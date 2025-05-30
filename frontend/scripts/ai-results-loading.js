document.addEventListener('DOMContentLoaded', async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/users/me/fomi', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unknown error');

    // optionally show the Fomi briefly:
    console.log('Your Fomi:', json.matchedFomi);

    // then redirect to dashboard
    window.location.href = 'dashboard.html';
  } catch (e) {
    console.error('Failed to get Fomi:', e);
  }
});