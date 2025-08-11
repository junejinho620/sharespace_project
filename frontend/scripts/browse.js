document.addEventListener('DOMContentLoaded', async () => {
  const centerContainer = document.querySelector('.center');
  let allUsers = [];
  let countries = [];

  const slugifyCountry = str => str.toLowerCase().replace(/\s+/g, '-');

  // ---- 1) Fetch users ----
  async function fetchUsers(nations = []) {
    try {
      const params = new URLSearchParams();
      nations.forEach(n => params.append('nationality', n));
      const url = '/api/users' + (params.toString() ? `?${params.toString()}` : '');
      const res = await fetch(url);
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
        <div class="coords">${user.city || 'Unknown'} | Joined ${new Date(user.joined_at).toLocaleDateString()}</div>
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
  const nationInput = document.getElementById('nationInput');
  const nationSelected = document.getElementById('selectedNations');
  const nationSuggestions = document.getElementById('nationSuggestions');
  const aMinS = document.getElementById('ageRangeMin');
  const aMaxS = document.getElementById('ageRangeMax');
  const aMinI = document.getElementById('ageInputMin');
  const aMaxI = document.getElementById('ageInputMax');
  const genderPills = document.querySelectorAll('.gender-pills .pill');
  const fomiChecks = document.querySelectorAll('input[name="fomi"]');
  const resetBtns = document.querySelectorAll('.reset-btn');
  const clearAll = document.getElementById('clear-filters');

  // ---- 4a) Budget dual-slider setup ----
  function syncDual(minS, maxS, minI, maxI, gap = 100) {
    const track = minS.parentElement.querySelector('.slider-track');
    const update = () => {
      const min = +minS.min;
      const max = +maxS.max;
      const curMin = +minS.value;
      const curMax = +maxS.value;
      const range = max - min;

      // get 0–100% positions
      const startPct = ((curMin - min) / range) * 100;
      const endPct = ((curMax - min) / range) * 100;

      // half your thumb width (16px total)
      const thumbW = 16;
      const halfThumb = thumbW / 2;

      // **anchor under the center of each knob**
      track.style.left = `calc(${startPct}% + ${halfThumb}px)`;
      track.style.width = `calc(${endPct - startPct}% - ${thumbW}px)`;
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

    return () => {
      minS.value = minS.min;
      maxS.value = maxS.max;
      minI.value = minS.min;
      maxI.value = maxS.max;
      update();
    };
  }

  const resetBudget = syncDual(bMinS, bMaxS, bMinI, bMaxI, 200);
  const resetAge = syncDual(aMinS, aMaxS, aMinI, aMaxI, 1);

  // ---- 4b) Load country list ----
  async function loadCountries() {
    try {
      const res = await fetch('scripts/countries.json');
      countries = await res.json();
    } catch {
      countries = [];
    }
  }

  function getSelectedNations() {
    return Array.from(document.querySelectorAll('.selected-nation')).map(el => el.dataset.value);
  }

  function addNation(name) {
    const slug = slugifyCountry(name);
    if (getSelectedNations().includes(slug)) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill selected selected-nation';
    btn.dataset.value = slug;
    btn.innerHTML = `${name}<span class="remove">×</span>`;
    btn.addEventListener('click', () => {
      btn.remove();
      applyFilters();
    });
    nationSelected.appendChild(btn);
    applyFilters();
  }

  await loadCountries();

  nationInput.addEventListener('input', () => {
    const q = nationInput.value.toLowerCase().replace(/-/g, ' ');
    nationSuggestions.innerHTML = '';
    if (!q) {
      nationSuggestions.classList.add('hidden');
      return;
    }
    const matches = countries.filter(c => c.toLowerCase().includes(q) && !getSelectedNations().includes(slugifyCountry(c)));
    matches.slice(0, 5).forEach(c => {
      const li = document.createElement('li');
      li.textContent = c;
      li.addEventListener('click', () => {
        addNation(c);
        nationInput.value = '';
        nationSuggestions.innerHTML = '';
        nationSuggestions.classList.add('hidden');
      });
      nationSuggestions.appendChild(li);
    });
    nationSuggestions.classList.toggle('hidden', matches.length === 0);
  });

  nationInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && nationSuggestions.firstChild) {
      e.preventDefault();
      nationSuggestions.firstChild.click();
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.multi-select')) {
      nationSuggestions.classList.add('hidden');
    }
  });

  // ---- 5) Main filtering logic ----
  async function applyFilters() {
    const minB = +bMinI.value, maxB = +bMaxI.value;
    const minA = +aMinI.value, maxA = +aMaxI.value;
    const selG = Array.from(genderPills).find(b => b.classList.contains('selected')).dataset.value;
    const selC = citySel.value;
    const selN = getSelectedNations();
    const selF = Array.from(fomiChecks).filter(c => c.checked).map(c => c.value);

    allUsers = await fetchUsers(selN);

    const filtered = allUsers.filter(u => {
      if (u.budget_max < minB || u.budget_min > maxB) return false;
      const age = Number(u.age);
      if (!Number.isNaN(age) && (age < minA || age > maxA)) return false;
      if (selC !== 'all' && u.city !== selC) return false;
      if (selG && u.gender !== selG) return false;
      if (selF.length && (!u.fomi || !selF.includes(u.fomi))) return false;
      return true;
    });
    renderUsers(filtered);
  }

  // pill toggles
  genderPills.forEach(p => p.addEventListener('click', () => {
    genderPills.forEach(x => x.classList.remove('selected'));
    p.classList.add('selected');
    applyFilters();
  }));

  fomiChecks.forEach(c => c.addEventListener('change', applyFilters));

  // dropdown
  citySel.addEventListener('change', applyFilters);

  // reset buttons
  resetBtns.forEach(btn => btn.addEventListener('click', e => {
    const grp = e.target.closest('.filter-group');
    if (grp.classList.contains('age-group')) {
      resetAge();
    } else if (grp.classList.contains('budget-group')) {
      resetBudget();
    }
    applyFilters();
  }));

  // clear all
  clearAll.addEventListener('click', () => {
    // budget
    resetBudget();
    // age
    resetAge();
    // city & nation
    citySel.value = 'all';
    nationSelected.innerHTML = '';
    nationInput.value = '';
    nationSuggestions.innerHTML = '';
    nationSuggestions.classList.add('hidden');
    // gender
    genderPills.forEach(p => p.classList.remove('selected'));
    genderPills[2].classList.add('selected'); // “Any”
    // fomi
    fomiChecks.forEach(c => c.checked = false);
    applyFilters();
  });

  // initial load
  allUsers = await fetchUsers();
  renderUsers(allUsers);
});