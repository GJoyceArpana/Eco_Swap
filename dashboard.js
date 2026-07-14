document.addEventListener("DOMContentLoaded", () => {
  // ===== Theme Toggle =====
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("icon-sun");
  const moonIcon = document.getElementById("icon-moon");
  const body = document.body;

  function updateThemeIcon() {
    if (body.classList.contains("dark")) {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    } else {
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    }
  }

  // Initialize theme from localStorage
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
  }
  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
    updateThemeIcon();
  });

  // ===== Profile Image Upload =====
  const profileImage = document.getElementById("profile-image");
  const profileImageInput = document.getElementById("profile-image-input");

  profileImage.addEventListener("click", () => {
    const isEditMode = !document.getElementById("edit-profile").classList.contains("hidden");
    if (isEditMode) {
      profileImageInput.click();
    }
  });

  profileImageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  // ===== Profile Form Edit/Save =====
  const form = document.getElementById("profile-form");
  const saveBtn = document.getElementById("save-profile");
  const editBtn = document.getElementById("edit-profile");
  const inputs = form.querySelectorAll("input, select, textarea");

  function setFormEditable(editable) {
    inputs.forEach((input) => {
      if (input.id === "profile-image-input") return; // Skip hidden file input
      if (editable) {
        input.removeAttribute("disabled");
      } else {
        input.disabled = true;
      }
    });
  }

  function toggleEditMode(enable) {
    setFormEditable(enable);
    saveBtn.classList.toggle("hidden", !enable);
    editBtn.classList.toggle("hidden", enable);
    profileImage.style.cursor = enable ? "pointer" : "default";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Collect form data
    const profileData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      gender: document.getElementById("gender").value,
      birthday: document.getElementById("birthday").value,
      about: document.getElementById("about").value,
    };

    // Save to localStorage (or Firebase in the future)
    localStorage.setItem("userProfile", JSON.stringify(profileData));
    
    console.log("Profile saved:", profileData);
    alert("Profile saved successfully!");

    toggleEditMode(false);
  });

  editBtn.addEventListener("click", () => {
    toggleEditMode(true);
  });

  // ===== Load Profile Data =====
  function loadProfileData() {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      try {
        const profileData = JSON.parse(saved);
        document.getElementById("name").value = profileData.name || "";
        document.getElementById("email").value = profileData.email || "";
        document.getElementById("phone").value = profileData.phone || "";
        document.getElementById("gender").value = profileData.gender || "";
        document.getElementById("birthday").value = profileData.birthday || "";
        document.getElementById("about").value = profileData.about || "";
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
  }

  // Initialize
  loadProfileData();
  toggleEditMode(false);
});
