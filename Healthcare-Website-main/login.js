document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", async function (event) {
        event.preventDefault(); // फॉर्म को रोकना

        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();

        let response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        let result = await response.json();

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("token", result.token); // JWT टोकन स्टोर करना
            window.location.href = "Home-page.html"; // Redirect
        } else {
            alert(result.error);
        }
    });
});
