import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from "./firebase.js";

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const status = document.getElementById("status");

const TIMER_DURATION = 60 * 60 * 1000; // 60 دقیقه (میلی‌ثانیه)

const timerRef = ref(db, "sharedTimer");

let interval = null;

function startTimer(endTime) {

    if (interval) clearInterval(interval);

    function update() {
        const remaining = Math.floor((endTime - Date.now()) / 1000);

        if (remaining <= 0) {
            timerEl.innerText = "00:00";
            clearInterval(interval);
            interval = null;

            // پاک کردن local
            localStorage.removeItem("endTime");
            return;
        }

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        timerEl.innerText =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");
    }

    update();
    interval = setInterval(update, 1000);
}

// 🚀 شروع تایمر (ارسال به Firebase + ذخیره local)
startBtn.onclick = () => {
    const endTime = Date.now() + TIMER_DURATION;

    // Firebase (برای چند دستگاه)
    set(timerRef, {
        endTime: endTime
    });

    // LocalStorage (برای backup و رفرش)
    localStorage.setItem("endTime", endTime);

    status.innerText = "تایمر شروع شد!";
};

// 👂 گرفتن از Firebase (منبع اصلی)
onValue(timerRef, (snapshot) => {
    const data = snapshot.val();

    if (!data || !data.endTime) return;

    const endTime = data.endTime;

    // sync با localStorage
    localStorage.setItem("endTime", endTime);

    startTimer(endTime);
});

// 🔄 اگر اینترنت نبود یا سریع لود شد
const saved = localStorage.getItem("endTime");

if (saved) {
    startTimer(Number(saved));
}
