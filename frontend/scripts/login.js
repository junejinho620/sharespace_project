document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const rememberMe = document.getElementById('rememberMe');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');

  // Prefill remembered email
  const saved = localStorage.getItem('rememberedEmail');
  if (saved) {
    emailInput.value = saved;
    rememberMe.checked = true;
  }

  // Toggle password visibility
  togglePassword.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePassword.src = isHidden
      ? 'styles/img/hidden.png'
      : 'styles/img/eye.png';
  });

  // Handle login submit
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Basic validations
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return alert('Please enter a valid email');
    }
    if (password.length < 6) {
      return alert('Password must be at least 6 characters');
    }

    // Remember me
    if (rememberMe.checked) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) return alert('❌ ' + data.error);

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', data.user.username || email.split('@')[0]);

      // Onboarding check
      const userRes = await fetch(`/api/users/${data.user.id}`, {
        headers: { Authorization: `Bearer ${data.token}` }
      });

      const { user } = await userRes.json();

      if (!user.username) return window.location.href = 'signup-step3.html';
      if (/*!user.name || */ !user.age || !user.gender) return window.location.href = 'userinfo-step1.html';
      window.location.href = redirect || 'index.html';

    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  });

  // Social-login icon handlers
  document.querySelectorAll('.social-icon').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const icon = el.querySelector('i');
      if (icon.classList.contains('fa-google')) {
        window.location.href = '/api/users/auth/google';
      } else if (icon.classList.contains('fa-facebook')) {
        window.location.href = '/api/users/auth/facebook';
      } else if (icon.classList.contains('fa-apple')) {
        window.location.href = '/api/users/auth/apple';
      }
    });
  });
});