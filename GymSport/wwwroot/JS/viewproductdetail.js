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

async function loadProductImages(productId) {
    const url = '/api/Image/all'; // Đường dẫn API lấy tất cả hình ảnh
    try {
        const response = await fetch(url);
        if (response.ok) {
            const images = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            // Lọc hình ảnh theo productID
            const productImages = images.filter(image => image.productID === productId);
            if (productImages.length === 0) {
                console.error("No images found for product ID:", productId);
                return;
            }
            // Hiển thị ba hình ảnh đầu tiên vào .small-images
            const smallImagesDiv = document.querySelector('.small-images');
            smallImagesDiv.innerHTML = ''; // Xóa nội dung hiện tại nếu có
            productImages.slice(0, 3).forEach((img, index) => {
                const imgElement = document.createElement('img');
                imgElement.src = img.imageURL; // Đường dẫn hình ảnh
                imgElement.alt = `Image ${index + 1}`;
                smallImagesDiv.appendChild(imgElement);
            });
            // Hiển thị hình ảnh vào HTML
            const scrollDiv = document.querySelector('.scroll');
            scrollDiv.innerHTML = ''; // Xóa nội dung hiện tại nếu có
            productImages.forEach(img => {
                const imgElement = document.createElement('img');
                imgElement.src = img.imageURL; // Đường dẫn hình ảnh
                scrollDiv.appendChild(imgElement);
            });
           
        } else {
            console.error("Error fetching product images:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}


let selectedSize = '';
document.querySelectorAll('.size-option').forEach(sizeElement => {
    sizeElement.addEventListener('click', function () {
        // Remove 'selected' class from all size options
        document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));

        // Add 'selected' class to the clicked size
        this.classList.add('selected');

        // Store the selected size
        selectedSize = this.getAttribute('data-size');
        console.log("Selected size:", selectedSize);
    });
});


async function fetchProductSize(sizeId) {
    const url = `/api/ProductSize/FetchProductBySizeId/${sizeId}`;


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



let product;
async function fetchProducts(productId) {
    const url = `/api/Product/${productId}`; // Fetch product info based on productId
    try {
        const response = await fetch(url);
        if (response.ok) {
            const result = await response.json(); // Convert JSON data from API to object
            product = result.data; // Assign the fetched product data to the global variable
            console.log("Fetched product:", product);
           
            // Update information into HTML elements
            document.getElementById('productName').textContent = product.productName;
            document.getElementById('productCategory').textContent = product.productCategoryName || "Unknown Category";
            document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;

            document.getElementById('productName1').textContent = product.productName;
            document.getElementById('productCategory1').textContent = product.productCategoryName || "Unknown Category";
            document.getElementById('productPrice1').textContent = `$${product.price.toFixed(2)}`;
            document.getElementById('description').textContent = product.description;
        } else {
            console.error("Error fetching product:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}
async function fetchProductColors(productId) {
    const url = '/api/ProductColor/GetAllProductColor';
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Chuyển dữ liệu JSON từ API thành object
            const productColors = data.data; // Truy cập danh sách màu sắc

            // Lọc màu sắc theo productId
            const colorsForProduct = productColors.filter(color => color.productID === productId);
            if (colorsForProduct.length === 0) {
                console.error("No colors found for product ID:", productId);
                return;
            }

            // Hiển thị màu sắc đầu tiên vào phần tử <p>
            document.querySelector('.product-images p').textContent = colorsForProduct[0].colorName;

        } else {
            console.error("Error fetching product colors:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

async function fetchPaymentMethod() {
    const url = '/api/PaymentMethod/GetAllPaymentMethod';

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log('API Response PaymentMethod:', data);

            const paymentMethods = data.data; // Giả sử data chứa mảng 'data'
            if (!Array.isArray(paymentMethods)) {
                console.error('Payment methods is not an array');
                return;
            }

            // Render danh sách phương thức thanh toán
            const dropdownContent = document.getElementById('payment-method-dropdown');
            dropdownContent.innerHTML = ''; // Xóa nội dung cũ

            paymentMethods.forEach(method => {
                const link = document.createElement('a');
                link.href = '#';
                link.innerText = method.paymentMethodName;
                link.setAttribute('data-methodid', method.paymentMethodID);

                link.onclick = function () {
                    // Gán class 'selected' để đánh dấu phương thức đã chọn
                    document.querySelectorAll('.dropdown-content a').forEach(a => a.classList.remove('selected'));
                    link.classList.add('selected');
                };
                dropdownContent.appendChild(link);
            });

        } else {
            console.error("Error fetching payment methods:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching payment methods:", error);
    }
}


async function handleCheckout() {
    const shippingAddress = document.getElementById('shipping-address').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const paymentMethod = document.querySelector('.dropdown-content a.selected'); // Lấy phương thức thanh toán đã chọn
    const userData = localStorage.getItem('userInfo');
    const loginWarning = document.getElementById('login-warning');

    if (!userData) {
        alert('You must be logged in to proceed with checkout.');
        loginWarning.style.display = 'block'; // Hiển thị cảnh báo đăng nhập
        return; // Ngăn chặn quá trình checkout
    }

    const parsedData = JSON.parse(userData);
    if (!parsedData.isLogin || !parsedData.userID) {
        alert('You must be logged in to proceed with checkout.');
        loginWarning.style.display = 'block';
        return;
    }

    // Nếu người dùng đã đăng nhập, tiếp tục kiểm tra form
    loginWarning.style.display = 'none'; // Ẩn cảnh báo đăng nhập
    let errorMessage = '';

    // Kiểm tra địa chỉ giao hàng
    if (!shippingAddress) {
        errorMessage += 'Please enter a valid shipping address.\n';
    }

    // Kiểm tra số điện thoại
    if (!phoneNumber) {
        errorMessage += 'Please enter a valid phone number.\n';
    }

    // Kiểm tra phương thức thanh toán
    if (!paymentMethod) {
        errorMessage += 'Please select a payment method.\n';
    }

    if (errorMessage) {
        alert(errorMessage); // Hiển thị thông báo lỗi
        return; // Không cho tiếp tục nếu có lỗi
    }

    // Nếu tất cả đều hợp lệ, thực hiện quá trình thanh toán
  
    // Thực hiện các bước checkout khác...
    const cartItems = JSON.parse(localStorage.getItem('shoppingBag')) || []; // Lấy thông tin giỏ hàng
    const userData1 = JSON.parse(localStorage.getItem('userInfo'));
    const totalAmount = cartItems.reduce((total, item) => total + parseFloat(item.productPrice), 0); // Tính tổng tiền
    console.log('Selected Payment Method:', paymentMethod);
    const orderResponse = await createOrders(cartItems, shippingAddress, phoneNumber, totalAmount, userData1.userID);
    console.log(orderResponse);

    if (orderResponse.isSuccess) {
        const paymentMethodID = paymentMethod ? paymentMethod.getAttribute('data-methodid') : null; // Sử dụng getAttribute để lấy ID


        if (!paymentMethodID) {
            alert('Invalid payment method selected.'); // Thông báo nếu không có ID
            return;
        }

        const paymentResponse = await createPayment(orderResponse.orderID, totalAmount, paymentMethodID, "Completed"); // Thay đổi PaymentStatus theo yêu cầu của bạn
       
        if (paymentResponse && paymentResponse.isCreated) {
            alert('Order and payment created successfully!');

            if (paymentMethodID == 3) {
                const paymentMOMO = await createMomoPayment(
                    "THANH TOAN DON HANG " + orderResponse.orderID, // PaymentContent
                    "VND", // PaymentCurrency
                    "ORD15z1", // PaymentRefId
                    totalAmount, // RequiredAmount
                    orderResponse.orderID, // OrderID
                    userData1.userID, // UserID
                    "vn", // PaymentLanguage
                    "Mer0dbcf13bd6de6f5eb8064b74cb2caa33", // MerchantID
                    "MOMO", // PaymentDestination
                    "ABCD1234" // Signature
                );

                console.log('momo : ', paymentMOMO);

                if (paymentMOMO && paymentMOMO.paymentUrl) {
                    window.location.href = paymentMOMO.paymentUrl;
                } else {
                    alert('Error creating Momo payment link.');
                }

            }

        }
    } else {
        alert('There was a problem creating your order.');
    }
}

async function createOrders(cartItems, shippingAddress, phoneNumber, totalAmount, userID) {
    const url = '/api/Order/create';

    // Prepare the orderDto according to the specified schema
    const orderDto = {
        UserID: userID, // Make sure the key is "UserID" not "userID"
        ShippingAddress: shippingAddress, // Make sure the key is "ShippingAddress"
        PhoneNumber: phoneNumber, // Make sure the key is "PhoneNumber"
        TotalAmount: totalAmount, // Make sure the key is "TotalAmount"
        CartItems: cartItems.map(item => ({
            productID: item.productID, // Make sure the key is "ProductID"
            quantity: item.quantity, // Make sure the key is "Quantity"
            unitPrice: item.productPrice, // Make sure the key is "UnitPrice"
            imageURL: item.imageURL, // Make sure the key is "ImageURL"
            productCategory: item.productCategory, // Make sure the key is "ProductCategory"
            productColor: item.productColor, // Make sure the key is "ProductColor"
            productName: item.productName, // Make sure the key is "ProductName"
            productSize: item.productSize // Make sure the key is "ProductSize"
        }))
    };

  

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDto),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Order Created:', data);
            return data; // return response data from server
        } else {
            const error = await response.json();
            console.error('Error creating Momo payment:', error);
            alert('Error creating Momo payment. Status: ' + response.status + ' Message: ' + JSON.stringify(error));

        }
    } catch (error) {
        console.error('Error creating order:', error);
        alert('There was an error creating your order. Please try again.');
    }
}
async function createMomoPayment(
    paymentContent,
    paymentCurrency,
    paymentRefId,
    requiredAmount,
    orderID,
    userID,
    paymentLanguage,
    merchantId,
    paymentDestinationId,
    signature
) {
    const url = '/api/payment'; // Đảm bảo rằng đây là endpoint đúng
    const paymentMomo = {
        paymentContent: paymentContent,
        paymentCurrency: paymentCurrency,
        paymentRefId: paymentRefId,
        requiredAmount: requiredAmount,
        orderID: orderID,
        userID: userID,
        paymentLanguage: paymentLanguage,
        merchantId: merchantId,
        paymentDestinationId: paymentDestinationId,
        signature: signature
    };
    console.log('Payment Data:', paymentMomo);


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentMomo)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Momo Payment Response:', result); // In ra toàn bộ phản hồi
            if (result && result.data && result.data.paymentUrl) {
                console.log('Payment URL:', result.data.paymentUrl); // In ra URL thanh toán
                window.location.href = result.data.paymentUrl; // Chuyển hướng tới liên kết thanh toán
            } else {
                alert('Error: No payment URL returned.');
            }
        } else {
            const error = await response.json();
            console.error('Error creating Momo payment:', error);
            alert('Error creating Momo payment. Status: ' + response.status + ' Message: ' + JSON.stringify(error));
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the Momo payment.');
    }
}


async function createPayment(orderID, totalAmount, paymentMethodID, paymentStatus) {
    const url = '/api/Payment/create';

    const paymentDto = {
        OrderID: orderID,
        TotalAmount: totalAmount,
        PaymentMethodID: paymentMethodID,
        PaymentStatus: paymentStatus,
 
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentDto),
        });
        console.log(paymentDto);

        if (response.ok) {
            const data = await response.json();
            console.log('Payment Created:', data);
            return data; // trả về dữ liệu phản hồi từ server
        } else {
            console.error('Error creating payment:', response.statusText);
            alert('There was an error processing your payment. Please try again.');
        }
    } catch (error) {
        console.error('Error creating payment:', error);
        alert('There was an error processing your payment. Please try again.');
    }
}



window.onload = function () {
    // Lấy productId từ URL (ví dụ như productdetail/5)
    const urlParts = window.location.pathname.split('/');
    const productId = parseInt(urlParts[urlParts.length - 1], 10);

    loadProductImages(productId);
    fetchProductColors(productId);
    fetchProducts(productId);
    fetchPaymentMethod();

};



let isBagEmpty = true; // Initialize a variable to track if the bag is empty

const addToBagButton = document.querySelector('.add-to-bag');
const bagOrderItem = document.querySelector('.Bag_order_item');
const bagEmptyMessage = document.querySelector('.bag_empty');
const bagOrder = document.querySelector('.Bag_order');
const bagItemCount = document.querySelector('.qtyy p'); // For quantity

shopIcon.addEventListener('click', function () {
    // Check if the bag is empty
    if (isBagEmpty) {
        // Optionally show a message or do nothing
        console.log("Your bag is empty. Please add items to your bag.");
        return; // Exit the function if the bag is empty
    }

    // Toggle visibility of the bag if it's not empty
    if (bagOrderItem.style.display === 'none' || bagOrderItem.style.display === '') {
        bagOrderItem.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        bagOrderItem.style.display = 'none';
        overlay.style.display = 'none';
        clearTimeout(Timeout);
        bagOrderItem.style.opacity = '0';
        bagOrderItem.style.visibility = 'hidden';
    }
});

closeIcon.addEventListener('mouseenter', function () {
    closeIcon.style.cursor = 'pointer';
});

closeIcon.addEventListener('click', function () {
    bagOrderItem.style.display = 'none';
    overlay.style.display = 'none';
});

overlay.addEventListener('click', function () {
    bagOrderItem.style.display = 'none';
    overlay.style.display = 'none';
});
// Handle adding products to the bag
let isFirstItem = true; // Flag to check if it's the first item being added


addToBagButton.addEventListener('click', async function () {
    const containerProduct = document.querySelector('.bag_itemm');



    // Only clear the container if it's the first item being added
    if (isFirstItem) {
        containerProduct.innerHTML = ''; // Clear the container only on the first addition
        isFirstItem = false; // Set the flag to false after the first addition
    }
    if (selectedSize == '') {
        alert("Vui lòng chọn Size trước: ");
        return;
    }

    // Fetch product images
    const productImages = await fetchProductImages();
    if (!product) {
        console.error("Product is not defined.");
        return; // Exit the function if product is not defined
    }

    // Access product properties
    const productName = document.getElementById('productName1').textContent;
    const productCategory = document.getElementById('productCategory1').textContent;
    const productPrice = parseFloat(document.getElementById('productPrice1').textContent.replace('$', '')); // Convert to number
    const productSize = selectedSize; // The size selected from the size options
    const productColor = document.querySelector('.product-images p').textContent; // Assuming this gets the color name correctly
    const imageData = productImages.find(image => image.productID === product.productID);
    const quantity = 1; 

    // Create a new item entry for the bag
    const newItemHTML = `
        <div class="order_item">
            <div class="img">
                <a class="container_img" href="/productdetail/${product.productID}">
                    <img class="edt_product" src="${imageData ? imageData.imageURL : '/src/default-image.png'}" alt="${productName}">
                </a>
            </div>
            <div class="description_product">
                <p class="boldz" id="bagProductName">${productName}</p>
                <p id="bagProductCategory">${productCategory}</p>
                <p id="bagProductSize">Size: ${productSize}</p>
                <p id="bagProductPrice" class="boldz">$${productPrice.toFixed(2)}</p>
                <p id="bagProductColor">Color: ${productColor}</p>
                <div class="heart_delete">
                    <div class="heartt">
                        <i class="fa-regular fa-heart"></i>
                    </div>
                    <div class="bin">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                    <div class="qtyy">
                        <p> Qty: 1</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Append the new item to the existing items
    containerProduct.insertAdjacentHTML('beforeend', newItemHTML); // Append the new item

    // Update the quantity in the bag
    var currentQty = parseInt(bagItemCount.textContent.split(': ')[1]) + 1; // Update quantity
    bagItemCount.textContent = `Qty: ${currentQty}`;

    // Update the total price
    const currentTotalPrice = parseFloat(document.getElementById('totalPrice').textContent.replace('US$', '')) || 0;
    const newTotalPrice = currentTotalPrice + productPrice; // Add the new item's price to the total
    document.getElementById('totalPrice').textContent = `US$${newTotalPrice.toFixed(2)}`; // Update total price

    // Mark bag as not empty
    isBagEmpty = false; 
    updateTotalPrice();

    // Save bag item to local storage
    saveBagToLocalStorage({
        productID: product.productID,
        productName,
        productCategory,
        productSize,
        productColor,
        productPrice: productPrice.toFixed(2),
        imageURL: imageData ? imageData.imageURL : '/src/default-image.png',
        quantity

    });
});


// Function to save the shopping bag to local storage
 function saveBagToLocalStorage(item) {
    // Get existing items from local storage
    const existingItems = JSON.parse(localStorage.getItem('shoppingBag')) || [];
    // Add the new item
    existingItems.push(item);
    // Save back to local storage
    localStorage.setItem('shoppingBag', JSON.stringify(existingItems));
}
document.addEventListener('DOMContentLoaded', () => {
    const existingItems = JSON.parse(localStorage.getItem('shoppingBag')) || [];
    const containerProduct = document.querySelector('.bag_itemm');

    existingItems.forEach(item => {
        const newItemHTML = `
            <div class="order_item">
                <div class="img">
                    <a class="container_img" href="/productdetail/${item.productID}">
                        <img class="edt_product" src="${item.imageURL}" alt="${item.productName}">
                    </a>
                </div>
                <div class="description_product">
                    <p class="boldz" id="bagProductName">${item.productName}</p>
                    <p id="bagProductCategory">${item.productCategory}</p>
                    <p id="bagProductSize">Size: ${item.productSize}</p>
                    <p id="bagProductPrice" class="boldz">$${item.productPrice}</p>
                    <p id="bagProductColor">Color: ${item.productColor}</p>
                    <div class="heart_delete">
                        <div class="heartt">
                           <i class="fa-regular fa-heart"></i>
                        </div>
                        <div class="bin">
                            <i class="fa-regular fa-trash-can"></i>
                        </div>
                        <div class="qtyy">
                            <p> Qty: 1</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        containerProduct.insertAdjacentHTML('beforeend', newItemHTML);
    });

    // Update quantity and total price
    const totalPrice = existingItems.reduce((acc, item) => acc + parseFloat(item.productPrice), 0);
    document.getElementById('totalPrice').textContent = `US$${totalPrice.toFixed(2)}`;
    bagItemCount.textContent = `Qty: ${existingItems.length}`;
    isBagEmpty = existingItems.length === 0;
});


// Function to remove item from local storage and update UI
// Function to remove item from local storage and update UI
function removeProductFromBag(productID, productSize, productColor) {
    // Get existing items from local storage
    let existingItems = JSON.parse(localStorage.getItem('shoppingBag')) || [];

    console.log("Before removal:", existingItems); // Debug: see the items before removal

    // Filter out the item that matches productID, size, and color
    existingItems = existingItems.filter(item =>
        !(item.productID === productID && item.productSize === productSize && item.productColor === productColor)
    );

    console.log("After removal:", existingItems); // Debug: see the items after removal

    // Save the updated array back to local storage
    localStorage.setItem('shoppingBag', JSON.stringify(existingItems));

    // Update the total price and item count
    const totalPrice = existingItems.reduce((acc, item) => acc + parseFloat(item.productPrice), 0);
    document.getElementById('totalPrice').textContent = `US$${totalPrice.toFixed(2)}`;
    bagItemCount.textContent = `Qty: ${existingItems.length}`;
    isBagEmpty = existingItems.length === 0;
}

// Event listener for trash icon (bin)
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('fa-trash-can')) {
        // Get the parent product element
        const productElement = event.target.closest('.order_item');

        // Get product details like ID, size, and color
        const productID = parseInt(productElement.querySelector('a.container_img').href.split('/').pop()); // Extract productID from href
        const productSize = productElement.querySelector('#bagProductSize').textContent.split('Size: ')[1]; // Extract size
        const productColor = productElement.querySelector('#bagProductColor').textContent.split('Color: ')[1]; // Extract color

        console.log("Removing product:", { productID, productSize, productColor }); // Debug: check values being used for removal

        // Remove product from DOM
        productElement.remove();

        // Remove product from local storage using ID, size, and color
        removeProductFromBag(productID, productSize, productColor);
    }
});


// Function to update the total price (example implementation)
function updateTotalPrice() {
    // You can add logic here to sum up all prices in the cart
    let total = 0;
    document.querySelectorAll('.Bag_order_item .description_product #bagProductPrice').forEach(priceElement => {
        const priceText = priceElement.textContent.replace('$', '');
        total += parseFloat(priceText);
    });
    document.querySelector('.pricee .css-price p').textContent = `US$${total.toFixed(2)}`;
}