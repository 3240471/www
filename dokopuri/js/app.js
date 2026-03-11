const input = document.querySelector("#inputFile_a");
const preview = document.querySelector("#preview_a");
const upIcon = document.querySelector(".upload-icon_a");
const upText = document.querySelector(".upload-text_a");

input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageData = e.target.result;
        preview.src = imageData;
        preview.style.display = "block";
        upIcon.style.display = "none";
        upText.style.display = "none";
        try {
            localStorage.setItem("purikura", imageData);
        } catch (error) {
            alert("画像が大きすぎて保存できません。別の画像を選んでください。");
        }
    };
    reader.readAsDataURL(file);
});
