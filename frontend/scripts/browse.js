document.addEventListener('DOMContentLoaded', async () => {
  const centerContainer = document.querySelector('.center');
  let allUsers = [];

  // Fetch users once
  async function fetchUsers() {
    try {
      const res = await fetch('/api/users');
      const users = await res.json();
      if (!Array.isArray(users)) throw new Error('Invalid format');
      return users;
    } catch (err) {
      console.error('Failed to load users:', err);
      return [];
    }
  }

  // Render given list of users into cards
  function renderUsers(users) {
    centerContainer.innerHTML = '';
    if (users.length === 0) {
      centerContainer.innerHTML = '<p>No roommates match these filters.</p>';
      return;
    }
    users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${user.profile_picture_url || 'styles/img/default.jpg'}" alt="${user.username}" class="profile-avatar">
        <h1>${user.username}, ${user.age || ''}</h1>
        <div class="coords">${user.city || 'Unknown'} | Joined ${new Date(user.created_at).toLocaleDateString()}</div>
        <div class="tags">
          ${user.interests
            ? user.interests.split(',').map(i => `<span class="tag">${i.trim()}</span>`).join('')
            : ''}
        </div>
        <p>${user.bio || 'No bio provided.'}</p>
        <a href="profile.html?userId=${user.id}" class="view-btn">View Profile</a>
      `;
      centerContainer.appendChild(card);
    });
  }

  // Apply all current filters
  function applyFilters() {
    const bMin = parseInt(document.getElementById('budgetInputMin').value, 10);
    const bMax = parseInt(document.getElementById('budgetInputMax').value, 10);
    const aMin = parseInt(document.getElementById('ageInputMin').value, 10);
    const aMax = parseInt(document.getElementById('ageInputMax').value, 10);
    const city = document.querySelector('input[name="city"]:checked').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    const filtered = allUsers.filter(u => {
      // Age
      if ((u.age || 0) < aMin || (u.age || 0) > aMax) return false;
      // City
      if (city !== 'All' && u.city !== city) return false;
      // Gender
      if (gender !== 'Any' && u.gender && u.gender.toLowerCase() !== gender.toLowerCase()) return false;
      // Budget
      if (typeof u.budget_min === 'number' && typeof u.budget_max === 'number') {
        if (u.budget_max < bMin || u.budget_min > bMax) return false;
      }
      return true;
    });

    renderUsers(filtered);
  }

  const sliders = {
    budget: {},
    age: {}
  };

  // Wire up dual-slider syncing and track rendering
  function syncDualSlider(minSlider, maxSlider, minInput, maxInput, gap = 100) {
    const track = minSlider.parentElement.querySelector('.slider-track');
    const updateTrack = () => {
      const range = maxSlider.max - maxSlider.min;
      const pMin = ((minSlider.value - minSlider.min) / range) * 100;
      const pMax = ((maxSlider.value - maxSlider.min) / range) * 100;
      track.style.left = pMin + '%';
      track.style.width = (pMax - pMin) + '%';
    };

    if (minSlider.id.includes('budget')) {
      sliders.budget = {
        minSlider,
        maxSlider,
        minInput,
        maxInput,
        track,
        updateTrack
      };
    } else if (minSlider.id.includes('age')) {
      sliders.age = {
        minSlider,
        maxSlider,
        minInput,
        maxInput,
        track,
        updateTrack
      };
    }

    const onMinInput = () => {
      let mn = parseInt(minSlider.value, 10);
      let mx = parseInt(maxSlider.value, 10);
      if (mx - mn < gap) minSlider.value = mx - gap;
      minInput.value = minSlider.value;
      updateTrack();
      applyFilters();
    };
    const onMaxInput = () => {
      let mn = parseInt(minSlider.value, 10);
      let mx = parseInt(maxSlider.value, 10);
      if (mx - mn < gap) maxSlider.value = mn + gap;
      maxInput.value = maxSlider.value;
      updateTrack();
      applyFilters();
    };
    const onMinNumber = () => {
      let mn = parseInt(minInput.value, 10);
      let mx = parseInt(maxInput.value, 10);
      if (mx - mn >= gap) minSlider.value = mn;
      updateTrack();
      applyFilters();
    };
    const onMaxNumber = () => {
      let mn = parseInt(minInput.value, 10);
      let mx = parseInt(maxInput.value, 10);
      if (mx - mn >= gap) maxSlider.value = mx;
      updateTrack();
      applyFilters();
    };

    minSlider.addEventListener('input', onMinInput);
    maxSlider.addEventListener('input', onMaxInput);
    minInput.addEventListener('change', onMinNumber);
    maxInput.addEventListener('change', onMaxNumber);

    updateTrack();
  }

  // Reset buttons
  document.querySelectorAll('.reset-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const group = e.target.closest('.filter-group');
      if (group.querySelector('#budgetRangeMin')) {
        const s = sliders.budget;
        s.minSlider.value = s.minSlider.min;
        s.maxSlider.value = s.maxSlider.max;
        s.minInput.value = s.minSlider.min;
        s.maxInput.value = s.maxSlider.max;
        s.updateTrack();
      } else if (group.querySelector('#ageRangeMin')) {
        const s = sliders.age;
        s.minSlider.value = s.minSlider.min;
        s.maxSlider.value = s.maxSlider.max;
        s.minInput.value = s.minSlider.min;
        s.maxInput.value = s.maxSlider.max;
        s.updateTrack();
      }
      applyFilters();
    });
  });

  // City & gender radio change
  document.querySelectorAll('input[name="city"], input[name="gender"]').forEach(r => {
    r.addEventListener('change', applyFilters);
  });

  // Initialize dual-sliders
  syncDualSlider(
    document.getElementById('budgetRangeMin'),
    document.getElementById('budgetRangeMax'),
    document.getElementById('budgetInputMin'),
    document.getElementById('budgetInputMax'),
    200
  );
  syncDualSlider(
    document.getElementById('ageRangeMin'),
    document.getElementById('ageRangeMax'),
    document.getElementById('ageInputMin'),
    document.getElementById('ageInputMax'),
    2
  );

  // Fetch & render initially
  allUsers = await fetchUsers();
  renderUsers(allUsers);
});
