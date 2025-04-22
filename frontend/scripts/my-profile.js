document.addEventListener("DOMContentLoaded", () => {
  const target = JSON.parse(localStorage.getItem("currentChatTarget"));
  if (!target) return;

  document.getElementById("chat-name").textContent = target.name;
  document.getElementById("chat-avatar").src = target.profile_picture_url;

  // You could then fetch chat history like:
  // loadMessages(currentUserId, target.id);
});

// Load profile data from localStorage (simulate)
document.addEventListener('DOMContentLoaded', () => {
  const userData = JSON.parse(localStorage.getItem('selectedProfile'));
  if (!userData) return;
  document.getElementById('profileName').textContent = userData.name + ", " + userData.age;
  document.getElementById('profileBio').textContent = userData.bio;
  document.getElementById('profileCity').textContent = userData.city || "Toronto";
  if (userData.profile_picture_url) {
    document.getElementById('profilePic').src = userData.profile_picture_url;
  }
});

function startChatWithUser() {
  const user = JSON.parse(localStorage.getItem('selectedProfile'));
  if (!user) return;

  const chatTarget = {
    id: user.id || 2, // fallback to dummy ID
    name: user.name || "Jane Doe",
    profile_picture_url: user.profile_picture_url || "img/default-avatar.png"
  };

  localStorage.setItem("currentChatTarget", JSON.stringify(chatTarget));
  window.location.href = "messages.html";
}

function queueNewChat() {
  const user = JSON.parse(localStorage.getItem("selectedProfile"));
  if (!user) return;

  // Save the selected user into a queue to be picked up in messages.html
  const queued = {
    id: user.id || Date.now(), // use real ID if available
    name: user.name,
    avatar: user.profile_picture_url || "img/default-avatar.png",
    lastMessage: "Say hi to your new match!"
  };

  localStorage.setItem("queuedChat", JSON.stringify(queued));
  window.location.href = "messages.html";
}