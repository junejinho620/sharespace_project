document.addEventListener('DOMContentLoaded', () => {
  const profileInput = document.getElementById('profile-picture');
  const profileSlot = document.getElementById('profile-pic-slot');
  const usernameInput = document.getElementById('username');
  const setupForm = document.querySelector('.setup-form');
  const usernameError = document.createElement('div');

  usernameError.style.color = 'red';
  usernameError.style.fontSize = '13px';
  usernameError.style.marginTop = '4px';
  usernameInput.insertAdjacentElement('afterend', usernameError);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Dynamic Image Preview
  profileInput.addEventListener('change', () => {
    const file = profileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        profileSlot.innerHTML = `<img src="${e.target.result}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  // Username Duplication Check
  usernameInput.addEventListener('input', async () => {
    const username = usernameInput.value.trim();
    if (!username) {
      usernameError.textContent = '';
      return;
    }

    const res = await fetch(`http://localhost:5000/api/users/check-username?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    usernameError.textContent = data.exists ? '❌ The username already exists.' : '';
  });

  // Submit Form (Profile picture and username)
  setupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (usernameError.textContent) {
      alert("Please resolve errors first.");
      return;
    }

    const formData = new FormData();
    formData.append('username', usernameInput.value.trim());

    if (profileInput.files[0]) {
      formData.append('profile_picture', profileInput.files[0]);
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/setup`, {
        method: 'PUT',
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Account setup complete!");
        window.location.href = "userinfo-step1.html";
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error("Setup submission error:", err);
      alert("❌ An error occurred during setup.");
    }
  });
});
