// scripts/navbar.js
document.addEventListener('DOMContentLoaded', () => {
  // load header & then set up links
  loadComponent('header-placeholder', 'components/header.html').then(renderNavLinks);
  // load footer
  loadComponent('footer-placeholder', 'components/footer.html');
});

async function loadComponent(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(url);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(`Failed to load ${url}:`, err);
  }
}

async function renderNavLinks() {
  const navLinks = document.getElementById('nav-links');
  const authActions = document.getElementById('auth-actions');
  if (!navLinks) return;
  const token = localStorage.getItem('token');
  if (!token) {
    navLinks.innerHTML = `
      <li><a href="dashboard.html">Dashboard</a></li>
      <li><a href="browse.html">Browse Matches</a></li>
      <li><a href="messages.html">Messages</a></li>
    `;
    authActions.innerHTML = `
      <a href="login.html" class="login-link">
        <img src="styles/img/index/Vector.png" class="login-icon" alt="Login Icon" />
        Login / Register
      </a>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    `;
    return;
  }
  try {
    const res = await fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    const { user } = await res.json();
    const username = user.username || user.name || user.email.split('@')[0];
    navLinks.innerHTML = `
      <li><a href="dashboard.html">Dashboard</a></li>
      <li><a href="browse.html">Browse Matches</a></li>
      <li><a href="messages.html">Messages</a></li>
    `;
    authActions.innerHTML = `
      <li id="login-li" class="user-dropdown">
        <span class="username">${username} ▼</span>
        <div class="dropdown-content">
          <a href="my-profile.html">My Profile</a>
          <a href="settings.html">Settings</a>
          <a href="#" id="logoutButton">Log Out</a>
        </div>
      </li>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    `;
    document.getElementById('login-li')
      .addEventListener('click', e => {
        if (e.target.id === 'logoutButton') {
          e.preventDefault();
          localStorage.clear();
          renderNavLinks();
        }
      });
  } catch (err) {
    console.error(err);
    localStorage.clear();
    renderNavLinks();
  }
}
