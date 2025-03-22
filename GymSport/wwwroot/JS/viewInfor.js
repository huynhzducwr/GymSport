
document.addEventListener('DOMContentLoaded', () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo && userInfo.userID) {
        fetchUserData(userInfo.userID);
        fetchOrderByUserId(userInfo.userID);
        fetchOrderTrackingByUserId(userInfo.userID);
    }

});


async function fetchOrderTrackingByUserId(userId) {
    try {
        const response = await fetch(`/api/Order/user/${userId}`);
        const orders = await response.json();
        console.log(orders);
        const orderTracking = document.getElementById('order-tracking');
        orderTracking.innerHTML = ''; // Xóa mọi nội dung hiện tại

        if (Array.isArray(orders)) {
            for (const order of orders) {
                // Render từng đơn hàng trong tiến độ giao hàng
                renderOrderTracking(order);
            }
        } else {
            console.error('Fetched data is not an array:', orders);
        }
    } catch (error) {
        console.error('Error fetching order tracking by user ID:', error);
    }
}

function renderOrderTracking(order, orderDetails) {
    const orderTracking = document.getElementById('order-tracking');

    // Tạo phần tử div cho mỗi đơn hàng
    const trackingItem = document.createElement('div');
    trackingItem.classList.add('tracking-item');

    // Lấy thông tin chi tiết sản phẩm đầu tiên (giả sử orderDetails là một mảng)
    const product = orderDetails[0];

    // Tạo phần tử img cho hình ảnh sản phẩm
    const productImage = document.createElement('img');
    productImage.src = product.imageURL || "https://via.placeholder.com/80";
    productImage.alt = "Product Image";
    productImage.width = 80;
    productImage.height = 80;

    // Tạo phần tử div cho thông tin chi tiết đơn hàng
    const trackingDetails = document.createElement('div');
    trackingDetails.classList.add('tracking-details');

    // Thêm thông tin vào trackingDetails
    trackingDetails.innerHTML = `
        <h4>Mã đơn hàng #${order.orderID}</h4>
        <p>Ngày mua: ${new Date(order.orderDate).toLocaleDateString()}</p>
        <p>Trạng thái: <span class="status">${order.orderStatus}</span></p>
    `;

    // Thêm hình ảnh và thông tin chi tiết vào div của từng đơn hàng
    trackingItem.appendChild(productImage);
    trackingItem.appendChild(trackingDetails);

    // Thêm đơn hàng vào phần tiến độ giao hàng trên giao diện
    orderTracking.appendChild(trackingItem);
}


async function fetchOrderByUserId(userId) {
    try {
        const response = await fetch(`/api/Order/user/${userId}`);
        const orders = await response.json();
        console.log(orders);
        const purchaseHistory = document.getElementById('purchase-history');
        const orderTracking = document.getElementById('order-tracking');
        orderTracking.innerHTML = ''; // Xóa mọi nội dung hiện tại
        purchaseHistory.innerHTML = ''; // Xóa mọi nội dung hiện tại

        if (Array.isArray(orders)) {
            for (const order of orders) {
                // Lấy orderID từ từng đơn hàng
                const orderID = order.orderID;

                // Gọi hàm để lấy chi tiết đơn hàng và render dữ liệu khi dữ liệu chi tiết sẵn sàng
                const orderDetails = await fetchOrderDetailsByOrderID(orderID);

                // Render dữ liệu lên giao diện
                renderOrderAndDetails(order, orderDetails);
                renderOrderTracking(order, orderDetails);
            }
        } else {
            console.error('Fetched data is not an array:', orders);
        }
    } catch (error) {
        console.error('Error fetching orders by user ID:', error);
    }
}

async function fetchOrderDetailsByOrderID(orderId) {
    try {
        const response = await fetch(`/api/OrderDetails/details/${orderId}`);
        const orderDetails = await response.json();
        console.log(orderDetails);
        return orderDetails; // Trả về dữ liệu chi tiết để sử dụng trong render
    } catch (error) {
        console.error('Error fetching order details by order ID:', error);
    }
}



// 1. Định nghĩa các trạng thái đơn hàng
class OrderState {
    constructor(order) {
        this.order = order;
    }

    getStatus() {
        return "Không xác định";
    }

    getAction() {
        return "Hành động không xác định";
    }
}

// Trạng thái "Chờ xử lý"
class PendingState extends OrderState {
    getStatus() {
        return "Chờ xử lý";
    }

    getAction() {
        return "Đơn hàng đang được chuẩn bị.";
    }
}

// Trạng thái "Đang giao"
class ShippedState extends OrderState {
    getStatus() {
        return "Đang giao";
    }

    getAction() {
        return "Đơn hàng đang trên đường giao.";
    }
}

// Trạng thái "Đã giao"
class DeliveredState extends OrderState {
    getStatus() {
        return "Đã giao";
    }

    getAction() {
        return "Đơn hàng đã được giao thành công.";
    }
}

// Trạng thái "Đã hủy"
class CancelledState extends OrderState {
    getStatus() {
        return "Đã hủy";
    }

    getAction() {
        return "Đơn hàng đã bị hủy.";
    }
}

// 2. Lớp quản lý trạng thái đơn hàng
class OrderContext {
    constructor(order) {
        this.order = order;
        this.setState(order.orderStatus);
    }

    setState(status) {
        switch (status) {
            case "Pending":
                this.state = new PendingState(this.order);
                break;
            case "Shipped":
                this.state = new ShippedState(this.order);
                break;
            case "Delivered":
                this.state = new DeliveredState(this.order);
                break;
            case "Cancelled":
                this.state = new CancelledState(this.order);
                break;
            default:
                this.state = new OrderState(this.order);
        }
    }

    getStatus() {
        return this.state.getStatus();
    }

    getAction() {
        return this.state.getAction();
    }
}

// 3. Sử dụng trong hàm renderOrderAndDetails
function renderOrderAndDetails(order, orderDetails) {
    const purchaseHistory = document.getElementById('purchase-history');

    const orderDiv = document.createElement('div');
    orderDiv.classList.add('purchase-item');

    const product = orderDetails[0];

    const productImage = document.createElement('img');
    productImage.src = product.imageURL || "https://via.placeholder.com/80";
    productImage.alt = product.productName || "Product Image";
    productImage.width = 80;
    productImage.height = 80;

    // Áp dụng mẫu State để lấy trạng thái đơn hàng
    const orderContext = new OrderContext(order);

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('purchase-details');

    detailsDiv.innerHTML = `
        <h4>Mã đơn hàng #${order.orderID}</h4>
        <p>Ngày đặt hàng: ${new Date(order.orderDate).toLocaleDateString()}</p>
        <p>Trạng thái: <strong>${orderContext.getStatus()}</strong></p>
        <p>Chi tiết: ${orderContext.getAction()}</p>
        <p>Địa chỉ nhận hàng: ${order.shippingAddress}</p>
        <p>Sản phẩm: ${product.productName} (Kiểu: ${product.productCategory}, Màu: ${product.productColor}, Size: ${product.productSize})</p>
        <p>Số lượng: ${product.quantity}</p>
        <p>Giá mỗi loại: $${product.unitPrice}</p>
        <p>Tổng: $${order.totalAmount}</p>
    `;

    orderDiv.appendChild(productImage);
    orderDiv.appendChild(detailsDiv);
    purchaseHistory.appendChild(orderDiv);
}

//function renderOrderAndDetails(order, orderDetails) {
//    const purchaseHistory = document.getElementById('purchase-history');

//    // Tạo phần tử div cho đơn hàng
//    const orderDiv = document.createElement('div');
//    orderDiv.classList.add('purchase-item');

//    // Lấy thông tin chi tiết sản phẩm đầu tiên (giả sử orderDetails là một mảng)
//    const product = orderDetails[0];

//    // Tạo phần tử img cho hình ảnh sản phẩm
//    const productImage = document.createElement('img');
//    productImage.src = product.imageURL || "https://via.placeholder.com/80";
//    productImage.alt = product.productName || "Product Image";
//    productImage.width = 80;
//    productImage.height = 80;

//    // Tạo phần tử div cho thông tin chi tiết đơn hàng
//    const detailsDiv = document.createElement('div');
//    detailsDiv.classList.add('purchase-details');

//    // Thêm thông tin vào detailsDiv
//    detailsDiv.innerHTML = `
//        <h4>Mã đơn hàng #${order.orderID}</h4>
//        <p>Ngày đặt hàng: ${new Date(order.orderDate).toLocaleDateString()}</p>
//        <p>Trạng thái: ${order.orderStatus}</p>
//        <p>Địa chỉ nhận hàng: ${order.shippingAddress}</p>
//        <p>Sản phẩm: ${product.productName} (Kiểu: ${product.productCategory}, Màu: ${product.productColor}, Size: ${product.productSize})</p>
//        <p>Số lượng: ${product.quantity}</p>
//        <p>Giá mỗi loại: $${product.unitPrice}</p>
//               <p>Tổng: $${order.totalAmount}</p>
//    `;

//    // Thêm hình ảnh và thông tin vào div của đơn hàng
//    orderDiv.appendChild(productImage);
//    orderDiv.appendChild(detailsDiv);

//    // Thêm đơn hàng vào phần lịch sử mua hàng trên giao diện
//    purchaseHistory.appendChild(orderDiv);
//}

async function fetchUserData(userID) {
    try {
        const response = await fetch(`https://localhost:44326/api/User/GetUser/${userID}`); 
        const data = await response.json();
        console.log(data); 


        if (data && data.data) {
            document.getElementById('firstname').value = data.data.firstname || '';
            document.getElementById('lastname').value = data.data.lastname || '';
            document.getElementById('email-update').value = data.data.email || '';
        } else {
            console.error("Không thể lấy thông tin người dùng:", data.message);
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

        

    

