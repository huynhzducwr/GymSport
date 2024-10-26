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


//async function fetchorderdetail() {
//    try {
//        const response = await fetch('/api/OrderDetails/all'); // Adjust your API URL if needed
//        const orderDetails = await response.json();
//        console.log(orderDetails);
//        if (Array.isArray(orderDetails)) {
//            const topProducts = calculateTopProducts(orderDetails);
//            fetchProducts(topProducts);
         
//        } else {
//            console.error('Fetched data is not an array:', orderDetails);
//        }
//    } catch (error) {
//        console.error('Error fetching order details:', error);
//    }
//}
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
</div>

<style>
    /* Định dạng chung cho sản phẩm */
 
    .product {
        text-align: center;
      
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

   
</style>


        `;

        container.insertAdjacentHTML('beforeend', productHTML);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchpaymentdetail();
    const topProductIDs = [5, 7, 9, 10]; // Example top product IDs
    fetchProducts(); // Lấy và hiển thị sản phẩm khi trang tải
});
