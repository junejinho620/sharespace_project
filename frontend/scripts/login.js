document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  const emailInput = document.getElementById('email');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  // If email is stored, prefill it and check the box
  if (localStorage.getItem('rememberedEmail')) {
    emailInput.value = localStorage.getItem('rememberedEmail');
    rememberMeCheckbox.checked = true;
  }

  // Handle login submit
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!validateEmail(email)) {
      highlightError(passwordInput);
      return;
    }

    if (!validatePassword(password)) {
      highlightError(passwordInput);
      return;
    }

    if (rememberMeCheckbox.checked) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
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
        localStorage.setItem("username", data.user.username || data.user.name || email.split('@')[0]);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);

        // Check if user has completed onboarding
        const userId = data.user.id;
        const token = data.token;

        const userInfoResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        const userInfoData = await userInfoResponse.json();

        if (userInfoResponse.ok) {
          const user = userInfoData.user;

          if (!user.username) {
            window.location.href = "user-name.html";
          } else if (!user.name || !user.age || !user.gender) {
            window.location.href = "user-info.html";
          } else {
            window.location.href = "index.html";  // User has completed onboarding
          }
        } else {
          alert("Could not verify user info. Redirecting to onboarding.");
          window.location.href = "user-name.html";
        }

      } else {
        alert("❌ " + data.error);
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    }
  });

  togglePassword.addEventListener('click', function () {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.src = type === 'password' ? 'styles/img/eye.png' : 'styles/img/hidden.png';
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
});