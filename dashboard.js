// Tabs with links to pages
const tabs = [
  { name: "Profile", url: "profile.html" },
  { name: "Request Item", url: "reqitem.html" },
  { name: "Add Item", url: "newitem.html" },
  { name: "Settings", url: "settings.html" },
  { name: "Chat", url: "chat.html" },
];

const tabButtonsContainer = document.getElementById('tabButtons');
const tabSearch = document.getElementById('tabSearch');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

// Populate sidebar tabs with filtering
function renderTabs(filter = '') {
  tabButtonsContainer.innerHTML = '';
  const filteredTabs = tabs.filter(tab =>
    tab.name.toLowerCase().includes(filter.toLowerCase())
  );
  filteredTabs.forEach(tab => {
    const button = document.createElement('button');
    button.className = 'tab-btn';
    button.textContent = tab.name;
    button.addEventListener('click', () => {
      window.location.href = tab.url;
    });
    tabButtonsContainer.appendChild(button);
  });
}

tabSearch.addEventListener('input', (e) => {
  renderTabs(e.target.value);
});

renderTabs();



// Sign out button
document.getElementById('signOutBtn').addEventListener('click', () => {
  window.location.href = 'login.html'; 
});
