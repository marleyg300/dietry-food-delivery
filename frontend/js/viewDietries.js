document.addEventListener('DOMContentLoaded', () => {
    fetchDietaryData();
    initializeCartFunctions();
});

async function fetchDietaryData() {
    try {
        const response = await fetch('/api/dietries/getDietries');
        const data = await response.json();
        renderDietaryMenu(data);
    } catch (error) {
        console.error('Error fetching dietary data:', error);
    }
}

function renderDietaryMenu(data) {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = '';

    for (const [restriction, meals] of Object.entries(data)) {
        let restrictionHasItems = false;

        for (const [mealType, foods] of Object.entries(meals)) {
            if (foods.length === 0) continue;

            restrictionHasItems = true;

            // Create and append the header
            const headerDiv = document.createElement('div');
            headerDiv.className = 'food-headers';
            headerDiv.innerHTML = `<h2>${restriction}</h2><h3>${capitalizeFirstLetter(mealType)}</h3>`;
            menuContainer.appendChild(headerDiv);

            // Create and append the menu box
            const menuBoxDiv = document.createElement('div');
            menuBoxDiv.className = 'menu_box';

            foods.forEach(food => {
                const ingredients = food.ingredients ? food.ingredients.join(', ') : 'N/A';
                const nutritionalValue = food.nutritional_value || 'N/A';
                const description = food.description || 'No description available';
                const image = food.image || 'default_image.png'; // Assuming you have a default image

                const menuCardDiv = document.createElement('div');
                menuCardDiv.className = 'menu_card';
                menuCardDiv.setAttribute("data-ingredients", ingredients);
                menuCardDiv.setAttribute("data-nutrition", nutritionalValue);

                menuCardDiv.innerHTML = `
                    <div class="menu_image">
                        <img src="${image}" alt="${food.name}">
                    </div>
                    <div class="menu_info">
                        <h2 class="food-title">${food.name}</h2>
                        <p>${description}</p>
                        <h3 class="food-price">Ksh ${food.price}</h3>
                        <div class="card-btn">
                            <a href="#" class="add-cart">Add to Cart</a>
                            <a href="#" class="view-food">View details</a>
                        </div>
                    </div>
                `;

                menuBoxDiv.appendChild(menuCardDiv);
            });

            menuContainer.appendChild(menuBoxDiv);
        }

        if (!restrictionHasItems) {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'food-headers';
            headerDiv.innerHTML = `<h2>${restriction}</h2>`;
            menuContainer.appendChild(headerDiv);
        }
    }

    initializeCartFunctions();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function initializeCartFunctions() {
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
    const checkoutButton = document.getElementById('checkout-button');

    let cartItems = [];
    let totalAmount = 0;
    const serviceFee = 100; // Fixed service fee

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const menuCard = e.target.closest('.menu_card');
            addToCart(menuCard);
            openCart();
        });
    });

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const menuCard = e.target.closest('.menu_card');
            openDetailsPopup(menuCard);
        });
    });

    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
    });

    closeButton.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    function addToCart(menuCard) {
        const title = menuCard.querySelector('.menu_info h2').innerText;
        let priceString = menuCard.querySelector('.menu_info h3').innerText;

        priceString = priceString.replace(/[^\d.]/g, '');
        const price = parseFloat(priceString);

        if (isNaN(price)) {
            console.error('Invalid price:', priceString);
            return;
        }

        const imageSrc = menuCard.querySelector('.menu_image img').src;

        const existingItemIndex = cartItems.findIndex(item => item.title === title);
        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push({ title, price, imageSrc, quantity: 1 });
        }

        updateCartUI();
    }

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

            cartItem.querySelector('.decrease').addEventListener('click', () => changeQuantity(index, -1));
            cartItem.querySelector('.increase').addEventListener('click', () => changeQuantity(index, 1));
            cartItem.querySelector('.remove_item').addEventListener('click', () => removeItem(index));
        });

        updateCartTotal();
    }

    function changeQuantity(index, delta) {
        cartItems[index].quantity += delta;
        if (cartItems[index].quantity <= 0) {
            cartItems.splice(index, 1);
        }
        updateCartUI();
    }

    function removeItem(index) {
        cartItems.splice(index, 1);
        updateCartUI();
    }

    function updateCartTotal() {
        totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        subtotalElement.innerText = ` ${totalAmount.toFixed(2)}`;
        serviceFeeElement.innerText = `${serviceFee.toFixed(2)}`;
        const totalWithServiceFee = totalAmount + serviceFee;
        totalElement.innerText = ` ${totalWithServiceFee.toFixed(2)}`;
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCountElements.forEach(cartCount => {
            cartCount.innerText = totalItems.toString();
        });
        cartHeaderTitle.innerText = `Your Cart (${totalItems})`;
    }

    function openCart() {
        cartSidebar.classList.add('open');
    }

    function openDetailsPopup(menuCard) {
        const detailsPopup = document.getElementById("details-popup");
        const image = menuCard.querySelector(".menu_image img").src;
        const title = menuCard.querySelector(".menu_info h2").textContent;
        let priceString = menuCard.querySelector('.menu_info h3').innerText;

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

    window.closeDetailsPopup = function() {
        document.getElementById("details-popup").style.display = "none";
    }

    window.addToCartFromDetails = function() {
        const title = document.getElementById("details-title").textContent;
        const priceString = document.getElementById("details-price").textContent.replace(/[^\d.]/g, '');
        const price = parseFloat(priceString);
        const imageSrc = document.getElementById("details-image").src;

        const existingItemIndex = cartItems.findIndex(item => item.title === title);
        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push({ title, price, imageSrc, quantity: 1 });
        }

        updateCartUI();
        closeDetailsPopup();
    }

    checkoutButton.addEventListener('click', () => {
        localStorage.setItem('cartDetails', JSON.stringify(cartItems));
        window.location.href = 'checkout.html';
    });
}

function closeDetailsPopup() {
    document.getElementById("details-popup").style.display = "none";
}
