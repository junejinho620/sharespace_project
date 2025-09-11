// scripts/navbar.js
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('header-placeholder', 'components/header.html').then(() => {
    renderNavLinks().then(() => {
      ensureMobileMenu();
      wireNavInteractions();
    });
  });
  loadComponent('footer-placeholder', 'components/footer.html');
});

async function loadComponent(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(url);
    el.innerHTML = await res.text();
    return el;
  } catch (e) {
    console.error('loadComponent failed:', url, e);
  }
}

async function renderNavLinks() {
  const navLinks = document.getElementById('nav-links');
  const authActions = document.getElementById('auth-actions');
  if (!navLinks || !authActions) return;

  const token = localStorage.getItem('token');

  // Common links
  navLinks.innerHTML = `
    <li><a href="dashboard.html">Dashboard</a></li>
    <li><a href="browse.html">Browse Matches</a></li>
    <li><a href="messages.html">Messages</a></li>
  `;

  if (!token) {
    authActions.innerHTML = `
      <a href="login.html" class="login-link">
        <img src="styles/img/index/Vector.png" class="login-icon" alt="Login Icon" />
        Login / Register
      </a>
      <button class="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu">
        <span></span><span></span><span></span>
      </button>
    `;
    return;
  }

  try {
    const res = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Unauthorized');

    const { user } = await res.json();
    const username = user?.username || user?.name || (user?.email || '').split('@')[0] || 'Account';

    authActions.innerHTML = `
      <li id="login-li" class="user-dropdown">
        <button class="user-toggle" aria-haspopup="menu" aria-expanded="false">
          <img src="styles/img/default.jpg" alt="" class="avatar" />
          <span class="username">${username}</span>
          <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </button>
        <div class="dropdown-content" role="menu" aria-label="User">
          <a role="menuitem" href="my-profile.html">My Profile</a>
          <a role="menuitem" href="settings.html">Settings</a>
          <button role="menuitem" class="logout-btn">Log Out</button>
        </div>
      </li>
      <button class="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu">
        <span></span><span></span><span></span>
      </button>
    `;
  } catch (e) {
    console.warn('Auth check failed, falling back to logged-out:', e);
    localStorage.clear();
    authActions.innerHTML = `
      <a href="login.html" class="login-link">
        <img src="styles/img/index/Vector.png" class="login-icon" alt="Login Icon" />
        Login / Register
      </a>
      <button class="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu">
        <span></span><span></span><span></span>
      </button>
    `;
  }
}

function ensureMobileMenu() {
  // Create a simple dropdown panel under the header if missing
  if (document.getElementById('mobile-menu')) return;

  const panel = document.createElement('div');
  panel.id = 'mobile-menu';
  panel.className = 'mobile-menu';
  panel.hidden = true;

  // Copy desktop nav items (kept simple)
  panel.innerHTML = `
    <ul class="mobile-links">
      <li><a href="dashboard.html">Dashboard</a></li>
      <li><a href="browse.html">Browse Matches</a></li>
      <li><a href="messages.html">Messages</a></li>
      <li><a href="#how-it-works">How it works</a></li>
      <li><a href="#pricing">Pricing</a></li>
    </ul>
    <div class="mobile-divider"></div>
    <ul class="mobile-user-actions">
      <li><a href="my-profile.html">My Profile</a></li>
      <li><a href="settings.html">Settings</a></li>
      <li><button class="logout-btn">Log Out</button></li>
    </ul>
  `;

  // Insert right after the header placeholder so it pushes content
  const headerPH = document.getElementById('header-placeholder');
  headerPH?.insertAdjacentElement('afterend', panel);
}

function wireNavInteractions() {
  const headerRoot = document.getElementById('header-placeholder') || document;
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburger = headerRoot.querySelector('.hamburger');
  const userItem = headerRoot.querySelector('#login-li');
  const userToggle = headerRoot.querySelector('.user-toggle');
  const dropdown = headerRoot.querySelector('.dropdown-content');

  const closeAll = () => {
    // close mobile
    if (mobileMenu && !mobileMenu.hidden) {
      mobileMenu.hidden = true;
      hamburger?.setAttribute('aria-expanded', 'false');
      
    }
    // close user dropdown
    if (userItem?.classList.contains('open')) {
      userItem.classList.remove('open');
      userToggle?.setAttribute('aria-expanded', 'false');
    }
  };

  // Hamburger toggle
  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = mobileMenu.hidden;
    closeAll();
    mobileMenu.hidden = !open;
    hamburger.setAttribute('aria-expanded', String(open));
    
  });

  // Close mobile on link click
  mobileMenu?.addEventListener('click', (e) => {
    const a = e.target.closest('a, button');
    if (!a) return;
    // Handle logout in mobile menu
    if (a.classList?.contains('logout-btn')) {
      e.preventDefault();
      localStorage.clear();
      renderNavLinks().then(() => {
        ensureMobileMenu();
        wireNavInteractions();
      });
      closeAll();
      return;
    }
    closeAll();
  });

  // User dropdown toggle
  userToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !userItem.classList.contains('open');
    closeAll();
    if (open) {
      userItem.classList.add('open');
      userToggle.setAttribute('aria-expanded', 'true');
      // focus first item for a11y
      const first = dropdown?.querySelector('[role="menuitem"], a, button');
      first && first.focus();
    }
  });

  // Logout (desktop dropdown)
  dropdown?.addEventListener('click', (e) => {
    const btn = e.target.closest('.logout-btn');
    if (!btn) return;
    e.preventDefault();
    localStorage.clear();
    renderNavLinks().then(() => {
      ensureMobileMenu();
      wireNavInteractions();
    });
    closeAll();
  });

  // Outside click + ESC to close
  document.addEventListener('click', (e) => {
    if (!headerRoot.contains(e.target) && !mobileMenu?.contains(e.target)) closeAll();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
}
