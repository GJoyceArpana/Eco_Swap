function submitRequestForm(event) {
  event.preventDefault();
  let isValid = true;
  document.querySelectorAll(".error").forEach(e => e.textContent = "");

  const fields = [
    { id: "reqCategory", name: "Category" },
    { id: "reqItemName", name: "Item Name" },
    { id: "reqDescription", name: "Description" },
    { id: "reqLocation", name: "Location" },
    { id: "reqEmail", name: "Email" },
    { id: "reqPhone", name: "Phone" }
  ];

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    const error = document.getElementById(`error-${field.id}`);
    if (!input.value.trim()) {
      error.textContent = `Please enter ${field.name.toLowerCase()}.`;
      isValid = false;
    }
  });

  const email = document.getElementById("reqEmail").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailPattern.test(email)) {
    document.getElementById("error-reqEmail").textContent = "Enter a valid email address.";
    isValid = false;
  }

  const phone = document.getElementById("reqPhone").value.trim();
  const phonePattern = /^\d{10}$/;
  if (phone && !phonePattern.test(phone)) {
    document.getElementById("error-reqPhone").textContent = "Enter a valid 10-digit phone number.";
    isValid = false;
  }

  if (isValid) {
    document.getElementById("reviewReqEmail").textContent = email;
    document.getElementById("reviewReqPhone").textContent = phone;
    document.getElementById("reviewReqName").textContent = document.getElementById("reqItemName").value;
    document.getElementById("reqReviewSection").style.display = "block";
    document.getElementById("reqReviewSection").scrollIntoView({ behavior: "smooth" });
  }
}
function finalReqSubmit() {
  const category = document.getElementById("reqCategory").value;
  const itemName = document.getElementById("reqItemName").value;
  const description = document.getElementById("reqDescription").value;
  const condition = document.getElementById("reqCondition").value;
  const location = document.getElementById("reqLocation").value;
  const email = document.getElementById("reqEmail").value;
  const phone = document.getElementById("reqPhone").value;

  // Validate inputs
  if (!category || !itemName || !description || !condition || !location || !email || !phone) {
    alert("Please fill out all fields before submitting.");
    return;
  }

  const requestData = {
    category,
    itemName,
    description,
    condition,
    location,
    email,
    phone,
    timestamp: new Date().toISOString(),
  };

  fetch("http://localhost:3000/submit-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Request failed");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Success:", data);
      alert("Request submitted successfully!");
      document.getElementById("reqItemForm").reset();
      document.getElementById("reqReviewSection").style.display = "none";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to submit request. Please try again later.");
    });
}

// Optional: Add review functionality
function previewRequest() {
  const category = document.getElementById("reqCategory").value;
  const itemName = document.getElementById("reqItemName").value;
  const description = document.getElementById("reqDescription").value;
  const condition = document.getElementById("reqCondition").value;
  const location = document.getElementById("reqLocation").value;
  const email = document.getElementById("reqEmail").value;
  const phone = document.getElementById("reqPhone").value;

  if (!category || !itemName || !description || !condition || !location || !email || !phone) {
    alert("Please fill out all fields before previewing.");
    return;
  }

  document.getElementById("reviewCategory").textContent = category;
  document.getElementById("reviewItemName").textContent = itemName;
  document.getElementById("reviewDescription").textContent = description;
  document.getElementById("reviewCondition").textContent = condition;
  document.getElementById("reviewLocation").textContent = location;
  document.getElementById("reviewEmail").textContent = email;
  document.getElementById("reviewPhone").textContent = phone;

  document.getElementById("reqReviewSection").style.display = "block";
}
