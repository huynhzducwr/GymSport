async function fetchProducts(topProductIDs) {
    try {
        const response = await fetch('/api/Product/All'); // Adjust the API endpoint
        const result = await response.json(); // The API response includes the products in the "data" property

        const products = result.data; // Access the array of products from the "data" property

        console.log('Fetched products:', products); // Log the products array

        if (Array.isArray(products)) {
            const productImages = await fetchProductImages(); // Assuming you have a function for fetching product images
            const productColors = await fetchProductColors(); // Assuming you have a function for fetching product colors

            // Filter the products to only include the top products
            const topProducts = products.filter(product => topProductIDs.includes(product.productID));

            renderProducts(topProducts, productImages, productColors, 'top-pick');
            const popularProducts = products.slice(0, 4);
            renderProducts(popularProducts, productImages, productColors, 'popular-pick');
        } else {
            console.error('Products fetched is not an array:', products);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
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



async function fetchpaymentdetail() {


    try {
        const response = await fetch('/api/paymentdetail/all'); // Adjust your API URL if needed
        const productImages = await response.json();
        console.log(productImages);
        if (Array.isArray(productImages)) {
            const topProducts = calculateTopProducts(productImages);
            fetchProducts(topProducts);

        } else {
            console.error('Fetched data is not an array:', productImages);
        }
    } catch (error) {
        console.error('Error fetching paymentdetail:', error);
    }
}
function calculateTopProducts(orderDetails) {
    const productCountMap = {};
    orderDetails.forEach(detail => {
        const { productID, quantity } = detail;
        if (!productCountMap[productID]){
            productCountMap[productID] =0;
        }
        productCountMap[productID] += quantity;
    });

    const sortedProducts = Object.entries(productCountMap)
        .map(([productID, totalQuantity]) => ({ productID: parseInt(productID), totalQuantity }))
        .sort((a, b) => b.totalQuantity - a.totalQuantity);

    return sortedProducts.slice(0, 4).map(product => product.productID);
    
}


function renderProducts(products, productImages, productColors, containerId) {

    const container = document.querySelector(`#${containerId}`);

    container.innerHTML = '';

    // Check if there are any products
    if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML = '<p>No products to display.</p>';
        return;
    }
   
    // Hiển thị sản phẩm theo thứ tự tăng dần
    products.forEach((product) => {
        // Lấy hình ảnh tương ứng với sản phẩm
        const imageData = productImages.find(image => image.productID === product.productID);

        // Lấy màu sắc tương ứng với sản phẩm
        const colorData = productColors.find(color => color.productID === product.productID);

        // Tạo mã HTML cho sản phẩm
        const productHTML = `
      <div class="product">
    <a class="container-img1" href="/productdetail/${product.productID}">
        <img class="edt_product" src="${imageData ? imageData.imageURL : '/src/default-image.png'}" alt="${product.productName}">
    </a>
    <p class="name_pro">${product.productName}</p>
    <p class="name_cate">${product.productCategoryName || 'Thể loại'}</p>
    <p class="name_color">${colorData ? colorData.colorName : 'Màu sắc không xác định'}</p>
    <p class="price">$${product.price.toFixed(2)}</p>
      <i class="fa-regular fa-heart heart-icon"></i>

</div>

<style>
    /* Định dạng chung cho sản phẩm */
 
    .product {
        
      
    }
     /* Định dạng cho container chứa hình ảnh */
    .container-img1 {
        display: block;
        overflow: hidden;
        width: 100%;



    }

    /* Định dạng cho hình ảnh bên trong container */
    .container-img1 img {
           width: 100%;
            height: auto;
                height: 400px;

        transition: transform 0.3s ease-in-out; /* Tạo hiệu ứng mượt mà */

    }

    /* Hiệu ứng zoom khi di chuột vào container chứa ảnh */
    .container-img1:hover img {
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

        container.insertAdjacentHTML('beforeend', productHTML);
    });
}

let fetchedImages = [];

async function initializeImages() {
    fetchedImages = await fetchProductImages();
}

initializeImages();

// Event listener for "favorite" functionality
async function toggleFavorite(event) {
    event.target.classList.toggle("fa-regular");
    event.target.classList.toggle("fa-solid");
    event.target.classList.toggle("active");

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isLogin) {
        alert("Please log in to add to favorites.");
        return;
    }

    const productElement = event.target.closest('.product');
    const productID = parseInt(productElement.querySelector('a').getAttribute('href').split('/').pop());
    const productName = productElement.querySelector('.name_pro').innerText;
    const productCategoryName = productElement.querySelector('.name_cate').innerText;
    const price = parseFloat(productElement.querySelector('.price').innerText.replace('$', ''));
    const imageURL = productElement.querySelector('img').getAttribute('src');
    const productImage = fetchedImages.find(image => image.productID === productID);
    const imageID = productImage ? productImage.imageID : null;

    const favoriteData = {
        userID: userInfo.userID,
        productID,
        productName,
        productCategoryName,
        price,
        imageURL,
        imageID
    };

    try {
        const response = await fetch('/api/WishList/AddWishList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(favoriteData)
        });

        if (response.ok) {
            console.log("Product added to favorites:", favoriteData);
        } else {
            console.error("Failed to add to favorites:", await response.json());
        }
    } catch (error) {
        console.error("Network error while adding to favorites:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchpaymentdetail();
    fetchProducts();
    fetchProductImages();
    fetchProductColors();

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("heart-icon")) {
            toggleFavorite(event);
        }
    });
});

