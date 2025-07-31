document.addEventListener('DOMContentLoaded', async () => {
  const centerContainer = document.querySelector('.center');
  let allUsers = [];

  // ---- 1) Fetch users ----
  async function fetchUsers() {
    try {
      const res = await fetch('/api/users');
      return (await res.json()) || [];
    } catch {
      return [];
    }
  }

  // ---- 2) Render user cards ----
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

  // ---- 3) Grab & wire up filter controls ----
  const bMinS = document.getElementById('budgetRangeMin');
  const bMaxS = document.getElementById('budgetRangeMax');
  const bMinI = document.getElementById('budgetInputMin');
  const bMaxI = document.getElementById('budgetInputMax');
  const citySel = document.getElementById('citySelect');
  const natSel = document.getElementById('nationSelect');
  const agePills = document.querySelectorAll('.age-pills .pill');
  const genderPills = document.querySelectorAll('.gender-pills .pill');
  const resetBtns = document.querySelectorAll('.reset-btn');
  const clearAll = document.getElementById('clear-filters');

  // ---- 4) Budget dual-slider setup ----
  function syncDual(minS, maxS, minI, maxI, gap = 100) {
    const track = minS.parentElement.querySelector('.slider-track');
    const update = () => {
      const min   = +minS.min;
      const max   = +maxS.max;
      const curMin= +minS.value;
      const curMax= +maxS.value;
      const range = max - min;

      // get 0–100% positions
      const startPct = ((curMin - min) / range) * 100;
      const endPct   = ((curMax - min) / range) * 100;

      // half your thumb width (16px total)
      const thumbW   = 16;
      const halfThumb= thumbW / 2;

      // **anchor under the center of each knob**
      track.style.left  = `calc(${startPct}% + ${halfThumb}px)`;
      track.style.width = `calc(${endPct - startPct}% - ${thumbW}px)`;

      // sync your number inputs & filters…
    };
    const onMin = () => {
      if (+maxS.value - +minS.value < gap) minS.value = +maxS.value - gap;
      minI.value = minS.value; update(); applyFilters();
    };
    const onMax = () => {
      if (+maxS.value - +minS.value < gap) maxS.value = +minS.value + gap;
      maxI.value = maxS.value; update(); applyFilters();
    };
    const onMinI = () => {
      if (+maxI.value - +minI.value >= gap) minS.value = minI.value;
      update(); applyFilters();
    };
    const onMaxI = () => {
      if (+maxI.value - +minI.value >= gap) maxS.value = maxI.value;
      update(); applyFilters();
    };
    minS.addEventListener('input', onMin);
    maxS.addEventListener('input', onMax);
    minI.addEventListener('change', onMinI);
    maxI.addEventListener('change', onMaxI);
    update();
  }

  syncDual(bMinS, bMaxS, bMinI, bMaxI, 200);

  // ---- 5) Main filtering logic ----
  function applyFilters() {
    const minB = +bMinI.value, maxB = +bMaxI.value;
    const selA = Array.from(agePills).filter(b => b.classList.contains('selected')).map(b => b.dataset.value);
    const selG = Array.from(genderPills).find(b => b.classList.contains('selected')).dataset.value;
    const selC = citySel.value, selN = natSel.value;

    const filtered = allUsers.filter(u => {
      if (u.budget_max < minB || u.budget_min > maxB) return false;
      if (selA.length && !selA.includes(u.age)) return false;
      if (selC !== 'all' && u.city !== selC) return false;
      if (selN !== 'all' && u.nationality !== selN) return false;
      if (selG && u.gender !== selG) return false;
      return true;
    });
    renderUsers(filtered);
  }

  // pill toggles
  agePills.forEach(p => p.addEventListener('click', () => {
    p.classList.toggle('selected');
    applyFilters();
  }));
  genderPills.forEach(p => p.addEventListener('click', () => {
    genderPills.forEach(x => x.classList.remove('selected'));
    p.classList.add('selected');
    applyFilters();
  }));

  // dropdowns
  citySel.addEventListener('change', applyFilters);
  natSel.addEventListener('change', applyFilters);

  // reset buttons
  resetBtns.forEach(btn => btn.addEventListener('click', e => {
    const grp = e.target.closest('.filter-group');
    if (grp.classList.contains('age-group'))
      agePills.forEach(p => p.classList.remove('selected'));
    else // budget-group
      syncDual(bMinS, bMaxS, bMinI, bMaxI, 200);
    applyFilters();
  }));

  // clear all
  clearAll.addEventListener('click', () => {
    // budget
    bMinS.value = bMinS.min; bMaxS.value = bMaxS.max;
    bMinI.value = bMinS.min; bMaxI.value = bMaxS.max;
    syncDual(bMinS, bMaxS, bMinI, bMaxI, 200);
    // age
    agePills.forEach(p => p.classList.remove('selected'));
    // city & nation
    citySel.value = 'all'; natSel.value = 'all';
    // gender
    genderPills.forEach(p => p.classList.remove('selected'));
    genderPills[2].classList.add('selected'); // “Any”
    applyFilters();
  });

  // initial load
  allUsers = await fetchUsers();
  renderUsers(allUsers);
});