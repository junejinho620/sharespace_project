document.addEventListener("DOMContentLoaded", async () => {
  const chatList = document.getElementById("chatList");
  const chatMessages = document.getElementById("chatMessages");
  const chatForm = document.getElementById("chatForm");
  const messageInput = document.getElementById("messageInput");

  let activeUserId = null;
  let activeUserName = "";
  let matchedUsers = [];

  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("userId"));

  if (!token || !userId) {
    chatList.innerHTML = "<p>Please log in to view your messages.</p>";
    return;
  }

  function showToast(message, senderId) {
    const toastContainer = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    // Make toast clickable
    toast.style.cursor = "pointer";
    toast.addEventListener("click", async () => {
      console.log("🔗 Toast clicked. Jumping to chat with user:", senderId);

      const targetChatItem = document.querySelector(
        `.chat-item[data-userid="${senderId}"]`
      );

      if (targetChatItem) {
        // Smoothly scroll to the chat user
        targetChatItem.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Then after 0.3 seconds, open that chat
        setTimeout(() => {
          targetChatItem.click();
        }, 300);
      } else {
        console.log("⚠️ Target chat not found for user:", senderId);
      }

      toast.remove(); // Remove the toast immediately after click
    });

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    // Remove after 3.5 seconds if not clicked
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 3500);
  }

  // ✅ Setup WebSocket connection
  const socket = io("http://localhost:5001"); // Connect to socket.io server

  socket.emit("join", userId); // Join your own user room

  // ✅ Listen for incoming real-time messages
  socket.on("new_message", (message) => {
    console.log("🔥 Received real-time message:", message);

    const isOwnMessage = message.sender_id === userId;
    const isChatWithSenderActive =
      parseInt(activeUserId, 10) === parseInt(message.sender_id, 10);
    const isChatWithReceiverActive =
      parseInt(activeUserId, 10) === parseInt(message.receiver_id, 10) &&
      isOwnMessage;
    const isCurrentChatOpen =
      isChatWithSenderActive || isChatWithReceiverActive;

    const targetUserId = isOwnMessage ? message.receiver_id : message.sender_id;
    const targetChatItem = document.querySelector(
      `.chat-item[data-userid="${targetUserId}"]`
    );

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // If chatting with the user, display the new message
    if (isCurrentChatOpen) {
      const bubble = document.createElement("div");
      const isFromUser = message.sender_id === userId;
      bubble.className =
        "message-bubble " + (isFromUser ? "from-user" : "from-other");
      bubble.innerHTML = `
        <div>${message.message_text}</div>
        <div class="message-time">${currentTime}</div>
      `;

      chatMessages.appendChild(bubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Update sidebar preview in real-time
    if (targetChatItem) {
      // Update preview text
      const preview = targetChatItem.querySelector(".chat-preview");
      if (preview) {
        preview.innerText = message.message_text;
      }
      // Move chat to top of chatList
      const chatList = document.getElementById("chatList");
      chatList.prepend(targetChatItem);
    }

    if (!isOwnMessage && !isCurrentChatOpen) {
      const senderUser = matchedUsers.find((u) => u.id === message.sender_id);
      const senderName = senderUser
        ? senderUser.name
        : `User ${message.sender_id}`;

      // If user is NOT chatting with the sender, show a toast popup
      showToast(
        `📬 New message from user ${senderName}. Click their chat to reply.`,
        message.sender_id
      );
    }
  });

  // ✅ Fetch matched users from backend
  try {
    const res = await fetch("/api/likes/matches", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const matches = data.matches;
    matchedUsers = matches;

    if (!matches || matches.length === 0) {
      chatList.innerHTML = "<p>No matched users yet.</p>";
      chatMessages.innerHTML =
        "<p class='placeholder'>No conversations available. Start matching!</p>";
      return;
    }

    chatList.innerHTML = ""; // Clear default content

    // ✅ Render matched users into sidebar
    matches.forEach((user) => {
      const item = document.createElement("div");
      item.className = "chat-item";
      item.dataset.userid = user.id;
      item.dataset.username = user.name;

      const previewText = user.last_message
        ? user.last_message
        : "Click to start chat";

      item.innerHTML = `
        <img src="${
          user.profile_picture_url || "styles/img/default.jpg"
        }" alt="${user.name}" class="avatar" />
        <div class="chat-info">
          <p class="chat-name">${user.name}</p>
          <p class="chat-preview">${previewText}</p>
        </div>
        <span class="chat-time"></span>
      `;

      chatList.appendChild(item);
    });

    // ✅ Add click events for each user
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.addEventListener("click", async () => {
        document
          .querySelectorAll(".chat-item")
          .forEach((i) => i.classList.remove("active"));
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
          let previousDate = null; // Track last rendered message date

          messages.forEach((msg) => {
            const messageDate = new Date(msg.sent_at);
            const currentDateString = messageDate.toDateString(); // "Tue Apr 30 2025"

            // ✅ Check if we need a date separator
            if (currentDateString !== previousDate) {
              const dateSeparator = document.createElement("div");
              dateSeparator.className = "date-separator";

              // ✅ Format separator: "Today", "Yesterday", or full date
              const today = new Date();
              const yesterday = new Date();
              yesterday.setDate(today.getDate() - 1);

              if (currentDateString === today.toDateString()) {
                dateSeparator.innerText = "Today";
              } else if (currentDateString === yesterday.toDateString()) {
                dateSeparator.innerText = "Yesterday";
              } else {
                // Format full date nicely
                dateSeparator.innerText = messageDate.toLocaleDateString(
                  undefined,
                  {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                );
              }

              chatMessages.appendChild(dateSeparator);
              previousDate = currentDateString;
            }

            // ✅ Create message bubble
            const bubble = document.createElement("div");
            const isFromUser = msg.sender_id === userId;

            bubble.className =
              "message-bubble " + (isFromUser ? "from-user" : "from-other");

            // Format time (e.g., 11:34 AM)
            const timeString = messageDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            // Bubble content includes message text + small time under it
            bubble.innerHTML = `
              <div>${msg.message_text}</div>
              <div class="message-time">${timeString}</div>
            `;

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
        body: JSON.stringify({
          receiver_id: activeUserId,
          message_text: message,
        }),
      });

      const data = await res.json();
      const sentMessageText = data.data.message_text;

      messageInput.value = "";

      const receiverId = activeUserId;

      // 2. Send message via WebSocket for real-time delivery
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
        },
      });
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  });
});
