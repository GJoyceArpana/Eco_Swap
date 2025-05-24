// Sample dynamic data
const tabs = [
  "Profile",
  "Request Item",
  "Add Item",
  "Settings",
  "Chat",
];

const requestedItems = [
  "Lawn Mower",
  "Bicycle",
  "Camera Lens",
  "Camping Tent",
  "Bluetooth Speaker",
];

const addedItems = [
  "Winter Jacket",
  "Laptop Stand",
  "Bookshelf",
  "Smartphone Charger",
  "Desk Lamp",
];

const topProducts = [
  "Smartphones",
  "Bookshelves",
  "Laptops",
  "Jackets",
  "Chairs",
];

// Helper: Render tab buttons dynamically
function renderTabs(filter = "") {
  const tabContainer = document.getElementById("tabButtons");
  tabContainer.innerHTML = "";
  const filteredTabs = tabs.filter((tab) =>
    tab.toLowerCase().includes(filter.toLowerCase())
  );
  filteredTabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.textContent = tab;
    btn.addEventListener("click", () => {
      setActiveTab(tab);
    });
    tabContainer.appendChild(btn);
  });
}

// Set active tab style and load related content
function setActiveTab(tabName) {
  const buttons = document.querySelectorAll(".tab-btn:not(.signout)");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.textContent === tabName);
  });
  // You can expand to load different content per tab if desired
}

// Render requested and added items with filtering
function renderItemList(listId, items, filter = "") {
  const listEl = document.getElementById(listId);
  listEl.innerHTML = "";
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(filter.toLowerCase())
  );
  if (filteredItems.length === 0) {
    listEl.innerHTML = "<li>No matching items found.</li>";
    return;
  }
  filteredItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    listEl.appendChild(li);
  });
}

// Render top products list
function renderTopProducts() {
  const listEl = document.getElementById("topProductsList");
  listEl.innerHTML = "";
  topProducts.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = product;
    listEl.appendChild(li);
  });
}

// Live search for tabs
document.getElementById("tabSearch").addEventListener("input", (e) => {
  renderTabs(e.target.value);
});

// Live search for requested and added items combined (filters both lists)
document.getElementById("itemSearch").addEventListener("input", (e) => {
  const filter = e.target.value;
  renderItemList("requestedItemsList", requestedItems, filter);
  renderItemList("addedItemsList", addedItems, filter);
});

// Chat functionality
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && chatInput.value.trim() !== "") {
    addChatMessage("You", chatInput.value.trim());
    chatInput.value = "";
    // Simulate bot reply
    setTimeout(() => {
      addChatMessage("Bot", "Thanks for your message!");
    }, 800);
  }
});

function addChatMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Chart.js Charts Setup
function initCharts() {
  const monthlyUsageCtx = document.getElementById("monthlyUsageChart").getContext("2d");
  const activityCtx = document.getElementById("activityChart").getContext("2d");
  const requestedItemsCtx = document.getElementById("requestedItemsChart").getContext("2d");
  const addedItemsCtx = document.getElementById("addedItemsChart").getContext("2d");
  const categoryCtx = document.getElementById("categoryChart").getContext("2d");

  // Monthly Usage Chart
  new Chart(monthlyUsageCtx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Usage",
          data: [30, 50, 40, 60, 70, 55, 65],
          backgroundColor: "#4b6cb7",
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  // Activity Breakdown (Doughnut)
  new Chart(activityCtx, {
    type: "doughnut",
    data: {
      labels: ["Lend", "Donation", "Swap"],
      datasets: [
        {
          data: [35, 45, 20],
          backgroundColor: ["#4b6cb7", "#8fbedf", "#d9e7fb"],
          borderWidth: 0,
        },
      ],
    },
    options: {
    scales: {
      x: {
        ticks: {
          display: false,  // hides labels on x-axis
          drawBorder: false,
        },
        grid: {
          display: false, // optionally hide grid lines too
        }
      },
      y: {
        ticks: {
          display: false,  // hides labels on y-axis
          drawBorder: false,
        },
        grid: {
          display: false,
        }
      }
    },
    cutout: "70%",
    plugins: {
  legend: {
    display: true,
    position: "right",
    labels: {
      boxWidth: 20,
      padding: 20,
    },
  },
},

  }
});

  // Requested Items Chart (Line)
new Chart(requestedItemsCtx, {
  type: "line",
  data: {
    labels: requestedItems,
    datasets: [
      {
        label: "Requested Items",
        data: requestedItems.map(() => Math.floor(Math.random() * 30) + 5),
        borderColor: "#4b6cb7",
        backgroundColor: "rgba(75, 108, 183, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  },
  
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
    },
  });

  new Chart(addedItemsCtx, {
  type: "line",
  data: {
    labels: addedItems,
    datasets: [
      {
        label: "Added Items",
        data: addedItems.map(() => Math.floor(Math.random() * 30) + 5),
        borderColor: "#8fbedf",
        backgroundColor: "rgba(143, 190, 223, 0.3)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
    },
  });

  // Category Breakdown Chart (Radar)
  new Chart(categoryCtx, {
    type: "radar",
    data: {
      labels: ["Electronics", "Furniture", "Clothing", "Books", "Others"],
      datasets: [
        {
          label: "Category Usage",
          data: [65, 59, 90, 81, 56],
          fill: true,
          backgroundColor: "rgba(75,108,183,0.3)",
          borderColor: "#4b6cb7",
          pointBackgroundColor: "#4b6cb7",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { color: "#ccc" },
          grid: { color: "#eee" },
          pointLabels: { color: "#555" },
          ticks: { beginAtZero: true, max: 100 },
        },
      },
      plugins: { legend: { display: false } },
    },
  });
}

// Initialization function to setup everything
function init() {
  renderTabs();
  setActiveTab(tabs[0]);
  renderItemList("requestedItemsList", requestedItems);
  renderItemList("addedItemsList", addedItems);
  renderTopProducts();
  initCharts();
}

// Run init when DOM is ready
document.addEventListener("DOMContentLoaded", init);
