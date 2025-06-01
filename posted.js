import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore, collection, getDocs
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWQIJirF6ap5HOE55yNL_zTiZWTzS-luo",
  authDomain: "ecoswap-4db13.firebaseapp.com",
  projectId: "ecoswap-4db13",
  storageBucket: "ecoswap-4db13.appspot.com",
  messagingSenderId: "184392888367",
  appId: "1:184392888367:web:6986d2bd7bd8c97c9f16da",
  measurementId: "G-X94Q876C3D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function fetchUserItems(userId, searchTerm = "") {
  const userItemsCol = collection(db, `users/${userId}/postItems`);
  const snapshot = await getDocs(userItemsCol);
  const items = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    const matchSearch = !searchTerm || (
      data.itemName && data.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchSearch) {
      items.push({ id: doc.id, ...data });
    }
  });

  return items;
}

function displayItemsGroupedByDate(items) {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  const grouped = {};

  items.forEach(item => {
    const date = item.createdAt?.toDate?.().toLocaleDateString() || "Unknown Date";
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });

  for (const [date, itemList] of Object.entries(grouped)) {
    const dateSection = document.createElement("div");
    dateSection.className = "mb-6";

    const dateHeader = document.createElement("h2");
    dateHeader.textContent = date;
    dateHeader.className = "text-xl font-bold mb-2 text-blue-700";
    dateSection.appendChild(dateHeader);

    itemList.forEach(item => {
      const card = document.createElement("div");
      card.className = "border border-gray-200 rounded p-4 mb-2 shadow-sm bg-gray-50 cursor-pointer hover:bg-blue-50 transition";
        card.addEventListener("click", () => {
            window.location.href = `requestusers.html?itemId=${item.id}`; // 🔥 navigate to requestusers.html
        });

        // Create card title separately so we can append the green circle dynamically
        const title = document.createElement("h3");
        title.className = "text-lg font-semibold inline-flex items-center";
        title.textContent = item.itemName;

        if (item.accepted) {
        const circle = document.createElement("span");
        circle.className = "ml-2 w-3 h-3 rounded-full bg-green-500 inline-block";
        title.appendChild(circle);
        }

        // Create the rest of the content
        const desc = document.createElement("p");
        desc.className = "text-sm text-gray-600";
        desc.textContent = `Description: ${item.description || "No description"}`;

        const cond = document.createElement("p");
        cond.className = "text-sm text-gray-500";
        cond.textContent = `Condition: ${item.itemCondition || "Unknown"}`;

        const act = document.createElement("p");
        act.className = "text-sm text-gray-500";
        act.textContent = `Action: ${item.itemAction || "Unknown"}`;

        const loc = document.createElement("p");
        loc.className = "text-sm text-gray-500";
        loc.textContent = `Location: ${item.location || "N/A"}`;

        // Append all to card
        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(cond);
        card.appendChild(act);
        card.appendChild(loc);
        dateSection.appendChild(card);
    });

    container.appendChild(dateSection);
  }
}


onAuthStateChanged(auth, async (user) => {
  if (user) {
    const items = await fetchUserItems(user.uid);
    displayItemsGroupedByDate(items);

    document.getElementById("searchForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const searchTerm = document.getElementById("searchInput").value.trim();
      const filteredItems = await fetchUserItems(user.uid, searchTerm);
      displayItemsGroupedByDate(filteredItems);
    });
  } else {
    document.getElementById("itemsContainer").innerHTML = `
      <p class="text-center text-gray-600 mt-10">Please log in to see your posted items.</p>
    `;
  }
});
//posted.js