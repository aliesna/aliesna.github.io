import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyDb1qC3qTxi16_caH0GPz4wMsnw94ZRPy0",
  authDomain: "timer-cec7c.firebaseapp.com",
  databaseURL: "https://timer-cec7c-default-rtdb.firebaseio.com",
  projectId: "timer-cec7c",
  storageBucket: "timer-cec7c.firebasestorage.app",
  messagingSenderId: "500563602401",
  appId: "1:500563602401:web:359556facfb864141880a0",
  measurementId: "G-1V0V5V1NBZ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");

const DURATION = 60 * 60;

let interval = null;

/* 🔥 این مهمه: وضعیت واقعی تایمر */
let endTime = parseInt(localStorage.getItem("endTime"));
let isRunning = localStorage.getItem("running") === "true";

/* نمایش */
function updateDisplay(seconds) {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    timeEl.textContent = `${m}:${s.toString().padStart(2, "0")}`;
}

/* 🚫 قفل کامل Start */
function lockStart() {
    startBtn.disabled = true;
    startBtn.style.opacity = "0.5";
}

/* 🔓 آزاد کردن Start */
function unlockStart() {
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
}

/* شروع تایمر */
function startTimer() {
    // 🚫 اگر قبلاً اجرا شده، اجازه نده
    if (isRunning) return;

    const now = Date.now();
    endTime = now + DURATION * 1000;

    localStorage.setItem("endTime", endTime);
    localStorage.setItem("running", "true");

    isRunning = true;

    lockStart();

    interval = setInterval(() => {
        const remaining = Math.floor((endTime - Date.now()) / 1000);

        if (remaining <= 0) {
            clearInterval(interval);
            interval = null;

            localStorage.removeItem("endTime");
            localStorage.removeItem("running");

            isRunning = false;

            updateDisplay(0);
            unlockStart();
            return;
        }

        updateDisplay(remaining);
    }, 1000);

    /* Firebase sync */
    set(ref(db, "timer"), {
        endTime: endTime,
        running: true
    });
}

/* ادامه بعد از رفرش */
if (isRunning && endTime) {
    lockStart();

    interval = setInterval(() => {
        const remaining = Math.floor((endTime - Date.now()) / 1000);

        if (remaining <= 0) {
            clearInterval(interval);
            interval = null;

            localStorage.removeItem("endTime");
            localStorage.removeItem("running");

            isRunning = false;

            updateDisplay(0);
            unlockStart();
            return;
        }

        updateDisplay(remaining);
    }, 1000);
}

/* دکمه */
startBtn.addEventListener("click", startTimer);
