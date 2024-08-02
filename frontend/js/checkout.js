document.addEventListener('DOMContentLoaded', () => {
    function getCartDetails() {
        return JSON.parse(localStorage.getItem('cartDetails')) || [];
    }

    function saveOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    function getOrders() {
        return JSON.parse(localStorage.getItem('orders')) || [];
    }

    function displayOrderSummary() {
        const cartItems = getCartDetails();
        const summaryDiv = document.getElementById('order-summary');
        let totalItems = 0;
        let totalAmount = 0;
        let html = '<ul>';

        cartItems.forEach(item => {
            html += `<li>${item.title} - ${item.quantity} @ Ksh ${item.price.toFixed(2)} each</li>`;
            totalAmount += item.price * item.quantity;
            totalItems += item.quantity;
        });

        html += '</ul>';
        html += `<p>Total Items: ${totalItems}</p>`;
        html += `<p>Total Amount: Ksh ${totalAmount.toFixed(2)}</p>`;
        summaryDiv.innerHTML = html;
    }

    function populateUserInfo() {
        const userInfo = {
            name: localStorage.getItem('userName') || '',
            email: localStorage.getItem('userEmail') || '',
            number: localStorage.getItem('userNumber') || ''
        };

        document.getElementById('name').value = userInfo.name;
        document.getElementById('email').value = userInfo.email;
        document.getElementById('number').value = userInfo.number;
    }

    function handlePaymentMethodChange() {
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
        document.getElementById('visa-form').style.display = 'none';
        document.getElementById('mpesa-form').style.display = 'none';
        document.getElementById('paypal-form').style.display = 'none';

        if (selectedMethod === 'visa') {
            document.getElementById('visa-form').style.display = 'block';
        } else if (selectedMethod === 'mpesa') {
            document.getElementById('mpesa-form').style.display = 'block';
        } else if (selectedMethod === 'paypal') {
            document.getElementById('paypal-form').style.display = 'block';
        }
    }

    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentMethodChange);
    });

    document.getElementById('checkout-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        console.log('Checkout data:', data);
        console.log('Payment method:', paymentMethod);

        const cartItems = getCartDetails();
        const order = {
            id: new Date().getTime(),
            items: cartItems.length,
            paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
            amount: `Ksh ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending'
        };

        const orders = getOrders();
        orders.push(order);
        saveOrders(orders);

        window.location.href = 'payment.html';
    });

    document.getElementById('open-cart').addEventListener('click', () => {
        document.getElementById('side-cart').classList.add('active');
        populateOrderList();
        updateOrderCount();
    });

    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('side-cart').classList.remove('active');
    });

    function populateOrderList() {
        const orders = getOrders();
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = orders.map(order => `
            <div class="order-item" data-id="${order.id}">
                <div class="order-title">${order.title}</div>
                <div class="order-status">${order.status}</div>
                <div class="order-details">
                    <p><strong>Number of Items:</strong> ${order.items}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                    <p><strong>Amount Paid:</strong> ${order.amount}</p>
                    <p><strong>Date Ordered:</strong> ${order.date}</p>
                </div>
            </div>
        `).join('');
    }

    document.getElementById('order-list').addEventListener('click', (event) => {
        const item = event.target.closest('.order-item');
        if (item) {
            const details = item.querySelector('.order-details');
            details.classList.toggle('active');
        }
    });

    function updateOrderCount() {
        const orders = getOrders();
        const cartButton = document.getElementById('open-cart');
        cartButton.innerHTML = `🛒 (${orders.length})`;
    }

    displayOrderSummary();
    populateUserInfo();
    handlePaymentMethodChange();
    updateOrderCount();
});
