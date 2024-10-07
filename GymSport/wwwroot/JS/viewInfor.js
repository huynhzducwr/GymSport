
document.addEventListener('DOMContentLoaded', () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo && userInfo.userID) {
        fetchUserData(userInfo.userID);
    }

});

async function fetchUserData(userID) {
    try {
        const response = await fetch(`https://localhost:44326/api/User/GetUser/${userID}`); 
        const data = await response.json();
        console.log(data); 


        if (data && data.data) {
            document.getElementById('firstname').value = data.data.firstname || '';
            document.getElementById('lastname').value = data.data.lastname || '';
            document.getElementById('email-update').value = data.data.email || '';
        } else {
            console.error("Không thể lấy thông tin người dùng:", data.message);
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

        

    

