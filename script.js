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

/* عناصر صفحه */
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");

/* تنظیمات تایمر */
const DURATION = 60 * 60; // 60 دقیقه
let interval = null;
let endTime = localStorage.getItem("endTime");

/* نمایش زمان */
function updateDisplay(seconds) {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    timeEl.textContent = `${m}:${s.toString().padStart(2, "0")}`;
}

/* شروع تایمر */
function startTimer(savedEndTime = null) {
    if (interval) return; // جلوگیری از چند بار اجرا

    const now = Date.now();
    endTime = savedEndTime || (now + DURATION * 1000);

    localStorage.setItem("endTime", endTime);
    localStorage.setItem("running", "true");

    startBtn.disabled = true;

    interval = setInterval(() => {
        const remaining = Math.floor((endTime - Date.now()) / 1000);

        if (remaining <= 0) {
            clearInterval(interval);
            interval = null;

            localStorage.removeItem("endTime");
            localStorage.removeItem("running");

            updateDisplay(0);
            startBtn.disabled = false;
            return;
        }

        updateDisplay(remaining);
    }, 1000);

    /* ذخیره در Firebase */
    set(ref(db, "timer"), {
        endTime: endTime
    });
}

/* ادامه تایمر بعد از رفرش */
if (localStorage.getItem("running") === "true" && endTime) {
    startTimer(parseInt(endTime));
}

/* دکمه استارت */
startBtn.addEventListener("click", () => {
    startTimer();
});
