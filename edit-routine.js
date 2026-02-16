/* ================= GET & SAVE ================= */

function getCaregiverData() {
    const allData = JSON.parse(localStorage.getItem("caregiverData")) || {};
    const currentUser = localStorage.getItem("currentUser");

    if (!allData[currentUser]) {
        allData[currentUser] = {
            medicines: [],
            meals: [],
            rests: [],
            waterLastDone: null,
            logs: []
        };
        localStorage.setItem("caregiverData", JSON.stringify(allData));
    }

    return allData[currentUser];
}

function saveCaregiverData(data) {
    const allData = JSON.parse(localStorage.getItem("caregiverData")) || {};
    const currentUser = localStorage.getItem("currentUser");

    allData[currentUser] = data;
    localStorage.setItem("caregiverData", JSON.stringify(allData));
}

/* ================= MEALS ================= */

function addMeal() {
    const name = document.getElementById("mealNameInput").value;
    const time = document.getElementById("mealTimeInput").value;

    if (!name || !time) {
        alert("Fill all fields");
        return;
    }

    let data = getCaregiverData();

    data.meals.push({
        name: name,
        time: time,
        done: false
    });

    saveCaregiverData(data);

    document.getElementById("mealNameInput").value = "";
    document.getElementById("mealTimeInput").value = "";

    loadMeals();
}

function loadMeals() {
    const list = document.getElementById("mealList");
    list.innerHTML = "";

    let data = getCaregiverData();

    // Sort by time
    data.meals.sort((a, b) => a.time.localeCompare(b.time));

    data.meals.forEach((meal, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${meal.name} - ${meal.time}
            <button onclick="deleteMeal(${index})">Delete</button>
        `;

        list.appendChild(li);
    });
}

function deleteMeal(index) {
    let data = getCaregiverData();
    data.meals.splice(index, 1);
    saveCaregiverData(data);
    loadMeals();
}

/* ================= REST ================= */

function addRest() {
    const name = document.getElementById("restNameInput").value;
    const time = document.getElementById("restTimeInput").value;

    if (!name || !time) {
        alert("Fill all fields");
        return;
    }

    let data = getCaregiverData();

    data.rests.push({
        name: name,
        time: time,
        done: false
    });

    saveCaregiverData(data);

    document.getElementById("restNameInput").value = "";
    document.getElementById("restTimeInput").value = "";

    loadRests();
}

function loadRests() {
    const list = document.getElementById("restList");
    list.innerHTML = "";

    let data = getCaregiverData();

    // Sort by time
    data.rests.sort((a, b) => a.time.localeCompare(b.time));

    data.rests.forEach((rest, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${rest.name} - ${rest.time}
            <button onclick="deleteRest(${index})">Delete</button>
        `;

        list.appendChild(li);
    });
}

function deleteRest(index) {
    let data = getCaregiverData();
    data.rests.splice(index, 1);
    saveCaregiverData(data);
    loadRests();
}

/* ================= NAVIGATION ================= */

function goBack() {
    window.location.href = "caregiver-dashboard.html";
}

/* ================= LOAD ================= */

window.onload = function() {
    loadMeals();
    loadRests();
};
