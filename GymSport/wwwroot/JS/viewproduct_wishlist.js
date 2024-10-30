
async function fetchProducts() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const containerProduct = document.querySelector('.container_product1'); // Select the product container
    const productDiv = containerProduct.querySelector('.product1'); // Select the product div

    if (!userInfo || !userInfo.isLogin) {
        // Display the login and create account message if user is not logged in
        productDiv.style.display = 'none'; // Hide the product div
        containerProduct.innerHTML = `
            <div class="container">
                <div class="wishlist-section">
                    <h1>❤️ SAVE TO WISHLIST</h1>
                    <p>
                        Ever wish you could save all your fave fits & accessories in one place to come back to later?
                        Almost like a ✨ wishlist ✨.
                    </p>
                    <div class="button-group">
                        <button class="create-account">CREATE ACCOUNT</button>
                        <button class="login">LOG IN</button>
                    </div>
                </div>
            </div>`;
        return; // Exit the function
    }

    const userID = userInfo.userID; // Get userID from userInfo
    const url = `/api/WishList/GetAllSize?userID=${userID}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const products = data.data;
          
            console.log(products);

            // Fetch additional data if needed
     
            const productColors = await fetchProductColors();
       

            // Call renderProducts with required data
            renderProducts(products, productColors);

            // Initialize sorting and filtering with data
            handleSortChange(products, productImages, productColors);
            handleCategoryFilter(products, productImages, productColors);
            handleSizeFilter(products, productImages, productColors, productSizes);
            handleColorFilter(products, productImages, productColors, productSizes);

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

//async function fetchProductImages() {
//    let url = '/api/Image/all'; // Đường dẫn API để lấy hình ảnh
//    try {
//        const response = await fetch(url);
//        if (response.ok) {
//            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
//            console.log("Fetched product images:", data); // Log để kiểm tra dữ liệu
//            return data; // Trả về dữ liệu hình ảnh
//        } else {
//            console.error("Error fetching product images:", response.statusText);
//            return []; // Trả về mảng rỗng nếu có lỗi
//        }
//    } catch (error) {
//        console.error("Network error:", error);
//        return []; // Trả về mảng rỗng nếu có lỗi
//    }
//}

async function toggleFavorite(event) {
    event.target.classList.toggle("fa-regular");
    event.target.classList.toggle("fa-solid");
    event.target.classList.toggle("active");

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isLogin) {
        alert("Please log in to add to favorites.");
        return;
    }

    const productID = event.target.dataset.productId;
    const userID = userInfo.userID;

    try {
        const response = await fetch(`/api/WishList/Delete/${userID}/${productID}`, { // Fixed backticks
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            console.log("Product deleted from favorites:", { userID, productID });
        } else {
            console.error("Failed to delete from favorites:", await response.json());
        }
    } catch (error) {
        console.error("Network error while deleting from favorites:", error);
    }
    fetchProducts();
}


function renderProducts(products, productColors) {
    const containerProduct = document.querySelector('.container_product1');

    // Clear the product container
    containerProduct.innerHTML = '';

    // Check if there are any products
    if (!Array.isArray(products) || products.length === 0) {
        containerProduct.innerHTML = '<p>Không có sản phẩm nào để hiển thị.</p>';
        return;
    }

    products.forEach((product) => {
        const colorData = productColors.find(color => color.productID === product.productID);

        const productHTML = `
            <div class="product1">
                <a class="container-img" href="/productdetail/${product.productID}">
                    <img class="edt_product" src="${product ? product.imageURL : '/src/default-image.png'}" alt="${product.productName}">
                </a>
                <p class="name_pro1">${product.productName}</p>
                <p class="name_cate1">${product.productCategoryName || 'Thể loại'}</p>
                <p class="name_color1">${colorData ? colorData.colorName : 'Màu sắc không xác định'}</p>
                <p class="price1">$${product.price.toFixed(2)}</p>

                <!-- Added data-product-id attribute here -->
                <i class="fa-regular fa-heart heart-icon" data-product-id="${product.productID}"></i>
            </div>

<style>
    /* Định dạng chung cho sản phẩm */
 
    .product1 {
        
      
    }
     /* Định dạng cho container chứa hình ảnh */
    .container-img {
        display: block;
        overflow: hidden;
        width: 100%;



    }

    /* Định dạng cho hình ảnh bên trong container */
    .container-img img {
           width: 100%;
            height: auto;
                height: 300px;

        transition: transform 0.3s ease-in-out; /* Tạo hiệu ứng mượt mà */

    }

    /* Hiệu ứng zoom khi di chuột vào container chứa ảnh */
    .container-img:hover img {
        transform: scale(1.1); /* Zoom hình lên 10% khi di chuột */
    }
.heart-icon {
    font-size: 24px;
    color: gray;
    cursor: pointer;
    transition: color 0.3s ease;
}

.heart-icon.active {
    color: gray;
}
   
</style>
 
 


        `;

        // Add the product HTML to the container
        containerProduct.insertAdjacentHTML('beforeend', productHTML);
    });
}

// Event listener for "favorite" functionality


document.addEventListener('DOMContentLoaded', () => {

    fetchProducts();
    fetchProductColors();
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("heart-icon")) {
            toggleFavorite(event);
        }
    });

  
});

