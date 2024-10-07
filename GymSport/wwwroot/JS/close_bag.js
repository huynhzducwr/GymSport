// Chọn biểu tượng giỏ hàng
const shopIcon = document.querySelector('.fa-solid.fa-shop');
const bag = document.querySelector('.Bag_order');
const closeIcon = document.querySelector('.fa-solid.fa-xmark');
const overlay = document.querySelector('.overlay');



shopIcon.addEventListener('click', function () {



    if (bag.style.display === 'none' || bag.style.display === '') {
        bag.style.display = 'block';
        overlay.style.display = 'block';

    } else {
        bag.style.display = 'none';
        overlay.style.display = 'none';
        clearTimeout(Timeout);
        bag.style.opacity = '0'
        bag.style.visibility = 'hidden';
    }
});
closeIcon.addEventListener('mouseenter', function () {
    closeIcon.style.cursor = 'pointer';
});
closeIcon.addEventListener('click', function () {
    bag.style.display = 'none';
    overlay.style.display = 'none';
})

overlay.addEventListener('click', function () {
    bag.style.display = 'none';
    overlay.style.display = 'none';
})



