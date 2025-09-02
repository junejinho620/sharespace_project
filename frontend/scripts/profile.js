document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');
  const token = localStorage.getItem('token');

  if (!userId) {
    alert("User ID not found. Redirecting to browse page.");
    window.location.href = "browse.html";
    return;
  }

  try {
    // Fetch user details from backend
    const res = await fetch(`http://localhost:5001/api/users/${userId}`);

    // If user not found, go to 404 page
    if (res.status === 404) {
      window.location.href = "404-error.html";
      return;
    }

    if (!res.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await res.json();
    console.log('✅ Fetched profile:', data.user);

    populateProfile(data.user);
    setupLikeButton(userId, token);

  } catch (err) {
    console.error("❌ Error loading profile:", err);
    window.location.href = "404-error.html";
  }
});

// Helper: Fill profile data into page
function populateProfile(user) {
  document.getElementById('profileName').textContent = `${user.name || user.username}, ${user.age || '-'}`;
  document.getElementById('profileCity').textContent = user.city || "Unknown";
  loadAndDisplayHobbies(user.id, 'profileHobbies');
  document.getElementById('profileBio').textContent = user.bio || "No bio available.";

  if (user.profile_picture_url) {
    document.getElementById('profilePic').src = user.profile_picture_url;
  } else {
    document.getElementById('profilePic').src = 'styles/img/default.jpg';
  }

  // Save user for messaging
  localStorage.setItem('selectedProfile', JSON.stringify(user));
}

// Helper: Setup Like button
async function setupLikeButton(userId, token) {
  if (!token) return;

  try {
    const likeStatusRes = await fetch(`/api/likes/check/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const likeStatus = await likeStatusRes.json();

    const likeBtn = document.getElementById('like-btn');

    if (likeStatus.liked) {
      likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Liked';
      likeBtn.disabled = true;
      likeBtn.style.backgroundColor = '#aaa';
    } else {
      likeBtn.addEventListener('click', async () => {
        try {
          const likeRes = await fetch('/api/likes/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ liked_id: userId }),
          });

          const likeData = await likeRes.json();
          if (likeRes.ok) {
            alert('You liked this user!');
            likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Liked';
            likeBtn.disabled = true;
            likeBtn.style.backgroundColor = '#aaa';
          } else {
            alert(likeData.error || likeData.message);
          }
        } catch (err) {
          console.error(err);
          alert('Failed to like user.');
        }
      });
    }
  } catch (error) {
    console.error('❌ Error checking like status:', error);
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

// Handles messaging button
function queueNewChat() {
  const user = JSON.parse(localStorage.getItem("selectedProfile"));
  if (!user) return;

  // Save the selected user into a queue to be picked up in messages.html
  const queued = {
    id: user.id || Date.now(), // use real ID if available
    name: user.name,
    avatar: user.profile_picture_url || "styles/img/default-avatar.png",
    lastMessage: "Say hi to your new match!"
  };

  localStorage.setItem("queuedChat", JSON.stringify(queued));
  window.location.href = "messages.html";
}