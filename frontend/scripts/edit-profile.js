document.addEventListener('DOMContentLoaded', async function() {
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
});

// Helper: Fill profile data into page
function populateProfile(user) {
  document.getElementById('name').value = user.name || '';
  document.getElementById('age').value = user.age || '';
  document.getElementById('gender').value = capitalizeFirstLetter(user.gender) || '';
  document.getElementById('bio').value = user.bio || '';
  document.getElementById('budget').value = user.budget || '';
  document.getElementById('cleanliness').value = user.cleanliness || '';
  document.getElementById('noise').value = user.noise_tolerance || '';
  document.getElementById('sleep').value = user.sleep_schedule || '';
  document.getElementById('smoking').value = user.smoking || '';
  document.getElementById('petFriendly').value = user.pet_friendly ? 'Yes' : 'No';
  document.getElementById('personality').value = user.personality || '';
  document.getElementById('hobbies').value = user.hobbies || '';

  // Profile picture
  if (user.profile_picture_url) {
    document.getElementById('profilePic').src = user.profile_picture_url;
  }
}

// Helper: Capitalize first letter (for gender etc.)
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

document.getElementById('editProfileForm').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Profile updated successfully!');
  window.location.href = 'my-profile.html';
});
