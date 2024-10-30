document.addEventListener("DOMContentLoaded", function () {
    const heartIcon = document.querySelector(".heart-icon");

    heartIcon.addEventListener("click", function () {
        // Thay đổi giữa hai lớp fa-regular và fa-solid
        heartIcon.classList.toggle("fa-regular");
        heartIcon.classList.toggle("fa-solid");
        heartIcon.classList.toggle("active");
    });
});