document.querySelector('.discount_list').addEventListener('click', function () {
    const listt = document.querySelector('.listt_discount');
    const arrow = document.querySelector('.arrow_up_discount');


    if (listt.style.display == 'none' || listt.style.display == '') {
        listt.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
    }
    else {
        listt.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
});