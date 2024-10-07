document.addEventListener('DOMContentLoaded', function () {  // phần này đảm bảo sẽ chỉ chạy sau khi toàn bộ code html được đọc
    //sự kiện DOMContentLoader kích hoạt khi html được tải đầy đủ (đảm bảo linkcate1,catehover được tương tác)
    const linkCate1 = document.querySelector('.link_cate1'); //dòng này tìm và lưu phần tử html có class .link_cate1
    const cateHover = document.querySelector('.cate_hover');// tương tự
    let hoverTimeout;   //khai báo biến let để sử dụng sau này cho setTImeout và clear Timeout

    linkCate1.addEventListener('mouseenter', function () {
        hoverTimeout = setTimeout(function () {
            cateHover.style.opacity = '1';
            cateHover.style.visibility = 'visible';
        }, 340);
    });


    linkCate1.addEventListener('mouseleave', function () {
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