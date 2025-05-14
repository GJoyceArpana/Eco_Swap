let uploadedImages = [];

function handleImageUpload(event) {
  const files = Array.from(event.target.files);
  const errorField = document.getElementById("error-itemPhotos");
  const previewContainer = document.getElementById("imagePreviewContainer");

  if ((uploadedImages.length + files.length) > 4) {
    errorField.textContent = "You can only upload up to 4 images.";
    return;
  }

  errorField.textContent = "";

  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const imageId = Date.now() + Math.random();
      uploadedImages.push({ id: imageId, file: file });

      const preview = document.createElement("div");
      preview.className = "image-preview";
      preview.dataset.id = imageId;

      const img = document.createElement("img");
      img.src = e.target.result;

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.innerHTML = "×";
      removeBtn.onclick = () => removeImage(imageId);

      preview.appendChild(img);
      preview.appendChild(removeBtn);
      previewContainer.appendChild(preview);
    };
    reader.readAsDataURL(file);
  });

  event.target.value = '';
}

function removeImage(imageId) {
  uploadedImages = uploadedImages.filter(img => img.id !== imageId);
  const imageDiv = document.querySelector(`.image-preview[data-id='${imageId}']`);
  if (imageDiv) imageDiv.remove();
}

function submitForm(event) {
  event.preventDefault();
  let isValid = true;

  // Clear previous errors
  document.querySelectorAll(".error").forEach(e => e.textContent = "");

  const fields = [
    { id: "category", name: "Category" },
    { id: "itemName", name: "Item Name" },
    { id: "description", name: "Description" },
    { id: "location", name: "Location" },
    { id: "email", name: "Email" },
    { id: "phone", name: "Phone" },
    { id: "itemCondition", name: "Condition" },
    { id: "itemAction", name: "Action" }
  ];

  // Basic non-empty check
  fields.forEach(field => {
    const input = document.getElementById(field.id);
    const error = document.getElementById(`error-${field.id}`);
    if (!input.value.trim()) {
      error.textContent = `Please enter ${field.name.toLowerCase()}.`;
      isValid = false;
    }
  });

  // Email pattern check
  const email = document.getElementById("email").value.trim();
  const emailError = document.getElementById("error-email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailPattern.test(email)) {
    emailError.textContent = "Enter a valid email address.";
    isValid = false;
  }

  // Phone number pattern check
  const phone = document.getElementById("phone").value.trim();
  const phoneError = document.getElementById("error-phone");
  const phonePattern = /^\d{10}$/;
  if (phone && !phonePattern.test(phone)) {
    phoneError.textContent = "Enter a valid 10-digit phone number.";
    isValid = false;
  }

  // Image validation
  const imgError = document.getElementById("error-itemPhotos");
  if (uploadedImages.length === 0) {
    imgError.textContent = "Please upload at least one image.";
    isValid = false;
  }

  if (isValid) {
    // Populate review section
    document.getElementById("reviewEmail").textContent = email;
    document.getElementById("reviewPhone").textContent = phone;
    document.getElementById("reviewName").textContent = document.getElementById("itemName").value;

    // Show review section
    document.getElementById("reviewSection").style.display = "block";
    document.getElementById("reviewSection").scrollIntoView({ behavior: "smooth" });
  }
}

function finalSubmit() {
  alert("Item submitted successfully!");
  document.getElementById("itemForm").reset();
  document.getElementById("imagePreviewContainer").innerHTML = "";
  uploadedImages = [];
  document.getElementById("reviewSection").style.display = "none";
}
