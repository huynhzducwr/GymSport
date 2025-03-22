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

            // Điều hướng dựa trên RoleID
            if (data.data.roleID === 1 || data.data.roleID === 3) {
                window.location.href = '/admin';
            } else if (data.data.roleID === 2) {
                window.location.href = '/home';
            } else {
                // Điều hướng mặc định nếu RoleID không phải 1 hoặc 2
                window.location.href = '/home';
            }
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

class UserBuilder {
    constructor() {
        this.firstName = 'John'; // Mặc định
        this.lastName = 'Doe'; // Mặc định
        this.email = '';
        this.password = ''; // Không có giá trị mặc định
    }

    setFirstName(firstName) {
        this.firstName = firstName.trim() || this.firstName;
        return this;
    }

    setLastName(lastName) {
        this.lastName = lastName.trim() || this.lastName;
        return this;
    }

    setEmail(email) {
        if (!email.trim()) {
            throw new Error('Email is required');
        }
        this.email = email.trim();
        return this;
    }

    setPassword(password) {
        if (!password.trim()) {
            throw new Error('Password is required');
        }
        this.password = password.trim();
        return this;
    }

    build() {
        if (!this.email) {
            throw new Error('Email is required');
        }
        if (!this.password) {
            throw new Error('Password is required');
        }

        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
        };
    }
}

async function isEmailDuplicate(email) {
    try {
        const response = await fetch('/api/User/AllUsers');
        const data = await response.json();
        console.log("Fetched data:", data);

        if (!response.ok || !data.success) {
            console.error('Failed to fetch users:', data.message);
            return false;
        }

        if (!data.data || !Array.isArray(data.data)) {
            console.error('Invalid data structure:', data);
            return false;
        }

        const users = data.data; // Dữ liệu user nằm trong data.data, không phải data.result
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());

    } catch (error) {
        console.error('Error checking email duplication:', error);
        return false;
    }
}

// Xử lý sự kiện đăng ký
document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Lấy giá trị từ các trường nhập liệu
    let firstName = document.getElementById("username-signup").value;
    let lastName = document.getElementById("lastname-signup").value;
    let email = document.getElementById("email-signup").value;
    let password = document.getElementById("password-signup").value;

    try {
        // Kiểm tra xem email đã tồn tại chưa
        const isDuplicate = await isEmailDuplicate(email);
        if (isDuplicate) {
            alert('This email is already registered. Please use another email.');
            return; // Ngừng đăng ký nếu email đã tồn tại
        }

        // Sử dụng UserBuilder để tạo requestBody
        const userBuilder = new UserBuilder();
        const requestBody = userBuilder
            .setFirstName(firstName)
            .setLastName(lastName)
            .setEmail(email)
            .setPassword(password)
            .build();

        // Gửi dữ liệu đăng ký đến API
        const response = await fetch('/api/User/RegisterUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (response.ok) {
            alert('User registered successfully!');
        } else {
            alert('Registration failed: ' + data.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});


