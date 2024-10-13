document.querySelector('.size_list').addEventListener('click', function () {
    const sizeList = document.querySelector('.listt_size');

    const arrow_up = document.querySelector('.arrow_uppp');

    if (sizeList.style.display == 'none' || sizeList.style.display == '') {
        sizeList.style.display = 'block';
        arrow_up.style.transform = 'rotate(180deg)';
    }
    else {
        sizeList.style.display = 'none';
        arrow_up.style.transform = 'rotate(0deg)';
    }
});