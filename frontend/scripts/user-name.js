// 🌐 Get query params (user ID from ?id=...)
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

const queryUserId = getQueryParam("id");
if (queryUserId) {
  localStorage.setItem("userId", queryUserId);
}

document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem('userId');
  
  if (!userId) {
    alert("⚠️ You're not logged in.");
    return window.location.href = "login.html";
  }

  try {
    // 👉 Check if user is verified
    const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();

    if (!data.user || !data.user.verified) {
      alert("⚠️ Please verify your email before setting your username.");
      return window.location.href = "index.html";
    }
  } catch (err) {
    console.error("Error verifying user:", err);
    alert("Something went wrong. Try again later.");
    return window.location.href = "index.html";
  }

  // Only run username form logic if verified
  const usernameForm = document.getElementById('username-form');

  if (usernameForm) {
    usernameForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const usernameInput = document.getElementById('username');
      const username = usernameInput.value.trim();

      if (!username) {
        alert('Please enter a username.');
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ username: username })
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('username', username);
          localStorage.setItem('isLoggedIn', 'true');
          window.location.href = 'user-info.html';
        } else {
          alert("❌ " + data.error);
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
      }
    });
  }
});

window.addEventListener('scroll', function () {
  const footer = document.querySelector('.footer');
  if (window.scrollY > 100) { // Show after 100px of scroll
    footer.style.display = 'block';
  } else {
    footer.style.display = 'none';
  }
});