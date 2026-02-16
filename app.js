// 🔹 Get current caregiver data
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

// 🔹 Save caregiver data
function saveCaregiverData(data) {
    const allData = JSON.parse(localStorage.getItem("caregiverData")) || {};
    const currentUser = localStorage.getItem("currentUser");

    allData[currentUser] = data;
    localStorage.setItem("caregiverData", JSON.stringify(allData));
}
//////////////////////////////////////////////////////////////////////////////////////


// 🔒 Block new users from patient dashboard
if (localStorage.getItem("sessionActive") === "true" &&
    localStorage.getItem("isNewUser") === "true") {

    window.location.href = "caregiver-dashboard.html";
}

// 🔐 Normal session protection
if (localStorage.getItem("sessionActive") !== "true") {
    window.location.href = "caregiver-register.html";
}


function updateTime() {
  const now = new Date();

  document.getElementById("time").innerText =
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  document.getElementById("dayDate").innerText =
    now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

  const h = now.getHours();
  let greet = "Good Morning";
  if (h >= 12 && h < 17) greet = "Good Afternoon";
  else if (h >= 17) greet = "Good Evening";

  document.getElementById("greeting").innerText = greet;
}

setInterval(updateTime, 1000);
updateTime();


/* ================= LANGUAGE ================= */

const translations = {
  en: { medicine: "Medicine", meal: "Meal", water: "Drink Water", rest: "Rest" },
  hi: { medicine: "दवा", meal: "भोजन", water: "पानी पिएं", rest: "आराम" },
  mr: { medicine: "औषध", meal: "जेवण", water: "पाणी प्या", rest: "विश्रांती" }
};

function setLang(lang, btn) {
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  document.querySelectorAll("[data-key]").forEach(el => {
    el.innerText = translations[lang][el.dataset.key];
  });
}


/* ================= MEDICINE MULTI-SLOT LOGIC ================= */

/* Get current active medicine based on time */
function getCurrentMedicine() {
    let meds = getCaregiverData().medicines;

    if (!meds || meds.length === 0) return null;

    // Sort by time
    meds.sort((a, b) => a.time.localeCompare(b.time));

    const currentTime = new Date().toTimeString().slice(0, 5);

    let currentMed = null;

    for (let i = 0; i < meds.length; i++) {
        if (meds[i].time <= currentTime) {
            currentMed = meds[i];
        }
    }

    return currentMed;
}

function getCurrentMeal() {
    let meals = getCaregiverData().meals;

    if (!meals || meals.length === 0) return null;

    meals.sort((a, b) => a.time.localeCompare(b.time));

    const currentTime = new Date().toTimeString().slice(0, 5);

    let currentMeal = null;

    for (let i = 0; i < meals.length; i++) {
        if (meals[i].time <= currentTime) {
            currentMeal = meals[i];
        }
    }

    return currentMeal;
}

function getCurrentRest() {
    let rests = getCaregiverData().rests;

    if (!rests || rests.length === 0) return null;

    rests.sort((a, b) => a.time.localeCompare(b.time));

    const currentTime = new Date().toTimeString().slice(0, 5);

    let currentRest = null;

    for (let i = 0; i < rests.length; i++) {
        if (rests[i].time <= currentTime) {
            currentRest = rests[i];
        }
    }

    return currentRest;
}


/* ================= DAILY RESET ================= */

function resetMedicinesIfNewDay() {
  const today = new Date().toISOString().split("T")[0];
  const lastReset = localStorage.getItem("lastMedicineReset");

  if (lastReset !== today) {
   let data = getCaregiverData();
    let meds = data.medicines;


    meds = meds.map(med => {
      med.done = false;
      return med;
    });

     data.medicines = meds;
    saveCaregiverData(data);
    localStorage.setItem("lastMedicineReset", today);
  }
}


/* Load and display correct medicine */
function loadMedicineDetails() {
    const med = getCurrentMedicine();
    const btn = document.querySelector(".medicine-btn");

    if (!med) {
        document.getElementById("medName").innerText = "No medicine now";
        document.getElementById("medTime").innerText = "⏰ --:--";
        return;
    }

    document.getElementById("medName").innerText = med.name;
    document.getElementById("medTime").innerText = "⏰ " + med.time;

    if (btn) {
        if (med.done) {
            btn.innerText = "✔";
            btn.classList.add("done");
        } else {
            btn.innerText = "DONE";
            btn.classList.remove("done");
        }
    }
}

function markDone(btn, taskType) {

  if (taskType === "water") {
    btn.innerText = "✔";
    btn.classList.add("done");
    let data = getCaregiverData();
data.waterLastDone = Date.now();
saveCaregiverData(data);

    return;
  }

  if (taskType === "medicine") {
    let data = getCaregiverData();
    const current = getCurrentMedicine();

    if (!current) return;

    data.medicines = data.medicines.map(med => {
        if (med.time === current.time) {
            med.done = true;
        }
        return med;
    });

    saveCaregiverData(data);

    btn.innerText = "✔";
    btn.classList.add("done");
    return;
  }

  if (taskType === "meal") {
    let data = getCaregiverData();
    let meals = data.meals;
    const current = getCurrentMeal();

    meals = meals.map(meal => {
        if (meal.time === current?.time) {
            meal.done = true;
        }
        return meal;
    });

    data.meals = meals;
    saveCaregiverData(data);

    btn.innerText = "✔";
    btn.classList.add("done");
    return;
  }

  if (taskType === "rest") {
    let data = getCaregiverData();
    let rests = data.rests;
    const current = getCurrentRest();

    rests = rests.map(rest => {
        if (rest.time === current?.time) {
            rest.done = true;
        }
        return rest;
    });

    data.rests = rests;
    saveCaregiverData(data);

    btn.innerText = "✔";
    btn.classList.add("done");
    return;
}
}

/* ================= RESET LOGIC (MEAL & REST) ================= */

function checkScheduledTask(taskType) {
  let data = getCaregiverData();
  const btn = document.querySelector(`.${taskType}-btn`);

  if (!btn) return;

  let tasks = [];

  if (taskType === "meal") tasks = data.meals;
  if (taskType === "rest") tasks = data.rests;

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  const currentTask = tasks.find(t => t.time <= currentTime);

  if (!currentTask) return;

  if (currentTask.done) {
    btn.innerText = "✔";
    btn.classList.add("done");
  } else {
    btn.innerText = "DONE";
    btn.classList.remove("done");
  }
}



/* ================= WATER RESET ================= */

function checkWaterTask() {
const lastDone = getCaregiverData().waterLastDone;
  const btn = document.querySelector(".water-btn");

  if (!btn) return;

  if (!lastDone) {
    btn.innerText = "DONE";
    btn.classList.remove("done");
    return;
  }

  const oneHour = 3600000;

  if (Date.now() - lastDone < oneHour) {
    btn.innerText = "✔";
    btn.classList.add("done");
  } else {
    btn.innerText = "DONE";
    btn.classList.remove("done");
  }
}


/* ================= SUPPORT ================= */

function confusedHelp() {
  alert("You are safe.\nFollow your routine.\nEverything is okay.");
}

function goPeople() {
  window.location.href = "people.html";
}


/* ================= AUTO CHECKS ================= */

setInterval(() => {
  loadMealDetails();
  loadRestDetails();
  checkWaterTask();
  loadMedicineDetails();
}, 60000);


/* ================= ON LOAD ================= */

window.onload = function () {
  resetMedicinesIfNewDay();   // 👈 Add this line

  loadMedicineDetails();
  loadMealDetails();
  loadRestDetails();
  checkWaterTask();
};
function logout() {
    localStorage.removeItem("sessionActive");   // ✅ ONLY remove session
    window.location.href = "caregiver-register.html";
}

function goToVerify() {
    window.location.href = "verify-caregiver.html";
}

function loadMealDetails() {
  const meal = getCurrentMeal();
  const btn = document.querySelector(".meal-btn");

  if (!meal) return;

  if (btn) {
    if (meal.done) {
      btn.innerText = "✔";
      btn.classList.add("done");
    } else {
      btn.innerText = "DONE";
      btn.classList.remove("done");
    }
  }
}

function loadRestDetails() {
  const rest = getCurrentRest();
  const btn = document.querySelector(".rest-btn");

  if (!rest) return;

  if (btn) {
    if (rest.done) {
      btn.innerText = "✔";
      btn.classList.add("done");
    } else {
      btn.innerText = "DONE";
      btn.classList.remove("done");
    }
  }
}
function checkReminders() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    let data = getCaregiverData();
    let updated = false;

    // 🔔 Medicine Reminder
    data.medicines.forEach(med => {
        if (med.time === currentTime && !med.done && !med.alerted) {
            triggerReminder("💊 Time to take: " + med.name);
            med.alerted = true;
            updated = true;
        }
    });

    // 🔔 Meal Reminder
    data.meals.forEach(meal => {
        if (meal.time === currentTime && !meal.done && !meal.alerted) {
            triggerReminder("🍽️ Time for: " + meal.name);
            meal.alerted = true;
            updated = true;
        }
    });

    // 🔔 Rest Reminder
    data.rests.forEach(rest => {
        if (rest.time === currentTime && !rest.done && !rest.alerted) {
            triggerReminder("😴 Time for: " + rest.name);
            rest.alerted = true;
            updated = true;
        }
    });

    if (updated) {
        saveCaregiverData(data);
    }
}
function triggerReminder(message) {
    alert(message);

    const sound = document.getElementById("alarmSound");

    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.log("Sound play blocked:", error);
        });
    }

    if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500]);
    }
}

document.addEventListener("click", function () {
    if (!audioUnlocked) {
        const sound = document.getElementById("alarmSound");
        if (sound) {
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
                audioUnlocked = true;
                console.log("Audio unlocked");
            }).catch(() => {
                console.log("Audio blocked");
            });
        }
    }
});
