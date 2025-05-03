document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    logoutAndRedirect();
    return;
  }

  try {
    const user = await fetchCurrentUser(token);
    const prefs = await fetchRoommatePrefs(token);

    populateForm(user, prefs);
    await loadHobbies(user.id);

    setupFormSubmit(user.id, token);

  } catch (err) {
    console.error('❌ Failed to initialise edit‑profile:', err);
    window.location.href = '404-error.html';
  }
});

async function fetchCurrentUser(token) {
  const res = await fetch('/api/users/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Unauthorized');
  const { user } = await res.json();
  return user;
}

async function fetchRoommatePrefs(token) {
  const res = await fetch('/api/prefs/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return {}; // first‑time users
  const data = await res.json();
  return data.prefs || data;
}

// Helper: Fill user data
function populateForm(user, pref = {}) {
  // User core
  setValue('name', user.name);
  setValue('age', user.age);
  setValue('gender', capitalizeFirstLetter(user.gender));
  setValue('bio', user.bio);
  setValue('city', user.city);

  if (user.profile_picture_url) {
    document.getElementById('profilePic').src = user.profile_picture_url;
  }

  // Prefs
  setValue('budget', pref.budget_range);
  setValue('cleanliness', cleanlinessLabel(pref.cleanliness));
  setValue('noise', noiseLabel(pref.noise_tolerance));
  setValue('sleep', pref.sleep_schedule);
  setValue('smoking', pref.smoking ? 'Yes' : 'No');
  setValue('petFriendly', pref.pet_friendly ? 'Yes' : 'No');
  setValue('gender_pref', pref.gender_pref);
  setValue('personality', pref.introvert ? 'Introvert' : 'Extrovert');
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.tagName === 'SELECT' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    el.value = val ?? '';
  }
}

// Helper: Load hobbies
async function loadHobbies(userId) {
  const all = await (await fetch('/api/hobbies')).json();
  const own = await (await fetch(`/api/users/${userId}/hobbies`)).json();
  const tags = document.getElementById('hobby-tags');
  const drop = document.getElementById('hobby-dropdown');
  let selected = [...own];

  const render = () => {
    tags.innerHTML = '';
    selected.forEach((h, i) => addTag(`${h.icon} ${h.name}`, () => open(i)));
    if (selected.length < 3) addTag('+ Add hobby', () => open(selected.length));
  };

  const addTag = (txt, cb) => {
    const div = document.createElement('div');
    div.className = 'hobby-tag';
    div.textContent = txt;
    div.onclick = cb;
    tags.appendChild(div);
  };

  const open = (idx) => {
    drop.innerHTML = '';
    all.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h.id;
      opt.textContent = `${h.icon} ${h.name}`;
      opt.selected = selected[idx] && selected[idx].id === h.id;
      drop.appendChild(opt);
    });
    drop.classList.remove('hidden');
    drop.onchange = () => {
      const id = parseInt(drop.value);
      if (selected.some(h => h.id === id)) {
        alert('You already selected this hobby.');
        return;
      }
      selected[idx] = all.find(h => h.id === id);
      selected = selected.filter(Boolean);
      drop.classList.add('hidden');
      render();
    };
  };
  render();

  // save on submit
  document.getElementById('editProfileForm').addEventListener('submit', async e => {
    e.preventDefault();
    const ids = selected.map(h => h.id);
    await fetch(`/api/users/${userId}/hobbies`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hobbyIds: ids })
    });
  }, { once: true });
}

// Helper: Handle form submission for user + roommatePref
function setupFormSubmit(userId, token) {
  document.getElementById('editProfileForm').addEventListener('submit', async e => {
    e.preventDefault();

    const updatedUser = {
      name: getVal('name'),
      age: parseInt(getVal('age')),
      gender: getVal('gender'),
      bio: getVal('bio'),
      city: getVal('city')
    };

    const updatedPrefs = {
      budget_range: getVal('budget'),
      cleanliness: parseCleanliness(getVal('cleanliness')),
      noise_tolerance: parseNoise(getVal('noise')),
      sleep_schedule: getVal('sleep'),
      smoking: getVal('smoking') === 'Yes',
      pet_friendly: getVal('petFriendly') === 'Yes',
      gender_pref: getVal('gender_pref') || 'Any',
      introvert: getVal('personality') === 'Introvert'
    };

    await Promise.all([
      fetch(`/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedUser)
      }),
      fetch('/api/prefs/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedPrefs)
      })
    ]);

    alert('Profile updated successfully!');
    window.location.href = 'my-profile.html';
  });
}

function getVal(id) {
  return document.getElementById(id).value;
}

// Helper: Utilities
function cleanlinessLabel(val) {
  if (val === 3) return 'Very Clean';
  if (val === 2) return 'Moderate';
  if (val === 1) return 'Messy';
  return '';
}

function noiseLabel(val) {
  if (val === 3) return 'High';
  if (val === 2) return 'Medium';
  if (val === 1) return 'Low';
  return '';
}

function parseCleanliness(val) {
  if (val === 'Very Clean') return 3;
  if (val === 'Moderate') return 2;
  if (val === 'Messy') return 1;
  return null;
}
function parseNoise(val) {
  if (val === 'High') return 3;
  if (val === 'Medium') return 2;
  if (val === 'Low') return 1;
  return null;
}

function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function logoutAndRedirect() {
  localStorage.clear();
  window.location.href = 'login.html';
}