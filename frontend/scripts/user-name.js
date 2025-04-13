document.addEventListener('DOMContentLoaded', function () {
    const usernameForm = document.getElementById('username-form');
  
    if (usernameForm) {
      usernameForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission
  
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
  
        if (!username) {
          alert('Please enter a username.');
          return;
        }
  
        const userId = localStorage.getItem('userId');
        if (!userId) {
          alert("User not identified.");
          return;
        }
  
        try {
          const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username })
          });
  
          const data = await res.json();
  
          if (res.ok) {
            // Save to localStorage to simulate login
            localStorage.setItem('username', username);
            localStorage.setItem('isLoggedIn', 'true');
  
            // Redirect to next step
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