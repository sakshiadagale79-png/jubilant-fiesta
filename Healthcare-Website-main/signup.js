document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signup-form").addEventListener("submit", function (event) {
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();
        let confirmPassword = document.getElementById("confirm-password").value.trim();
        let errorMessage = "";

        // Name Validation
        if (name === "") {
            errorMessage += "Name is required.\n";
        }

        // Email Validation
        if (!email.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)) {
            errorMessage += "Enter a valid email.\n";
        }

        // Password Validation
        if (password.length < 6) {
            errorMessage += "Password must be at least 6 characters long.\n";
        }
        if (password !== confirmPassword) {
            errorMessage += "Passwords do not match.\n";
        }

        if (errorMessage !== "") {
            alert(errorMessage);
            event.preventDefault(); // Form submit hone se rokna
        }
    });
});
