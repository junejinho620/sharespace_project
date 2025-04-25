// JavaScript (Optional for Animation)
const room404 = document.querySelector('.room-404');

room404.addEventListener('mouseover', () => {
  room404.style.backgroundColor = '#ff8c8c';
});

room404.addEventListener('mouseout', () => {
  room404.style.backgroundColor = '#ff6b6b';
});

// JavaScript for Interactive Lights
const house = document.querySelector('.house');
const windows = document.querySelectorAll('.window');

house.addEventListener('mouseover', () => {
  windows.forEach(window => {
    window.style.opacity = '1'; // Lights on
    window.style.boxShadow = '0 0 10px 5px rgba(255, 215, 0, 0.8)'; // Glow effect
  });
});

house.addEventListener('mouseout', () => {
  windows.forEach(window => {
    window.style.opacity = '0.3'; // Lights off
    window.style.boxShadow = 'none'; // Remove glow
  });
});

// Lets the search bar on 404 redirect you to browse.html with a query.
document.getElementById("errorSearchBtn").addEventListener("click", () => {
  const query = document.getElementById("errorSearchInput").value.trim();
  if (query) {
    // Redirect to browse page with search parameter
    window.location.href = `browse.html?search=${encodeURIComponent(query)}`;
  }
});