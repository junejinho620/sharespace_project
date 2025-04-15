document.addEventListener('DOMContentLoaded', function () {
  // 🔹 Smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const section = document.querySelector(targetId);
        if (section) {
          e.preventDefault();
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // 🔹 Smooth scroll for step items
  document.querySelectorAll('.step-item').forEach(step => {
    step.addEventListener('click', () => {
      step.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // 🔹 IntersectionObserver for title animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.how-it-works h2').forEach(heading => {
    observer.observe(heading);
  });

  // 🔹 Scroll-triggered step animation
  const sectionHeader = document.querySelector('.how-it-works h2');
  const stepItems = document.querySelectorAll('.step-item');
  const section = document.querySelector('.how-it-works');
  let lastScrollTop = 0;
  let sectionHasBeenSeen = false;

  function checkVisibility() {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const scrollingDown = st > lastScrollTop;
    const sectionInView = rect.top < windowHeight && rect.bottom > 0;
    const scrolledAboveSection = rect.bottom <= 0;

    if (sectionInView) {
      if (!sectionHasBeenSeen || (scrollingDown && !elementsAreVisible())) {
        showElements();
        sectionHasBeenSeen = true;
      }
    } else if (scrolledAboveSection && !scrollingDown) {
      hideElements();
    }

    lastScrollTop = st <= 0 ? 0 : st;
  }

  function showElements() {
    sectionHeader.classList.add('visible');
    stepItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('visible');
      }, 200 * (index + 1));
    });
  }

  function hideElements() {
    sectionHeader.classList.remove('visible');
    stepItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.remove('visible');
      }, 100 * (index + 1));
    });
  }

  function elementsAreVisible() {
    return sectionHeader.classList.contains('visible');
  }

  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('load', checkVisibility);

  // 🔹 Handle login state in nav bar
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username');
  const navLinks = document.querySelector('.nav-links');

  if (isLoggedIn && username && navLinks) {
    const loginLink = navLinks.querySelector('a[href="login.html"]');
    const loginLi = loginLink?.parentElement;

    if (loginLi) {
      loginLi.classList.add('user-dropdown');
      loginLi.innerHTML = `
        <span class="username">${username} ▼</span>
        <div class="dropdown-content">
          <a href="profile.html">My Profile</a>
          <a href="settings.html">Settings</a>
          <a href="#" id="logoutButton">Log Out</a>
        </div>
      `;

      const logoutBtn = document.getElementById('logoutButton');
      loginLi.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'logoutButton') {
          e.preventDefault();
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('username');
          loginLi.classList.remove('user-dropdown');
          loginLi.innerHTML = `<a href="login.html" class="login">Log in</a>`;
        }
      });
    }

    const dashboardExists = Array.from(navLinks.querySelectorAll('a')).some(link =>
      link.href.includes('my-dashboard.html')
    );

    if (!dashboardExists) {
      const dashboardLi = document.createElement('li');
      dashboardLi.innerHTML = '<a href="my-dashboard.html">My Dashboard</a>';
      navLinks.insertBefore(dashboardLi, loginLi);
    }
  }
});
