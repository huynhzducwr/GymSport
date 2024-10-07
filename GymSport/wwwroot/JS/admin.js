// Lấy danh sách các mục <li> từ HTML
const menuItems = document.querySelectorAll('#menu-list li');

// Lấy phần tử main-content
const mainContent = document.getElementById('main-content');

// Định nghĩa nội dung cho từng trang
const pages = {
    'dashboard': {
        title: 'Dashboard',
        content: `
            <h2>Chào mừng đến Dashboard</h2>
            <p>Đây là trang quản lý Dashboard.</p>
        `
    },
    'nguoi-dung': {
        title: 'Người dùng',
        content: `
            <h2>Quản lý Người dùng</h2>
            <p>Đây là trang quản lý người dùng.</p>

            <!-- Form tìm kiếm -->
            <div>
                <input type="text" id="search-input" placeholder="Tìm kiếm người dùng..." />
                <button id="search-btn">Tìm kiếm</button>
            </div>

            <!-- Lọc trạng thái -->
            <div>
                <button id="active-btn">Đang hoạt động</button>
                <button id="inactive-btn">Vô hiệu hóa</button>
            </div>

            <!-- Bảng dữ liệu người dùng -->
            <table>
                <thead>
                    <tr>
                        <th>UserID</th>
                        <th>RoleName</th>
                        <th>Email</th>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>PasswordHash</th>
                        <th>CreatedAt</th>
                        <th>LastLogin</th>
                        <th>IsActive</th>
                        <th>Update</th> 
                        <th>Active </th>
                    </tr>
                </thead>
                <tbody id="user-table-body">
                    <!-- Dữ liệu người dùng sẽ được điền ở đây -->
                </tbody>
            </table>

            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        `
    },
    'san-pham': {
        title: 'Sản phẩm',
        content: `
        <h2>Manage Products</h2>
<p>This is the product management page.</p>

<!-- Form tìm kiếm -->
<div>
    <input type="text" id="search-product1-input" placeholder="Search for products..." />
    <button id="search-product1-btn">Search</button>
</div>
            <div>
                <button id="active-product1-btn">Đang hoạt động</button>
                <button id="inactive-product1-btn">Vô hiệu hóa</button>
            </div>

<!-- Nút Tạo Sản Phẩm -->
<button id="create-product-btn">Tạo Sản Phẩm</button>

<!-- Form nhập liệu ẩn (hiển thị khi bấm nút) -->
<div id="create-product-form" style="display: none;">
    <label for="new-product-name">Product Name:</label>
    <input type="text" id="new-product-name" placeholder="Enter product name" required>
    <br>
    
    <label for="new-product-description">Description:</label>
    <input type="text" id="new-product-description" placeholder="Enter description" required>
    <br>

    <br>
    
    <label for="new-product-price">Price:</label>
    <input type="number" id="new-product-price" placeholder="Enter product price" step="0.01" required>
    <br>
    
    <label for="new-product-status">Status:</label>
    <select id="new-product-status" required>
        <option value="Available">Available</option>
        <option value="Not Available">Not Available</option>
    </select>
    <br>
  <label for="new-product-category">Product Category:</label>
<input type="text" id="new-product-category" placeholder="Enter product category name" required>
<input type="hidden" id="selected-category-id" required> <!-- Hidden field to store selected category ID -->
<br>


    
    <button id="submit-new-product">Add Product</button>
</div>



<!-- Bảng dữ liệu sản phẩm -->
<table>
    <thead>
        <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>isActive</th>
            <th>Category</th>
            <th>Status</th>
            <th>Modified Date</th>
            <th>Update</th>
            <th>Active</th>
        </tr>
    </thead>
    <tbody id="product-table-body">
        <!-- Product data will be filled here -->
    </tbody>
</table>

<style>

    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
    #create-product-form {
        margin: 20px 0;
    }
    #create-product-btn {
        margin-bottom: 10px;
    }
    #search-product-input {
        margin-right: 5px;
    }
</style>
`
    },
    'don-hang': {
        title: 'Đơn hàng',
        content: `
            <h2>Quản lý Đơn hàng</h2>
            <p>Đây là trang quản lý đơn hàng.</p>
        `
    },
    'danhmuc-sanpham': {
        title: 'Danh mục sản phẩm',
        content: `
        <!-- Nút Tạo Danh Mục Sản Phẩm -->
<button id="create-product-category-btn">Tạo Danh Mục Sản Phẩm</button>

<!-- Form nhập liệu ẩn (hiển thị khi bấm nút) -->
<div id="create-product-category-form" style="display: none;">
    <label for="new-category-name">Tên danh mục:</label>
    <input type="text" id="new-category-name" placeholder="Nhập tên danh mục">
    <br>
    <label for="new-category-description">Mô tả:</label>
    <input type="text" id="new-category-description" placeholder="Nhập mô tả">
    <br>
    <button id="submit-new-category">Thêm danh mục</button>
</div>

            <h2>Quản lý Danh mục sản phẩm</h2>
            <p>Đây là trang quản lý danh mục sản phẩm.</p>

            <!-- Form tìm kiếm -->
            <div>
                <input type="text" id="search-product-input" placeholder="Tìm kiếm sản phẩm..." />
                <button id="search-product-btn">Tìm kiếm</button>
            </div>

            <!-- Lọc trạng thái -->
            <div>
                <button id="active-product-btn">Có sẵn</button>
                <button id="unactive-product-btn">Không có sẵn</button>
            </div>

            <!-- Bảng dữ liệu sản phẩm -->
            <table>
                <thead>
                    <tr>
                        <th>ProductCategoryID</th>
                        <th>ProductCategoryName</th>
                        <th>Description</th>
                        <th>isActive</th>
                        
                        <th>Update</th>
                        <th>Active</th>
                    </tr>
                </thead>
                 <tbody id="product-category-table-body">
                    <!-- Dữ liệu sản phẩm sẽ được điền ở đây -->
                </tbody>
            </table>

            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        `

    },
    'size': {
        title: 'Size',
        content: `
        <!-- Nút Tạo Danh Mục Sản Phẩm -->
<button id="create-size-btn">Tạo Size</button>

<!-- Form nhập liệu ẩn (hiển thị khi bấm nút) -->
<div id="create-size-form" style="display: none;">
    <label for="new-size-name">Tên size:</label>
    <input type="text" id="new-size-name" placeholder="Nhập tên size">
    <br>
    <button id="submit-new-size">Thêm size</button>
</div>

            <h2>Quản lý Size</h2>
            <p>Đây là trang quản lý size</p>

            <!-- Form tìm kiếm -->
            <div>
                <input type="text" id="search-size-input" placeholder="Tìm kiếm size..." />
                <button id="search-size-btn">Tìm kiếm</button>
            </div>

            <!-- Lọc trạng thái -->
            <div>
                <button id="active-size-btn">Có sẵn</button>
                <button id="unactive-size-btn">Không có sẵn</button>
            </div>

            <!-- Bảng dữ liệu sản phẩm -->
            <table>
                <thead>
                    <tr>
                        <th>SizeID</th>
                        <th>SizeName</th>
                        <th>isActive</th>                      
                        <th>Update</th>
                        <th>Active</th>
                    </tr>
                </thead>
                 <tbody id="size-table-body">
                    <!-- Dữ liệu sản phẩm sẽ được điền ở đây -->
                </tbody>
            </table>

            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        `

    },



};

//Product

document.addEventListener('DOMContentLoaded', function () {
    const createProductBtn = document.getElementById('create-product-btn');
    const submitProductBtn = document.getElementById('submit-new-product');
    const categoryInput = document.getElementById('new-product-category');
    const selectedCategoryIdInput = document.getElementById('selected-category-id'); // Khai báo ở đây

    // Gọi hàm để lấy danh mục sản phẩm sau khi DOM đã được tải đầy đủ
    fetchProductCategories();

    // Toggle form thêm sản phẩm khi nhấn nút tạo sản phẩm mới
    if (createProductBtn) {
        createProductBtn.addEventListener('click', () => {
            const form = document.getElementById('create-product-form');
            form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Chuyển đổi hiển thị form
        });
    }
    if (categoryInput) {
        categoryInput.addEventListener('input', () => {
            const categoryName = categoryInput.value;
            const categoryId = getCategoryIdByName(categoryName);
            selectedCategoryIdInput.value = categoryId; // Cập nhật ID danh mục
        });
    }


    // Xử lý việc submit form để thêm sản phẩm
    if (submitProductBtn) {
        submitProductBtn.addEventListener('click', () => {
            const productName = document.getElementById('new-product-name').value;
            const description = document.getElementById('new-product-description').value;
            const price = document.getElementById('new-product-price').value;
            const productCategoryID = selectedCategoryIdInput.value; // Lấy ID danh mục đã chọn
            const status = document.getElementById('new-product-status').value; // Lấy trạng thái sản phẩm

            if (productName && description && price && productCategoryID) {
                addProduct(productName, productCategoryID, description, parseFloat(price), status);
            } else {
                alert('Vui lòng nhập đầy đủ thông tin sản phẩm.');
            }
        });
    }


});

function getCategoryIdByName(categoryName) {
    const category = categories.find(cat => cat.productCategoryName.toLowerCase() === categoryName.toLowerCase());
    return category ? category.productCategoryID : null; // Trả về ID nếu tìm thấy, ngược lại trả về null
}

async function fetchProductCategories() {
    const url = '/api/ProductCategory/GetAllProductCategory';

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);

            categories = data.data; // Giả sử data chứa mảng 'data'
            if (!Array.isArray(categories)) {
                console.error('Categories is not an array');
                return;
            }


        } else {
            console.error("Error fetching categories:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching product categories:", error);
    }
}
async function addProduct(productName, productCategoryID, description, price, status) {
    try {
        const response = await fetch('/api/Product/Create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName: productName,
                productCategoryID: parseInt(productCategoryID), // Đảm bảo gửi dưới dạng số nguyên
                description: description,
                price: price, // Giá đã được phân tích thành float trước khi gọi hàm này
                status: status // Sử dụng trạng thái đã cung cấp
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Thông báo thành công
            fetchProducts(); // Tải lại danh sách sản phẩm
        } else {
            alert(result.message); // Thông báo lỗi
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function fetchProducts(isActive = null) {
    let url = '/api/Product/All';
    if (isActive !== null) {
        url += `?isActive=${isActive}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Convert JSON data from API to object
            console.log(data);
            renderProducts(data.data); // Call the function to render the data in the table
        } else {
            console.error("Error fetching products:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

function renderProducts(products) {
    const productTableBody = document.getElementById('product-table-body');
    productTableBody.innerHTML = ''; // Clear existing rows

    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.productID}</td>
                <td>${product.productName}</td>
                <td>${product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.isActive ? 'Yes' : 'No'}</td>
                <td>${product.productCategoryName}</td>
                <td>${product.status}</td>
                <td>${product.modifiedDate ? new Date(product.modifiedDate).toLocaleString() : 'N/A'}</td>
                <td>
                    <button class="update-product-info-btn" data-productID="${product.productID}">
                        Cập nhật Thông tin
                    </button>
                </td>
                <td>
                    
                    <button class="update-product-status-btn" data-productID="${product.productID}">
                        Cập nhật Trạng thái
                    </button>
                </td>
            </tr>
        `;


        productTableBody.insertAdjacentHTML('beforeend', row);
    });

    // Add event listeners for the update buttons
    document.querySelectorAll('.update-product-info-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productID = e.target.getAttribute('data-productID');
            updateProduct(productID);
            fetchProducts(); // Refresh the product list
        });
    });

    document.querySelectorAll('.update-product-status-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productID = e.target.getAttribute('data-productID');
            
         
            toggleProductActive(productID);
            fetchProducts(); // Refresh the product list
        });
    });
}

async function updateProduct(userId) {
    const productName = prompt('Nhập tên mới cho sản phẩm:');
    const productCategoryID = parseInt(prompt('Nhập ID danh mục mới:'), 10); // Use ID instead of name
    const description = prompt('Nhập mô tả mới cho sản phẩm:');
    const price = parseFloat(prompt('Nhập giá mới:'));
    const status = prompt('Nhập trạng thái: (Available | Sold Out)');

    // Validate inputs
    if (!productName || !productCategoryID || isNaN(price) || !description || !status) {
        alert('Vui lòng nhập đầy đủ thông tin sản phẩm và đảm bảo giá hợp lệ.');
        return;
    }

    try {
        const response = await fetch('/api/Product/Update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: userId,
                productName: productName,
                productCategoryID: productCategoryID, // Use category ID
                description: description,
                price: price,
                status: status,
                modifiedBy: "System" // Modify as needed to represent the user making the update
            })
        });

        console.log(response);

        if (!response.ok) {
            console.error("Error: " + response.status);
            alert("Cập nhật không thành công");
            return;
        }

        const result = await response.json();
        alert(result.message); // Show success message
        fetchProducts(); // Refresh the product list after a successful update
    } catch (error) {
        console.error("Error updating product:", error);
        alert("Đã xảy ra lỗi trong quá trình cập nhật sản phẩm.");
    }
}

async function toggleProductActive(userId, isActive) {
    console.log('ProductID:', userId, 'isActive:', isActive); // Log userID and isActive
    try {
        const response = await fetch(`/api/Product/ToggleActive?userId=${userId}&isActive=${isActive}`, {
            method: 'POST', // Keep POST if that's how your API is designed
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Hiển thị thông báo thay đổi trạng thái thành công
            fetchProducts(); // Reload lại danh sách người dùng
        } else {
            alert("Update trang thai thanh cong");
        }
    } catch (error) {
        console.error("Error toggling user active status:", error);
    }
}

//ProductCategory
document.addEventListener('DOMContentLoaded', function () {
    const createCategoryBtn = document.getElementById('create-product-category-btn');
    const submitCategoryBtn = document.getElementById('submit-new-category');

    // Ensure the buttons exist before adding event listeners
    if (createCategoryBtn) {
        // Xử lý logic khi click nút "Tạo Danh Mục Sản Phẩm"
        createCategoryBtn.addEventListener('click', () => {
            const form = document.getElementById('create-product-category-form');
            form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Ẩn/hiện form
        });
    }

    if (submitCategoryBtn) {
        // Xử lý sự kiện khi click nút "Thêm danh mục"
        submitCategoryBtn.addEventListener('click', () => {
            const categoryName = document.getElementById('new-category-name').value;
            const description = document.getElementById('new-category-description').value;

            if (categoryName && description) {
                addProductCategory(categoryName, description); // Gọi hàm để thêm danh mục
            } else {
                alert('Vui lòng nhập đầy đủ thông tin danh mục.');
            }
        });
    }
});

async function addProductCategory(categoryName, description) {
    try {
        const response = await fetch('/api/ProductCategory/AddProductCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productCategoryName: categoryName,
                description: description
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Thông báo thành công
            fetchProductCategory(); // Tải lại danh sách danh mục sản phẩm
        } else {
            alert(result.message); // Thông báo lỗi nếu có
        }
    } catch (error) {
        console.error('Error adding product category:', error);
    }
}

async function fetchProductCategory(isActive = null) {
    let url = '/api/ProductCategory/GetAllProductCategory';
    if (isActive !== null) {
        url += `?isActive=${isActive}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            console.log(data);
            renderProductCategory(data.data); // Gọi hàm hiển thị dữ liệu lên bảng
        } else {
            console.error("Error fetching users:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

async function updateProductCategory(userId) {

    const productCategoryName = prompt('Nhập tên mới cho danh mục:');
    const description = prompt('Nhập mô tả mới cho danh mục:');
    try {
        const response = await fetch('/api/ProductCategory/Update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productCategoryID: userId,
                productCategoryName: productCategoryName,
                description: description,
            })
        });
        console.log(response);

        if (!response.ok) {
            console.error("Error: " + response.status);
            alert("Cập nhật không thành công");
            return;
        }

        const result = await response.json();
        if (result.isAssign) {
            alert(result.message); // Hiển thị thông báo cập nhật thành công
            fetchProductCategory(); // Reload lại danh sách người dùng
            console.log(result);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error updating user role:", error);
    }
}

async function toggleProductCategoryActive(userId, isActive) {
    console.log('ProductCategoryID:', userId, 'isActive:', isActive); // Log userID and isActive
    try {
        const response = await fetch(`/api/ProductCategory/ToggleActive?userId=${userId}&isActive=${isActive}`, {
            method: 'POST', // Keep POST if that's how your API is designed
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Hiển thị thông báo thay đổi trạng thái thành công
            fetchProductCategory(); // Reload lại danh sách người dùng
        } else {
            alert("Update trang thai thanh cong");
        }
    } catch (error) {
        console.error("Error toggling user active status:", error);
    }
}
function renderProductCategory(productCategories) {
    const productCategoryTableBody = document.getElementById('product-category-table-body');
    productCategoryTableBody.innerHTML = ''; // Clear existing rows

    productCategories.forEach(productCategories => {

        const row = `
            <tr>

                <td>${productCategories.productCategoryID}</td>
                <td>${productCategories.productCategoryName}</td>
                <td>${productCategories.description}</td>
                <td>${productCategories.isActive ? 'Yes' : 'No'}</td>
                
                <td>
                    <!-- Add your button or update logic here -->
                    <button class="update-productCategory-info-btn" data-productCategoryID="${productCategories.productCategoryID}">
                        Cập nhật Thông tin
                    </button>
                </td>
                <td>
                    <select class="status-select" data-productCategoryID="${productCategories.productCategoryID}">
                        <option value="true" ${productCategories.isActive ? 'selected' : ''}>Kích hoạt</option>
                        <option value="false" ${!productCategories.isActive ? 'selected' : ''}>Không kích hoạt</option>
                    </select>
                    <button class="update-productCategory-status-btn" data-productCategoryID="${productCategories.productCategoryID}">
                        Cập nhật Trạng thái
                    </button>
                </td>
            </tr>
        `;

        productCategoryTableBody.insertAdjacentHTML('beforeend', row);
    });
    document.querySelectorAll('.update-productCategory-info-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCategoryID = e.target.getAttribute('data-productCategoryID');
            updateProductCategory(productCategoryID);
            fetchProductCategory();
        });
    });

    document.querySelectorAll('.update-productCategory-status-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCategoryID = e.target.getAttribute('data-productCategoryID');
            const statusSelect = document.querySelector(`.status-select[data-productCategoryID="${productCategoryID}"]`);
            const isActive = statusSelect.value == 'true';
            console.log('Updating ProductCategoryID:', productCategoryID, 'to isActive', isActive);
            toggleProductCategoryActive(productCategoryID, isActive);
            fetchProductCategory();
        });
    });

}



//Size

document.addEventListener('DOMContentLoaded', function () {
    const createCategoryBtn = document.getElementById('create-size-btn');
    const submitCategoryBtn = document.getElementById('submit-new-size');

    // Ensure the buttons exist before adding event listeners
    if (createCategoryBtn) {
        // Xử lý logic khi click nút "Tạo Danh Mục Sản Phẩm"
        createCategoryBtn.addEventListener('click', () => {
            const form = document.getElementById('create-size-form');
            form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Ẩn/hiện form
        });
    }

    if (submitCategoryBtn) {
        // Xử lý sự kiện khi click nút "Thêm danh mục"
        submitCategoryBtn.addEventListener('click', () => {
            const categoryName = document.getElementById('new-size-name').value;


            if (categoryName) {
                addSize(categoryName); // Gọi hàm để thêm danh mục
            } else {
                alert('Vui lòng nhập đầy đủ thông tin danh mục.');
            }
        });
    }
});

async function addSize(categoryName) {
    try {
        const response = await fetch('/api/Size/AddSize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                SizeName: categoryName
          
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Thông báo thành công
            fetchProductCategory(); // Tải lại danh sách danh mục sản phẩm
        } else {
            alert(result.message); // Thông báo lỗi nếu có
        }
    } catch (error) {
        console.error('Error adding Size:', error);
    }
}

async function fetchSize(isActive = null) {
    let url = '/api/Size/GetAllSize';
    if (isActive !== null) {
        url += `?isActive=${isActive}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            console.log(data);
            renderSize(data.data); // Gọi hàm hiển thị dữ liệu lên bảng
        } else {
            console.error("Error fetching size:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

async function updateSize(sizeId) {
    const SizeName = prompt('Nhập tên mới cho Size:');

    try {
        const response = await fetch('/api/Size/Update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sizeId: sizeId,  // Sửa lại từ productCategoryID thành sizeId
                SizeName: SizeName,
            })
        });
        console.log(response);

        if (!response.ok) {
            console.error("Error: " + response.status);
            alert("Cập nhật không thành công");
            return;
        }

        const result = await response.json();
        if (result.isAssign) {
            alert(result.message); // Hiển thị thông báo cập nhật thành công
            fetchSize(); // Reload lại danh sách kích thước
            console.log(result);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error updating size type:", error);
    }
}


async function toggleSizeActive(userId, isActive) {
    console.log('SizeID:', userId, 'isActive:', isActive); // Log userID and isActive
    try {
        const response = await fetch(`/api/Size/ToggleActive?userId=${userId}&isActive=${isActive}`, {
            method: 'POST', // Keep POST if that's how your API is designed
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Hiển thị thông báo thay đổi trạng thái thành công
            fetchSize(); // Reload lại danh sách người dùng
        } else {
            alert("Update trang thai thanh cong");
        }
    } catch (error) {
        console.error("Error toggling size active status:", error);
    }
}
function renderSize(productCategories) {
    const productCategoryTableBody = document.getElementById('size-table-body');
    productCategoryTableBody.innerHTML = ''; // Clear existing rows

    productCategories.forEach(productCategories => {

        const row = `
            <tr>

                <td>${productCategories.sizeID}</td>
                <td>${productCategories.sizeName}</td>
                <td>${productCategories.isActive ? 'Yes' : 'No'}</td>
                
                <td>
                    <!-- Add your button or update logic here -->
                    <button class="update-size-info-btn" data-sizeID="${productCategories.sizeID}">
                        Cập nhật Thông tin
                    </button>
                </td>
                <td>
                    <select class="status-select" data-sizeID="${productCategories.sizeID}">
                        <option value="true" ${productCategories.isActive ? 'selected' : ''}>Kích hoạt</option>
                        <option value="false" ${!productCategories.isActive ? 'selected' : ''}>Không kích hoạt</option>
                    </select>
                    <button class="update-size-status-btn" data-sizeID="${productCategories.sizeID}">
                        Cập nhật Trạng thái
                    </button>
                </td>
            </tr>
        `;

        productCategoryTableBody.insertAdjacentHTML('beforeend', row);
    });
    document.querySelectorAll('.update-size-info-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCategoryID = e.target.getAttribute('data-sizeID');
            updateSize(productCategoryID);
            fetchSize();
        });
    });

    document.querySelectorAll('.update-size-status-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCategoryID = e.target.getAttribute('data-sizeID');
            const statusSelect = document.querySelector(`.status-select[data-sizeID="${productCategoryID}"]`);
            const isActive = statusSelect.value == 'true';
            console.log('Updating SizeID:', productCategoryID, 'to isActive', isActive);
            toggleSizeActive(productCategoryID, isActive);
            fetchSize();
        });
    });

}

//User
async function fetchUsers(isActive = null) {
    let url = '/api/User/AllUsers';
    if (isActive !== null) {
        url += `?isActive=${isActive}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            renderUsers(data.data);
            console.log(data);// Gọi hàm hiển thị dữ liệu lên bảng
        } else {
            console.error("Error fetching users:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}
function renderUsers(users) {
    const userTableBody = document.getElementById('user-table-body');
    userTableBody.innerHTML = ''; // Xóa nội dung hiện tại


    users.forEach(user => {
        const row = `
                <tr>
                    <td>${user.userID}</td>
                    <td>${user.roleName}</td>
                    <td>${user.email}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>******</td> <!-- Không hiển thị mật khẩu hash -->
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Chưa đăng nhập'}</td>
                    <td>${user.isActive ? 'Yes' : 'No'}</td>
     
    <td>
        <select class="role-select" data-userid="${user.userID}">
            <!-- Các options sẽ được điền bằng fetchUserRoles() -->
        </select>
        <button class="update-role-btn" data-userid="${user.userID}">Cập nhật Role</button>
    </td>

           <td>
        <select class="status-select" data-userid="${user.userID}">
            <option value="true" ${user.isActive ? 'selected' : ''}>Kích hoạt</option>
            <option value="false" ${!user.isActive ? 'selected' : ''}>Không kích hoạt</option>
        </select>
        <button class="update-status-btn" data-userid="${user.userID}">Cập nhật Trạng thái</button>
    </td>

                </tr>
            `;
        userTableBody.insertAdjacentHTML('beforeend', row);
    });
    // Thêm sự kiện cho nút cập nhật Role

    document.querySelectorAll('.update-role-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-userid');
            updateUserRole(userId); // Gọi hàm updateUserRole với userId
            fetchUsers();
        });
    });


    // Gọi hàm để lấy danh sách Role
    fetchUserRoles();
    // Thêm sự kiện cho nút thay đổi trạng thái hoạt động
    document.querySelectorAll('.update-status-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-userid'); // Lấy userID từ thuộc tính data
            const statusSelect = document.querySelector(`.status-select[data-userid="${userId}"]`); // Lấy dropdown tương ứng
            const isActive = statusSelect.value === 'true'; // Lấy giá trị true/false từ dropdown và chuyển thành boolean

            // In ra giá trị để kiểm tra
            console.log('Updating UserID:', userId, 'to isActive:', isActive); // In ra để kiểm tra dữ liệu

            // Gọi API để thay đổi trạng thái người dùng
            toggleUserActive(userId, isActive);
        });
    });



}

async function fetchUserRoles() {
    try {
        const response = await fetch('/api/User/GetRoles'); // Gọi API để lấy danh sách role
        if (response.ok) {
            const roles = await response.json();
            document.querySelectorAll('.role-select').forEach(select => {
                // Xóa các tùy chọn hiện tại nếu có
                select.innerHTML = '';

                roles.forEach(role => {
                    const option = document.createElement('option');
                    option.value = role.roleID; // Đặt value là roleID
                    option.textContent = role.roleName; // Đặt text là roleName
                    select.appendChild(option);
                });
            });
        } else {
            console.error("Error fetching roles:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}


async function updateUserRole(userId) {
    const roleSelect = document.querySelector(`.role-select[data-userid="${userId}"]`);
    const roleId = roleSelect.value; // Lấy giá trị từ dropdown

    if (!roleId) {
        alert("Vui lòng chọn một vai trò.");
        return;
    }

    try {
        const response = await fetch('/api/User/AssignRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UserID: userId,
                RoleID: roleId
            })
        });

        const result = await response.json();
        if (result.isAssign) {
            alert(result.message); // Hiển thị thông báo cập nhật thành công
            fetchUsers(); // Reload lại danh sách người dùng
        } else {
            alert( result.message);
        }
    } catch (error) {
        console.error("Error updating user role:", error);
    }
}

async function toggleUserActive(userId, isActive) {
    console.log('UserID:', userId, 'isActive:', isActive); // Log userID and isActive
    try {
        const response = await fetch(`/api/User/ToggleActive?userId=${userId}&isActive=${isActive}`, {
            method: 'POST', // Keep POST if that's how your API is designed
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Hiển thị thông báo thay đổi trạng thái thành công
            fetchUsers(); // Reload lại danh sách người dùng
        } else {
            alert("Update trang thai thanh cong");
            
        }
    } catch (error) {
        console.error("Error toggling user active status:", error);
    }
}

// Thêm sự kiện click cho mỗi mục <li>
// Thêm sự kiện click cho mỗi mục <li>
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Lấy giá trị của thuộc tính data-page
        const page = item.getAttribute('data-page');

        // Cập nhật nội dung phần main-content
        mainContent.querySelector('header h1').textContent = pages[page].title;
        mainContent.querySelector('.content').innerHTML = pages[page].content;

        // Logic cho trang "Người dùng"
        if (page === 'nguoi-dung') {
            fetchUsers();
            setTimeout(() => {
                const searchBtn = document.getElementById('search-btn');
                const activeBtn = document.getElementById('active-btn');
                const inactiveBtn = document.getElementById('inactive-btn');
                const userTableBody = document.getElementById('user-table-body');

                searchBtn.addEventListener('click', () => {
                    const query = document.getElementById('search-input').value.toLowerCase();
                    const rows = userTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                        row.style.display = email.includes(query) ? '' : 'none';
                    });
                });

                activeBtn.addEventListener('click', () => {
                    const rows = userTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const isActive = row.querySelector('td:nth-child(9)').textContent;
                        row.style.display = isActive === 'Yes' ? '' : 'none';
                    });
                });

                inactiveBtn.addEventListener('click', () => {
                    const rows = userTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const isActive = row.querySelector('td:nth-child(9)').textContent;
                        row.style.display = isActive === 'No' ? '' : 'none';
                    });
                });
            }, 0); // Đảm bảo các phần tử đã tồn tại trước khi gắn sự kiện
        }

        // Logic cho trang "Danh mục sản phẩm"
        if (page === 'danhmuc-sanpham') {
            fetchProductCategory(); // Gọi hàm để load danh sách danh mục sản phẩm

            setTimeout(() => {
                const searchProductBtn = document.getElementById('search-product-btn');
                const activeProductBtn = document.getElementById('active-product-btn');
                const inactiveProductBtn = document.getElementById('unactive-product-btn');
                const productCategoryTableBody = document.getElementById('product-category-table-body');

                // Kiểm tra nếu các phần tử cần thiết tồn tại trước khi thao tác
                if (productCategoryTableBody) {

                    // Sự kiện tìm kiếm danh mục sản phẩm theo tên
                    if (searchProductBtn) {
                        searchProductBtn.addEventListener('click', () => {
                            const query = document.getElementById('search-product-input').value.toLowerCase();
                            const rows = productCategoryTableBody.querySelectorAll('tr');
                            rows.forEach(row => {
                                const categoryName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                                row.style.display = categoryName.includes(query) ? '' : 'none';
                            });
                        });
                    }

                    // Sự kiện cho nút hiển thị danh mục sản phẩm Active
                    if (activeProductBtn) {
                        activeProductBtn.addEventListener('click', () => {
                            const rows = productCategoryTableBody.querySelectorAll('tr');
                            rows.forEach(row => {
                                const isActive = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
                                row.style.display = (isActive === 'yes' || isActive === 'active') ? '' : 'none';
                            });
                        });
                    }

                    // Sự kiện cho nút hiển thị danh mục sản phẩm Inactive
                    if (inactiveProductBtn) {
                        inactiveProductBtn.addEventListener('click', () => {
                            const rows = productCategoryTableBody.querySelectorAll('tr');
                            rows.forEach(row => {
                                const isActive = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
                                row.style.display = (isActive === 'no' || isActive === 'inactive') ? '' : 'none';
                            });
                        });
                    }
                }

                // Thêm sự kiện cho nút Tạo Danh Mục Sản Phẩm
                const createCategoryBtn = document.getElementById('create-product-category-btn');
                if (createCategoryBtn) {
                    createCategoryBtn.addEventListener('click', () => {
                        const form = document.getElementById('create-product-category-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Ẩn/hiện form
                    });
                }

                // Thêm danh mục sản phẩm mới
                const submitCategoryBtn = document.getElementById('submit-new-category');
                if (submitCategoryBtn) {
                    submitCategoryBtn.addEventListener('click', () => {
                        const categoryName = document.getElementById('new-category-name').value;
                        const description = document.getElementById('new-category-description').value;

                        if (categoryName && description) {
                            addProductCategory(categoryName, description); // Gọi hàm để thêm danh mục
                        } else {
                            alert('Vui lòng nhập đầy đủ thông tin danh mục.');
                        }
                    });
                }
            }, 0); // Đảm bảo các phần tử đã tồn tại trước khi gắn sự kiện
        }

        // Logic cho trang "Sản phẩm"
        if (page === 'san-pham') {
            fetchProducts(); // Gọi hàm để load danh sách sản phẩm

            // Thêm sự kiện cho các nút sau khi sản phẩm đã được tải
            const searchProductBtn = document.getElementById('search-product1-btn');
            const activeProductBtn = document.getElementById('active-product1-btn');
            const inactiveProductBtn = document.getElementById('inactive-product1-btn');
            const productTableBody = document.getElementById('product-table-body');
            const createProductBtn = document.getElementById('create-product-btn');
            const submitProductBtn = document.getElementById('submit-new-product');
            const categoryInput = document.getElementById('new-product-category');
            const selectedCategoryIdInput = document.getElementById('selected-category-id'); // Khai báo ở đây
            if (categoryInput) {
                categoryInput.addEventListener('input', () => {
                    const categoryName = categoryInput.value;
                    const categoryId = getCategoryIdByName(categoryName);
                    selectedCategoryIdInput.value = categoryId; // Cập nhật ID danh mục
                });
            }

            // Tìm các nút và đảm bảo rằng chúng tồn tại trước khi gán sự kiện
            if (searchProductBtn) {
                searchProductBtn.addEventListener('click', () => {
                    const query = document.getElementById('search-product1-input').value.toLowerCase();
                    const rows = productTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const productName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                        row.style.display = productName.includes(query) ? '' : 'none';
                    });
                });
            }

            if (activeProductBtn) {
                activeProductBtn.addEventListener('click', () => {
                    const rows = productTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const isActive = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
                        row.style.display = (isActive === 'yes' || isActive === 'true') ? '' : 'none'; // Show only active products
                    });
                });
            }

            if (inactiveProductBtn) {
                inactiveProductBtn.addEventListener('click', () => {
                    const rows = productTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const isActive = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
                        row.style.display = (isActive === 'no' || isActive === 'false') ? '' : 'none'; // Show only inactive products
                    });
                });
            }


            // Thêm sự kiện cho nút Tạo Sản Phẩm
            if (createProductBtn) {
                createProductBtn.addEventListener('click', () => {
                    const form = document.getElementById('create-product-form');
                    form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Ẩn/hiện form
                });
            }

            // Thêm sản phẩm mới
            if (submitProductBtn) {
                submitProductBtn.addEventListener('click', () => {
                    const productName = document.getElementById('new-product-name').value;
                    const price = document.getElementById('new-product-price').value;
                    const description = document.getElementById('new-product-description').value;
                    const productCategoryID = selectedCategoryIdInput.value; // Lấy ID danh mục đã chọn
                    const status = document.getElementById('new-product-status').value;

                    if (productName && description && price && productCategoryID) {
                        addProduct(productName, productCategoryID, description, parseFloat(price), status);
                    } else {
                        alert('Vui lòng nhập đầy đủ thông tin sản phẩm.');
                    }
                });
            }


        }

        if (page === 'size') {
            fetchSize(); // Gọi hàm để load danh sách danh mục sản phẩm

            setTimeout(() => {
                const searchProductBtn = document.getElementById('search-size-btn');
                const activeProductBtn = document.getElementById('active-size-btn');
                const inactiveProductBtn = document.getElementById('unactive-size-btn');
                const productCategoryTableBody = document.getElementById('size-table-body');

                // Kiểm tra nếu các phần tử cần thiết tồn tại trước khi thao tác
                if (productCategoryTableBody) {

                    // Sự kiện tìm kiếm danh mục sản phẩm theo tên
                    if (searchProductBtn) {
                        searchProductBtn.addEventListener('click', () => {
                            const query = document.getElementById('search-size-input').value.toLowerCase();
                            const rows = productCategoryTableBody.querySelectorAll('tr');
                            rows.forEach(row => {
                                const categoryName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                                row.style.display = categoryName.includes(query) ? '' : 'none';
                            });
                        });
                    }

                    // Sự kiện cho nút hiển thị danh mục sản phẩm Active
                    if (activeProductBtn) {
                        activeProductBtn.addEventListener('click', () => {
                            const rows = productCategoryTableBody.querySelectorAll('tr');
                            rows.forEach(row => {
                                const isActive = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
                                row.style.display = (isActive === 'yes' || isActive === 'active') ? '' : 'none';
                            });
                        });
                    }

                    // Sự kiện cho nút hiển thị danh mục sản phẩm Inactive
                    if (inactiveProductBtn) {
                        inactiveProductBtn.addEventListener('click', () => {
                            const rows = productCategoryTableBody.querySelectorAll('tr');
                            rows.forEach(row => {
                                const isActive = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
                                row.style.display = (isActive === 'no' || isActive === 'inactive') ? '' : 'none';
                            });
                        });
                    }
                }

                // Thêm sự kiện cho nút Tạo Danh Mục Sản Phẩm
                const createCategoryBtn = document.getElementById('create-size-btn');
                if (createCategoryBtn) {
                    createCategoryBtn.addEventListener('click', () => {
                        const form = document.getElementById('create-size-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Ẩn/hiện form
                    });
                }

                // Thêm danh mục sản phẩm mới
                const submitCategoryBtn = document.getElementById('submit-new-size');
                if (submitCategoryBtn) {
                    submitCategoryBtn.addEventListener('click', () => {
                        const categoryName = document.getElementById('new-size-name').value;
                      

                        if (categoryName) {
                            addSize(categoryName); // Gọi hàm để thêm danh mục
                        } else {
                            alert('Vui lòng nhập đầy đủ thông tin danh mục.');
                        }
                    });
                }
            }, 0); // Đảm bảo các phần tử đã tồn tại trước khi gắn sự kiện
        }
    });
});
