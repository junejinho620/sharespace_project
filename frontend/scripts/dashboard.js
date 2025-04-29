document.addEventListener('DOMContentLoaded', function () {
  const username = localStorage.getItem('username') || 'User';
  document.getElementById('welcome-message').textContent = `Welcome back, ${username}!`;

  const logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = 'index.html';
  });

  // 🌟 Progress Fill and House Emoji Logic
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  // Example: You can dynamically calculate profile completion later
  let completionPercent = 70; // Assume 70% for now

  progressFill.style.width = `${completionPercent}%`;
  if (completionPercent >= 100) {
    progressText.textContent = '🏡';
  } else {
    progressText.textContent = `${completionPercent}%`;
  }
});
