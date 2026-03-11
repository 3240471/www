function playsound() {
    const sound_btn = document.getElementById("btn_sound");
    if (sound_btn) {
        sound_btn.currentTime = 0;
        sound_btn.play();
    }

    setTimeout(function () {
        location.href = "app.html";
    }, 800);
}
