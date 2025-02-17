async function fetchProducts() {
    try {
        const response = await fetch('/api/Product/All'); // Gọi API để lấy danh sách sản phẩm
        const result = await response.json(); // Dữ liệu trả về từ API

        const products = result.data; // Dữ liệu sản phẩm
        console.log(products);
        const productSelect = document.getElementById('product-select');

        // Xóa các sản phẩm cũ trong dropdown
        productSelect.innerHTML = '';

        // Thêm tùy chọn mặc định
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Chọn sản phẩm';
        productSelect.appendChild(defaultOption);

        // Thêm các sản phẩm vào dropdown
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.productID; // Sử dụng ProductID
            option.textContent = product.productName;  // Sử dụng ProductName
            productSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Gọi hàm khi trang tải xong
document.addEventListener('DOMContentLoaded', fetchProducts);

// Hàm gửi yêu cầu tải lên hình ảnh
document.getElementById('add-product-image-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Ngừng gửi form mặc định

    const productID = document.getElementById('product-select').value;  // Lấy ProductID đã chọn từ dropdown
    const productName = document.getElementById('product-select').selectedOptions[0].text;  // Lấy tên sản phẩm từ option đã chọn
    const imageFile = document.getElementById('image-file').files[0];  // Lấy tệp hình ảnh đã chọn

    if (!productID || !productName || !imageFile) {
        alert("Vui lòng chọn sản phẩm, tên sản phẩm và hình ảnh.");
        return;
    }

    const formData = new FormData();
    formData.append('ProductID', productID);  // Thêm ProductID vào FormData
    formData.append('ProductName', productName);  // Thêm ProductName vào FormData
    formData.append('ImageFile', imageFile);  // Thêm ImageFile vào FormData

    try {
        const response = await fetch('/api/Image/Upload', {
            method: 'POST',
            body: formData  // Gửi FormData lên server
        });

        const result = await response.json();
        if (result.isSuccess) {
            alert("Hình ảnh đã được tải lên thành công.");
        } else {
            alert("Có lỗi xảy ra khi tải lên hình ảnh.");
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        alert("Lỗi kết nối hoặc có sự cố xảy ra.");
    }
});

