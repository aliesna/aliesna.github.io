import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from "./firebase.js";

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const status = document.getElementById("status");

const TIMER_DURATION = 60 * 60 * 1000;

const timerRef = ref(db, "sharedTimer");

let interval = null;

// ⏱ تایمر
function startTimer(endTime) {

    if (interval) clearInterval(interval);

    function update() {
        const remaining = Math.floor((endTime - Date.now()) / 1000);

        if (remaining <= 0) {
            timerEl.innerText = "00:00";
            startBtn.disabled = false;
            startBtn.innerText = "Start";

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

// 🚀 شروع تایمر (فقط یک بار)
startBtn.onclick = () => {

    // اگر قبلاً شروع شده → اجازه نده
    if (startBtn.disabled) return;

    const endTime = Date.now() + TIMER_DURATION;

    set(timerRef, {
        endTime: endTime
    });

    localStorage.setItem("endTime", endTime);

    startBtn.disabled = true;
    startBtn.innerText = "Running...";

    status.innerText = "تایمر شروع شد!";
};

// 👂 گرفتن از Firebase
onValue(timerRef, (snapshot) => {
    const data = snapshot.val();

    if (!data || !data.endTime) return;

    const endTime = data.endTime;

    localStorage.setItem("endTime", endTime);

    startBtn.disabled = true;
    startBtn.innerText = "Running...";

    startTimer(endTime);
});

// 🔄 اگر رفرش شد
const saved = localStorage.getItem("endTime");

if (saved) {
    startBtn.disabled = true;
    startBtn.innerText = "Running...";

    startTimer(Number(saved));
}
