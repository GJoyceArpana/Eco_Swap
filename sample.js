document.addEventListener("DOMContentLoaded", () => {
  window.showRequestSection = async function () {
    const main = document.getElementById("mainContent");
    main.innerHTML = `
      <input type="text" id="searchItem" placeholder="Search item" />
      <button onclick="searchItem()">Search</button>
      <h3>Requested List</h3>
      <div id="requestList"></div>
    `;
    updateRequestList();
  };

  window.searchItem = async function () {
    const itemName = document.getElementById("searchItem").value.trim().toLowerCase();
    const results = document.getElementById("searchResults") || document.createElement("div");
    results.id = "searchResults";
    results.innerHTML = "";
    document.getElementById("mainContent").appendChild(results);

    if (!itemName) return;

    const res = await fetch("/api/items");
    const items = await res.json();

    const matched = items.filter(item => item.itemName.toLowerCase() === itemName);

    if (matched.length === 0) {
      results.innerHTML = `
        <p style="color:#4b6cb7;">Not available</p>
        <button onclick="requestItem('${itemName}')">Request Item</button>
      `;
    } else {
      results.innerHTML = matched.map((item, i) => `
        <div class="provider-box">
          <p>Provider ${i + 1} (${item.email || "unknown"})</p>
          <button onclick="acceptItem('${itemName}', '${item.userId || item.email}')">Request</button>
        </div>
      `).join("");
    }
  };

  window.requestItem = async function (itemName) {
    const userId = prompt("Enter your userId:");
    await fetch("/api/request-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemName, userId })
    });
    alert("Request submitted.");
    showRequestSection();
  };

  window.acceptItem = async function (itemName, provider) {
    await fetch("/api/accept-provider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemName, providerName: provider })
    });

    const main = document.getElementById("mainContent");
    main.innerHTML = `
      <h3>${itemName}</h3>
      <p>Provider: ${provider}</p>
      <a href="chat.html" class="btn" style="background-color: #4b6cb7; color: white; padding: 10px 16px; border-radius: 5px; text-decoration: none;">Chat</a>
    `;
  };

  window.updateRequestList = async function () {
    const res = await fetch("/api/items");
    const items = await res.json();
    const listDiv = document.getElementById("requestList");
    listDiv.innerHTML = "";

    items.forEach(item => {
      const statusClass = item.status === "accepted" ? "status-green" : "status-red";
      listDiv.innerHTML += `
        <div class="item-status">
          <span>${item.itemName}</span>
          <div class="status-dot ${statusClass}"></div>
        </div>
      `;
    });
  };
});
