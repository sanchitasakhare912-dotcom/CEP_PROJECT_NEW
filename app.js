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
  const meds = JSON.parse(localStorage.getItem("medicines")) || [];
  const now = new Date();
  const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  let currentMed = null;

  meds.forEach(med => {
    if (med.time <= currentTime) {
      currentMed = med;
    }
  });

  return currentMed;
}
function getCurrentMeal() {
  const meals = JSON.parse(localStorage.getItem("meals")) || [];
  const now = new Date();
  const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  let currentMeal = null;

  meals.forEach(meal => {
    if (meal.time <= currentTime) {
      currentMeal = meal;
    }
  });

  return currentMeal;
}
function getCurrentRest() {
  const rests = JSON.parse(localStorage.getItem("rests")) || [];
  const now = new Date();
  const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  let currentRest = null;

  rests.forEach(rest => {
    if (rest.time <= currentTime) {
      currentRest = rest;
    }
  });

  return currentRest;
}

/* ================= DAILY RESET ================= */

function resetMedicinesIfNewDay() {
  const today = new Date().toISOString().split("T")[0];
  const lastReset = localStorage.getItem("lastMedicineReset");

  if (lastReset !== today) {
    let meds = JSON.parse(localStorage.getItem("medicines")) || [];

    meds = meds.map(med => {
      med.done = false;
      return med;
    });

    localStorage.setItem("medicines", JSON.stringify(meds));
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
    if (btn) {
      btn.innerText = "DONE";
      btn.classList.remove("done");
    }
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
    localStorage.setItem("waterLastDone", Date.now());
    return;
  }

  if (taskType === "medicine") {
    let meds = JSON.parse(localStorage.getItem("medicines")) || [];
    const current = getCurrentMedicine();

    meds = meds.map(med => {
      if (med.time === current?.time) {
        med.done = true;
      }
      return med;
    });

    localStorage.setItem("medicines", JSON.stringify(meds));

    btn.innerText = "✔";
    btn.classList.add("done");
    return;
  }

  if (taskType === "meal") {
    let meals = JSON.parse(localStorage.getItem("meals")) || [];
    const current = getCurrentMeal();

    meals = meals.map(meal => {
      if (meal.time === current?.time) {
        meal.done = true;
      }
      return meal;
    });

    localStorage.setItem("meals", JSON.stringify(meals));

    btn.innerText = "✔";
    btn.classList.add("done");
    return;
  }

  if (taskType === "rest") {
    let rests = JSON.parse(localStorage.getItem("rests")) || [];
    const current = getCurrentRest();

    rests = rests.map(rest => {
      if (rest.time === current?.time) {
        rest.done = true;
      }
      return rest;
    });

    localStorage.setItem("rests", JSON.stringify(rests));

    btn.innerText = "✔";
    btn.classList.add("done");
    return;
  }
  btn.innerText = "✔";
  btn.classList.add("done");
  const taskTime = localStorage.getItem(taskType + "Time");
  localStorage.setItem(taskType + "LastDone", taskTime);

}

/* ================= RESET LOGIC (MEAL & REST) ================= */

function checkScheduledTask(taskType) {
  const taskTime = localStorage.getItem(taskType + "Time");
  const lastDone = localStorage.getItem(taskType + "LastDone");
  const btn = document.querySelector(`.${taskType}-btn`);

  if (!taskTime || !btn) return;

  if (taskTime === lastDone) {
    btn.innerText = "✔";
    btn.classList.add("done");
  } else {
    btn.innerText = "DONE";
    btn.classList.remove("done");
  }
}


/* ================= WATER RESET ================= */

function checkWaterTask() {
  const lastDone = localStorage.getItem("waterLastDone");
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
