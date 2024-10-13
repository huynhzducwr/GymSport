document.querySelector('.activity_list').addEventListener('click', function () {
    const listt = document.querySelector('.listt_activity');
    const arrow = document.querySelector('.arrow_up_activity');


    if (listt.style.display == 'none' || listt.style.display == '') {
        listt.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
    }
    else {
        listt.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
});