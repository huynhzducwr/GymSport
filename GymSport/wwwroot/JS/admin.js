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
               <h2 id="user-title">Quản lý Người dùng</h2>
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
           #user-title:hover {
                color: #007bff; /* Change color on hover */
                cursor: pointer; /* Change cursor to pointer on hover */
                text-decoration: underline; /* Underline on hover */
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

`
    },
    'don-hang': {
        title: 'Don hàng',
        content: `
        <!-- Search Form -->
        <div>
            <input type="text" id="search-order-input" placeholder="Tìm kiếm hinh anh..." />
            <button id="search-order-btn">Tìm kiếm</button>
        </div>

        <!-- Button to Show Image Creation Form -->
        <button id="create-order-btn">Tạo Hình Ảnh</button>

        <!-- Hidden Form for Adding New Image -->
        <div id="create-order-form" style="display: none;">
            <label for="product-id">Product ID:</label>
            <input type="text" id="product-id" placeholder="Nhập Product ID">
             <label for="stock-quantity">Stock Quantity:</label>
            <input type="text" id="stock-quantity" placeholder="Nhập Stock Quantity">
            <br>
            <button id="submit-new-order">Thêm order</button>
        </div>

        <!-- Button to Show Image Deletion Form -->
        <button id="delete-productorder-btn">Xóa Productorder</button>
        <div id="delete-productorder-form" style="display: none;">
            <label for="delete-orderID">orderID:</label>
            <input type="number" id="delete-orderID" placeholder="Nhập orderID">
            <br>
            <button id="submit-delete-productorder">Xóa Productorder</button>
        </div>

        <!-- Product Image Management Table -->
        <h2>Quản lý Hình Ảnh cho Kho</h2>
        <p>Đây là trang quản lý kho</p>
        <table>
            <thead>
                <tr>
                    <th> OrderID </th>
             
                    <th> firstname </th>
                    <th> lastname </th>
                    <th> OrderDate </th>
                    <th> OrderStatus </th>
                    <th> ShippingAddress </th>
                    <th> PhoneNumber </th>
                    <th> TotalAmount $ </th>
                    <th>   Update      </th>
                </tr>
            </thead>
            <tbody id="productorder-table-body">
                <!-- Data will be populated here -->
            </tbody>
        </table>

        
    `
    },
    'payment': {
        title: 'thanh toán',
        content: `
        <!-- Search Form -->
        <div>
            <input type="text" id="search-payment-input" placeholder="Tìm kiếm hóa đơn" />
            <button id="search-payment-btn">Tìm kiếm</button>
        </div>

        <!-- Product Image Management Table -->
        <h2>Quản lý Hình Ảnh cho Kho</h2>
        <p>Đây là trang quản lý kho</p>
        <table>
            <thead>
                <tr>
                    <th>PaymentID</th>
                    <th>OrderID</th>
                    <th>TotalAmount $</th>
                    <th>PaymentDate</th>
                    <th>PaymentMethodID</th>
                    <th>PaymentStatus</th>
              
                </tr>
            </thead>
            <tbody id="payment-table-body">
                <!-- Data will be populated here -->
            </tbody>
        </table>

        
    `
    },
    'paymentdetail': {
        title: 'Chi tiết Hóa đơn',
        content: `
        <!-- Search Form -->
        <div>
            <input type="text" id="search-paymentdetail-input" placeholder="Tìm kiếm hóa đơn" />
            <button id="search-paymentdetail-btn">Tìm kiếm</button>
        </div>


        <!-- Product Image Management Table -->
        <h2>Quản lý Hình Ảnh cho Kho</h2>
        <p>Đây là trang quản lý kho</p>
        <table>
            <thead>
                <tr>
                    <th>PaymentDetailID</th>
                    <th>PaymentID</th>
                    <th>ProductID</th>
                    <th>Quantity</th>
                    <th>Price $</th>
                </tr>
            </thead>
            <tbody id="paymentdetail-table-body">
                <!-- Data will be populated here -->
            </tbody>
        </table>

        
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

         
        `

    },
    'color': {
        title: 'Color',
        content: `
        <!-- Nút Tạo Danh Mục Màu sắc -->
<button id="create-color-btn">Tạo Color</button>

<!-- Form nhập liệu ẩn (hiển thị khi bấm nút) -->
<div id="create-color-form" style="display: none;">
    <label for="new-color-name">Tên Color:</label>
    <input type="text" id="new-color-name" placeholder="Nhập tên màu">
    <br>
    <button id="submit-new-color">Thêm màu</button>
</div>

            <h2>Quản lý Màu cho sản phẩm</h2>
            <p>Đây là trang quản lý màu</p>

            <!-- Form tìm kiếm -->
            <div>
                <input type="text" id="search-color-input" placeholder="Tìm kiếm màu..." />
                <button id="search-color-btn">Tìm kiếm</button>
            </div>

            <!-- Lọc trạng thái -->
            <div>
                <button id="active-color-btn">Có sẵn</button>
                <button id="unactive-color-btn">Không có sẵn</button>
            </div>

            <!-- Bảng dữ liệu sản phẩm -->
            <table>
                <thead>
                    <tr>
                        <th>ColorID</th>
                        <th>ColorName</th>
                        <th>isActive</th>                      
                        <th>Update</th>
                        <th>Active</th>
                    </tr>
                </thead>
                 <tbody id="color-table-body">
                    <!-- Dữ liệu sản phẩm sẽ được điền ở đây -->
                </tbody>
            </table>

           
        `
    },
    'product-size': {
        title: 'Kích cỡ sản phẩm',
        content: `
 
<div id="product-size">
    <h2>Quản lý kích cỡ sản phẩm</h2>
    <p>Đây là trang quản lý kích cỡ sản phẩm</p>

    <!-- Search Form -->
    <div>
        <input type="text" id="search-productsize-input" placeholder="Tìm kiếm sản phẩm..." />
        <button id="search-productsize-btn">Tìm kiếm</button>
    </div>

    <!-- Add ProductSize Form -->
    <button id="add-productsize-btn">Tạo ProductSize</button>
    <div id="add-productsize-form" style="display: none;">
        <label for="add-productID">ProductID:</label>
        <input type="number" id="add-productID" placeholder="Nhập ProductID">
        <label for="add-productName">ProductName:</label>
        <input type="text" id="add-productName" placeholder="Nhập ProductName">
        <label for="add-sizeID">SizeID:</label>
        <input type="number" id="add-sizeID" placeholder="Nhập SizeID">
        <label for="add-sizeName">SizeName:</label>
        <input type="text" id="add-sizeName" placeholder="Nhập SizeName">
        <br>
        <button id="submit-add-productsize">Thêm ProductSize</button>
    </div>

    <!-- Delete ProductSize Form -->
  <button id="delete-productsize-btn">Xóa ProductSize</button>
    <div id="delete-productsize-form" style="display: none;">
        <label for="delete-productID">ProductID:</label>
        <input type="number" id="delete-productID" placeholder="Nhập ProductID">
        <label for="delete-productName">ProductName:</label>
        <input type="text" id="delete-productName" placeholder="Nhập ProductName">
        <label for="delete-sizeID">SizeID:</label>
        <input type="number" id="delete-sizeID" placeholder="Nhập SizeID">
        <label for="delete-sizeName">SizeName:</label>
        <input type="text" id="delete-sizeName" placeholder="Nhập SizeName">
        <br>
        <button id="submit-delete-productsize">Xóa ProductSize</button>
    </div>

    <!-- Bulk Insert ProductSize Form -->
    <button id="bulk-insert-productsize-btn">Thêm ProductSize hàng loạt</button>
    <div id="bulk-insert-productsize-form" style="display: none;">
        <label for="bulk-insert-productID">ProductID:</label>
        <input type="number" id="bulk-insert-productID" placeholder="Nhập ProductID">
        <label for="bulk-insert-sizeIDs">SizeIDs (nhập cách nhau bằng dấu phẩy):</label>
        <input type="text" id="bulk-insert-sizeIDs" placeholder="Nhập SizeIDs">
        <br>
        <button id="submit-bulk-insert-productsize">Thêm hàng loạt</button>
    </div>

    <!-- Bulk Update ProductSize Form -->
    <button id="bulk-update-productsize-btn">Cập nhật ProductSize hàng loạt</button>
    <div id="bulk-update-productsize-form" style="display: none;">
        <label for="bulk-update-productID">ProductID:</label>
        <input type="number" id="bulk-update-productID" placeholder="Nhập ProductID">
        <label for="bulk-update-sizeIDs">SizeIDs (nhập cách nhau bằng dấu phẩy):</label>
        <input type="text" id="bulk-update-sizeIDs" placeholder="Nhập SizeIDs">
        <br>
        <button id="submit-bulk-update-productsize">Cập nhật hàng loạt</button>
    </div>

    <!-- Table for displaying product sizes -->
    <table>
        <thead>
            <tr>
                <th>ProductID</th>
                <th>ProductName</th>
                <th>SizeID</th>
                <th>SizeName</th>
            </tr>
        </thead>
        <tbody id="productsize-table-body">
            <!-- Product size data will be dynamically added here -->
        </tbody>
    </table>

 
        `

    },


    'product-color': {
        title: 'Màu sắc sản phẩm',
        content: `
 
<div id="product-size">
    <h2>Quản lý màu sắc sản phẩm</h2>
    <p>Đây là trang quản lý kích cỡ sản phẩm</p>

    <!-- Search Form -->
    <div>
        <input type="text" id="search-productcolor-input" placeholder="Tìm kiếm sản phẩm..." />
        <button id="search-productcolor-btn">Tìm kiếm</button>
    </div>

    <!-- Add ProductSize Form -->
    <button id="add-productcolor-btn">Tạo ProductColor</button>
    <div id="add-productcolor-form" style="display: none;">
        <label for="add-productID">ProductID:</label>
        <input type="number" id="add-productID" placeholder="Nhập ProductID">
        <label for="add-productName">ProductName:</label>
        <input type="text" id="add-productName" placeholder="Nhập ProductName">
        <label for="add-colorID">ColorID:</label>
        <input type="number" id="add-colorID" placeholder="Nhập ColorID">
        <label for="add-colorName">ColorName:</label>
        <input type="text" id="add-colorName" placeholder="Nhập ColorName">
        <br>
        <button id="submit-add-productcolor">Thêm ProductColor</button>
    </div>

    <!-- Delete ProductSize Form -->
  <button id="delete-productcolor-btn">Xóa ProductColor</button>
    <div id="delete-productcolor-form" style="display: none;">
        <label for="delete-productID">ProductID:</label>
        <input type="number" id="delete-productID" placeholder="Nhập ProductID">
        <label for="delete-productName">ProductName:</label>
        <input type="text" id="delete-productName" placeholder="Nhập ProductName">
        <label for="delete-colorID">ColorID:</label>
        <input type="number" id="delete-colorID" placeholder="Nhập ColorID">
        <label for="delete-colorName">ColorName:</label>
        <input type="text" id="delete-colorName" placeholder="Nhập ColorName">
        <br>
        <button id="submit-delete-productcolor">Xóa ProductColor</button>
    </div>

    <!-- Bulk Insert ProductSize Form -->
    <button id="bulk-insert-productcolor-btn">Thêm ProductColor hàng loạt</button>
    <div id="bulk-insert-productcolor-form" style="display: none;">
        <label for="bulk-insert-productID">ProductID:</label>
        <input type="number" id="bulk-insert-productID" placeholder="Nhập ProductID">
        <label for="bulk-insert-colorIDs">ColorIDs (nhập cách nhau bằng dấu phẩy):</label>
        <input type="text" id="bulk-insert-colorIDs" placeholder="Nhập ColorIDs">
        <br>
        <button id="submit-bulk-insert-productcolor">Thêm hàng loạt</button>
    </div>

    <!-- Bulk Update ProductSize Form -->
    <button id="bulk-update-productcolor-btn">Cập nhật ProductColor hàng loạt</button>
    <div id="bulk-update-productcolor-form" style="display: none;">
        <label for="bulk-update-productID">ProductID:</label>
        <input type="number" id="bulk-update-productID" placeholder="Nhập ProductID">
        <label for="bulk-update-colorIDs">ColorIDs (nhập cách nhau bằng dấu phẩy):</label>
        <input type="text" id="bulk-update-colorIDs" placeholder="Nhập ColorIDs">
        <br>
        <button id="submit-bulk-update-productcolor">Cập nhật hàng loạt</button>
    </div>

    <!-- Table for displaying product sizes -->
    <table>
        <thead>
            <tr>
                <th>ProductID</th>
                <th>ProductName</th>
                <th>ColorID</th>
                <th>ColorName</th>
            </tr>
        </thead>
        <tbody id="productcolor-table-body">
            <!-- Product size data will be dynamically added here -->
        </tbody>
    </table>

 
        `

    },
    'product-image': {
        title: 'Hình ảnh sản phẩm',
        content: `
        <!-- Search Form -->
        <div>
            <input type="text" id="search-image-input" placeholder="Tìm kiếm hinh anh..." />
            <button id="search-image-btn">Tìm kiếm</button>
        </div>

        <!-- Button to Show Image Creation Form -->
        <button id="create-image-btn">Tạo Hình Ảnh</button>

        <!-- Hidden Form for Adding New Image -->
        <div id="create-image-form" style="display: none;">
            <label for="product-id">Product ID:</label>
            <input type="text" id="product-id" placeholder="Nhập Product ID">
            <label for="productName">Product Name:</label>
            <input type="text" id="ProductName" placeholder="Nhập Product Name">
            <label for="image-file">Chọn Hình Ảnh:</label>
            <input type="file" id="image-file">
            <br>
            <button id="submit-new-image">Thêm Hình Ảnh</button>
        </div>

        <!-- Button to Show Image Deletion Form -->
        <button id="delete-productimage-btn">Xóa ProductImage</button>
        <div id="delete-productimage-form" style="display: none;">
            <label for="delete-productID">ProductID:</label>
            <input type="number" id="delete-imageID" placeholder="Nhập ImageID">
            <br>
            <button id="submit-delete-productimage">Xóa ProductImage</button>
        </div>

        <!-- Product Image Management Table -->
        <h2>Quản lý Hình Ảnh cho sản phẩm</h2>
        <p>Đây là trang quản lý hình ảnh</p>
        <table>
            <thead>
                <tr>
                    <th>ImageID</th>
                    <th>ProductID</th>
                    <th>Product name</th>
                    <th>ImageURL</th>
                </tr>
            </thead>
            <tbody id="productimage-table-body">
                <!-- Data will be populated here -->
            </tbody>
        </table>

     
    `
    },
    'product-inventory': {
        title: 'Kho hàng',
        content: `
        <!-- Search Form -->
        <div>
            <input type="text" id="search-inventory-input" placeholder="Tìm kiếm hinh anh..." />
            <button id="search-inventory-btn">Tìm kiếm</button>
        </div>

        <!-- Button to Show Image Creation Form -->
        <button id="create-inventory-btn">Tạo Hình Ảnh</button>

        <!-- Hidden Form for Adding New Image -->
        <div id="create-inventory-form" style="display: none;">
            <label for="product-id">Product ID:</label>
            <input type="text" id="product-id" placeholder="Nhập Product ID">
             <label for="stock-quantity">Stock Quantity:</label>
            <input type="text" id="stock-quantity" placeholder="Nhập Stock Quantity">
            <br>
            <button id="submit-new-inventory">Thêm Inventory</button>
        </div>

        <!-- Button to Show Image Deletion Form -->
        <button id="delete-productinventory-btn">Xóa ProductInventort</button>
        <div id="delete-productinventory-form" style="display: none;">
            <label for="delete-inventoryID">InventoryID:</label>
            <input type="number" id="delete-inventoryID" placeholder="Nhập InventoryID">
            <br>
            <button id="submit-delete-productinventory">Xóa ProductInventory</button>
        </div>

        <!-- Product Image Management Table -->
        <h2>Quản lý Hình Ảnh cho Kho</h2>
        <p>Đây là trang quản lý kho</p>
        <table>
            <thead>
                <tr>
                    <th>InventoryID</th>
                    <th>ProductID</th>
                    <th>Stock Quantity</th>
                    <th>Product Name </th>
                </tr>
            </thead>
            <tbody id="productinventory-table-body">
                <!-- Data will be populated here -->
            </tbody>
        </table>

        
    `
    },
    'order-detail': {
        title: 'Chi tiết đơn hàng',
        content: `
        <!-- Search Form -->
        <div>
            <input type="text" id="search-order-detail-input" placeholder="Tìm kiếm đơn hàng" />
            <button id="search-orderdetail-btn">Tìm kiếm</button>
        </div>

        

    

        <!-- Button to Show Image Deletion Form -->
        <button id="delete-orderdetail-btn">Xóa đơn</button>
        <div id="delete-orderdetail-form" style="display: none;">

            <label for="delete-orderdetailID">orderdetailID:</label>
            <input type="number" id="delete-orderdetailID" placeholder="Nhập orderID">
            <br>

            <button id="submit-delete-orderdetailID">Xóa chi tiết đơn hàng</button>
        </div>

        <!-- Product Image Management Table -->
        <h2>Quản lý Hình Ảnh cho Kho</h2>
        <p>Đây là trang quản lý kho</p>
        <table>
            <thead>
                <tr>
                    <th>OrderDetailID</th>
                    <th>OrderID</th>
                    <th>ProductID</th>
                    <th>ProductName</th>
                    <th>Quantity</th>
                    <th>UnitPrice</th>
                    <th>OrderDate</th>
                    <th>TotalAmount</th>
                    <th>OrderStatus</th>
                </tr>
            </thead>
            <tbody id="orderdetail-table-body">
                <!-- Data will be populated here -->
            </tbody>
        </table>

      
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


async function toggleOrderStatus(orderId, newStatus) {
    console.log('OrderID:', orderId, 'NewStatus:', newStatus); // Log orderId and newStatus
    try {
        const response = await fetch(`/api/Order/ToggleActive?orderId=${orderId}&newStatus=${encodeURIComponent(newStatus)}`, {
            method: 'POST', // POST nếu API của bạn yêu cầu
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        showSuccessAlert(result.message);
            fetchOrders(); // Gọi lại hàm để load danh sách đơn hàng mới
      
    } catch (error) {
        console.error("Error toggling order status:", error);
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


//Color
document.addEventListener('DOMContentLoaded', function () {
    const createCategoryBtn = document.getElementById('create-color-btn');
    const submitCategoryBtn = document.getElementById('submit-new-color');

    // Ensure the buttons exist before adding event listeners
    if (createCategoryBtn) {
        // Xử lý logic khi click nút "Tạo Danh Mục Sản Phẩm"
        createCategoryBtn.addEventListener('click', () => {
            const form = document.getElementById('create-color-form');
            form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Ẩn/hiện form
        });
    }

    if (submitCategoryBtn) {
        // Xử lý sự kiện khi click nút "Thêm danh mục"
        submitCategoryBtn.addEventListener('click', () => {
            const categoryName = document.getElementById('new-color-name').value;


            if (categoryName) {
                addColor(categoryName); // Gọi hàm để thêm danh mục
            } else {
                alert('Vui lòng nhập đầy đủ thông tin danh mục.');
            }
        });
    }
});

async function addColor(categoryName) {
    try {
        const response = await fetch('/api/Color/AddColor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                colorName: categoryName

            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Thông báo thành công
            fetchColor(); // Tải lại danh sách danh mục sản phẩm
        } else {
            alert(result.message); // Thông báo lỗi nếu có
        }
    } catch (error) {
        console.error('Error adding Size:', error);
    }
}

async function fetchColor(isActive = null) {
    let url = '/api/Color/GetAllColor';
    if (isActive !== null) {
        url += `?isActive=${isActive}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            console.log(data);
            renderColor(data.data); // Gọi hàm hiển thị dữ liệu lên bảng
        } else {
            console.error("Error fetching size:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

async function updateColor(sizeId) {
    const ColorName = prompt('Nhập tên mới cho Màu:');

    try {
        const response = await fetch('/api/Color/Update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                colorId: sizeId,  // Sửa lại từ productCategoryID thành sizeId
                ColorName: ColorName,
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
            fetchColor(); // Reload lại danh sách kích thước
            console.log(result);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error updating size type:", error);
    }
}


async function toggleColorActive(userId, isActive) {
    console.log('ColorID:', userId, 'isActive:', isActive); // Log userID and isActive
    try {
        const response = await fetch(`/api/Color/ToggleActive?userId=${userId}&isActive=${isActive}`, {
            method: 'POST', // Keep POST if that's how your API is designed
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Hiển thị thông báo thay đổi trạng thái thành công
            fetchColor(); // Reload lại danh sách người dùng
        } else {
            alert("Update trang thai thanh cong");
        }
    } catch (error) {
        console.error("Error toggling size active status:", error);
    }
}
function renderColor(productCategories) {
    const productCategoryTableBody = document.getElementById('color-table-body');
    productCategoryTableBody.innerHTML = ''; // Clear existing rows

    productCategories.forEach(productCategories => {

        const row = `
            <tr>

                <td>${productCategories.colorID}</td>
                <td>${productCategories.colorName}</td>
                <td>${productCategories.isActive ? 'Yes' : 'No'}</td>
                
                <td>
                    <!-- Add your button or update logic here -->
                    <button class="update-color-info-btn" data-colorID="${productCategories.colorID}">
                        Cập nhật Thông tin
                    </button>
                </td>
                <td>
                    <select class="status-select" data-colorID="${productCategories.colorID}">
                        <option value="true" ${productCategories.isActive ? 'selected' : ''}>Kích hoạt</option>
                        <option value="false" ${!productCategories.isActive ? 'selected' : ''}>Không kích hoạt</option>
                    </select>
                    <button class="update-color-status-btn" data-colorID="${productCategories.colorID}">
                        Cập nhật Trạng thái
                    </button>
                </td>
            </tr>
        `;

        productCategoryTableBody.insertAdjacentHTML('beforeend', row);
    });
    document.querySelectorAll('.update-color-info-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCategoryID = e.target.getAttribute('data-colorID');
            updateColor(productCategoryID);
            fetchColor();
        });
    });

    document.querySelectorAll('.update-color-status-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCategoryID = e.target.getAttribute('data-colorID');
            const statusSelect = document.querySelector(`.status-select[data-colorID="${productCategoryID}"]`);
            const isActive = statusSelect.value == 'true';
            console.log('Updating ColorID:', productCategoryID, 'to isActive', isActive);
            toggleColorActive(productCategoryID, isActive);
            fetchColor();
        });
    });

}




//ProductSize



function renderProductSize(productCategories) {
    const productCategoryTableBody = document.getElementById('productsize-table-body');
    productCategoryTableBody.innerHTML = ''; // Clear existing rows

    productCategories.forEach(productCategories => {

        const row = `
            <tr>

                <td>${productCategories.productID}</td>
                <td>${productCategories.productName}</td>
                 <td>${productCategories.sizeID}</td>
                <td>${productCategories.sizeName}</td>
            </tr>
        `;

        productCategoryTableBody.insertAdjacentHTML('beforeend', row);
    });

}
async function fetchProductSize() {
    let url = '/api/ProductSize/GetAllProductSize';


    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            console.log(data);
            renderProductSize(data.data); // Gọi hàm hiển thị dữ liệu lên bảng
        } else {
            console.error("Error fetching size:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}
async function addProductSize(productID, sizeID, productName = '', sizeName = '') {
    try {
        const response = await fetch('/api/ProductSize/AddProductSize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: productID,
                sizeID: sizeID,
                productName: productName, // Optional
                sizeName: sizeName       // Optional
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Notify success
            fetchProductSize(); // Reload the product size list
        } else {
            alert(result.message); // Notify error
        }
    } catch (error) {
        console.error('Error adding productSize:', error);
    }
}

async function deleteProductSize(productID, sizeID, productName = '', sizeName = '') {
    try {
        const response = await fetch('/api/ProductSize/DeleteProductSize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: productID,
                sizeID: sizeID,
                productName: productName, // Optional
                sizeName: sizeName       // Optional
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Notify success
            fetchProductSize(); // Reload the product size list
        } else {
            alert(result.message); // Notify error
        }
    } catch (error) {
        console.error('Error adding productSize:', error);
    }
}
async function addBulkProductSize(productID, sizeIDs) {
    try {
        const response = await fetch('/api/ProductSize/BulkInsertProductSize', { // Update the API endpoint if needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: productID,
                sizeIDs: sizeIDs
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Display success message
            fetchProductSize(); // Reload the product sizes (implement this function as needed)
        } else {
            alert(result.message); // Display error message
        }
    } catch (error) {
        console.error('Error adding productSize:', error);
    }
}


async function addBulkUpdateProductSize(productID, sizeIDs) {
    try {
        const response = await fetch('/api/ProductSize/BulkUpdateProductSize', { // Update the API endpoint if needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: productID,
                sizeIDs: sizeIDs
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Display success message
            fetchProductSize(); // Reload the product sizes (implement this function as needed)
        } else {
            alert(result.message); // Display error message
        }
    } catch (error) {
        console.error('Error adding productSize:', error);
    }
}




//ProductColor

function renderProductColor(productCategories) {
    const productCategoryTableBody = document.getElementById('productcolor-table-body');
    productCategoryTableBody.innerHTML = ''; // Clear existing rows

    productCategories.forEach(productCategories => {

        const row = `
            <tr>

                <td>${productCategories.productID}</td>
                <td>${productCategories.productName}</td>
                 <td>${productCategories.colorID}</td>
                <td>${productCategories.colorName}</td>
            </tr>
        `;

        productCategoryTableBody.insertAdjacentHTML('beforeend', row);
    });

}
async function fetchProductColor() {
    let url = '/api/ProductColor/GetAllProductColor';


    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            console.log(data);
            renderProductColor(data.data); // Gọi hàm hiển thị dữ liệu lên bảng
        } else {
            console.error("Error fetching size:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}


async function addProductColor(productID, colorID, productName = '', colorName = '') {
    try {
        const response = await fetch('/api/ProductColor/AddProductColor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: productID,
                colorID: colorID,
                productName: productName, // Optional
                colorName: colorName       // Optional
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Notify success
            fetchProductColor(); // Reload the product size list
        } else {
            alert(result.message); // Notify error
        }
    } catch (error) {
        console.error('Error adding productColor:', error);
    }
}

async function deleteProductColor(productID, colorID, productName = '', colorName = '') {
    try {
        const response = await fetch('/api/ProductColor/DeleteProductColor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: productID,
                colorID: colorID,
                productName: productName, // Optional
                colorName: colorName       // Optional
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Notify success
            fetchProductColor(); // Reload the product size list
        } else {
            alert(result.message); // Notify error
        }
    } catch (error) {
        console.error('Error adding productColor:', error);
    }
}
async function addBulkProductColor(productID, colorIDs) {
    try {
        const response = await fetch('/api/ProductColor/BulkInsertProductColor', { // Update the API endpoint if needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: productID,
                colorIDs: colorIDs
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Display success message
            fetchProductColor(); // Reload the product sizes (implement this function as needed)
        } else {
            alert(result.message); // Display error message
        }
    } catch (error) {
        console.error('Error adding productSize:', error);
    }
}


async function addBulkUpdateProductColor(productID, colorIDs) {
    try {
        const response = await fetch('/api/ProductColor/BulkUpdateProductColor', { // Update the API endpoint if needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: productID,
                colorIDs: colorIDs
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); // Display success message
            fetchProductColor(); // Reload the product sizes (implement this function as needed)
        } else {
            alert(result.message); // Display error message
        }
    } catch (error) {
        console.error('Error adding productColor:', error);
    }
}
//order
async function fetchOrder() {
    // Giả sử fetchOrders là API để lấy danh sách đơn hàng
    const response = await fetch('/api/Order/all');
    const orders = await response.json();

    const productOrderTableBody = document.getElementById('productorder-table-body');
    productOrderTableBody.innerHTML = ''; // Xóa dữ liệu cũ

    orders.forEach(order => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${order.orderID}</td>
            <td>${order.firstname}</td>
            <td>${order.lastname}</td>
            <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            <td>${order.orderStatus}</td>
            <td>${order.shippingAddress}</td>
            <td>${order.phoneNumber}</td>
            <td>${order.totalAmount}</td>
            <td>
                <!-- Dropdown cho trạng thái mới -->
                <select class="status-dropdown" data-order-id="${order.orderID}">
                    <option value="Đang chờ lấy hàng">Đang chờ lấy hàng</option>
                    <option value="Shipper đã nhận đơn hàng">Shipper đã nhận đơn hàng</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                </select>
                <button class="update-status-btn" data-order-id="${order.orderID}">Cập Nhật Trạng Thái</button>
            </td>
        `;

        // Thêm dòng vào bảng
        productOrderTableBody.appendChild(row);
    });

    // Thêm event listener cho tất cả các nút "Cập Nhật Trạng Thái"
    document.querySelectorAll('.update-status-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const orderId = button.getAttribute('data-order-id');
            const dropdown = document.querySelector(`.status-dropdown[data-order-id="${orderId}"]`);
            const newStatus = dropdown.value;

            // Gọi hàm để cập nhật trạng thái
            await toggleOrderStatus(orderId, newStatus);
        });
    });
}

async function fetchorderdetail() {
    try {
        const response = await fetch('/api/OrderDetails/all'); // Adjust your API URL if needed
        const orderDetails = await response.json();
        console.log(orderDetails);
        if (Array.isArray(orderDetails)) {
            renderorderdetail(orderDetails); // Call render with correct function name
        } else {
            console.error('Fetched data is not an array:', orderDetails);
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
}
function renderorderdetail(productCategory) {
    const productCategoryTableBody = document.getElementById('orderdetail-table-body');
    productCategoryTableBody.innerHTML = ''; // Clear existing rows

    if (Array.isArray(productCategory)) {
        productCategory.forEach(productCategory => { // Rename for clarity
            const row = `
                <tr>
                    <td>${productCategory.orderDetailID}</td>    
                    <td>${productCategory.orderID}</td>   
                    <td>${productCategory.productID}</td>
                    <td>${productCategory.productName}</td>    
                    <td>${productCategory.quantity}</td>
                    <td>${productCategory.unitPrice}</td>
                    <td>${productCategory.orderDate}</td>
                    <td>${productCategory.totalAmount}</td>
                    <td>${productCategory.orderStatus}</td>    
                </tr>
            
            `;
            productCategoryTableBody.insertAdjacentHTML('beforeend', row);
        });
    } else {
        console.error('Data passed to OrderDetails is not an array:', productCategories);
    }
}
async function deleteOrderDetails(OrderDetails) {
    try {
        const response = await fetch(`/api/OrderDetails/${OrderDetailID}`, {
            method: 'DELETE'
        });

        const result = await response.json(); // Parse the JSON response

        if (result.isSuccess) {
            alert(result.message); // Notify success
        } else {
            alert(result.message); // Notify error
        }
    } catch (error) {
        console.error('Error deleting product image:', error);
    }
}
//payment

async function fetchpayment() {


    try {
        const response = await fetch('/api/payment/all'); // Adjust your API URL if needed
        const productImages = await response.json();
        console.log(productImages);
        if (Array.isArray(productImages)) {
            renderpayment(productImages); // Call render only when data is ready

        } else {
            console.error('Fetched data is not an array:', productImages);
        }
    } catch (error) {
        console.error('Error fetching product images:', error);
    }
}
function renderpayment(productCategories) {
    const productCategoryTableBody = document.getElementById('payment-table-body');
    productCategoryTableBody.innerHTML = ''; // Clear existing rows

    if (Array.isArray(productCategories)) {
        productCategories.forEach(productCategory => { // Rename for clarity
            const row = `
                <tr>
                    <td>${productCategory.paymentID}</td>    
                    <td>${productCategory.orderID}</td>
                
                    <td>${productCategory.amount}</td>
                    <td>${productCategory.paymentDate}</td>
                     <td>${productCategory.paymentMethodID}</td>    
                    <td>${productCategory.paymentStatus}</td>
               
                </tr>
            `;
            productCategoryTableBody.insertAdjacentHTML('beforeend', row);
        });
    } else {
        console.error('Data passed to renderpayment is not an array:', productCategories);
    }
}
//paymentdetail
async function fetchpaymentdetail() {


    try {
        const response = await fetch('/api/paymentdetail/all'); // Adjust your API URL if needed
        const productImages = await response.json();
        console.log(productImages);
        if (Array.isArray(productImages)) {
            renderpaymentdetail(productImages); // Call render only when data is ready

        } else {
            console.error('Fetched data is not an array:', productImages);
        }
    } catch (error) {
        console.error('Error fetching paymentdetail:', error);
    }
}
function renderpaymentdetail(productCategories) {
    const productCategoryTableBody = document.getElementById('paymentdetail-table-body');
    productCategoryTableBody.innerHTML = ''; // Clear existing rows

    if (Array.isArray(productCategories)) {
        productCategories.forEach(productCategory => { // Rename for clarity 
            const row = `
                <tr>
                    <td>${productCategory.paymentPaymentDetailID}</td>    
                    <td>${productCategory.paymentID}</td>
                    <td>${productCategory.productID}</td>
                    <td>${productCategory.quantity}</td>
                    <td>${productCategory.price}</td>
                </tr>
            `;
            productCategoryTableBody.insertAdjacentHTML('beforeend', row);
        });
    } else {
        console.error('Data passed to renderpaymentdetail is not an array:', productCategories);
    }
}
//Image

async function fetchImage() {


    try {
        const response = await fetch('/api/Image/all'); // Adjust your API URL if needed
        const productImages = await response.json();
        console.log(productImages);
        if (Array.isArray(productImages)) {
            renderProductImages(productImages); // Call render only when data is ready

        } else {
            console.error('Fetched data is not an array:', productImages);
        }
    } catch (error) {
        console.error('Error fetching product images:', error);
    }
}
function renderProductImages(productCategories) {
    const productCategoryTableBody = document.getElementById('productimage-table-body');
    productCategoryTableBody.innerHTML = ''; // Clear existing rows

    if (Array.isArray(productCategories)) {
        productCategories.forEach(productCategory => { // Rename for clarity
            const row = `
                <tr>
                    <td>${productCategory.imageID}</td>    
                    <td>${productCategory.productID}</td>
                    <td>${productCategory.productName}</td>
                    <td><img src="${productCategory.imageURL}" alt="Product Image" style="width: 100px; height: auto;"></td>

                </tr>
            `;
            productCategoryTableBody.insertAdjacentHTML('beforeend', row);
        });
    } else {
        console.error('Data passed to renderProductImages is not an array:', productCategories);
    }
}



async function addProductImages(productID, imageFile, ProductName) {
    try {
        // Prepare form data to include the product ID and the image file
        const formData = new FormData();
        formData.append('ProductID', productID);  // Adding ProductID to the form
        formData.append('ProductName', ProductName);
        formData.append('ImageFile', imageFile);  // Adding Image file to the form

        const response = await fetch('/api/Image/upload', {
            method: 'POST',
            body: formData // FormData object used directly in the request body
        });

        const result = await response.json();
        if (result.isSuccess) {
            alert(result.message); // Notify success
            fetchImage();  // Reload the product images list
        } else {
            alert(result.message); // Notify error
        }
    } catch (error) {
        console.error('Error uploading product image:', error);
    }
}

// Function to delete a product image
async function deleteProductImage(imageID) {
    try {
        const response = await fetch(`/api/Image/${imageID}`, {
            method: 'DELETE'
        });

        const result = await response.json(); // Parse the JSON response

        if (result.isSuccess) {
            alert(result.message); // Notify success
        } else {
            alert(result.message); // Notify error
        }
    } catch (error) {
        console.error('Error deleting product image:', error);
    }
}



//Inventory
async function fetchInventory() {


    try {
        const response = await fetch('/api/Inventory/all'); // Adjust your API URL if needed
        const productImages = await response.json();

        if (Array.isArray(productImages)) {
            renderProductInventory(productImages); // Call render only when data is ready
        } else {
            console.error('Fetched data is not an array:', productImages);
        }
    } catch (error) {
        console.error('Error fetching product images:', error);
    }
}
function renderProductInventory(productCategories) {
    const productCategoryTableBody = document.getElementById('productinventory-table-body');
    productCategoryTableBody.innerHTML = ''; // Clear existing rows

    if (Array.isArray(productCategories)) {
        productCategories.forEach(productCategory => { // Rename for clarity
            const row = `
                <tr>
                    <td>${productCategory.inventoryID}</td>    
                    <td>${productCategory.productID}</td>
                    <td>${productCategory.stockQuantity}</td>
                    <td>${productCategory.productName}</td>
                </tr>
            `;
            productCategoryTableBody.insertAdjacentHTML('beforeend', row);
        });
    } else {
        console.error('Data passed to renderProductImages is not an array:', productCategories);
    }
}



async function addProductInventory(productID, quantity) {
    try {
        const response = await fetch('/api/Inventory/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Thêm header để chỉ định JSON
            },
            body: JSON.stringify({
                productID: productID,
                stockQuantity: quantity
            })
        });

        const result = await response.json();
        console.log(result);

        if (result.isSuccess) {
            alert(result.message); // Notify success
            fetchInventory();  // Reload the inventory list
        } else {
            alert(result.message); // Notify error
        }
    } catch (error) {
        console.error('Error uploading product inventory:', error);
    }
}


// Function to delete a product image
async function deleteProductInventory(imageID) {
    try {
        const response = await fetch(`/api/Inventory/${imageID}`, {
            method: 'DELETE'
        });

        const result = await response.json(); // Parse the JSON response

        if (result.isSuccess) {
            alert(result.message); // Notify success
        } else {
            alert(result.message); // Notify error
        }
    } catch (error) {
        console.error('Error deleting product image:', error);
    }
}

async function deleteProductOrder(orderID) {
    try {
        const response = await fetch(`/api/order/${orderID}`, {
            method: 'DELETE'
        });

        const result = await response.json(); // Parse the JSON response

        if (result.isSuccess) {
            alert(result.message); // Notify success
        } else {
            alert(result.message); // Notify error
        }
    } catch (error) {
        console.error('Error deleting product order:', error);
    }
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
            console.log(data);// Gọi hàm hiển thị dữ liệu lên bảng
            renderUsers(data.data);

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
            alert(result.message);
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

        if (page === 'color') {
            fetchColor(); // Gọi hàm để load danh sách danh mục sản phẩm

            setTimeout(() => {
                const searchProductBtn = document.getElementById('search-color-btn');
                const activeProductBtn = document.getElementById('active-color-btn');
                const inactiveProductBtn = document.getElementById('unactive-color-btn');
                const productCategoryTableBody = document.getElementById('color-table-body');

                // Kiểm tra nếu các phần tử cần thiết tồn tại trước khi thao tác
                if (productCategoryTableBody) {

                    // Sự kiện tìm kiếm danh mục sản phẩm theo tên
                    if (searchProductBtn) {
                        searchProductBtn.addEventListener('click', () => {
                            const query = document.getElementById('search-color-input').value.toLowerCase();
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
                const createCategoryBtn = document.getElementById('create-color-btn');
                if (createCategoryBtn) {
                    createCategoryBtn.addEventListener('click', () => {
                        const form = document.getElementById('create-color-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Ẩn/hiện form
                    });
                }

                // Thêm danh mục sản phẩm mới
                const submitCategoryBtn = document.getElementById('submit-new-color');
                if (submitCategoryBtn) {
                    submitCategoryBtn.addEventListener('click', () => {
                        const categoryName = document.getElementById('new-color-name').value;


                        if (categoryName) {
                            addColor(categoryName); // Gọi hàm để thêm danh mục
                        } else {
                            alert('Vui lòng nhập đầy đủ thông tin danh mục.');
                        }
                    });
                }
            }, 0); // Đảm bảo các phần tử đã tồn tại trước khi gắn sự kiện




        }
        if (page === 'product-size') {
            fetchProductSize(); // Load the list of product sizes

            setTimeout(() => {
                const searchProductBtn = document.getElementById('search-productsize-btn'); // Correct the ID for search button
                const productCategoryTableBody = document.getElementById('productsize-table-body');

                // Check if necessary elements exist before proceeding
                if (productCategoryTableBody) {
                    // Event listener for searching product sizes by name
                    if (searchProductBtn) {
                        searchProductBtn.addEventListener('click', () => {
                            const query = document.getElementById('search-productsize-input').value.toLowerCase(); // Correct the search input ID
                            const rows = productCategoryTableBody.querySelectorAll('tr');
                            rows.forEach(row => {
                                const productName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                                row.style.display = productName.includes(query) ? '' : 'none';
                            });
                        });
                    }
                }


                // Event listener for the "Create Product Size" button
                const createProductSizeBtn = document.getElementById('add-productsize-btn');
                if (createProductSizeBtn) {
                    createProductSizeBtn.addEventListener('click', () => {
                        const form = document.getElementById('add-productsize-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Toggle form visibility
                    });
                }

                // Event listener for submitting a new product size
                const submitProductSizeBtn = document.getElementById('submit-add-productsize');
                if (submitProductSizeBtn) {
                    submitProductSizeBtn.addEventListener('click', () => {
                        const productID = document.getElementById('add-productID').value;
                        const sizeID = document.getElementById('add-sizeID').value;
                        const productName = document.getElementById('add-productName').value; // Optional ProductName
                        const sizeName = document.getElementById('add-sizeName').value;       // Optional SizeName

                        if (productID && sizeID) {
                            addProductSize(productID, sizeID, productName, sizeName); // Call function with optional parameters
                        } else {
                            alert('Vui lòng nhập đầy đủ thông tin kích cỡ sản phẩm.');
                        }
                    });
                }

                const deleteProductSizeBtn = document.getElementById('delete-productsize-btn');
                if (deleteProductSizeBtn) {
                    deleteProductSizeBtn.addEventListener('click', () => {
                        const form = document.getElementById('delete-productsize-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Toggle form visibility
                    });
                }

                // Event listener for submitting a Product Size deletion
                const submitDeleteProductSizeBtn = document.getElementById('submit-delete-productsize');
                if (submitDeleteProductSizeBtn) {
                    submitDeleteProductSizeBtn.addEventListener('click', () => {
                        const productID = document.getElementById('delete-productID').value;
                        const sizeID = document.getElementById('delete-sizeID').value;
                        const productName = document.getElementById('delete-productName').value; // Optional ProductName
                        const sizeName = document.getElementById('delete-sizeName').value;       // Optional SizeName

                        if (productID && sizeID) {
                            deleteProductSize(productID, sizeID, productName, sizeName); // Call function with optional parameters
                        } else {
                            alert('Vui lòng nhập đầy đủ thông tin kích cỡ sản phẩm.');
                        }
                    });
                }

                // Event listener for Bulk Insert Product Size
                const bulkInsertBtn = document.getElementById('bulk-insert-productsize-btn'); // Bulk insert button
                if (bulkInsertBtn) {
                    bulkInsertBtn.addEventListener('click', () => {
                        const form = document.getElementById('bulk-insert-productsize-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Toggle bulk insert form visibility
                    });
                }

                // Event listener for submitting bulk insert
                const submitBulkInsertBtn = document.getElementById('submit-bulk-insert-productsize');
                if (submitBulkInsertBtn) {
                    submitBulkInsertBtn.addEventListener('click', () => {
                        const productID = document.getElementById('bulk-insert-productID').value;
                        const sizeIDsString = document.getElementById('bulk-insert-sizeIDs').value;
                        const sizeIDs = sizeIDsString.split(',').map(id => parseInt(id.trim()));

                        if (productID && sizeIDs.length > 0) {
                            addBulkProductSize(productID, sizeIDs); // Call function to add bulk product sizes
                        } else {
                            alert('Vui lòng nhập ProductID và ít nhất một SizeID.');
                        }
                    });
                }


                const bulkUpdateBtn = document.getElementById('bulk-update-productsize-btn'); // Bulk insert button
                if (bulkUpdateBtn) {
                    bulkUpdateBtn.addEventListener('click', () => {
                        const form = document.getElementById('bulk-update-productsize-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Toggle bulk insert form visibility
                    });
                }

                // Event listener for submitting bulk insert
                const submitBulkUpdateBtn = document.getElementById('submit-bulk-update-productsize');
                if (submitBulkUpdateBtn) {
                    submitBulkUpdateBtn.addEventListener('click', () => {
                        const productID = document.getElementById('bulk-update-productID').value;
                        const sizeIDsString = document.getElementById('bulk-update-sizeIDs').value;
                        const sizeIDs = sizeIDsString.split(',').map(id => parseInt(id.trim()));

                        if (productID && sizeIDs.length > 0) {
                            addBulkUpdateProductSize(productID, sizeIDs); // Call function to add bulk product sizes
                        } else {
                            alert('Vui lòng nhập ProductID và ít nhất một SizeID.');
                        }
                    });
                }

            }, 0); // Ensure elements exist before attaching events
        }

        if (page === 'product-color') {
            fetchProductColor(); // Load the list of product sizes

            setTimeout(() => {
                const searchProductBtn = document.getElementById('search-productcolor-btn'); // Correct the ID for search button
                const productCategoryTableBody = document.getElementById('productcolor-table-body');

                // Check if necessary elements exist before proceeding
                if (productCategoryTableBody) {
                    // Event listener for searching product sizes by name
                    if (searchProductBtn) {
                        searchProductBtn.addEventListener('click', () => {
                            const query = document.getElementById('search-productcolor-input').value.toLowerCase(); // Correct the search input ID
                            const rows = productCategoryTableBody.querySelectorAll('tr');
                            rows.forEach(row => {
                                const productName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                                row.style.display = productName.includes(query) ? '' : 'none';
                            });
                        });
                    }
                }


                // Event listener for the "Create Product Size" button
                const createProductSizeBtn = document.getElementById('add-productcolor-btn');
                if (createProductSizeBtn) {
                    createProductSizeBtn.addEventListener('click', () => {
                        const form = document.getElementById('add-productcolor-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Toggle form visibility
                    });
                }

                // Event listener for submitting a new product size
                const submitProductSizeBtn = document.getElementById('submit-add-productcolor');
                if (submitProductSizeBtn) {
                    submitProductSizeBtn.addEventListener('click', () => {
                        const productID = document.getElementById('add-productID').value;
                        const sizeID = document.getElementById('add-colorID').value;
                        const productName = document.getElementById('add-productName').value; // Optional ProductName
                        const sizeName = document.getElementById('add-colorName').value;       // Optional SizeName

                        if (productID && sizeID) {
                            addProductColor(productID, sizeID, productName, sizeName); // Call function with optional parameters
                        } else {
                            alert('Vui lòng nhập đầy đủ thông tin kích cỡ sản phẩm.');
                        }
                    });
                }

                const deleteProductSizeBtn = document.getElementById('delete-productcolor-btn');
                if (deleteProductSizeBtn) {
                    deleteProductSizeBtn.addEventListener('click', () => {
                        const form = document.getElementById('delete-productcolor-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Toggle form visibility
                    });
                }

                // Event listener for submitting a Product Size deletion
                const submitDeleteProductSizeBtn = document.getElementById('submit-delete-productcolor');
                if (submitDeleteProductSizeBtn) {
                    submitDeleteProductSizeBtn.addEventListener('click', () => {
                        const productID = document.getElementById('delete-productID').value;
                        const sizeID = document.getElementById('delete-colorID').value;
                        const productName = document.getElementById('delete-productName').value; // Optional ProductName
                        const sizeName = document.getElementById('delete-colorName').value;       // Optional SizeName

                        if (productID && sizeID) {
                            deleteProductColor(productID, sizeID, productName, sizeName); // Call function with optional parameters
                        } else {
                            alert('Vui lòng nhập đầy đủ thông tin màu sắc sản phẩm.');
                        }
                    });
                }

                // Event listener for Bulk Insert Product Size
                const bulkInsertBtn = document.getElementById('bulk-insert-productcolor-btn'); // Bulk insert button
                if (bulkInsertBtn) {
                    bulkInsertBtn.addEventListener('click', () => {
                        const form = document.getElementById('bulk-insert-productcolor-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Toggle bulk insert form visibility
                    });
                }

                // Event listener for submitting bulk insert
                const submitBulkInsertBtn = document.getElementById('submit-bulk-insert-productcolor');
                if (submitBulkInsertBtn) {
                    submitBulkInsertBtn.addEventListener('click', () => {
                        const productID = document.getElementById('bulk-insert-productID').value;
                        const sizeIDsString = document.getElementById('bulk-insert-colorIDs').value;
                        const sizeIDs = sizeIDsString.split(',').map(id => parseInt(id.trim()));

                        if (productID && sizeIDs.length > 0) {
                            addBulkProductColor(productID, sizeIDs); // Call function to add bulk product sizes
                        } else {
                            alert('Vui lòng nhập ProductID và ít nhất một SizeID.');
                        }
                    });
                }


                const bulkUpdateBtn = document.getElementById('bulk-update-productcolor-btn'); // Bulk insert button
                if (bulkUpdateBtn) {
                    bulkUpdateBtn.addEventListener('click', () => {
                        const form = document.getElementById('bulk-update-productcolor-form');
                        form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Toggle bulk insert form visibility
                    });
                }

                // Event listener for submitting bulk insert
                const submitBulkUpdateBtn = document.getElementById('submit-bulk-update-productcolor');
                if (submitBulkUpdateBtn) {
                    submitBulkUpdateBtn.addEventListener('click', () => {
                        const productID = document.getElementById('bulk-update-productID').value;
                        const sizeIDsString = document.getElementById('bulk-update-colorIDs').value;
                        const sizeIDs = sizeIDsString.split(',').map(id => parseInt(id.trim()));

                        if (productID && sizeIDs.length > 0) {
                            addBulkUpdateProductColor(productID, sizeIDs); // Call function to add bulk product sizes
                        } else {
                            alert('Vui lòng nhập ProductID và ít nhất một ColorID.');
                        }
                    });
                }

            }, 0); // Ensure elements exist before attaching events
        }

        if (page == 'product-image') {
            // Fetch and display the product images
            fetchImage(); // Load the list of product images

            // Event listener for searching images by product ID
            const searchProductBtn = document.getElementById('search-image-btn');
            const productCategoryTableBody = document.getElementById('productimage-table-body');

            if (searchProductBtn && productCategoryTableBody) {
                searchProductBtn.addEventListener('click', () => {
                    const query = document.getElementById('search-image-input').value.toLowerCase();
                    const rows = productCategoryTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const productID = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                        row.style.display = productID.includes(query) ? '' : 'none';
                    });
                });
            }

            // Show form to add a new image
            const createImageBtn = document.getElementById('create-image-btn');
            const createImageForm = document.getElementById('create-image-form');

            createImageBtn.addEventListener('click', () => {
                createImageForm.style.display = createImageForm.style.display === 'none' ? 'block' : 'none';
            });

            // Handle form submission for adding a new image
            const submitNewImageBtn = document.getElementById('submit-new-image');
            submitNewImageBtn.addEventListener('click', async () => {
                const productID = document.getElementById('product-id').value;
                const imageFile = document.getElementById('image-file').files[0];
                const ProductName = document.getElementById('ProductName').value;
                if (productID && imageFile && ProductName) {
                    await addProductImages(productID, imageFile, ProductName);
                } else {
                    alert('Vui lòng nhập đầy đủ thông tin Product ID và chọn Hình ảnh');
                }
            });

            // Show form to delete an image
            const deleteImageBtn = document.getElementById('delete-productimage-btn');
            const deleteImageForm = document.getElementById('delete-productimage-form');

            deleteImageBtn.addEventListener('click', () => {
                deleteImageForm.style.display = deleteImageForm.style.display === 'none' ? 'block' : 'none';
            });

            // Handle form submission for deleting an image
            const submitDeleteImageBtn = document.getElementById('submit-delete-productimage');
            submitDeleteImageBtn.addEventListener('click', async () => {
                const productID = document.getElementById('delete-imageID').value;

                if (productID) {
                    await deleteProductImage(productID);
                } else {
                    alert('Vui lòng nhập imageID.');
                }
            });
        }
        if (page == 'product-inventory') {
            // Fetch and display the product images
            fetchInventory(); // Load the list of product images

            // Event listener for searching images by product ID
            const searchProductBtn = document.getElementById('search-inventory-btn');
            const productCategoryTableBody = document.getElementById('productinventory-table-body');

            if (searchProductBtn && productCategoryTableBody) {
                searchProductBtn.addEventListener('click', () => {
                    const query = document.getElementById('search-inventory-input').value.toLowerCase();
                    const rows = productCategoryTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const productID = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                        row.style.display = productID.includes(query) ? '' : 'none';
                    });
                });
            }

            // Show form to add a new image
            const createImageBtn = document.getElementById('create-inventory-btn');
            const createImageForm = document.getElementById('create-inventory-form');

            createImageBtn.addEventListener('click', () => {
                createImageForm.style.display = createImageForm.style.display === 'none' ? 'block' : 'none';
            });

            // Handle form submission for adding a new image
            const submitNewImageBtn = document.getElementById('submit-new-inventory');
            submitNewImageBtn.addEventListener('click', async () => {
                const productID = document.getElementById('product-id').value;
                const imageFile = document.getElementById('stock-quantity').value;

                if (productID && imageFile) {
                    await addProductInventory(productID, imageFile);
                } else {
                    alert('Vui lòng nhập đầy đủ thông tin Product ID và chọn Hình ảnh');
                }
            });

            // Show form to delete an image
            const deleteImageBtn = document.getElementById('delete-productinventory-btn');
            const deleteImageForm = document.getElementById('delete-productinventory-form');

            deleteImageBtn.addEventListener('click', () => {
                deleteImageForm.style.display = deleteImageForm.style.display === 'none' ? 'block' : 'none';
            });

            // Handle form submission for deleting an image
            const submitDeleteImageBtn = document.getElementById('submit-delete-productinventory');
            submitDeleteImageBtn.addEventListener('click', async () => {
                const productID = document.getElementById('delete-inventoryID').value;

                if (productID) {
                    await deleteProductInventory(productID);
                } else {
                    alert('Vui lòng nhập inventoryID.');
                }
            });
        }

        if (page == 'don-hang') {
            // Fetch and display the product images
            fetchOrder(); // Load the list of product images

            // Event listener for searching images by product ID
            const searchProductBtn = document.getElementById('search-order-btn');
            const productCategoryTableBody = document.getElementById('productorder-table-body');

            if (searchProductBtn && productCategoryTableBody) {
                searchProductBtn.addEventListener('click', () => {
                    const query = document.getElementById('search-order-input').value.toLowerCase();
                    const rows = productCategoryTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const productID = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                        row.style.display = productID.includes(query) ? '' : 'none';
                    });
                });
            }

            // Show form to add a new image
            const createImageBtn = document.getElementById('create-order-btn');
            const createImageForm = document.getElementById('create-order-form');

            createImageBtn.addEventListener('click', () => {
                createImageForm.style.display = createImageForm.style.display === 'none' ? 'block' : 'none';
            });

            // Handle form submission for adding a new image
            const submitNewImageBtn = document.getElementById('submit-new-order');
            submitNewImageBtn.addEventListener('click', async () => {
                const productID = document.getElementById('product-id').value;
                const imageFile = document.getElementById('stock-quantity').value;

                if (productID && imageFile) {
                    await addProductorder(productID, imageFile);
                } else {
                    alert('Vui lòng nhập đầy đủ thông tin Product ID và chọn Hình ảnh');
                }
            });

            // Show form to delete an image
            const deleteImageBtn = document.getElementById('delete-productorder-btn');
            const deleteImageForm = document.getElementById('delete-productorder-form');

            deleteImageBtn.addEventListener('click', () => {
                deleteImageForm.style.display = deleteImageForm.style.display === 'none' ? 'block' : 'none';
            });

            // Handle form submission for deleting an image
            const submitDeleteImageBtn = document.getElementById('submit-delete-productorder');
            submitDeleteImageBtn.addEventListener('click', async () => {
                const productID = document.getElementById('delete-orderID').value;

                if (productID) {
                    await deleteProductOrder(orderID);
                } else {
                    alert('Vui lòng nhập orderID.');
                }
            });
        }
        if (page == 'order-detail') {
            // Fetch and display the product images
            fetchorderdetail(); // Load the list of product images

            // Event listener for searching images by product ID
            const searchProductBtn = document.getElementById('search-orderdetail-btn');
            const productCategoryTableBody = document.getElementById('orderdetail-table-body');

            if (searchProductBtn && productCategoryTableBody) {
                searchProductBtn.addEventListener('click', () => {
                    const query = document.getElementById('search-orderdetail-input').value.toLowerCase();
                    const rows = productCategoryTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const productID = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                        row.style.display = productID.includes(query) ? '' : 'none';
                    });
                });
            }


            // Show form to delete an image
            const deleteImageBtn = document.getElementById('delete-orderdetail-btn');
            const deleteImageForm = document.getElementById('delete-orderdetail-form');

            deleteImageBtn.addEventListener('click', () => {
                deleteImageForm.style.display = deleteImageForm.style.display === 'none' ? 'block' : 'none';
            });

            // Handle form submission for deleting an image
            const submitDeleteImageBtn = document.getElementById('submit-delete-orderdetailID');
            submitDeleteImageBtn.addEventListener('click', async () => {
                const OrderDetailID = document.getElementById('delete-orderdetailID').value;

                if (OrderDetailID) {
                    await deleteProductOrder(OrderDetailID);
                } else {
                    alert('Vui lòng nhập orderdetailID.');
                }
            });
        }


        if (page == 'payment') {
            // Fetch and display the product images
            fetchpayment(); // Load the list of product images

            // Event listener for searching images by product ID
            const searchProductBtn = document.getElementById('search-payment-btn');
            const productCategoryTableBody = document.getElementById('payment-table-body');

            if (searchProductBtn && productCategoryTableBody) {
                searchProductBtn.addEventListener('click', () => {
                    const query = document.getElementById('search-payment-input').value.toLowerCase();
                    const rows = productCategoryTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const productID = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                        row.style.display = productID.includes(query) ? '' : 'none';
                    });
                });
            }
        }


        if (page == 'paymentdetail') {
            // Fetch and display the product images
            fetchpaymentdetail(); // Load the list of product images

            // Event listener for searching images by product ID
            const searchProductBtn = document.getElementById('search-paymentdetail-btn');
            const productCategoryTableBody = document.getElementById('paymentdetail-table-body');

            if (searchProductBtn && productCategoryTableBody) {
                searchProductBtn.addEventListener('click', () => {
                    const query = document.getElementById('search-paymentdetail-input').value.toLowerCase();
                    const rows = productCategoryTableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const productID = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                        row.style.display = productID.includes(query) ? '' : 'none';
                    });
                });
            }
        }



    });
});
