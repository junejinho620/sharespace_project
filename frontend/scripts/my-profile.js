document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    logoutAndRedirect();
    return;
  }

  try {
    const user = await fetchCurrentUser(token);
    const prefs = await fetchRoommatePrefs(token);

    populateProfile(user, prefs);
    await loadHobbies(user.id);

    // Edit button ➜ edit-profile.html
    document.getElementById('editProfileBtn').addEventListener('click', () => {
      window.location.href = 'userinfo-step1.html';
    });
    
  } catch (err) {
    console.error('❌ Failed to load profile:', err);
    window.location.href = '404-error.html';
  }
});

// Fetch current user from token
async function fetchCurrentUser(token) {
  const res = await fetch('/api/users/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Unauthorized');
  const { user } = await res.json();
  return user;
}

// Fetch current user's preference from token
async function fetchRoommatePrefs(token) {
  const res = await fetch('/api/prefs/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return {}; // user might not have prefs yet
  const data = await res.json();
  return data.prefs || data; // support both shapes
}

// Helper: Fill user data
function populateProfile(user, pref = {}) {
  // Header
  document.getElementById('profileName').textContent = user.name || '';
  document.getElementById('profileCity').textContent = user.city || '';
  if (user.profile_picture_url) {
    document.getElementById('profilePic').src = user.profile_picture_url;
  }

  // About & core
  document.getElementById('profileBio').textContent  = user.bio || 'No bio yet.';
  document.getElementById('profileAge').textContent  = user.age ?? '-';
  document.getElementById('profileGender').textContent = capitalizeFirstLetter(user.gender) || '-';

  // Pref‑backed fields
  document.getElementById('profileBudget').textContent        = pref.budget_range     || '-';
  document.getElementById('profileSleep').textContent         = pref.sleep_schedule   || '-';
  document.getElementById('profileCleanliness').textContent   = cleanlinessLabel(pref.cleanliness);
  document.getElementById('profileNoise').textContent         = noiseLabel(pref.noise_tolerance);
  document.getElementById('profileSmoking').textContent       = pref.smoking ? 'Yes'  : 'No';
  document.getElementById('profilePetFriendly').textContent   = pref.pet_friendly ? 'Yes' : 'No';
  document.getElementById('profilePersonality').textContent   = pref.introvert ? 'Introvert' : 'Extrovert';
  document.getElementById('profileGenderPref').textContent    = pref.gender_pref || '-';
}

// Helper: Load hobbies
async function loadHobbies(userId) {
  try {
    const res = await fetch(`/api/users/${userId}/hobbies`);
    if (!res.ok) return;
    const hobbies = await res.json();
    const container = document.getElementById('profileHobbies');
    container.innerHTML = '';
    hobbies.forEach(hobby => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = `${hobby.icon} ${hobby.name}`;
      container.appendChild(tag);
    });
  } catch (err) {
    console.error('❌ Failed to load hobbies:', err);
  }
}

// Helper: Utilities
function cleanlinessLabel(val) {
  if (val === 3) return 'Very Clean';
  if (val === 2) return 'Moderate';
  if (val === 1) return 'Messy';
  return '-';
}

function noiseLabel(val) {
  if (val === 3) return 'High';
  if (val === 2) return 'Medium';
  if (val === 1) return 'Low';
  return '-';
}

function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function logoutAndRedirect() {
  localStorage.clear();
  window.location.href = 'login.html';
}
