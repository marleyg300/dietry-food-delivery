document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-cart');
    const viewDetailsButtons = document.querySelectorAll('.view-food');
    const cartIcon = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.sidecart');
    const closeButton = document.querySelector('.sidecart .close_btn');
    const cartItemsContainer = document.querySelector('.cart_items');
    const subtotalElement = document.querySelector('.cart_actions .subtotal span');
    const serviceFeeElement = document.querySelector('.cart_actions .service_fee span');
    const totalElement = document.querySelector('.cart_actions .total span');
    const cartCountElements = document.querySelectorAll('.cart_count');
    const cartHeaderTitle = document.querySelector('.header_title');
    const checkoutButton = document.getElementById('checkout-button'); // Add this line to reference the checkout button

    let cartItems = [];
    let totalAmount = 0;
    const serviceFee = 100; // Fixed service fee

    // Attach click event listeners to "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const menuCard = e.target.closest('.menu_card');
            addToCart(menuCard);
            openCart();
        });
    });

    // Attach click event listeners to "View Details" buttons
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const menuCard = e.target.closest('.menu_card');
            openDetailsPopup(menuCard);
        });
    });

    // Toggle cart sidebar when the cart icon is clicked
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
    });

    // Close cart sidebar when the close button is clicked
    closeButton.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Add item to the cart
    function addToCart(menuCard) {
        const title = menuCard.querySelector('.menu_info h2').innerText;
        let priceString = menuCard.querySelector('.menu_info h3').innerText;

        // Remove non-numeric characters except for the decimal point
        priceString = priceString.replace(/[^\d.]/g, '');
        const price = parseFloat(priceString);

        if (isNaN(price)) {
            console.error('Invalid price:', priceString);
            return;
        }

        const imageSrc = menuCard.querySelector('.menu_image img').src;

        // Check if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(item => item.title === title);
        if (existingItemIndex > -1) {
            // Increase the quantity if the item already exists
            cartItems[existingItemIndex].quantity += 1;
        } else {
            // Add a new item to the cart
            cartItems.push({ title, price, imageSrc, quantity: 1 });
        }

        // Update the UI to reflect cart changes
        updateCartUI();
    }

    // Update the cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart_item');
            cartItem.innerHTML = `
                <div class="item_img"><img src="${item.imageSrc}" class="img"></div>
                <div class="item_details">
                    <p>${item.title}</p>
                    <p>Ksh ${item.price.toFixed(2)}</p>
                    <div class="qty">
                        <span class="decrease">-</span>
                        <strong>${item.quantity}</strong>
                        <span class="increase">+</span>
                    </div>
                </div>
                <div class="remove_item"><span>&times;</span></div>
            `;
            cartItemsContainer.appendChild(cartItem);

            // Attach event listeners for quantity modification
            cartItem.querySelector('.decrease').addEventListener('click', () => changeQuantity(index, -1));
            cartItem.querySelector('.increase').addEventListener('click', () => changeQuantity(index, 1));
            cartItem.querySelector('.remove_item').addEventListener('click', () => removeItem(index));
        });

        // Update the cart total amount
        updateCartTotal();
    }

    // Change the quantity of a cart item
    function changeQuantity(index, delta) {
        cartItems[index].quantity += delta;
        if (cartItems[index].quantity <= 0) {
            cartItems.splice(index, 1);
        }
        updateCartUI();
    }

    // Remove an item from the cart
    function removeItem(index) {
        cartItems.splice(index, 1);
        updateCartUI();
    }

    // Update the total amount and cart count
    function updateCartTotal() {
        // Calculate the subtotal by summing up item prices and quantities
        totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        subtotalElement.innerText = ` ${totalAmount.toFixed(2)}`;

        // Display fixed service fee
        serviceFeeElement.innerText = `${serviceFee.toFixed(2)}`;

        // Calculate and display the total amount (subtotal + service fee)
        const totalWithServiceFee = totalAmount + serviceFee;
        totalElement.innerText = ~` ${totalWithServiceFee.toFixed(2)}`;

        // Update cart item count in the cart title and cart icon
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCountElements.forEach(cartCount => {
            cartCount.innerText = totalItems.toString();
        });
        cartHeaderTitle.innerText = `Your Cart (${totalItems})`;
    }

    // Function to open the cart
    function openCart() {
        cartSidebar.classList.add('open');
    }

    // Function to open the details popup
    function openDetailsPopup(menuCard) {
        const detailsPopup = document.getElementById("details-popup");
        const image = menuCard.querySelector(".menu_image img").src;
        const title = menuCard.querySelector(".menu_info h2").textContent;
        let priceString = menuCard.querySelector('.menu_info h3').innerText;
        
        // Remove non-numeric characters except for the decimal point
        priceString = priceString.replace(/[^\d.]/g, '');
        const price = parseFloat(priceString);

        const ingredients = menuCard.getAttribute("data-ingredients");
        const nutrition = menuCard.getAttribute("data-nutrition");

        document.getElementById("details-image").src = image;
        document.getElementById("details-title").textContent = title;
        document.getElementById("details-price").textContent = `Ksh ${price.toFixed(2)}`;
        document.getElementById("details-ingredients").textContent = `Ingredients: ${ingredients}`;
        document.getElementById("details-nutrition").textContent = `Nutritional Values: ${nutrition}`;

        detailsPopup.style.display = "flex";
    }

    // Function to close the details popup
    window.closeDetailsPopup = function() {
        document.getElementById("details-popup").style.display = "none";
    }

    // Function to add to cart from the details popup
    window.addToCartFromDetails = function() {
        const title = document.getElementById("details-title").textContent;
        const priceString = document.getElementById("details-price").textContent.replace(/[^\d.]/g, '');
        const price = parseFloat(priceString);
        const imageSrc = document.getElementById("details-image").src;

        // Check if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(item => item.title === title);
        if (existingItemIndex > -1) {
            // Increase the quantity if the item already exists
            cartItems[existingItemIndex].quantity += 1;
        } else {
            // Add a new item to the cart
            cartItems.push({ title, price, imageSrc, quantity: 1 });
        }

        // Update the UI to reflect cart changes
        updateCartUI();

        // Close the details popup
        closeDetailsPopup();
    }

    // Add event listener for checkout button
    checkoutButton.addEventListener('click', () => {
        localStorage.setItem('cartDetails', JSON.stringify(cartItems)); // Save cart details to localStorage
        window.location.href = 'checkout.html'; // Redirect to checkout page
    });
});
