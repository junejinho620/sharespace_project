document.addEventListener('DOMContentLoaded', async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/users/me/fomi', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!res.ok) throw new Error('Failed to get Fomi');

    const { matchedFomi } = await res.json();
    if (matchedFomi) {
      // Save to localStorage so dashboard can pick it up
      localStorage.setItem('matchedFomi', matchedFomi);
    }

    // Redirect to dashboard after 1 second
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  } catch (e) {
    console.error('Failed to get Fomi:', e);
  }
});