import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔴 اینجا اطلاعات Firebase خودت را قرار می‌دهی
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// دیتابیس
export const db = getDatabase(app);