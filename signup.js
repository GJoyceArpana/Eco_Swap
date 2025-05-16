// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
const db = getFirestore(app);

// Handle form submit
document.getElementById("signUpForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const location = document.getElementById("location").value.trim();

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extra user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      location: location,
      createdAt: new Date()
    });

    alert("User signed up and profile saved!");
  } catch (error) {
    console.error("Signup error:", error.message);
    alert("Signup failed: " + error.message);
  }
});
