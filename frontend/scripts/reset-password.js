// Get token from URL
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

// DOM Elements
const resetForm = document.getElementById("reset-password-form");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");

// Create inline error message container for same password
const formError = document.createElement('div');
formError.style.color = 'red';
formError.style.fontSize = '14px';
formError.style.marginTop = '15px';
formError.style.textAlign = 'center';  // center under button
formError.style.transition = 'opacity 0.3s ease';
formError.style.opacity = '0'; // Start hidden

resetForm.appendChild(formError);

// Create inline error message
const passwordError = document.createElement('div');
passwordError.style.color = 'red';
passwordError.style.fontSize = '13px';
passwordError.style.marginTop = '4px';

// Attach error under confirm-password field, outside the password-container
const confirmPasswordGroup = confirmPasswordInput.closest('.form-group');
confirmPasswordGroup.appendChild(passwordError);

// Real-time validation
confirmPasswordInput.addEventListener('input', function () {
  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();
  if (newPassword !== confirmPassword) {
    passwordError.textContent = "❌ Passwords do not match.";
  } else {
    passwordError.textContent = "";
  }
});

// Handle Form Submit
resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  // Clear previous error
  passwordError.textContent = "";

  if (!validatePassword(newPassword)) {
    passwordError.textContent = "❌ Password must be at least 6 characters long.";
    return;
  }

  if (newPassword !== confirmPassword) {
    passwordError.textContent = "❌ Passwords do not match.";
    return;
  }

  try {
    const res = await fetch("http://localhost:5001/api/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword })
    });
    const data = await res.json();

    if (res.ok) {
      window.location.href = "login.html";
    } else {
      formError.textContent = `❌ ${data.error}`;
      formError.style.opacity = '1';

      // Automatically hide the error after 5 seconds
      setTimeout(() => {
        formError.style.opacity = '0';
        formError.textContent = '';
      }, 5001);
    }
  } catch (err) {
    formError.textContent = "❌ Something went wrong. Please try again.";
    formError.style.opacity = '1';
    
    setTimeout(() => {
      formError.style.opacity = '0';
      formError.textContent = '';
    }, 5001);
  }
});

// Password validation
function validatePassword(password) {
  return password.length >= 6;
}

// Show/hide password
document.addEventListener('DOMContentLoaded', function () {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('new-password');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const confirmPasswordInput = document.getElementById('confirm-password');

  togglePassword.addEventListener('click', function () {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.src = type === 'password' ? 'styles/img/eye.png' : 'styles/img/hidden.png';
  });

  toggleConfirmPassword.addEventListener('click', function () {
    const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    confirmPasswordInput.type = type;
    this.src = type === 'password' ? 'styles/img/eye.png' : 'styles/img/hidden.png';
  });
});