function submitRequestForm(event) {
  event.preventDefault();

  // Clear previous errors
  document.querySelectorAll(".error").forEach(e => e.innerText = "");

  // Grab form values
  const category = document.getElementById("reqCategory").value.trim();
  const itemName = document.getElementById("reqItemName").value.trim();
  const description = document.getElementById("reqDescription").value.trim();
  const condition = document.getElementById("reqCondition").value.trim();
  const location = document.getElementById("reqLocation").value.trim();
  const email = document.getElementById("reqEmail").value.trim();
  const phone = document.getElementById("reqPhone").value.trim();

  let hasError = false;

  if (!category) {
    document.getElementById("error-reqCategory").innerText = "Category is required.";
    hasError = true;
  }
  if (!itemName) {
    document.getElementById("error-reqItemName").innerText = "Item name is required.";
    hasError = true;
  }
  if (!description) {
    document.getElementById("error-reqDescription").innerText = "Description is required.";
    hasError = true;
  }
  if (!location) {
    document.getElementById("error-reqLocation").innerText = "Location is required.";
    hasError = true;
  }
  if (!email) {
    document.getElementById("error-reqEmail").innerText = "Email is required.";
    hasError = true;
  }
  if (!phone || phone.length !== 10) {
    document.getElementById("error-reqPhone").innerText = "Enter a valid 10-digit phone number.";
    hasError = true;
  }

  if (hasError) return;

  // Temporarily store in localStorage to show in review
  localStorage.setItem("requestDetails", JSON.stringify({
    category, itemName, description, condition, location, email, phone
  }));

  // Populate review section
  document.getElementById("reviewReqEmail").innerText = email;
  document.getElementById("reviewReqPhone").innerText = phone;
  document.getElementById("reviewReqName").innerText = itemName;

  // Show review section and hide form
  document.getElementById("reqItemForm").style.display = "none";
  document.getElementById("reqReviewSection").style.display = "block";
}

async function finalReqSubmit() {
  const data = JSON.parse(localStorage.getItem("requestDetails"));
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("User not logged in.");
    return;
  }

  const payload = { ...data, userId };

  try {
    const res = await fetch("/submit-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
      alert("Request submitted successfully!");
      localStorage.removeItem("requestDetails");
      window.location.href = "/"; // Redirect to home or success page
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert("Failed to submit your request. Please try again later.");
  }
}
