document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');
  
    signupForm.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent form submission
  
      // Get input values
      const email = signupForm.querySelector('#email').value;
      const password = signupForm.querySelector('#password').value;
  
      // Validate inputs
      if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }
  
      if (!validatePassword(password)) {
        alert('Password must be at least 6 characters long.');
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
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function () {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.src = isPassword ? 'styles/hidden.png' : 'styles/eye.png';
});

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('username-form');
  
    form.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const nameInput = form.querySelector('#name');
      const username = nameInput.value.trim();
  
      if (username === '') return;
  
      // Save to localStorage to simulate login
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
  
   // Go to home page
    });
  });