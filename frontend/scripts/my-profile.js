document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');

  if (!token) {
    logoutAndRedirect();
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Authenticated user:', data.user);
      populateProfile(data.user);
    } else {
      // Token expired, invalid, or user not found
      throw new Error('Unauthorized');
    }
  } catch (err) {
    console.error("❌ Error loading profile:", err);
    window.location.href = "404-error.html";
  }

  // Handle Edit Profile button click
  const editButton = document.getElementById('editProfileBtn');
  if (editButton) {
    editButton.addEventListener('click', () => {
      window.location.href = 'edit-profile.html';
    });
  }
});

// Helper: Fill profile data into page
function populateProfile(user) {
  document.getElementById('profileName').textContent = user.name || 'Name not set';
  document.getElementById('profileCity').textContent = user.city || 'City not set';
  document.getElementById('profileBio').textContent = user.bio || 'No bio available.';
  document.getElementById('profileAge').textContent = user.age || '-';
  document.getElementById('profileGender').textContent = capitalizeFirstLetter(user.gender) || '-';
  document.getElementById('profileBudget').textContent = user.budget_range || '-';
  document.getElementById('profileSleep').textContent = user.sleep_schedule || '-';
  document.getElementById('profileCleanliness').textContent = user.cleanliness || '-';
  document.getElementById('profileNoise').textContent = user.noise_tolerance || '-';
  document.getElementById('profileSmoking').textContent = user.smoking || '-';
  document.getElementById('profilePetFriendly').textContent = user.pet_friendly || '-';
  document.getElementById('profilePersonality').textContent = user.personality || '-';
  loadAndDisplayHobbies(user.id, 'profileHobbies');
  document.getElementById('profileGenderPref').textContent = user.gender_pref || '-';

  // Profile picture
  if (user.profile_picture_url) {
    document.getElementById('profilePic').src = user.profile_picture_url;
  }
}

// Helper: Load and display user's hobbies
async function loadAndDisplayHobbies(userId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(`/api/users/${userId}/hobbies`);
    const hobbies = await res.json();

    container.innerHTML = '';
    hobbies.forEach(hobby => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = `${hobby.icon} ${hobby.name}`;
      container.appendChild(tag);
    });

  } catch (err) {
    console.error("❌ Failed to load hobbies:", err);
  }
}

// Helper: Capitalize first letter (for gender etc.)
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}