document.addEventListener('DOMContentLoaded', async () => {
  const headerPlaceholder = document.getElementById('header-placeholder');

  try {
    const res = await fetch('/components/header.html');
    const html = await res.text();
    headerPlaceholder.innerHTML = html;
    renderNavLinks();
  } catch (err) {
    console.error('Failed to load header:', err);
  }
});

function renderNavLinks() {
  const navLinks = document.getElementById('nav-links');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username') || 'User';

  if (!navLinks) return;

  if (isLoggedIn) {
    navLinks.innerHTML = `
      <li><a href="dashboard.html">Dashboard</a></li>
      <li><a href="browse.html">Browse Matches</a></li>
      <li><a href="messages.html">Messages</a></li>
      <li id="login-li" class="user-dropdown">
        <span class="username">${username} ▼</span>
        <div class="dropdown-content">
          <a href="profile.html">My Profile</a>
          <a href="settings.html">Settings</a>
          <a href="#" id="logoutButton">Log Out</a>
        </div>
      </li>
    `;

    const loginLi = document.getElementById('login-li');
    loginLi.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'logoutButton') {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        loginLi.classList.remove('user-dropdown');
        loginLi.innerHTML = `<a href="login.html" class="login">Log in</a>`;
      }
    });
  } else {
    navLinks.innerHTML = `
    <li><a href="dashboard.html">Dashboard</a></li>
    <li><a href="browse.html">Browse Matches</a></li>
    <li><a href="messages.html">Messages</a></li>
    <li class="user-dropdown">
    <li><a href="login.html" class="login">Log in</a></li>
  `;
  }
}
