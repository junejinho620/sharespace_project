document.addEventListener("DOMContentLoaded", function () {
  const codeForm = document.querySelector(".code-form");
  const codeInputs = Array.from(document.querySelectorAll(".code-input"));
  const emailDisplay = document.getElementById("user-email");
  const userEmail = localStorage.getItem("userEmail");

  // Show dynamic email
  if (userEmail) {
    emailDisplay.textContent = userEmail;
  } else {
    emailDisplay.textContent = "your email";
  }

  // Auto-jump & backspace
  codeInputs.forEach((input, idx) => {
    input.addEventListener("input", (e) => {
      // Only allow digits
      e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);

      if (e.target.value && idx < codeInputs.length - 1) {
        codeInputs[idx + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && idx > 0) {
        codeInputs[idx - 1].focus();
      }
    });
  });

  // Paste handler — spread digits across inputs
  codeInputs[0].addEventListener("paste", (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    const digits = paste.replace(/[^0-9]/g, "").slice(0, codeInputs.length);
    digits.split("").forEach((d, i) => {
      codeInputs[i].value = d;
    });
    // focus next empty or last
    const nextIdx = Math.min(digits.length, codeInputs.length - 1);
    codeInputs[nextIdx].focus();
  });

  // Resend link
  const resendLink = document.querySelector(".resend-link");
  resendLink.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost:5001/api/users/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("✅ Verification code resent!");
        // Optionally clear inputs
        codeInputs.forEach((i) => (i.value = ""));
        codeInputs[0].focus();
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error("Resend error:", err);
      alert("An error occurred while resending the code.");
    }
  });

  // Handle form submit
  codeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = codeInputs.map((i) => i.value).join("");
    const email = localStorage.getItem("userEmail");

    try {
      const res = await fetch("http://localhost:5001/api/users/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        const payload = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("userId", payload.id);

        alert("✅ Email verified!");
        window.location.href = "signup-step3.html";
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      console.error("Error during verification:", error);
      alert("❌ An error occurred during verification.");
    }
  });
});
