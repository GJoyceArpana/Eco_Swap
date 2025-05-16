const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebaseauthenti.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Firestore database reference

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // serve static files like HTML/CSS

// Multer configuration for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve HTML page (newitems.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "newitems.html"));
});

// Handle item submission
app.post("/submit-item", upload.array("images", 4), async (req, res) => {
  try {
    const {
      itemName,
      itemDescription,
      itemCategory,
      itemCondition,
      itemAction,
      location,
      email,
      phone,
      userId,
    } = req.body;

    const images = req.files;

    const itemData = {
      itemName,
      itemDescription,
      itemCategory,
      itemCondition,
      itemAction,
      location,
      email,
      phone,
      userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      imageCount: images.length,
    };

    // Save item data in Firestore
    await db.collection("items").add(itemData);

    res.status(200).json({ success: true, message: "Item stored in Firestore!" });
  } catch (error) {
    console.error("Error submitting item:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`EcoSwap server running at http://localhost:${PORT}`);
});
