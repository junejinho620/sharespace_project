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

    centerContainer.innerHTML = ''; // Clear existing hardcoded cards

    users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="additional">
          <div class="user-card">
            <img src="${user.profile_picture_url || 'img/default.jpg'}" alt="${user.name}" class="profile-avatar">
          </div>
          <div class="more-info">
            <h1>${user.name}, ${user.age || ''}</h1>
            <div class="coords">
              <span>${user.city || 'Unknown'}</span>
              <span>Joined ${new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            <div class="coords">
              <span>${user.job_title || 'N/A'}</span>
              <span>${user.interests || ''}</span>
            </div>
            <div class="stats">
              <div>
                <div class="title">Matches</div>
                <div class="value">-</div>
              </div>
              <div>
                <div class="title">Chats</div>
                <div class="value">-</div>
              </div>
              <div>
                <div class="title">Coffee</div>
                <div class="value infinity">∞</div>
              </div>
            </div>
          </div>
        </div>
        <div class="general">
          <h1>${user.name}, ${user.age || ''}</h1>
          <p>${user.bio || 'No bio provided.'}</p>
          <a href="my-profile.html?userId=${user.id}" class="view-btn">View Profile</a>
        </div>
      `;

      centerContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Failed to load users:', err);
    centerContainer.innerHTML = `<p>Failed to load users. Please try again later.</p>`;
  }
});