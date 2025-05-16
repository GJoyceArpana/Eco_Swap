// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAWQIJirF6ap5HOE55yNL_zTiZWTzS-luo",
    authDomain: "ecoswap-4db13.firebaseapp.com",
    projectId: "ecoswap-4db13",
    storageBucket: "ecoswap-4db13.firebasestorage.app",
    messagingSenderId: "184392888367",
    appId: "1:184392888367:web:6986d2bd7bd8c97c9f16da",
    measurementId: "G-X94Q876C3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle login form submit
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    alert("Login successful! Welcome back, " + user.email);
    // Redirect or show user dashboard here
  } catch (error) {
    console.error("Login error:", error.message);
    alert("Login failed: " + error.message);
  }
});