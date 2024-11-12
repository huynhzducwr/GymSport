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
     
        if (data.success) {

            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('userInfo', JSON.stringify(data.data));


            showSuccessAlert('Đăng nhập thành công: ' + data.message);
            window.location.href = '/home';
        } else {
            showAlert('Sai tên đăng nhập hoặc mật khẩu');
        }

    } catch (error) {
        console.error('Lỗi:', error);
    }
});

async function showAlert(message) {
    const alertBox = document.getElementById('alert-box');
    const alertMessage = document.getElementById('alert-message');

    alertMessage.textContent = message; // Set the alert message
    alertBox.style.display = 'block'; // Show the alert box

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
        alertBox.classList.add('fade-out');
        setTimeout(() => {
            alertBox.style.display = 'none';
            alertBox.classList.remove('fade-out');
        }, 600); // Match the transition duration
    }, 1000); // Show for 3 seconds
}

async function closeAlert() {
    const alertBox = document.getElementById('alert-box');
    alertBox.style.display = 'none'; // Close the alert
}

async function showSuccessAlert(message) {
    const successBox = document.getElementById('success-box');
    const successMessage = document.getElementById('success-message');

    successMessage.textContent = message; // Set the success message
    successBox.style.display = 'block'; // Show the success box

    // Automatically hide the success alert after 3 seconds
    setTimeout(() => {
        successBox.classList.add('fade-out');
        setTimeout(() => {
            successBox.style.display = 'none';
            successBox.classList.remove('fade-out');
        }, 600); // Match the transition duration
    }, 1000); // Show for 3 seconds
}

async function closeSuccessAlert() {
    const successBox = document.getElementById('success-box');
    successBox.style.display = 'none'; // Close the success alert
}


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
            showSuccessAlert('Tạo tài khoản thành công');
            // Có thể chuyển hướng đến trang đăng nhập hoặc trang khác
        } else {
            showAlert('Tạo tài khoản thất bại: ' + data.message);
        }
    } catch (error) {
        console.error('Lỗi:', error);
        showAlert('Đã xảy ra lỗi trong quá trình tạo tài khoản.');
    }
});


