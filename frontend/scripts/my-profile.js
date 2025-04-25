document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');

  if (!userId) {
    alert("User ID not found. Redirecting to browse page.");
    window.location.href = "browse.html";
    return;
  }

  const token = localStorage.getItem('token');

  try {
    // Fetch user details from backend
    const res = await fetch(`/api/users/${userId}`);

    // If user not found, go to 404 page
    if (res.status === 404) {
      window.location.href = "404-error.html";
      return;
    }

    const user = await res.json();

    // Update profile page elements
    document.getElementById('profileName').textContent = `${user.name}, ${user.age}`;
    document.getElementById('profileBio').textContent = user.bio || "No bio available.";
    document.getElementById('profileCity').textContent = user.city || "Unknown city";

    if (user.profile_picture_url) {
      document.getElementById('profilePic').src = user.profile_picture_url;
    } else {
      document.getElementById('profilePic').src = 'styles/img/default.jpg';
    }

    // Save user temporarily for chatting
    localStorage.setItem('selectedProfile', JSON.stringify(user));

      // Check if already liked
      if (token) {
      const likeStatusRes = await fetch(`/api/likes/check/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const likeStatus = await likeStatusRes.json();

      const likeBtn = document.getElementById('like-btn');

      if (likeStatus.liked) {
        likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Liked';
        likeBtn.disabled = true; // disable button if already liked (optional)
        likeBtn.style.backgroundColor = '#aaa'; // make it look greyed out
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
    }
  } catch (err) {
    console.error("Error loading profile:", err);
    window.location.href = "404-error.html";
  }
});

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