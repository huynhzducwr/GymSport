document.querySelector('.sort_list').addEventListener('click', function () {
    const listt = document.querySelector('.listt');
    const arrow = document.querySelector('.arrow_up');

    // Toggle hiển thị của danh sách
    if (listt.style.display === 'none' || listt.style.display === '') {
        listt.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';

    } else {
        listt.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)'; // Xoay mũi tên lên
    }
});
