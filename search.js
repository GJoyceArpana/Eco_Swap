import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWQIJirF6ap5HOE55yNL_zTiZWTzS-luo",
  authDomain: "ecoswap-4db13.firebaseapp.com",
  projectId: "ecoswap-4db13",
  storageBucket: "ecoswap-4db13.appspot.com",
  messagingSenderId: "184392888367",
  appId: "1:184392888367:web:6986d2bd7bd8c97c9f16da",
  measurementId: "G-X94Q876C3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;

// Track logged in user
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    currentUser = null;
  }
});

/**
 * Search items by name and show only those that are not accepted yet
 */
export async function searchItem() {
  const itemNameInput = document.getElementById("searchItem");
  const searchTerm = itemNameInput.value.trim().toLowerCase();
  const resultsDiv = document.getElementById("searchResults");

  if (!searchTerm) {
    resultsDiv.innerHTML = `<p style="color:#4b6cb7;">Please enter an item name to search.</p>`;
    return;
  }

  resultsDiv.innerHTML = `<p>Searching...</p>`;

  try {
    const itemsCol = collection(db, "items");
    const snapshot = await getDocs(itemsCol);
    const filteredItems = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      // Check if itemName matches searchTerm
      if (data.itemName && data.itemName.toLowerCase().includes(searchTerm)) {
        const providerUserId = data.userId;

        if (!providerUserId) {
          // If no provider userId, include item by default
          filteredItems.push({ id: docSnap.id, ...data });
          continue;
        }

        // Check accepted field in user's postItems/{itemId}
        const postItemDocRef = doc(db, "users", providerUserId, "postItems", docSnap.id);
        const postItemSnap = await getDoc(postItemDocRef);

        if (postItemSnap.exists()) {
          const postItemData = postItemSnap.data();

          // Include only if accepted !== true
          if (!postItemData.accepted) {
            filteredItems.push({ id: docSnap.id, ...data });
          }
        } else {
          // If postItem doc does not exist, assume not accepted, include
          filteredItems.push({ id: docSnap.id, ...data });
        }
      }
    }

    if (filteredItems.length === 0) {
      resultsDiv.innerHTML = `
        <p style="color:#4b6cb7;">No items found matching "${searchTerm}" or all matching items have been accepted.</p>
        <button 
  onclick="window.location.href='reqitem.html?item=${encodeURIComponent(searchTerm)}'" 
  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
>
  Request Item
</button>

        
      `;
    } else {
      resultsDiv.innerHTML = filteredItems.map(item => `
        <div class="provider-box border p-4 mb-4 rounded shadow">
          <p><strong>Item:</strong> ${item.itemName}</p>
          <p><strong>Provider:</strong> ${item.userId || 'Unknown'}</p>
          <p><strong>Location:</strong> ${item.location || 'Not specified'}</p>
          <button onclick="requestItem('${item.id}', '${item.itemName}', '${item.userId || 'Unknown'}')" class="bg-blue-500 text-white px-3 py-1 rounded mt-2 hover:bg-blue-600">Request</button>
        </div>
      `).join('');
    }

  } catch (error) {
    resultsDiv.innerHTML = `<p style="color:red;">Error searching items: ${error.message}</p>`;
  }
}

/**
 * Request the item by adding current user info to requestedBy subcollection
 * @param {string} itemId - Firestore doc id of the item
 * @param {string} itemName - item name (optional for alerts)
 * @param {string} provider - provider userId (optional for alerts)
 */
export async function requestItem(itemId, itemName, provider) {
  if (!currentUser) {
    alert("Please log in to request this item.");
    return;
  }

  try {
    const requesterData = {
      userId: currentUser.uid,
      name: currentUser.displayName || "Anonymous",
      email: currentUser.email || "",
      requestedAt: new Date()
    };

    const requestedByColRef = collection(db, "items", itemId, "requestedBy");

    await addDoc(requestedByColRef, requesterData);

    alert(`Request sent for "${itemName}" from provider "${provider}".`);
  } catch (error) {
    console.error("Error sending request:", error);
    alert("Failed to send request: " + error.message);
  }
}

// Expose the requestItem function globally to call from HTML buttons
window.requestItem = requestItem;
//search.js