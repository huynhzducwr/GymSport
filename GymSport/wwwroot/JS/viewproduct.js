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


async function fetchPopularProducts() {
    const feedbackData = await fetchAllFeedBack();

    if (!Array.isArray(feedbackData)) {
        console.error("Feedback data is not an array:", feedbackData);
        return;
    }

    // Aggregate high ratings (4 and 5 stars) for each product
    const ratingCounts = {};
    feedbackData.forEach(feedback => {
        if (feedback.rating >= 4) { // Consider only 4 and 5-star ratings
            if (!ratingCounts[feedback.productID]) {
                ratingCounts[feedback.productID] = 0;
            }
            ratingCounts[feedback.productID]++;
        }
    });

    // Sort products by the number of high ratings in descending order and get the top 4
    const popularProductIDs = Object.entries(ratingCounts)
        .sort((a, b) => b[1] - a[1]) // Sort by count of high ratings
        .slice(0, 4) // Get top 4 products
        .map(entry => parseInt(entry[0])); // Extract product IDs

    // Fetch and display popular products based on high ratings
    if (popularProductIDs.length > 0) {
        fetchProductss(popularProductIDs); // Only popularProductIDs will be used for 'popular-pick'
    } else {
        console.log("No popular products based on feedback ratings.");
    }
}

async function fetchProductss(topProductIDs) {
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

            renderProducts(topProducts, productImages, productColors, 'popular-pick');
            //const popularProducts = products.slice(0, 4);
            //renderProducts(popularProducts, productImages, productColors, 'popular-pick');
        } else {
            console.error('Products fetched is not an array:', products);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


function showAlert(message) {
    const alertBox = document.getElementById('alert-box');
    const alertMessage = document.getElementById('alert-message');

    alertMessage.textContent = message; // Set the alert message
    alertBox.style.display = 'block'; // Show the alert box

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
        alertBox.classList.add('fade-out');
        setTimeout(() => {
            alertBox.style.display = 'none';
            alertBox.classList.remove('fade-out');
        }, 600); // Match the transition duration
    }, 1000); // Show for 3 seconds
}

async function closeAlert() {
    const alertBox = document.getElementById('alert-box');
    alertBox.style.display = 'none'; // Close the alert
}

function showSuccessAlert(message) {
    const successBox = document.getElementById('success-box');
    const successMessage = document.getElementById('success-message');

    successMessage.textContent = message; // Set the success message
    successBox.style.display = 'block'; // Show the success box

    // Automatically hide the success alert after 3 seconds
    setTimeout(() => {
        successBox.classList.add('fade-out');
        setTimeout(() => {
            successBox.style.display = 'none';
            successBox.classList.remove('fade-out');
        }, 600); // Match the transition duration
    }, 1000); // Show for 3 seconds
}

async function closeSuccessAlert() {
    const successBox = document.getElementById('success-box');
    successBox.style.display = 'none'; // Close the success alert
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
    <div class="container-img1">
        <a href="/productdetail/${product.productID}">
            <img class="edt_product" src="${imageData ? imageData.imageURL : '/src/default-image.png'}" alt="${product.productName}">
        </a>
        <i class="fa-regular fa-heart heart-icon"></i> <!-- Đưa icon vào trong container -->
    </div>
    <p class="name_pro">${product.productName}</p>
    <p class="name_cate">${product.productCategoryName || 'Thể loại'}</p>
    <p class="name_color">${colorData ? colorData.colorName : 'Màu sắc không xác định'}</p>
    <p class="price">$${product.price.toFixed(2)}</p>
</div>

<style>
/* Định dạng container ảnh */
.container-img1 {
    position: relative; /* Để chứa icon ở góc */
    display: block;
    overflow: hidden;
    width: 100%;
}

.container-img1 img {
    width: 100%;
    height: 400px;
    transition: transform 0.3s ease-in-out;
}

/* Hiệu ứng zoom khi hover */
.container-img1:hover img {
    transform: scale(1.1);
}

/* Định dạng icon heart */
.heart-icon {
    position: absolute;  /* Cố định vị trí trên ảnh */
    top: 10px;  /* Khoảng cách từ trên xuống */
    right: 10px; /* Khoảng cách từ phải qua */
    font-size: 15px;
    color: gray;
    cursor: pointer;
    transition: color 0.3s ease;
    background: rgba(255, 255, 255, 0.7); /* Nền mờ giúp nhìn rõ icon */
    padding: 5px;
    border-radius: 50%;
}

/* Khi được active */
.heart-icon.active {
    color: gray;
}
</style>

 


        `;

        container.insertAdjacentHTML('beforeend', productHTML);
    });
}


let fetchedImages = []; // Initialize as an empty array

async function fetchImages() {
    try {
        const response = await fetch('/api/Image/all');
        if (response.ok) {
            fetchedImages = await response.json();
        } else {
            console.error("Failed to fetch images:", await response.json());
        }
    } catch (error) {
        console.error("Network error while fetching images:", error);
    }
}

fetchImages(); // Ensure images are loaded when the page loads


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



async function fetchAllFeedBack() {
    const url = `/api/FeedBack/GetAllFeedBack`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const result = await response.json();
            console.log("Fetch feedback:", result);

            return result.data;
        } else {
            console.error("Error fetching feedback:", response.statusText);
            return []; // Return an empty array if an error occurs
        }
    } catch (error) {
        console.error("Network error:", error);
        return [];
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchpaymentdetail();
    fetchProducts();
    fetchProductImages();
    fetchProductColors();
    fetchPopularProducts(); 
    fetchAllFeedBack();

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("heart-icon")) {
            toggleFavorite(event);
        }
    });
});

