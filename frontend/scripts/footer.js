// scripts/footer.js
document.addEventListener('DOMContentLoaded', async () => {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  try {
    const res = await fetch('/frontend/components/footer.html');
    footerPlaceholder.innerHTML = await res.text();
  } catch (err) {
    console.error('Failed to load footer:', err);
  }
});
