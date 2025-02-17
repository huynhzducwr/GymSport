// Hàm fetch danh sách sản phẩm
async function fetchProducts(topProductIDs) {
    try {
        const response = await fetch('/api/Product/All'); // API endpoint sản phẩm
        const result = await response.json();
        const products = result.data; // Giả sử dữ liệu sản phẩm nằm trong result.data

        console.log('Fetched products:', products);

        if (Array.isArray(products)) {
            const productImages = await fetchProductImages(); // Lấy hình ảnh sản phẩm
            const productColors = await fetchProductColors(); // Nếu có dùng màu sản phẩm

            // Lọc các sản phẩm theo topProductIDs (nếu cần)
            const topProducts = products.filter(product => topProductIDs.includes(product.productID));
            // Render vào bảng (trong ví dụ này chúng ta sẽ render topProducts)
            renderProducts(topProducts, productImages, productColors);

            // Nếu muốn render 1 danh sách khác (ví dụ popularProducts), có thể tạo bảng khác hoặc cập nhật giao diện theo yêu cầu
            // const popularProducts = products.slice(0, 4);
            // renderProducts(popularProducts, productImages, productColors);
        } else {
            console.error('Products fetched is not an array:', products);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Hàm fetch hình ảnh sản phẩm
async function fetchProductImages() {
    const url = '/api/Image/all'; // API endpoint hình ảnh sản phẩm
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log("Fetched product images:", data);
            return data; // Giả sử data là một mảng chứa các đối tượng có { productID, url }
        } else {
            console.error("Error fetching product images:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Network error:", error);
        return [];
    }
}

// Giả sử có hàm fetchProductColors nếu cần
async function fetchProductColors() {
    // Tương tự như fetchProductImages()
    return []; // Ví dụ trả về mảng rỗng nếu không có dữ liệu màu
}

// Hàm render dữ liệu sản phẩm vào bảng
function renderProducts(products, productImages, productColors) {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = ''; // Xóa nội dung cũ

    products.forEach((product, index) => {
        const tr = document.createElement('tr');

        // Tên sản phẩm
        const tdName = document.createElement('td');
        tdName.textContent = product.name || product.productName || 'N/A';
        tr.appendChild(tdName);

        // Chi tiết sản phẩm (nút xem thêm mở popup)
        const tdDetails = document.createElement('td');
        const shortText = (product.description || product.detail || 'N/A').substring(0, 50) + '...';

        const spanText = document.createElement('span');
        spanText.textContent = shortText;

        const btnToggle = document.createElement('button');
        btnToggle.textContent = 'Xem thêm';
        btnToggle.classList.add('btn', 'btn-sm', 'btn-link');
        btnToggle.setAttribute('data-index', index);

        // Khi nhấn "Xem thêm", mở modal
        btnToggle.onclick = function () {
            document.getElementById(`modal-content-${index}`).textContent = product.description || product.detail || 'Không có mô tả';
            document.getElementById(`modal-${index}`).style.display = 'block';
        };

        tdDetails.appendChild(spanText);
        tdDetails.appendChild(btnToggle);
        tr.appendChild(tdDetails);

        // Giá
        const tdPrice = document.createElement('td');
        tdPrice.textContent = product.price ? product.price + ' đ' : 'N/A';
        tr.appendChild(tdPrice);

        // Trạng thái
        const tdStatus = document.createElement('td');
        const statusLabel = document.createElement('label');
        statusLabel.className = 'badge badge-danger';
        statusLabel.textContent = product.status || 'Pending';
        tdStatus.appendChild(statusLabel);
        tr.appendChild(tdStatus);

        // Loại sản phẩm
        const tdType = document.createElement('td');
        tdType.textContent = product.type || product.productCategoryName || 'N/A';
        tr.appendChild(tdType);

        // Hình ảnh
        const tdImage = document.createElement('td');
        const imgElement = document.createElement('img');
        const productImage = productImages.find(img => img.productID === product.productID);
        imgElement.src = productImage ? productImage.imageURL : '/images/default.png';
        imgElement.alt = product.name || 'Product Image';
        imgElement.classList.add('product-image');
        imgElement.style.width = '110px';
        imgElement.style.height = '110px';
        imgElement.style.objectFit = 'cover';

        tdImage.appendChild(imgElement);
        tr.appendChild(tdImage);

        // Thêm hàng vào bảng
        tbody.appendChild(tr);

        // Tạo modal riêng cho từng sản phẩm
        const modal = document.createElement('div');
        modal.id = `modal-${index}`;
        modal.classList.add('custom-modal');
        modal.innerHTML = `
        <style>
        .custom-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    max-width: 90%;
    background: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
}
.modal-content {
    position: relative;
}
.close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 18px;
    cursor: pointer;
}

        </style>
            <div class="modal-content">
                <span class="close-btn" onclick="document.getElementById('modal-${index}').style.display='none'">&times;</span>
                <h4>Chi tiết sản phẩm</h4>
                <p id="modal-content-${index}"></p>
            </div>
        `;
        document.body.appendChild(modal);
    });
}


document.getElementById('add-product-btn').addEventListener('click', function () {
    alert('Mở modal hoặc form để thêm sản phẩm!');
});

function addStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        #add-product-btn {
            padding: 8px 12px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        #add-product-btn:hover {
            background-color: #218838;
        }
    `;
    document.head.appendChild(style);
}

addStyles();



document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/api/Product/All'); // API lấy toàn bộ sản phẩm
        const result = await response.json();
        const products = result.data; // Giả sử danh sách sản phẩm nằm trong result.data

        if (Array.isArray(products) && products.length > 0) {
            const allProductIDs = products.map(product => product.productID); // Lấy danh sách tất cả productID
            console.log("Danh sách tất cả productID:", allProductIDs);

            fetchProducts(allProductIDs); // Gọi hàm fetchProducts() với tất cả sản phẩm
        } else {
            console.warn('Không có sản phẩm nào trong danh sách.');
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
    }
});
