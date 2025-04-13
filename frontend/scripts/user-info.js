// Handle User Info Form Submission
document.addEventListener('DOMContentLoaded', function() {
  const userInfoForm = document.getElementById('user-info-form');
  
  if (userInfoForm) {
    userInfoForm.addEventListener('submit', async function(event) {
      event.preventDefault();
    
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User not identified.");
        return;
      }
    
      const userData = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        bio: document.getElementById("bio").value,
        phone_number: document.getElementById("phone").value
      };
    
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });
    
        const data = await res.json();
    
        if (res.ok) {
          alert("✅ Info saved!");
          window.location.href = "index.html";
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