document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = document.getElementById("newUser").value;
    const pass = document.getElementById("newPass").value;
    const confirm = document.getElementById("confirmPass").value;

    if (pass !== confirm) {
        document.getElementById("regMessage").innerText = "Passwords do not match";
        document.getElementById("regMessage").style.color = "red";
        return;
    }

    let caregivers = JSON.parse(localStorage.getItem("caregivers")) || [];

caregivers.push({
    username: user,
    password: pass
});

localStorage.setItem("caregivers", JSON.stringify(caregivers));


   // Save caregivers
localStorage.setItem("caregivers", JSON.stringify(caregivers));

// 🔥 Add these lines
localStorage.setItem("sessionActive", "true");
localStorage.setItem("currentUser", user);
localStorage.setItem("isNewUser", "true");

// Redirect to caregiver dashboard
window.location.href = "caregiver-dashboard.html";

});
