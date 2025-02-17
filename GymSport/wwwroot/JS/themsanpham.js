document.addEventListener("DOMContentLoaded", () => {
    fetchProductCategories(); // Tải danh mục sản phẩm khi trang được load
});

// Xử lý sự kiện submit form
document.getElementById("add-product-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Ngăn form submit mặc định

    // Lấy dữ liệu từ form
    const productName = document.getElementById("product-name").value.trim();
    const productDescription = document.getElementById("product-description").value.trim();
    const productPrice = parseFloat(document.getElementById("product-price").value);
    const productStatus = document.getElementById("product-status").value;
    const productCategory = parseInt(document.getElementById("product-category").value);

    // Kiểm tra dữ liệu đầu vào
    if (!productName || !productDescription || isNaN(productPrice) || isNaN(productCategory)) {
        alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
        return;
    }

    const productData = {
        productName,
        productCategoryID: productCategory,
        description: productDescription,
        price: productPrice,
        status: productStatus
    };

    try {
        const response = await fetch("/api/Product/Create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        });

        const data = await response.json();

        if (data.isCreated) {
            alert("Sản phẩm đã được tạo thành công!");
            document.getElementById("add-product-form").reset();
        } else {
            alert("Sản phẩm đã được tạo thành công!");
        }
    } catch (error) {
        console.error("Error creating product:", error);
        alert("Đã xảy ra lỗi khi tạo sản phẩm.");
    }
});

// Gọi API lấy danh mục sản phẩm
async function fetchProductCategories(isActive = null) {
    try {
        const url = isActive !== null
            ? `/api/ProductCategory/GetAllProductCategory?IsActive=${isActive}`
            : `/api/ProductCategory/GetAllProductCategory`;

        const response = await fetch(url);
        const result = await response.json();

        const categories = result.data; // Giả sử dữ liệu nằm trong result.data
        console.log("Fetched product categories:", categories);

        if (Array.isArray(categories)) {
            renderProductCategories(categories);
        } else {
            console.error("Categories fetched is not an array:", categories);
        }
    } catch (error) {
        console.error("Error fetching product categories:", error);
    }
}


// Render danh mục sản phẩm vào dropdown
function renderProductCategories(categories) {
    const categorySelect = document.getElementById("product-category");

    categorySelect.innerHTML = ""; // Xóa nội dung hiện có

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Chọn danh mục";
    categorySelect.appendChild(defaultOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.productCategoryID;
        option.textContent = category.productCategoryName;
        categorySelect.appendChild(option);
    });
}
