
function handleSortChange(products, productImages, productColors) {
    const sortLowToHigh = document.getElementById('sortLowToHigh');
    const sortHighToLow = document.getElementById('sortHighToLow');

    // Add event listeners to the sorting options
    sortLowToHigh.addEventListener('click', () => {
        console.log('Sorting by Price: Low to High');
        // Sort by price low to high
        const sortedProducts = [...products].sort((a, b) => a.price - b.price);
        renderProducts(sortedProducts, productImages, productColors);
    });

    sortHighToLow.addEventListener('click', () => {
        console.log('Sorting by Price: High to Low');
        // Sort by price high to low
        const sortedProducts = [...products].sort((a, b) => b.price - a.price);
        renderProducts(sortedProducts, productImages, productColors);
    });
}

//tim size
async function fetchProductSize() {
    let url = '/api/ProductSize/GetAllProductSize';


    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            console.log(data);
            return data.data;
        } else {
            console.error("Error fetching size:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

function filterProductsBySize(products, productSizes, selectedSizeName) {
    // Get products that match the selected size
    const filteredProductIDs = productSizes
        .filter((size) => size.sizeName === selectedSizeName)
        .map((size) => size.productID);

    return products.filter((product) => filteredProductIDs.includes(product.productID));
}

function handleSizeFilter(products, productImages, productColors, productSizes) {
    const sizeElements = document.querySelectorAll('.listt_size .type_box');

    sizeElements.forEach((sizeElement) => {
        sizeElement.addEventListener('click', () => {
            const selectedSize = sizeElement.textContent.trim(); // Get selected size text
            const filteredProducts = filterProductsBySize(products, productSizes, selectedSize); // Filter products by size

            renderProducts(filteredProducts, productImages, productColors, productSizes); // Re-render filtered products
        });
    });
}
//tim product theo category
function handleCategoryFilter(products, productImages, productColors) {
    const categoryItems = document.querySelectorAll('.type_box');

    // Add event listeners to each category item
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedCategory = item.getAttribute('data-category');
            console.log(`Selected Category: ${selectedCategory}`);

            // Filter the products by the selected category
            const filteredProducts = products.filter(product => product.productCategoryName === selectedCategory);

            // Re-render the filtered products
            renderProducts(filteredProducts, productImages, productColors);
        });
    });
}


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

//lay tat ca product
async function fetchProducts() {
    let url = '/api/Product/All?isActive=true'; // Set isActive to true

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển đổi dữ liệu JSON từ API thành object
            console.log(data);
            const products = data.data;
            const productImages = await fetchProductImages(); // Lấy dữ liệu hình ảnh
            const productColors = await fetchProductColors(); // Lấy dữ liệu màu sắc
            const productSizes = await fetchProductSize(); // Get product-size data
            renderProducts(products, productImages, productColors, productSizes); // Gọi hàm để hiển thị dữ liệu sản phẩm và màu sắc

            // Initialize sorting event listeners
            handleSortChange(products, productImages, productColors);
            handleCategoryFilter(products, productImages, productColors);
            handleSizeFilter(products, productImages, productColors, productSizes); // Filter products by size
            handleColorFilter(products,productImages,productColors,productSizes);

        } else {
            console.error("Error fetching products:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

// Hàm để lấy dữ liệu màu sắc


function handleColorFilter(products, productImages, productColors, productSizes) {
    const colorElements = document.querySelectorAll('.listt_color .type_box');

    colorElements.forEach((colorElement) => {
        colorElement.addEventListener('click', () => {
            const selectedColor = colorElement.textContent.trim(); // Get selected color name
            const filteredProducts = filterProductsByColor(products, productColors, selectedColor); // Filter products by color

            renderProducts(filteredProducts, productImages, productColors, productSizes); // Re-render filtered products
        });
    });
}

function filterProductsByColor(products, productColors, selectedColorName) {
    // Get products that match the selected color
    const filteredProductIDs = productColors
        .filter((color) => color.colorName === selectedColorName)
        .map((color) => color.productID);

    return products.filter((product) => filteredProductIDs.includes(product.productID));
}



function renderProducts(products, productImages, productColors, productSizes) {
    const containerProduct = document.querySelector('.container_product1');

    // Clear the product container
    containerProduct.innerHTML = '';

    // Check if there are any products
    if (!Array.isArray(products) || products.length === 0) {
        containerProduct.innerHTML = '<p>Không có sản phẩm nào để hiển thị.</p>';
        return;
    }

    // Display products
    products.forEach((product) => {
        // Get corresponding image and color
        const imageData = productImages.find(image => image.productID === product.productID);
        const colorData = productColors.find(color => color.productID === product.productID);

        // Create HTML for the product
        const productHTML = `
    <div class="product1">
        <a class="container_img" href="/productdetail/${product.productID}">
            <img class="edt_product" src="${imageData ? imageData.imageURL : '/src/default-image.png'}" alt="${product.productName}">
        </a>
        <p class="name_pro">${product.productName}</p>
        <p class="name_cate">${product.productCategoryName || 'Thể loại'}</p>
        <p class="name_color">${colorData ? colorData.colorName : 'Màu sắc không xác định'}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
    </div>
    
                <style>
             .container-img {
                  display: block;
                     overflow: hidden;
        width: 100%;
          }

       /* Định dạng cho hình ảnh bên trong container */
    .container-img img {
           width: 100%;
            height: auto;
                height: 400px;

        transition: transform 0.3s ease-in-out; /* Tạo hiệu ứng mượt mà */

    }

    /* Hiệu ứng zoom khi di chuột vào container chứa ảnh */
    .container-img:hover img {
        transform: scale(1.1); /* Zoom hình lên 10% khi di chuột */
    }
             </style>
`;


        

        // Add the product HTML to the container
        containerProduct.insertAdjacentHTML('beforeend', productHTML);
    });
}

fetchProducts().then(() => {
    handleColorFilter(products, productImages, productColors, productSizes); // Add the color filter functionality
});

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(); // Lấy và hiển thị sản phẩm khi trang tải
});
