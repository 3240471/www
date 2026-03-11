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

        const isTemplate = item.parentElement.id === "slide_tnp";

        if (isTemplate) {
            newItem.className = "added-item template-item";
            // テンプレートは操作無効
        } else {
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

/* --- ドラッグ・サイズ変更 (最新Pointer Events対応) --- */
function setupItemEvents(targetItem) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    targetItem.onpointerdown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        isDragging = true;

        // 開始時の位置を記録
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = parseFloat(targetItem.style.left) || 0;
        initialTop = parseFloat(targetItem.style.top) || 0;

        // 指やマウスが動いてもこの要素を追いかけるように設定
        targetItem.setPointerCapture(e.pointerId);
        targetItem.style.zIndex = "1000"; // ドラッグ中は最前面
    };

    targetItem.onpointermove = (e) => {
        if (!isDragging) return;

        // 移動距離を計算
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // 位置を更新
        targetItem.style.left = initialLeft + dx + "px";
        targetItem.style.top = initialTop + dy + "px";
    };

    targetItem.onpointerup = (e) => {
        isDragging = false;
        targetItem.releasePointerCapture(e.pointerId);
        targetItem.style.zIndex = "20"; // 通常の重なりに戻す
    };

    targetItem.onpointercancel = (e) => {
        isDragging = false;
    };

    /* サイズ変更 (ホイール操作) */
    targetItem.onwheel = (e) => {
        e.preventDefault();
        let w = parseFloat(targetItem.style.width);
        w += e.deltaY < 0 ? 10 : -10;
        if (w < 20) w = 20;
        if (w > 400) w = 400;
        targetItem.style.width = w + "px";
    };
}

/* --- エフェクト --- */
document.querySelectorAll(".effect_btn").forEach((btn) => {
    btn.onclick = () => {
        saveHistory();
        currentEffect = btn.dataset.eff;
        puriContainer.className = "edit_canvas_area " + (currentEffect !== "normal" ? "effect_" + currentEffect : "");
    };
});

/* --- 完成：Canvas保存 --- */
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

    // 2. アイテム描画
    document.querySelectorAll(".added-item").forEach((item) => {
        const x = parseFloat(item.style.left) || 0;
        const y = parseFloat(item.style.top) || 0;
        const w = parseFloat(item.style.width) || 350;
        // 高さはアスペクト比を維持
        const h = (item.naturalHeight / item.naturalWidth) * w;
        ctx.drawImage(item, x, y, w, h);
    });

    localStorage.setItem("purikura_final", canvas.toDataURL("image/png"));
    location.href = "save.html";
};

/* スライド切替 */
document.querySelectorAll(".btn_e").forEach((btn) => {
    btn.onclick = () => {
        document.querySelectorAll(".slide_e").forEach((s) => (s.style.display = "none"));
        const target = document.getElementById(btn.dataset.target);
        if (target) target.style.display = "flex";
    };
});
