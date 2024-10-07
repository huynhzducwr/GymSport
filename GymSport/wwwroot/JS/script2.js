document.addEventListener('DOMContentLoaded', function () {
    const discountTexts = document.querySelectorAll('.container_discount .text_discount');
    let currentIndex = 0;

    function showNextText() {
        discountTexts.forEach((element, index) => {
            if (index === currentIndex) {
                element.classList.add('show');
            } else {
                element.classList.remove('show');
            }
        });
        currentIndex = (currentIndex + 1) % discountTexts.length;
    }

    // Hiển thị phần tử đầu tiên
    showNextText();

    // Thay đổi văn bản mỗi 3 giây
    setInterval(showNextText, 3000);
});
