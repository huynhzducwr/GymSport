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
async function submitFeedback(event, productId) {
    event.preventDefault(); // Prevent the form's default submission action

    const url = '/api/FeedBack/AddFeedback';

    // Retrieve userID from local storage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userID = userInfo ? userInfo.userID : null; // Assign userID from local storage if available

    // Retrieve the comment and rating values
    const comment = document.getElementById("customerComment").value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value; // Get selected rating value

    if (!rating) {
        showAlert("Please select a rating."); // Ensure a rating is selected
        return;
    }

    // Construct feedback data with the added rating
    const feedbackData = {
        UserID: userID, // Use userID from local storage
        ProductID: productId, // Use productId from function argument
        Comment: comment,
        Rating: rating // Include rating in feedback data
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData),
        });

        const result = await response.json();
        console.log("Submit feedback result:", result);

        if (result.success) {
            // Display success message
            showSuccessAlert(result.message);
            // Clear comment and rating inputs
            document.getElementById("customerComment").value = '';
            document.querySelector('input[name="rating"]:checked').checked = false;
            fetchAllFeedBack(productId);
        } else {
            // Display error message
            showAlert(result.message);
        }
    } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("An error occurred while submitting feedback. Please try again.");
    }
}


async function showAlert(message) {
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

async function showSuccessAlert(message) {
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

async function fetchAllFeedBack(productId) {
    const url = `/api/FeedBack/GetFeedbacksByProductId/${productId}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const result = await response.json();
            console.log("Fetch comment:", result);

            const feedbackSection = document.getElementById('feedbackSection');
            feedbackSection.style.display = 'block'; // Display feedback section

            // Clear old feedback to avoid duplication
            feedbackSection.innerHTML = '';

            // Check if data exists and loop through feedback array from result.data
            if (result.data && Array.isArray(result.data)) {
                result.data.forEach(feedback => {
                    const feedbackDiv = document.createElement('div');
                    feedbackDiv.classList.add('feedback-item');

                    // Create elements for user name, date, rating, and comment
                    const nameElement = document.createElement('p');
                    nameElement.style.fontWeight = 'bold';
                    nameElement.innerHTML = `${feedback.lastName}`;

                    const dateElement = document.createElement('p');
                    dateElement.classList.add('feedback-date');
                    const feedbackDate = new Date(feedback.feedbackDate);
                    const daysAgo = Math.floor((new Date() - feedbackDate) / (1000 * 60 * 60 * 24));
                    dateElement.textContent = `${daysAgo} days ago`;

                    const ratingElement = document.createElement('p');
                    ratingElement.classList.add('ratingz');

                    // Generate star icons based on the rating value
                    const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating); // Filled and empty stars
                    ratingElement.textContent = stars; // Set star icons as text content


                    const commentElement = document.createElement('p');
                    commentElement.classList.add('feedback-comment');
                    commentElement.textContent = feedback.comment;

                    // Append elements to feedbackDiv
                    feedbackDiv.appendChild(nameElement);
                    feedbackDiv.appendChild(dateElement);
                    feedbackDiv.appendChild(ratingElement);
                    feedbackDiv.appendChild(commentElement);

                    // Append feedbackDiv to feedbackSection
                    feedbackSection.appendChild(feedbackDiv);
                });
            } else {
                console.log("No feedback data available.");
            }

            return result.data;
        } else {
            console.error("Error fetching comment:", response.statusText);
            return []; // Return an empty array if an error occurs
        }
    } catch (error) {
        console.error("Network error:", error);
        return [];
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

document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submit-order-btn');
    if (submitButton) {
        submitButton.addEventListener('click', async function (event) {
            event.preventDefault();
            await handleCheckout();
        });
    } else {
        console.error("Error: 'submit-order-btn' not found in the DOM.");
    }
});


async function handleCheckout() {
    // Fetch form input values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phoneNumber = document.getElementById('phone').value.trim();
    const shippingAddress = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const province = document.getElementById('province').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const paymentMethod = document.querySelector('.payment-method input:checked'); // Get selected payment method
    const userData = localStorage.getItem('userInfo');
    let userID;
    if (userData) {
        const parsedData = JSON.parse(userData); // Parse the string into an object
        userID = parsedData.userID; // Access userID from the parsed object
        console.log(userID); // You can use the userID as needed
    } else {
        console.log("User not logged in");
    }



    // Check if user is logged in
    if (!userData) {
        alert('You must be logged in to proceed with checkout.');
        loginWarning.style.display = 'block';
        return;
    }

    const parsedData = JSON.parse(userData);
    if (!parsedData.isLogin || !parsedData.userID) {
        alert('You must be logged in to proceed with checkout.');
        loginWarning.style.display = 'block';
        return;
    }
    let paymentMethodID;
    if (paymentMethod) {
        switch (paymentMethod.value) {
            case 'cash':
                paymentMethodID = 1;  // Giả định ID cho tiền mặt
                break;
            case 'momo':
                paymentMethodID = 3;  // Giả định ID cho Momo
                break;
            default:
                alert('Phương thức thanh toán không hợp lệ.');
                return;
        }
    } else {
        alert('Vui lòng chọn phương thức thanh toán.');
        return;
    }



    let errorMessage = '';

    // Validate input fields
    if (!firstName || !lastName) {
        errorMessage += 'Please enter your full name.\n';
    }
    if (!shippingAddress) {
        errorMessage += 'Please enter a valid shipping address.\n';
    }
    if (!phoneNumber) {
        errorMessage += 'Please enter a valid phone number.\n';
    }
    if (!city || !province) {
        errorMessage += 'Please select both city and province.\n';
    }
    if (!postalCode) {
        errorMessage += 'Please enter your postal code.\n';
    }
    if (!paymentMethod) {
        errorMessage += 'Please select a payment method.\n';
    }

    if (errorMessage) {
        alert(errorMessage); // Show error messages
        return;
    }

    // Fetch cart items and calculate total amount
    let cartItems = [];
    const cartData = localStorage.getItem('shoppingBag');
    if (cartData) {
        try {
            cartItems = JSON.parse(cartData);
            if (!Array.isArray(cartItems)) {
                cartItems = [];
            }
        } catch (e) {
            console.error("Error parsing cart data:", e);
            cartItems = [];
        }
    }


    const totalAmount = cartItems.reduce((total, item) => total + parseFloat(item.productPrice), 0);

    // Create the orderDto with all the required information
    const orderDto = {
        userID: userID,
        shippingAddress: shippingAddress,
        phoneNumber: phoneNumber,
        totalAmount: totalAmount,
        cartItems: Array.isArray(cartItems) ? cartItems.map(item => ({
            productID: item.productID,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            imageURL: item.imageURL,
            productCategory: item.productCategory,
            productColor: item.productColor,
            productName: item.productName,
            productSize: item.productSize
        })) : [],
        city: city,
        province: province,
        firstName: firstName,
        lastName: lastName,
        postalCode: postalCode
    };


    // Call API to create the order
    const orderResponse = await createOrders(orderDto);
    console.log(orderResponse);

    if (orderResponse.isSuccess) {
        /*paymentMethodID = paymentMethod ? paymentMethod.getAttribute('data-methodid') : null;*/ // Sử dụng getAttribute để lấy ID


        if (!paymentMethodID) {
            alert('Invalid payment method selected.'); // Thông báo nếu không có ID
            return;
        }

        const paymentResponse = await createPayment(orderResponse.orderID, totalAmount, paymentMethodID, "Completed"); // Thay đổi PaymentStatus theo yêu cầu của bạn

        if (paymentResponse && paymentResponse.isCreated) {
            showSuccessAlert('Đang tạo mã QR thanh toán');

            if (paymentMethodID == 3) {
                const paymentMOMO = await createMomoPayment(
                    "THANH TOAN DON HANG " + orderResponse.orderID, // PaymentContent
                    "VND", // PaymentCurrency
                    "ORD15z1", // PaymentRefId
                    totalAmount, // RequiredAmount
                    orderResponse.orderID, // OrderID
                    userID, // UserID
                    "vn", // PaymentLanguage
                    "Mer0dbcf13bd6de6f5eb8064b74cb2caa33", // MerchantID
                    "MOMO", // PaymentDestination
                    "ABCD1234" // Signature
                );

                console.log('momo : ', paymentMOMO);

                if (paymentMOMO && paymentMOMO.paymentUrl) {
                    window.location.href = paymentMOMO.paymentUrl;
                } else {
                    showSuccessAlert('Đang tạo mã QR thanh toán');
                }

            }




        }
    } else {
        alert('There was a problem creating your order.');
    }
}

async function createOrders(orderDto) {
    const url = '/api/Order/create';

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
            showSuccessAlert('Đặt hàng thành công');
            return data; // Return response data from server
        } else {
            const error = await response.json();
            console.error('Error creating order:', error);
            showAlert('There was an error creating your order. Please try again.');
        }
    } catch (error) {
        console.error('Error creating order:', error);
        showAlert('There was an error creating your order. Please try again.');
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






const EventObserver = (function () {
    let events = {};

    return {
        subscribe: function (event, callback) {
            if (!events[event]) {
                events[event] = [];
            }
            events[event].push(callback);
        },
        notify: function (event, data) {
            if (events[event]) {
                events[event].forEach(callback => callback(data));
            }
        }
    };
})();

window.onload = function () {
    const urlParts = window.location.pathname.split('/');
    const productId = parseInt(urlParts[urlParts.length - 1], 10);

    EventObserver.notify("pageLoad", productId);
};

// Đăng ký các sự kiện
EventObserver.subscribe("pageLoad", loadProductImages);
EventObserver.subscribe("pageLoad", fetchProductColors);
EventObserver.subscribe("pageLoad", fetchProducts);
EventObserver.subscribe("pageLoad", fetchPaymentMethod);
EventObserver.subscribe("pageLoad", fetchAllFeedBack);
EventObserver.subscribe("pageLoad", function (productId) {
    document.getElementById("commentForm").addEventListener("submit", function (event) {
        submitFeedback(event, productId);
    });
});



//window.onload = function () {
//    // Lấy productId từ URL (ví dụ như productdetail/5)
//    const urlParts = window.location.pathname.split('/');
//    const productId = parseInt(urlParts[urlParts.length - 1], 10);

//    loadProductImages(productId);
//    fetchProductColors(productId);
//    fetchProducts(productId);
//    fetchPaymentMethod();
//    fetchAllFeedBack(productId);
//    // Gắn sự kiện submit cho biểu mẫu sau khi đã xác định productId
//    document.getElementById("commentForm").addEventListener("submit", function (event) {
//        submitFeedback(event, productId);
//    });
//};



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

class BagItemBuilder {
    constructor() {
        this.item = {};
    }

    setProductID(id) {
        this.item.productID = id;
        return this;
    }

    setProductName(name) {
        this.item.productName = name;
        return this;
    }

    setProductCategory(category) {
        this.item.productCategory = category;
        return this;
    }

    setProductSize(size) {
        this.item.productSize = size;
        return this;
    }

    setProductColor(color) {
        this.item.productColor = color;
        return this;
    }

    setProductPrice(price) {
        this.item.productPrice = price;
        return this;
    }

    setImageURL(url) {
        this.item.imageURL = url;
        return this;
    }

    setQuantity(quantity) {
        this.item.quantity = quantity;
        return this;
    }

    build() {
        return this.item;
    }
}
addToBagButton.addEventListener('click', async function () {
    const containerProduct = document.querySelector('.bag_itemm');

    if (isFirstItem) {
        containerProduct.innerHTML = ''; // Clear the container only on the first addition
        isFirstItem = false;
    }

    if (selectedSize === '') {
        alert("Vui lòng chọn Size trước: ");
        return;
    }

    // Fetch product images
    const productImages = await fetchProductImages();
    if (!product) {
        console.error("Product is not defined.");
        return;
    }

    // Lấy thông tin sản phẩm từ giao diện
    const productName = document.getElementById('productName1').textContent;
    const productCategory = document.getElementById('productCategory1').textContent;
    const productPrice = parseFloat(document.getElementById('productPrice1').textContent.replace('$', ''));
    const productSize = selectedSize;
    const productColor = document.querySelector('.product-images p').textContent;
    const imageData = productImages.find(image => image.productID === product.productID);

    // Dùng Builder Pattern để tạo đối tượng sản phẩm
    const bagItem = new BagItemBuilder()
        .setProductID(product.productID)
        .setProductName(productName)
        .setProductCategory(productCategory)
        .setProductSize(productSize)
        .setProductColor(productColor)
        .setProductPrice(productPrice.toFixed(2))
        .setImageURL(imageData ? imageData.imageURL : '/src/default-image.png')
        .setQuantity(1)
        .build();

//    // Tạo phần tử HTML để hiển thị trong giỏ hàng
//    const newItemHTML = `
//    <div class="order_item">
//        <div class="img">
//            <a class="container_img" href="/productdetail/${product.productID}">
//                <img class="edt_product" src="${imageData ? imageData.imageURL : '/src/default-image.png'}" alt="${productName}">
//            </a>
//        </div>
//        <div class="description_product">
//            <p class="boldz" id="bagProductName">${productName}</p>
//            <p id="bagProductCategory">${productCategory}</p>
//            <p id="bagProductSize">Kích thước: ${productSize}</p>
//            <p id="bagProductPrice" class="boldz">$${productPrice.toFixed(2)}</p>
//            <p id="bagProductColor">Màu sắc: ${productColor}</p>
//            <div class="heart_delete">
//                <div class="heartt">
//                    <i class="fa-regular fa-heart"></i>
//                </div>
//                <div class="bin">
//                    <i class="fa-regular fa-trash-can"></i>
//                </div>
//                <div class="qtyy">
//                    <p> Số lượng: 1</p>
//                </div>
//            </div>
//        </div>
//    </div>
//`;

//    // Thêm sản phẩm vào giỏ hàng
//    containerProduct.insertAdjacentHTML('beforeend', newItemHTML);

//    // Cập nhật số lượng sản phẩm
//    let currentQty = parseInt(bagItemCount.textContent.split(': ')[1]) + 1;
//    bagItemCount.textContent = `Qty: ${currentQty}`;

//    // Cập nhật tổng giá trị giỏ hàng
//    let currentTotalPrice = parseFloat(document.getElementById('totalPrice').textContent.replace('US$', '')) || 0;
//    let newTotalPrice = currentTotalPrice + parseFloat(bagItem.productPrice);
//    document.getElementById('totalPrice').textContent = `US$${newTotalPrice.toFixed(2)}`;

    // Lưu vào localStorage
    saveBagToLocalStorage(bagItem);
    loadBagItems();
});


function loadBagItems() {
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
}


//addToBagButton.addEventListener('click', async function () {
//    const containerProduct = document.querySelector('.bag_itemm');



//    // Only clear the container if it's the first item being added
//    if (isFirstItem) {
//        containerProduct.innerHTML = ''; // Clear the container only on the first addition
//        isFirstItem = false; // Set the flag to false after the first addition
//    }
//    if (selectedSize == '') {
//        alert("Vui lòng chọn Size trước: ");
//        return;
//    }

//    // Fetch product images
//    const productImages = await fetchProductImages();
//    if (!product) {
//        console.error("Product is not defined.");
//        return; // Exit the function if product is not defined
//    }

//    // Access product properties
//    const productName = document.getElementById('productName1').textContent;
//    const productCategory = document.getElementById('productCategory1').textContent;
//    const productPrice = parseFloat(document.getElementById('productPrice1').textContent.replace('$', '')); // Convert to number
//    const productSize = selectedSize; // The size selected from the size options
//    const productColor = document.querySelector('.product-images p').textContent; // Assuming this gets the color name correctly
//    const imageData = productImages.find(image => image.productID === product.productID);
//    const quantity = 1;

//    // Create a new item entry for the bag
//    const newItemHTML = `
//    <div class="order_item">
//        <div class="img">
//            <a class="container_img" href="/productdetail/${product.productID}">
//                <img class="edt_product" src="${imageData ? imageData.imageURL : '/src/default-image.png'}" alt="${productName}">
//            </a>
//        </div>
//        <div class="description_product">
//            <p class="boldz" id="bagProductName">${productName}</p>
//            <p id="bagProductCategory">${productCategory}</p>
//            <p id="bagProductSize">Kích thước: ${productSize}</p>
//            <p id="bagProductPrice" class="boldz">$${productPrice.toFixed(2)}</p>
//            <p id="bagProductColor">Màu sắc: ${productColor}</p>
//            <div class="heart_delete">
//                <div class="heartt">
//                    <i class="fa-regular fa-heart"></i>
//                </div>
//                <div class="bin">
//                    <i class="fa-regular fa-trash-can"></i>
//                </div>
//                <div class="qtyy">
//                    <p> Số lượng: 1</p>
//                </div>
//            </div>
//        </div>
//    </div>
//`;


//    // Append the new item to the existing items
//    containerProduct.insertAdjacentHTML('beforeend', newItemHTML); // Append the new item

//    // Update the quantity in the bag
//    var currentQty = parseInt(bagItemCount.textContent.split(': ')[1]) + 1; // Update quantity
//    bagItemCount.textContent = `Qty: ${currentQty}`;

//    // Update the total price
//    const currentTotalPrice = parseFloat(document.getElementById('totalPrice').textContent.replace('US$', '')) || 0;
//    const newTotalPrice = currentTotalPrice + productPrice; // Add the new item's price to the total
//    document.getElementById('totalPrice').textContent = `US$${newTotalPrice.toFixed(2)}`; // Update total price

//    // Mark bag as not empty
//    isBagEmpty = false;
//    updateTotalPrice();

//    // Save bag item to local storage
//    saveBagToLocalStorage({
//        productID: product.productID,
//        productName,
//        productCategory,
//        productSize,
//        productColor,
//        productPrice: productPrice.toFixed(2),
//        imageURL: imageData ? imageData.imageURL : '/src/default-image.png',
//        quantity

//    });
//});


// Function to save the shopping bag to local storage
function saveBagToLocalStorage(item) {
    // Get existing items from local storage
    const existingItems = JSON.parse(localStorage.getItem('shoppingBag')) || [];
    // Add the new item
    existingItems.push(item);
    // Save back to local storage
    localStorage.setItem('shoppingBag', JSON.stringify(existingItems));

}
//document.addEventListener('DOMContentLoaded', () => {
//    const existingItems = JSON.parse(localStorage.getItem('shoppingBag')) || [];
//    const containerProduct = document.querySelector('.bag_itemm');

//    existingItems.forEach(item => {
//        const newItemHTML = `
//            <div class="order_item">
//                <div class="img">
//                    <a class="container_img" href="/productdetail/${item.productID}">
//                        <img class="edt_product" src="${item.imageURL}" alt="${item.productName}">
//                    </a>
//                </div>
//                <div class="description_product">
//                    <p class="boldz" id="bagProductName">${item.productName}</p>
//                    <p id="bagProductCategory">${item.productCategory}</p>
//                    <p id="bagProductSize">Size: ${item.productSize}</p>
//                    <p id="bagProductPrice" class="boldz">$${item.productPrice}</p>
//                    <p id="bagProductColor">Color: ${item.productColor}</p>
//                    <div class="heart_delete">
//                        <div class="heartt">
//                           <i class="fa-regular fa-heart"></i>
//                        </div>
//                        <div class="bin">
//                            <i class="fa-regular fa-trash-can"></i>
//                        </div>
//                        <div class="qtyy">
//                            <p> Qty: 1</p>
//                        </div>
//                    </div>
//                </div>
//            </div>
//        `;

//        containerProduct.insertAdjacentHTML('beforeend', newItemHTML);
//    });

//    // Update quantity and total price
//    const totalPrice = existingItems.reduce((acc, item) => acc + parseFloat(item.productPrice), 0);
//    document.getElementById('totalPrice').textContent = `US$${totalPrice.toFixed(2)}`;
//    bagItemCount.textContent = `Qty: ${existingItems.length}`;
//    isBagEmpty = existingItems.length === 0;
//});



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





function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll('.Bag_order_item .description_product #bagProductPrice').forEach(priceElement => {
        const priceText = priceElement.textContent.replace('$', '');
        total += parseFloat(priceText);
    });

    // Display the total in the UI
    document.querySelector('.pricee .css-price p').textContent = `US$${total.toFixed(2)}`;

    // Save the total price to local storage
    localStorage.setItem('totalPrice', total.toFixed(2));
}