document.addEventListener('DOMContentLoaded', function () {
    const linkCate2 = document.querySelector('.link_cate2');
    const cateHover2 = document.querySelector('.cate_hover2');

    let hoverTimeout;


    linkCate2.addEventListener('mouseenter', function () {
        hoverTimeout = setTimeout(function () {
            cateHover2.style.opacity = '1';
            cateHover2.style.visibility = 'visible';
        }, 340);
    });

    linkCate2.addEventListener('mouseleave', function () {
        clearTimeout(hoverTimeout);
        cateHover2.style.opacity = '0';
        cateHover2.style.visibility = 'hidden';
    });

    cateHover2.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimeout);
        cateHover2.style.opacity = '1';
        cateHover2.style.visibility = 'visible';
    });

    cateHover2.addEventListener('mouseleave', function () {
        cateHover2.style.opacity = '0';
        cateHover2.style.visibility = 'hidden';
    });





});