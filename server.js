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

// Serve all static files (HTML, JS, CSS) from root directory
app.use(express.static(__dirname));

// Serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "newitems.html"));
});

app.get("/reqitem", (req, res) => {
  res.sendFile(path.join(__dirname, "reqitem.html"));
});

// Handle new item submission with image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
      userId
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

    await db.collection("items").add(itemData);

    res.status(200).json({ success: true, message: "Item stored in Firestore!" });
  } catch (error) {
    console.error("Error submitting item:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Handle requested item submission
app.post("/submit-request", async (req, res) => {
  try {
    const {
      category,
      itemName,
      description,
      condition,
      location,
      email,
      phone
    } = req.body;

    if (!itemName || !email || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const requestData = {
      category,
      itemName,
      description,
      condition,
      location,
      email,
      phone,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("requested_items").add(requestData);

    res.status(200).json({ success: true, message: "Requested item submitted successfully!" });
  } catch (error) {
    console.error("Error submitting requested item:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`EcoSwap server running at http://localhost:${PORT}`);
});
