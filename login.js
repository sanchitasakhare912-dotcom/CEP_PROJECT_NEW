// When login form is submitted
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Stop page reload

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    let caregivers = JSON.parse(localStorage.getItem("caregivers")) || [];

let user = caregivers.find(u =>
    u.username === username && u.password === password
);

if (user) {
    localStorage.setItem("sessionActive", "true");
    localStorage.setItem("currentUser", username);
    localStorage.removeItem("isNewUser");
    window.location.href = "index.html";

} else {
    document.getElementById("message").innerText = "Invalid Username or Password";
    document.getElementById("message").style.color = "red";
}

});


// Create Account Button
function createAccount() {
    window.location.href = "caregiver-login.html";
}


// Forgot Password
function forgotPassword() {
    const savedPass = localStorage.getItem("caregiverPass");

    if (savedPass) {
        alert("Your password is: " + savedPass);
    } else {
        alert("No account found. Please create account first.");
    }
}
