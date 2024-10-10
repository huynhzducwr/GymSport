async function fetchProducts(isActive = null) {
    let url = '/api/Product/All';
    if (isActive !== null) {
        url += `?isActive=${isActive}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển đổi dữ liệu JSON từ API thành object
            console.log(data);
            const products = data.data;
            const productImages = await fetchProductImages(); // Lấy dữ liệu hình ảnh
            const productColors = await fetchProductColors(); // Lấy dữ liệu màu sắc
            renderProducts(products, productImages, productColors); // Gọi hàm để hiển thị dữ liệu sản phẩm và màu sắc
        } else {
            console.error("Error fetching products:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

// Hàm để lấy dữ liệu màu sắc
async function fetchProductColors() {
    let url = '/api/ProductColor/GetAllProductColor';
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            return data.data; // Trả về dữ liệu màu sắc
        } else {
            console.error("Error fetching product colors:", response.statusText);
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    } catch (error) {
        console.error("Network error:", error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
}

async function fetchProductImages() {
    let url = '/api/Image/all'; // Đường dẫn API để lấy hình ảnh
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            console.log("Fetched product images:", data); // Log để kiểm tra dữ liệu
            return data; // Trả về dữ liệu hình ảnh
        } else {
            console.error("Error fetching product images:", response.statusText);
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    } catch (error) {
        console.error("Network error:", error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
}

function renderProducts(products, productImages, productColors) {
    const containerProduct = document.querySelector('#top-pick');
    const containerProduct1 = document.querySelector('#popular-pick');

    // Xóa sản phẩm hiện có trong cả hai container
    containerProduct.innerHTML = '';
    containerProduct1.innerHTML = '';

    // Kiểm tra xem có sản phẩm không
    if (!Array.isArray(products) || products.length === 0) {
        containerProduct.innerHTML = '<p>Không có sản phẩm nào để hiển thị.</p>';
        return;
    }

    // Sắp xếp sản phẩm theo productID tăng dần
    products.sort((a, b) => a.productID - b.productID);

    // Giới hạn số lượng sản phẩm cho mỗi container
    const maxProductsPerContainer = 4;

    // Hiển thị sản phẩm theo thứ tự tăng dần
    products.forEach((product, index) => {
        // Lấy hình ảnh tương ứng với sản phẩm
        const imageData = productImages.find(image => image.productID === product.productID);

        // Lấy màu sắc tương ứng với sản phẩm
        const colorData = productColors.find(color => color.productID === product.productID);

        // Tạo mã HTML cho sản phẩm
        const productHTML = `
            <div class="product">
                <img class="edt_product" src="${imageData ? imageData.imageURL : '/src/default-image.png'}" alt="${product.productName}">
                <p class="name_pro">${product.productName}</p>
                <p class="name_cate">${product.productCategoryName || 'Thể loại'}</p>
                <p class="name_color">${colorData ? colorData.colorName : 'Màu sắc không xác định'}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
            </div>
        `;

        // Chèn mã HTML vào container tương ứng
        if (index < maxProductsPerContainer) {
            containerProduct.insertAdjacentHTML('beforeend', productHTML); // Thêm vào phần sản phẩm hàng đầu
        } else if (index < maxProductsPerContainer * 2) {
            containerProduct1.insertAdjacentHTML('beforeend', productHTML); // Thêm vào phần sản phẩm phổ biến
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(); // Lấy và hiển thị sản phẩm khi trang tải
});
