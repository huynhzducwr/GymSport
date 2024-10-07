document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Lấy giá trị từ localStorage

    // Kiểm tra nếu isLoggedIn có giá trị 'true' (là chuỗi)
    if (isLoggedIn === 'true') {
        const userLink = document.querySelector('.link_order');
        userLink.href = '/account';  // Chuyển hướng đến trang thông tin tài khoản
        userLink.innerHTML = '<i class="fa-regular fa-user"></i>';  // Cập nhật biểu tượng nếu cần
    }
});
