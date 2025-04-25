document.addEventListener("DOMContentLoaded", async () => {
  const chatList = document.getElementById("chatList");
  const chatMessages = document.getElementById("chatMessages");
  const chatForm = document.getElementById("chatForm");
  const messageInput = document.getElementById("messageInput");

  let activeUserId = null;
  let activeUserName = "";

  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("userId"));

  if (!token || !userId) {
    chatList.innerHTML = "<p>Please log in to view your messages.</p>";
    return;
  }

  // ✅ 1. Fetch matched users from backend
  try {
    const res = await fetch("/api/likes/matches", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const matches = data.matches;

    if (!matches || matches.length === 0) {
      chatList.innerHTML = "<p>No matched users yet.</p>";
      chatMessages.innerHTML = "<p class='placeholder'>No conversations available. Start matching!</p>";
      return;
    }

    chatList.innerHTML = ""; // Clear default content

    // ✅ 2. Render matched users into sidebar
    matches.forEach(user => {
      const item = document.createElement("div");
      item.className = "chat-item";
      item.dataset.userid = user.id;
      item.dataset.username = user.name;

      item.innerHTML = `
        <img src="${user.profile_picture_url || 'img/default.jpg'}" alt="${user.name}" class="avatar" />
        <div class="chat-info">
          <p class="chat-name">${user.name}</p>
          <p class="chat-preview">Click to open chat</p>
        </div>
        <span class="chat-time"></span>
      `;

      chatList.appendChild(item);
    });

    // ✅ 3. Add click events for each user
    document.querySelectorAll(".chat-item").forEach(item => {
      item.addEventListener("click", async () => {
        document.querySelectorAll(".chat-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        activeUserId = item.dataset.userid;
        activeUserName = item.dataset.username;
        chatForm.classList.remove("hidden");

        // Load conversation
        try {
          const convRes = await fetch(`/api/messages/${activeUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const messages = await convRes.json();
          chatMessages.innerHTML = "";

          messages.forEach(msg => {
            const bubble = document.createElement("div");
            const isFromUser = msg.sender_id === userId;

            bubble.className = "message-bubble " + (isFromUser ? "from-user" : "from-other");
            bubble.textContent = msg.message_text;
            chatMessages.appendChild(bubble);
          });

          chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (err) {
          console.error("❌ Error loading conversation:", err);
        }
      });
    });

  } catch (err) {
    console.error("❌ Error fetching matches:", err);
    chatList.innerHTML = "<p>Failed to load chat list.</p>";
  }

  // ✅ 4. Send a message
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message || !activeUserId) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: activeUserId, message_text: message }),
      });

      const data = await res.json();

      const bubble = document.createElement("div");
      bubble.className = "message-bubble from-user";
      bubble.textContent = data.data.message_text;
      chatMessages.appendChild(bubble);

      messageInput.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  });
});
