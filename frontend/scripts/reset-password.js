// Get token from URL
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

document.getElementById("reset-password-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPassword = document.getElementById("new-password").value;

  try {
    const res = await fetch("http://localhost:5000/api/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword })
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      window.location.href = "login.html";
    } else {
      alert("❌ " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
});
