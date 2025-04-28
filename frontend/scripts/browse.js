document.addEventListener('DOMContentLoaded', async () => {
  const centerContainer = document.querySelector('.center');

  try {
    // Fetch all users
    const res = await fetch('/api/users');
    const users = await res.json();

    if (!Array.isArray(users)) {
      console.error('Invalid users format:', users);
      return;
    }

    centerContainer.innerHTML = ''; // Clear existing cards

    users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${user.profile_picture_url || 'styles/img/default.jpg'}" alt="${user.name}" class="profile-avatar">
        <h1>${user.name}, ${user.age || ''}</h1>
        <div class="coords">${user.city || 'Unknown'} | Joined ${new Date(user.created_at).toLocaleDateString()}</div>
        <div class="tags">
          ${user.interests ? user.interests.split(',').map(interest => `<span class="tag">${interest.trim()}</span>`).join('') : ''}
        </div>
        <p>${user.bio || 'No bio provided.'}</p>
        <a href="profile.html?userId=${user.id}" class="view-btn">View Profile</a>
      `;

      centerContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Failed to load users:', err);
    centerContainer.innerHTML = `<p>Failed to load users. Please try again later.</p>`;
  }
});
