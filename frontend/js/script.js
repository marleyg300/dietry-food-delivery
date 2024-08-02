document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector(".login-btn");
    const closeBtns = document.querySelectorAll(".close-btn");
    const showSignupLink = document.querySelector(".show-signup");
    const showLoginLink = document.querySelector(".show-login");
    const signupSubmitBtn = document.querySelector(".signup-submit");

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
    signupSubmitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Add any form validation or processing here
        // Assuming form validation is passed, show login popup
        document.querySelector(".signup-popup").style.display = "none";
        document.querySelector(".login-popup").style.display = "block";
    });
});
