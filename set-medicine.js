function getCaregiverData() {
    const allData = JSON.parse(localStorage.getItem("caregiverData")) || {};
    const currentUser = localStorage.getItem("currentUser");

    if (!allData[currentUser]) {
       allData[currentUser] = {
    medicines: [],
    meals: [],
    rests: [],
    waterLastDone: null,
    people: [],   // ✅ ADD THIS
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

/* ================= ADD MEDICINE ================= */

function addMedicine() {
    const name = document.getElementById("medName").value;
    const time = document.getElementById("medTime").value;

    if (!name || !time) {
        alert("Please fill all fields");
        return;
    }

    let data = getCaregiverData();

    data.medicines.push({
        name: name,
        time: time,
        done: false
    });

    saveCaregiverData(data);

    document.getElementById("medName").value = "";
    document.getElementById("medTime").value = "";

    loadMedicines();
}

/* ================= DISPLAY LIST ================= */

function loadMedicines() {
    let data = getCaregiverData();
    const list = document.getElementById("medicineList");
    list.innerHTML = "";

    data.medicines.forEach((med, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${med.name} - ${med.time}
        <button onclick="deleteMedicine(${index})">Delete</button>`;
        list.appendChild(li);
    });
}

/* ================= DELETE ================= */

function deleteMedicine(index) {
    let data = getCaregiverData();
    data.medicines.splice(index, 1);
    saveCaregiverData(data);
    loadMedicines();
}

function goBack() {
    window.location.href = "caregiver-dashboard.html";
}

window.onload = loadMedicines;
