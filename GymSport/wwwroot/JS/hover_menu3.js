document.addEventListener('DOMContentLoaded', function () {
    const linkCate3 = document.querySelector('.link_cate3');
    const cateHover = document.querySelector('.cate_hover3');
    let hoverTimeout;


    linkCate3.addEventListener('mouseenter', function () {
        hoverTimeout = setTimeout(function () {
            cateHover.style.opacity = '1';
            cateHover.style.visibility = 'visible';
        }, 340);
    });

    linkCate3.addEventListener('mouseleave', function () {
        clearTimeout(hoverTimeout);
        cateHover.style.opacity = '0';
        cateHover.style.visibility = 'hidden';
    });


    cateHover.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimeout);
        cateHover.style.opacity = '1';
        cateHover.style.visibility = 'visible';
    });

    cateHover.addEventListener('mouseleave', function () {
        cateHover.style.opacity = '0';
        cateHover.style.visibility = 'hidden';
    });
});