document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = loginForm.querySelector('#email').value.trim();
    const passwordInput = loginForm.querySelector('#password');
    const password = passwordInput.value;

    if (!validateEmail(email)) {
      highlightError(passwordInput);
      return;
    }

    if (!validatePassword(password)) {
      highlightError(passwordInput);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.user.name || email.split('@')[0]);
        localStorage.setItem("userId", data.user.id);
        window.location.href = 'index.html';
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    }
  });

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function highlightError(inputEl) {
    inputEl.classList.add('error');
    setTimeout(() => inputEl.classList.remove('error'), 2000);
  }

  const forgotPasswordLink = document.querySelector('.forgot-password a');
  forgotPasswordLink.addEventListener('click', function (event) {
    event.preventDefault();
    const email = prompt('Please enter your email to reset your password:');
    if (email && validateEmail(email)) {
      alert(`Password reset instructions have been sent to ${email}.`);
    } else {
      alert('Please enter a valid email address.');
    }
  });
});

// Show/hide password
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
togglePasswordButtons.forEach(button => {
  button.addEventListener('click', function () {
    const passwordInput = this.previousElementSibling;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.textContent = 'Hide Password';
    } else {
      passwordInput.type = 'password';
      this.textContent = 'Show Password';
    }
  });
});