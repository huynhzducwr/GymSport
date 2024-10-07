document.querySelector('.update-btn').addEventListener('click', async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Kiểm tra xem UserID có tồn tại không
    if (!userInfo || !userInfo.userID) {
        alert("UserID không tìm thấy. Vui lòng đăng nhập lại.");
        return; // Dừng thực hiện nếu không tìm thấy UserID
    }

    const updateUser = {
        userID: userInfo.userID, 
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        Email: document.getElementById('email-update').value,
        Password: document.getElementById('password-update').value
    };

    try {
        const response = await fetch(`https://localhost:44326/api/User/Update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateUser)
        });

        const data = await response.json();
        alert(data.message);
        if (data.data.isUpdate) {
            localStorage.setItem('userInfo', JSON.stringify(updateUser));
        }

    } catch (error) {
        console.error('Lỗi:', error);
    }
});

document.querySelector('.log_out').addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
   
    window.location.href = '/login';
});
