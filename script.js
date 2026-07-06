import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from "./firebase.js";

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const status = document.getElementById("status");

const TIMER_DURATION = 60 * 60; // 60 دقیقه (ثانیه)

const timerRef = ref(db, "sharedTimer");

let interval = null;

// 🚀 شروع تایمر
startBtn.onclick = () => {
    const endTime = Date.now() + TIMER_DURATION * 1000;

    set(timerRef, {
        endTime: endTime
    });

    status.innerText = "تایمر شروع شد!";
};

// 👂 گوش دادن همه دستگاه‌ها
onValue(timerRef, (snapshot) => {
    const data = snapshot.val();
    if (!data || !data.endTime) return;

    const endTime = data.endTime;

    // جلوگیری از چند interval همزمان
    if (interval) clearInterval(interval);

    function updateTimer() {
        const remaining = Math.floor((endTime - Date.now()) / 1000);

        if (remaining <= 0) {
            timerEl.innerText = "00:00";
            clearInterval(interval);
            interval = null;
            return;
        }

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        timerEl.innerText =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");
    }

    // اجرا فوری (بدون انتظار 1 ثانیه)
    updateTimer();

    // آپدیت هر 1 ثانیه
    interval = setInterval(updateTimer, 1000);
});
