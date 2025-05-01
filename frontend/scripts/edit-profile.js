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
      loadHobbies(data.user.id);
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
  document.getElementById('city').value = user.city || '';
  document.getElementById('budget').value = user.budget_range || '';
  document.getElementById('cleanliness').value = user.cleanliness || '';
  document.getElementById('noise').value = user.noise_tolerance || '';
  document.getElementById('sleep').value = user.sleep_schedule || '';
  document.getElementById('smoking').value = user.smoking || '';
  document.getElementById('petFriendly').value = user.pet_friendly || '';
  document.getElementById('personality').value = user.personality || '';
  document.getElementById('gender_pref').value = user.gender_pref || '';

  // Profile picture
  if (user.profile_picture_url) {
    document.getElementById('profilePic').src = user.profile_picture_url;
  }
}

// Helper: Load hobbies in dropdown
async function loadHobbies(userId) {
  const hobbyRes = await fetch("/api/hobbies");
  const allHobbies = await hobbyRes.json();

  const userHobbyRes = await fetch(`/api/users/${userId}/hobbies`);
  const selectedHobbies = await userHobbyRes.json();

  const tagContainer = document.getElementById("hobby-tags");
  const dropdown = document.getElementById("hobby-dropdown");

  let selected = [...selectedHobbies]; // clone the user's hobbies

  function renderTags() {
    tagContainer.innerHTML = ""; // clear previous
    selected.forEach((hobby, index) => {
      const tag = document.createElement("div");
      tag.className = "hobby-tag";
      tag.textContent = `${hobby.icon} ${hobby.name}`;
      tag.dataset.index = index;
      tag.addEventListener("click", () => openDropdown(index));
      tagContainer.appendChild(tag);
    });

    if (selected.length < 3) {
      const addBtn = document.createElement("div");
      addBtn.className = "hobby-tag";
      addBtn.textContent = "+ Add hobby";
      addBtn.addEventListener("click", () => openDropdown(selected.length));
      tagContainer.appendChild(addBtn);
    }
  }

  function openDropdown(index) {
    dropdown.innerHTML = "";
    allHobbies.forEach(hobby => {
      const option = document.createElement("option");
      option.value = hobby.id;
      option.textContent = `${hobby.icon} ${hobby.name}`;
      option.selected = selected[index] && selected[index].id === hobby.id;
      dropdown.appendChild(option);
    });

    dropdown.classList.remove("hidden");
    dropdown.onchange = async () => {
      const chosenId = parseInt(dropdown.value);
      const chosen = allHobbies.find(h => h.id === chosenId);
      if (selected.find(h => h.id === chosenId)) {
        alert("You already selected this hobby.");
        return;
      }
      selected[index] = chosen;
      selected = selected.filter(Boolean); // remove empty slots
      dropdown.classList.add("hidden");
      renderTags();
    };
  }
  // Initial render
  renderTags();

  // Hook into form submission
  const form = document.getElementById("editProfileForm");
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const userRes = await fetch('http://localhost:5000/api/users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const user = (await userRes.json()).user;

    const hobbyIds = selected.map(h => h.id);

    await fetch(`/api/users/${user.id}/hobbies`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hobbyIds })
    });

    alert('Profile updated successfully!');
    window.location.href = 'my-profile.html';
  });
}

// Helper: Capitalize first letter (for gender etc.)
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

document.getElementById('editProfileForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const userRes = await fetch('http://localhost:5000/api/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const user = (await userRes.json()).user;

  const selectedHobbies = [...document.getElementById('hobbySelect').selectedOptions].map(opt => parseInt(opt.value));

  await fetch(`/api/users/${user.id}/hobbies`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hobbyIds: selectedHobbies })
  });

  alert('Profile updated successfully!');
  window.location.href = 'my-profile.html';
});