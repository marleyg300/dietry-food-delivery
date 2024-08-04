
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector(".login-btn");
    const closeBtns = document.querySelectorAll(".close-btn");
    const showSignupLink = document.querySelector(".show-signup");
    const showLoginLink = document.querySelector(".show-login");
    const signupSubmitBtn = document.querySelector(".signup-submit");

    // Example dietary restrictions data - replace this with actual data from your backend
    const dietaryRestrictions = [
        { value: 'Hypertension', image: 'images/hypertension.jpg' },
        { value: 'Diabetes', image: 'images/diabetes.jpg' },
        { value: 'Lactose Intolerance', image: 'images/lactose intolerance.jpg' },
        { value: 'Vegan', image: 'images/vegan.jpg' },
        { value: 'High Protein Diet', image: 'images/foodlife.jpg' },
        { value: 'Anti Inflammatory Diet', image: 'images/anti inflammatory.jpg' },
        { value: 'Celiac Disease', image: 'images/celiac.jpg' },
        { value: 'Renal Diet', image: 'images/foodlife.jpg' },
        { value: 'Ulcers Diet', image: 'images/ulcers.jpg' }
    ];

    // Function to dynamically create dietary restriction cards
    function populateDietaryRestrictions() {
        const container = document.getElementById('dietary-cards-container');
        container.innerHTML = ''; // Clear existing content
        dietaryRestrictions.forEach(restriction => {
            const card = document.createElement('label');
            card.classList.add('card');
            card.innerHTML = `
                <input type="checkbox" name="dietary_restrictions[]" value="${restriction.value}" />
                <div class="card-content">
                    <div class="card-top">
                        <img src="${restriction.image}" alt="${restriction.value}" />
                    </div>
                    <div class="card-bottom">
                        <p>${restriction.value}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Call function to populate cards when DOM content is loaded
    populateDietaryRestrictions();

    // Show login popup
    loginBtn.addEventListener("click", () => {
        document.querySelector(".login-popup").style.display = "block";
    });

    // Hide all popups
    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".form-popup").forEach(popup => {
                popup.style.display = "none";
            });
        });
    });

    // Show signup popup
    showSignupLink.addEventListener("click", () => {
        document.querySelector(".login-popup").style.display = "none";
        document.querySelector(".signup-popup").style.display = "block";
        showStep(1); // Ensure the first step is shown
    });

    // Show login popup from signup popup
    showLoginLink.addEventListener("click", () => {
        document.querySelector(".signup-popup").style.display = "none";
        document.querySelector(".login-popup").style.display = "block";
    });

    // Show the next or previous step in the signup form
    window.showStep = function(step) {
        document.querySelectorAll('.form-step').forEach((stepDiv, index) => {
            stepDiv.style.display = (index + 1 === step) ? 'block' : 'none';
        });
    };

    // Handle signup submit button
    signupSubmitBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const form = document.getElementById('signup-form');
        const formData = new FormData(form);

        try {
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    username: formData.get('username'),
                    password: formData.get('password'),
                    role: formData.get('role'),
                    dietary_restrictions: formData.getAll('dietary_restrictions[]')
                })
            });

            const result = await response.json();
            if (response.ok) {
                document.querySelector(".signup-popup").style.display = "none";
                document.querySelector(".login-popup").style.display = "block";
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    });

    // Handle login submit button
    document.querySelector('.login-popup form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password')
                })
            });

            const result = await response.json();            
            if (response.ok) {
                // Store token in localStorage (or cookies if you prefer)
                localStorage.setItem('token', result.token);
                if (result.role === 'admin') {
                    window.location.href = '/admin.html';
                } else {
                    window.location.href = '../viewDietries.html';
                }
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    });
});
