document.addEventListener("DOMContentLoaded", () => {
  const chatItems = document.querySelectorAll(".chat-item");
  const chatMessages = document.getElementById("chatMessages");
  const chatForm = document.getElementById("chatForm");
  const messageInput = document.getElementById("messageInput");

  let activeUser = "";

  chatItems.forEach(item => {
    item.addEventListener("click", () => {
      const user = item.dataset.user;
      activeUser = user;

      // Visually mark active chat
      chatItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      chatForm.classList.remove("hidden");

      // Clear and load mock messages
      chatMessages.innerHTML = `
        <div class="message-bubble from-other">Hey ${user}!</div>
        <div class="message-bubble from-user">Hi, how are you?</div>
      `;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  });

  chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;

    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble", "from-user");
    bubble.textContent = message;
    chatMessages.appendChild(bubble);
    messageInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
});
