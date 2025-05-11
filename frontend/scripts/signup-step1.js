document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.querySelector('.signup-form');
  const passwordInput = signupForm.querySelector('#password');
  const confirmPasswordInput = signupForm.querySelector('#confirm-password');

  // Inline error element for password matching
  const passwordError = document.createElement('div');
  passwordError.style.color = 'red';
  passwordError.style.fontSize = '13px';
  passwordError.style.marginTop = '4px';

  const confirmPasswordContainer = confirmPasswordInput.closest('.password-container');
  confirmPasswordContainer.insertAdjacentElement('afterend', passwordError);

  // Real-time check for password match
  confirmPasswordInput.addEventListener('input', function () {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    passwordError.textContent = password !== confirmPassword ? "❌ Passwords do not match." : "";
  });

  signupForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Fetch input values
    const email = signupForm.querySelector('#email').value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Reset previous error messages
    passwordError.textContent = "";

    // Validate email
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Validate password length
    if (!validatePassword(password)) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      passwordError.textContent = "❌ Passwords do not match.";
      return;
    }

    try {
      // POST data to backend
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userId", data.user.id); // Store user ID
        localStorage.setItem("userEmail", email); 
        window.location.href = "signup-step2.html";
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred while signing up.");
    }
  });

  // Toggle password visibility
  document.getElementById('togglePassword').addEventListener('click', function () {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.src = type === 'password' ? 'styles/img/eye.png' : 'styles/img/hidden.png';
  });

  document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
    const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    confirmPasswordInput.type = type;
    this.src = type === 'password' ? 'styles/img/eye.png' : 'styles/img/hidden.png';
  });

  // Helper function for email validation
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Helper function for password validation
  function validatePassword(password) {
    return password.length >= 6;
  }
});