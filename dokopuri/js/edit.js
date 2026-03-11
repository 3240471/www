/* --- 初期設定 --- */
const puriImg = document.getElementById("edit_img");
const puriContainer = document.getElementById("puri");
const savedImage = localStorage.getItem("purikura");
if (savedImage) puriImg.src = savedImage;

let historyStack = [];
let currentEffect = "normal";

function saveHistory() {
    historyStack.push({ html: puriContainer.innerHTML, effect: currentEffect });
}

/* --- アイテム追加（スタンプ・テンプレ・文字） --- */
const allItems = document.querySelectorAll(".slide_e img");
allItems.forEach((item) => {
    item.onclick = () => {
        saveHistory();
        const newItem = document.createElement("img");
        newItem.src = item.src;

        // テンプレート（slide_tnp）かどうかを判定
        const isTemplate = item.parentElement.id === "slide_tnp";

        if (isTemplate) {
            // テンプレートの場合：専用クラスを付与（CSSで350px固定）
            newItem.className = "added-item template-item";
            newItem.style.width = "350px";
            newItem.style.left = "0px";
            newItem.style.top = "0px";
            // テンプレートはドラッグイベントを登録しない
        } else {
            // スタンプなどの場合：通常クラス
            newItem.className = "added-item";
            newItem.style.width = "100px";
            newItem.style.left = "125px";
            newItem.style.top = "125px";
            // ドラッグやサイズ変更を有効化
            setupItemEvents(newItem);
        }

        puriContainer.appendChild(newItem);
    };
});

/* --- ドラッグ・サイズ変更 --- */
function setupItemEvents(targetItem) {
    let ox, oy;
    targetItem.onpointerdown = (e) => {
        e.stopPropagation();
        ox = e.offsetX;
        oy = e.offsetY;
        targetItem.setPointerCapture(e.pointerId);
    };
    targetItem.onpointermove = (e) => {
        if (e.pressure === 0) return;
        const rect = puriContainer.getBoundingClientRect();
        targetItem.style.left = e.clientX - rect.left - ox + "px";
        targetItem.style.top = e.clientY - rect.top - oy + "px";
    };
    targetItem.onwheel = (e) => {
        e.preventDefault();
        let w = parseFloat(targetItem.style.width);
        w += e.deltaY < 0 ? 10 : -10;
        if (w < 20) w = 20;
        targetItem.style.width = w + "px";
    };
}

/* --- エフェクト --- */
document.querySelectorAll(".effect_btn").forEach((btn) => {
    btn.onclick = () => {
        saveHistory();
        currentEffect = btn.dataset.eff;
        // edit_canvas_area のクラスを更新してフィルタを適用
        puriContainer.className = "edit_canvas_area " + (currentEffect !== "normal" ? "effect_" + currentEffect : "");
    };
});

/* --- 完成：350px 完璧収束保存 --- */
document.getElementById("complete_btn").onclick = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 350;
    canvas.height = 350;

    // 1. 写真（背景）の描画
    if (currentEffect === "mono") ctx.filter = "grayscale(100%)";
    if (currentEffect === "dust") ctx.filter = "sepia(60%) contrast(110%)";

    const iw = puriImg.naturalWidth;
    const ih = puriImg.naturalHeight;
    let sx, sy, sw, sh;

    // 写真を正方形にクロップする計算
    if (iw / ih > 1) {
        sw = ih;
        sh = ih;
        sx = (iw - ih) / 2;
        sy = 0;
    } else {
        sw = iw;
        sh = iw;
        sx = 0;
        sy = (ih - iw) / 2;
    }

    ctx.drawImage(puriImg, sx, sy, sw, sh, 0, 0, 350, 350);
    ctx.filter = "none";

    // 2. 重なっているアイテム（テンプレ・スタンプ）をすべて描画
    // .added-item クラスがついているものを順番に描画
    document.querySelectorAll(".added-item").forEach((item) => {
        const x = parseFloat(item.style.left) || 0;
        const y = parseFloat(item.style.top) || 0;
        const w = parseFloat(item.style.width);
        const h = (item.naturalHeight / item.naturalWidth) * w;
        ctx.drawImage(item, x, y, w, h);
    });

    localStorage.setItem("purikura_final", canvas.toDataURL("image/png"));
    location.href = "save.html";
};

/* スライド切替初期化 */
document.querySelectorAll(".btn_e").forEach((btn) => {
    btn.onclick = () => {
        document.querySelectorAll(".slide_e").forEach((s) => (s.style.display = "none"));
        const target = document.getElementById(btn.dataset.target);
        if (target) target.style.display = "flex";
    };
});
