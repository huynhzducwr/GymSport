async function fetchPaymentMethod() {
    const url = '/api/PaymentMethod/GetAllPaymentMethod';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log('API Response PaymentMethod:', data);
        }
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
document.addEventListener('DOMContentLoaded', () => {
    const existingItems = JSON.parse(localStorage.getItem('shoppingBag')) || [];
    const containerProduct = document.querySelector('.bag_itemm'); // Adjust selector if needed
    const bagOrderItem = document.querySelector('.Bag_order_item'); // Adjust selector if needed
    const bagOrder = document.querySelector('.Bag_order'); // Adjust selector if needed
    const bagItemCount = document.querySelector('.qtyy p'); // Adjust based on your HTML structure

    fetchPaymentMethod();

    function renderBagItems() {
        containerProduct.innerHTML = ''; // Clear previous items

        if (existingItems.length > 0) {
            bagOrderItem.style.display = 'block';
            bagOrder.style.display = 'none'; // Hide empty state

            existingItems.forEach((item, index) => {
                const newItemHTML = `
                    <div class="order_item" data-productid="${item.productID}">
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
                                <div class="bin" data-index="${index}">
                                    <i class="fa-regular fa-trash-can"></i>
                                </div>
                                <div class="qtyy">
                                    <button class ="qty-decrease" data-index="${index}">-</button>
                                    <p> Qty: ${item.quantity || 1}</p>
                                    <button class="qty-increase" data-index="${index}">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <style>
             .qtyy {
    display: flex;
    align-items: center;
    gap: 15px; /* Increase space between elements */
    margin-top: 10px;
    font-size: 18px;
}

.qty-decrease,
.qty-increase {
    width: 45px; /* Increase width */
    height: 45px; /* Increase height */
    background-color: #f0f0f0;
    border: 2px solid #ccc;
    border-radius: 8px; /* Slightly larger radius */
    color: #333;
    font-size: 24px; /* Larger font for symbols */
    font-weight: bold; /* Makes the symbols more visible */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s, transform 0.1s;
}

.qty-decrease:hover,
.qty-increase:hover {
    background-color: #d4d4d4;
}

.qty-decrease:active,
.qty-increase:active {
    background-color: #bcbcbc;
    transform: scale(1.1); /* Slightly larger when pressed */
}

.qtyy p {
    margin: 0;
    color: #333;
    padding: 0 10px;
    white-space: nowrap;
    font-size: 18px; /* Increase font size for balance */
}

                    </style>
                `;
                containerProduct.insertAdjacentHTML('beforeend', newItemHTML);
            });

            // Update quantity and total price
            const totalPrice = existingItems.reduce((acc, item) => acc + (parseFloat(item.productPrice) * (item.quantity || 1)), 0);
            document.getElementById('totalPrice').textContent = `US$${totalPrice.toFixed(2)}`;
            bagItemCount.textContent = `Qty: ${existingItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}`;

            document.querySelectorAll('.bin').forEach(bin => {
                bin.addEventListener('click', function () {
                    const index = bin.getAttribute('data-index');
                    removeItemFromBag(index);
                });
            });
          
            document.querySelectorAll('.qty-increase').forEach(btn => {
                btn.addEventListener('click', function () {
                    const index = btn.getAttribute('data-index');
                    changeItemQuantity(index, 1);
                });
            });
            document.querySelectorAll('.qty-decrease').forEach(btn => {
                btn.addEventListener('click', function () {
                    const index = btn.getAttribute('data-index');
                    changeItemQuantity(index, -1);
                });
            });

        } else {
            bagOrderItem.style.display = 'none';
            bagOrder.style.display = 'block'; 
        }

  
    }


    function changeItemQuantity(index, change) {

        existingItems[index].quantity = (existingItems[index].quantity || 1) + change;
        if (existingItems[index].quantity < 1) {
            removeItemFromBag(index);
        } else {

            localStorage.setItem('shoppingBag', JSON.stringify(existingItems));
            renderBagItems();
        }
    }
    function removeItemFromBag(index) {
        // Remove item from existingItems array
        existingItems.splice(index, 1);

        // Update local storage
        localStorage.setItem('shoppingBag', JSON.stringify(existingItems));

        // Re-render the bag items
        renderBagItems();
    }

    shopIcon.addEventListener('click', renderBagItems);

    closeIcon.addEventListener('click', function () {
        bagOrderItem.style.display = 'none';
        overlay.style.display = 'none';
    });

    overlay.addEventListener('click', function () {
        bagOrderItem.style.display = 'none';
        overlay.style.display = 'none';
    });
});



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

