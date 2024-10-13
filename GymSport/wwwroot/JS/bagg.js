document.addEventListener('DOMContentLoaded', () => {
    const existingItems = JSON.parse(localStorage.getItem('shoppingBag')) || [];
    const containerProduct = document.querySelector('.bag_itemm'); // Change selector if needed
    const bagOrderItem = document.querySelector('.Bag_order_item'); // Change selector if needed
    const bagOrder = document.querySelector('.Bag_order'); // Change selector if needed
    const bagItemCount = document.querySelector('.qtyy p'); // Adjust based on your HTML structure


    shopIcon.addEventListener('click', function () {
        if (existingItems.length > 0) {
            bagOrderItem.style.display = 'block';
            bagOrder.style.display = 'none'; // Hide empty state

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
        }
        else {
            // If there are no items, show the empty bag message
            bagOrderItem.style.display = 'none';
            bagOrder.style.display = 'block'; // Show empty state
        }
    });


    closeIcon.addEventListener('click', function () {
        if (existingItems.length > 0) {
            bagOrderItem.style.display = 'none';
            overlay.style.display = 'none';
        } else {
            bagorder.style.display = 'none';
            overlay.style.display = 'none';
        }
    });
    overlay.addEventListener('click', function () {
        if (existingItems.length > 0) {
            bagOrderItem.style.display = 'none';
            overlay.style.display = 'none';
        }
        else {
            bagOrder.style.display = 'none';
            overlay.style.display = 'none';
        }
    })


   
});
