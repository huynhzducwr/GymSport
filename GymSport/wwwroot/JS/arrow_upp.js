document.querySelector('.product_list').addEventListener('click', function () {
    const listt = document.querySelector('.listt_product');
    const arrow = document.querySelector('.arrow_upp');

    // Toggle hiển thị của danh sách
    if (listt.style.display === 'none' || listt.style.display === '') {
        listt.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
        arrows.style = 'padding-left:80px;'; // Xoay mũi tên xuống
    } else {
        listt.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)'; // Xoay mũi tên lên,
    }
});
