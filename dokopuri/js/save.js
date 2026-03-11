document.addEventListener("DOMContentLoaded", () => {
    const finalImg = document.getElementById("final_result");
    const saveBtn = document.getElementById("btn_save");

    // localStorage からデータを取得 (edit.js で保存した名前と合わせる)
    const finalData = localStorage.getItem("purikura_final");

    if (finalData && finalImg) {
        finalImg.src = finalData;
    } else {
        console.error("画像データが見つかりません。");
        alert("画像データがありません。編集画面からやり直してください。");
    }

    // 保存ボタンの処理
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            if (!finalImg.src || finalImg.src.startsWith("data:image/png;base64") === false) {
                alert("保存する画像が正しく読み込めていません。");
                return;
            }

            const a = document.createElement("a");
            a.href = finalImg.src;
            a.download = "purikura_" + Date.now() + ".png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            alert("画像を保存しました！");
        });
    }
});
