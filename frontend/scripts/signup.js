document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signup-form');
  const passwordInput = signupForm.querySelector('#password');
  const confirmPasswordInput = signupForm.querySelector('#confirm-password');

  // Inline error elements
  const passwordError = document.createElement('div');
  passwordError.style.color = 'red';
  passwordError.style.fontSize = '13px';
  passwordError.style.marginTop = '4px';

  const confirmPasswordGroup = signupForm.querySelector('#confirm-password').closest('.form-group');
  confirmPasswordGroup.appendChild(passwordError);
  
  // Real-time check for password match
  confirmPasswordInput.addEventListener('input', function () {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    if (password !== confirmPassword) {
      passwordError.textContent = "❌ Passwords do not match.";
    } else {
      passwordError.textContent = "";
    }
  });

  signupForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const email = signupForm.querySelector('#email').value;
    const password = signupForm.querySelector('#password').value;
    const confirmPassword = signupForm.querySelector('#confirm-password').value;
    const acceptTerms = signupForm.querySelector('#acceptTerms').checked;
    
    // Reset previous error
    passwordError.textContent = "";

    // Validate inputs
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      passwordError.textContent = "❌ Passwords do not match.";
      return;
    }

    if (!acceptTerms) {
      alert('You must agree to the Terms and Privacy Policy.');
      return;
    }

    try {
      // POST data to backend
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userId", data.user.id); //Store the user's ID for future updates
        alert("✅ Sign-up successful! Please check your email and verify before continuing.");
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred while signing up.");
    }
  });

  // Email validation
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Password validation
  function validatePassword(password) {
    return password.length >= 6;
  }
});

// Show/hide password
document.addEventListener('DOMContentLoaded', function () {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
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