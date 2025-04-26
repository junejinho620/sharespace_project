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

  // ✅ Setup WebSocket connection
  const socket = io("http://localhost:5000"); // Connect to socket.io server

  socket.emit("join", userId); // Join your own user room

  // ✅ Listen for incoming real-time messages
  socket.on("new_message", (message) => {
    console.log("🔥 Received real-time message:", message);
    console.log("activeUserId:", activeUserId, "message.sender_id:", message.sender_id, "message.receiver_id:", message.receiver_id);
  
    const isChatWithSenderActive = parseInt(activeUserId, 10) === parseInt(message.sender_id, 10);
    const isChatWithReceiverActive = parseInt(activeUserId, 10) === parseInt(message.receiver_id, 10);
    const isCurrentChatOpen = isChatWithSenderActive || isChatWithReceiverActive;
  
    if (isCurrentChatOpen) {
      const bubble = document.createElement("div");
      const isFromUser = message.sender_id === userId;
  
      bubble.className = "message-bubble " + (isFromUser ? "from-user" : "from-other");
      bubble.textContent = message.message_text;
  
      chatMessages.appendChild(bubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      // 2. If user is NOT chatting with the sender, show a simple alert (optional)
      alert(`📬 New message from user ${message.sender_id}. Click their chat to reply.`);
    }
  });

  // ✅ Fetch matched users from backend
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

    // ✅ Render matched users into sidebar
    matches.forEach(user => {
      const item = document.createElement("div");
      item.className = "chat-item";
      item.dataset.userid = user.id;
      item.dataset.username = user.name;

      item.innerHTML = `
        <img src="${user.profile_picture_url || 'styles/img/default.jpg'}" alt="${user.name}" class="avatar" />
        <div class="chat-info">
          <p class="chat-name">${user.name}</p>
          <p class="chat-preview">Click to open chat</p>
        </div>
        <span class="chat-time"></span>
      `;

      chatList.appendChild(item);
    });

    // ✅ Add click events for each user
    document.querySelectorAll(".chat-item").forEach(item => {
      item.addEventListener("click", async () => {
        document.querySelectorAll(".chat-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        activeUserId = parseInt(item.dataset.userid, 10);
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

  // ✅ Send a message on form submit
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message || !activeUserId) return;

    try {
      // 1. Save message to backend (DB)
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: activeUserId, message_text: message }),
      });

      const data = await res.json();
      const sentMessageText = data.data.message_text;

      // 2. Instantly show your sent message
      const bubble = document.createElement("div");
      bubble.className = "message-bubble from-user";
      bubble.textContent = sentMessageText;
      chatMessages.appendChild(bubble);

      chatMessages.scrollTop = chatMessages.scrollHeight;
      messageInput.value = "";

      const receiverId = activeUserId;

      // 3. Send message via WebSocket for real-time delivery
      console.log("🚀 Sent message via WebSocket:", {
        to: receiverId,
        message: sentMessageText,
      });

      socket.emit("private_message", {
        receiverId: receiverId,
        message: {
          sender_id: userId,
          receiver_id: receiverId,
          message_text: sentMessageText,
        }
      });

    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  });
});
