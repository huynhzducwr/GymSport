document.querySelector('.feature_list').addEventListener('click', function () {
    const listt = document.querySelector('.listt_feature');
    const arrow = document.querySelector('.arrow_up_feature');

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
