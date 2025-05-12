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

async function renderNavLinks() {
  const navLinks = document.getElementById('nav-links');
  const token = localStorage.getItem('token');

  if (!navLinks) return;

  if (!token) {
    // Not logged in
    navLinks.innerHTML = `
      <li><a href="dashboard.html">Dashboard</a></li>
      <li><a href="browse.html">Browse Matches</a></li>
      <li><a href="messages.html">Messages</a></li>
      <li><a href="login.html" class="login">Log in</a></li>
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
      <li id="login-li" class="user-dropdown">
        <span class="username">${username} ▼</span>
        <div class="dropdown-content">
          <a href="my-profile.html">My Profile</a>
          <a href="settings.html">Settings</a>
          <a href="#" id="logoutButton">Log Out</a>
        </div>
      </li>
    `;

    const loginLi = document.getElementById('login-li');
    loginLi.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'logoutButton') {
        e.preventDefault();
        localStorage.clear();
        loginLi.classList.remove('user-dropdown');
        loginLi.innerHTML = `<a href="login.html" class="login">Log in</a>`;
      }
    });
  } catch (err) {
    // Token is invalid or expired
    localStorage.clear();
    navLinks.innerHTML = `
      <li><a href="dashboard.html">Dashboard</a></li>
      <li><a href="browse.html">Browse Matches</a></li>
      <li><a href="messages.html">Messages</a></li>
      <li><a href="login.html" class="login">Log in</a></li>
    `;
  }
}