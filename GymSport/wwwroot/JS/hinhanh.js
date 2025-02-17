// Fetch danh sách hình ảnh sản phẩm
async function fetchProductImages() {
    const url = '/api/Image/all'; // API lấy danh sách hình ảnh sản phẩm
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error fetching product images:", response.statusText);
            return [];
        }
        const data = await response.json();
        console.log("Fetched product images:", data);

        // Kiểm tra nếu data không phải là mảng, trả về mảng rỗng
        return Array.isArray(data) ? data.filter(img => img.productID && img.imageURL && img.productName) : [];
    } catch (error) {
        console.error("Network error:", error);
        return [];
    }
}

// Nhóm các hình ảnh theo tên sản phẩm
function groupImagesByProductName(productImages) {
    return productImages.reduce((grouped, img) => {
        if (!grouped[img.productName]) {
            grouped[img.productName] = [];
        }
        grouped[img.productName].push(img);
        return grouped;
    }, {});
}

// Hiển thị danh sách sản phẩm kèm hình ảnh
async function renderProducts() {
    const productImages = await fetchProductImages();
    const groupedImages = groupImagesByProductName(productImages);
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = ''; // Xóa dữ liệu cũ

    if (Object.keys(groupedImages).length === 0) {
        console.warn("No product images found.");
        return;
    }

    // Render các sản phẩm kèm hình ảnh
    for (const [productName, images] of Object.entries(groupedImages)) {
        const tr = document.createElement('tr');

        // Cột Tên sản phẩm
        const tdName = document.createElement('td');
        tdName.textContent = productName || 'N/A';
        tr.appendChild(tdName);

        // Cột Hình ảnh
        const tdImage = document.createElement('td');

        // Ảnh đại diện
        const mainImage = images[0]; // Sử dụng ảnh đầu tiên làm đại diện
        const imgElement = document.createElement('img');
        imgElement.src = mainImage.imageURL;
        imgElement.alt = mainImage.productName || 'Product Image';
        imgElement.classList.add('product-image');
        imgElement.style.width = '100px';
        imgElement.style.height = '100px';
        imgElement.style.objectFit = 'cover';
        tdImage.appendChild(imgElement);

        // Nút "Xem thêm"
        if (images.length > 1) {
            const seeMoreBtn = document.createElement('button');
            seeMoreBtn.textContent = 'Xem thêm';
            seeMoreBtn.classList.add('btn', 'btn-info');
            seeMoreBtn.onclick = () => showAdditionalImages(images); // Xử lý khi click "Xem thêm"
            seeMoreBtn.style.marginLeft = '10px'; // Thêm khoảng cách giữa ảnh và nút
            tdImage.appendChild(seeMoreBtn);
        }

        tr.appendChild(tdImage);
        tbody.appendChild(tr);
    }
}
// Lưu modal ở cấp toàn cục để dễ quản lý
let modal = null;

// Hiển thị các hình ảnh còn lại khi nhấn "Xem thêm"
function showAdditionalImages(images) {
    const additionalImages = images.slice(1); // Lấy tất cả các hình ảnh còn lại (trừ ảnh đại diện)

    // Nếu modal đã tồn tại, chỉ cần mở lại modal và cập nhật nội dung
    if (modal) {
        modal.style.display = 'flex';
        updateModalContent(additionalImages);  // Cập nhật lại nội dung
        return;
    }

    // Tạo modal nếu chưa tồn tại
    modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.display = 'flex'; // Hiển thị modal
    modal.innerHTML = `
    <style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: none;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        max-width: 90%;
        max-height: 80%;
        overflow-y: auto;
        text-align: center;
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 30px;
        cursor: pointer;
    }

    .modal img {
        margin: 5px;
        transition: transform 0.3s;
    }

    .modal img:hover {
        transform: scale(1.05);
    }
    </style>
    <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h4>Hình ảnh bổ sung</h4>
    </div>
    `;

    // Thêm modal vào body
    document.body.appendChild(modal);

    // Cập nhật nội dung modal với các hình ảnh
    updateModalContent(additionalImages);
}

// Cập nhật nội dung modal với các hình ảnh bổ sung
function updateModalContent(additionalImages) {
    const modalContent = modal.querySelector('.modal-content');

    // Làm sạch nội dung hình ảnh cũ trong modal
    const imagesContainer = modalContent.querySelector('.images-container');
    if (imagesContainer) {
        imagesContainer.remove();  // Xóa phần chứa hình ảnh cũ
    }

    // Tạo container mới để chứa các hình ảnh bổ sung
    const newImagesContainer = document.createElement('div');
    newImagesContainer.classList.add('images-container');

    additionalImages.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = img.imageURL;
        imgElement.alt = img.productName || 'Product Image';
        imgElement.classList.add('product-image');
        imgElement.style.width = '200px';
        imgElement.style.height = '200px';
        imgElement.style.objectFit = 'cover';
        newImagesContainer.appendChild(imgElement);
    });

    // Thêm container mới vào modal
    modalContent.appendChild(newImagesContainer);
}

// Đóng modal
function closeModal() {
    if (modal) {
        modal.style.display = 'none';
    }
}
// Tìm nút "Thêm hình ảnh" và thêm sự kiện click
document.getElementById('add-image-btn').addEventListener('click', function () {
    // Chuyển hướng người dùng đến trang "/themhinhanh"
    window.location.href = '/themhinhanh';
});


// Khi trang tải xong, render bảng
document.addEventListener('DOMContentLoaded', renderProducts);
