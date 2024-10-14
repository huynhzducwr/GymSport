document.querySelector('.fit_list').addEventListener('click', function () {
    const fitlist = document.querySelector('.listt_fit');
    const arrow = document.querySelector('.arrow_up_fit');

    if (fitlist.style.display == 'none' || fitlist.style.display == '') {
        fitlist.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
    }
    else {
        fitlist.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
})