document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");


    loginBtn.addEventListener("click", function () {
        // Switch to Login
        loginForm.classList.add("active");
        signupForm.classList.remove("active");


        // Update button styles
        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");
    });

    signupBtn.addEventListener("click", function () {
        // Switch to Sign Up
        signupForm.classList.add("active");
        loginForm.classList.remove("active");


        // Update button styles
        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");
    });
});

// Xử lý gửi biểu mẫu đăng nhập
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://localhost:44326/api/User/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();
        console.log('Response data:', data);
        if (data.password != password) {
            alert('Đăng nhập thất bại: ' + data.message); // In toàn bộ dữ liệu phản hồi
        }

        if (data.data.isLogin) {

            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('userInfo', JSON.stringify(data.data));

            alert('Đăng nhập thành công: ' + data.message);
            window.location.href = '/home';
        } 

    } catch (error) {
        console.error('Lỗi:', error);
    }
});




// Xử lý gửi biểu mẫu đăng ký
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const firstname = document.getElementById('username-signup').value;
    const lastname = document.getElementById('lastname-signup').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;

    try {
        const response = await fetch('https://localhost:44326/api/User/RegisterUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: firstname, lastname: lastname,  email: email, password: password })
        });  
   

        const data = await response.json();
        if (data.data.isCreated) {
            alert('Tạo tài khoản thành công');
            // Có thể chuyển hướng đến trang đăng nhập hoặc trang khác
        } else {
            alert('Tạo tài khoản thất bại: ' + data.message);
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Đã xảy ra lỗi trong quá trình tạo tài khoản.');
    }
});


