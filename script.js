import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from "./firebase.js";

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const status = document.getElementById("status");

const TIMER_DURATION = 60 * 60; // 60 دقیقه

let interval;

// مرجع دیتابیس
const timerRef = ref(db, "sharedTimer");

// شروع تایمر
startBtn.onclick = () => {
    const startTime = Date.now();

    set(timerRef, {
        startTime: startTime,
        duration: TIMER_DURATION
    });

    status.innerText = "تایمر شروع شد!";
};

// گوش دادن به تغییرات (همه دستگاه‌ها)
onValue(timerRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) return;

    const startTime = data.startTime;
    const duration = data.duration;

    clearInterval(interval);

    interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = duration - elapsed;

        if (remaining <= 0) {
            timerEl.innerText = "00:00";
            clearInterval(interval);
            return;
        }

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        timerEl.innerText =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

    }, 1000);
});