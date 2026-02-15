// Block direct access if not logged in
if (localStorage.getItem("sessionActive") !== "true") {
    window.location.href = "caregiver-login.html";
}

document.getElementById("verifyForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let enteredPassword = document.getElementById("verifyPassword").value;

    // Get all caregivers
    let caregivers = JSON.parse(localStorage.getItem("caregivers")) || [];

    // Get current logged-in user
    let currentUser = localStorage.getItem("currentUser");

    // Find that user in array
    let user = caregivers.find(u => u.username === currentUser);

    if (user && enteredPassword === user.password) {
        window.location.href = "caregiver-dashboard.html";
    } else {
        document.getElementById("errorMsg").innerText = "Incorrect password!";
    }
});
