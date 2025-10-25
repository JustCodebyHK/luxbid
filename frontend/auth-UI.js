document.addEventListener("DOMContentLoaded", () => {
  const spinner = document.getElementById("spinner");
  const loginBtn = document.getElementById("loginBtn"); // Changed from "login-btn" to "loginBtn" to match index.html
  const welcomeBox = document.getElementById("welcome-message");

  // Show spinner for 2 seconds, then check session
  if (spinner) spinner.style.display = "block";
  setTimeout(() => {
    checkSession();
  }, 2000);

  function checkSession() {
    fetch("/me", { credentials: "include" })
      .then((res) => {
        if (spinner) spinner.style.display = "none";
        if (!res.ok) return;
        return res.json();
      })
      .then((user) => {
        if (user) {
          if (loginBtn) loginBtn.style.display = "none";
          // Hide Admin Login if present
          const adminBtn = document.getElementById('adminLoginBtn');
          if (adminBtn) adminBtn.style.display = 'none';
          // Show bidding options for logged-in users
          showBiddingOptions();
          showWelcome(user.name || "Guest");
        } else {
          // Hide bidding options for non-logged-in users
          hideBiddingOptions();
        }
      })
      .catch(() => {
        if (spinner) spinner.style.display = "none";
        // Hide bidding options for non-logged-in users
        hideBiddingOptions();
      });
  }

  // Show bidding options for logged-in users
  function showBiddingOptions() {
    const biddingOptions = document.getElementById('biddingOptions');
    if (biddingOptions) {
      biddingOptions.style.display = 'inline-block';
    }
  }

  // Hide bidding options for non-logged-in users
  function hideBiddingOptions() {
    const biddingOptions = document.getElementById('biddingOptions');
    if (biddingOptions) {
      biddingOptions.style.display = 'none';
    }
  }

  function showWelcome(name) {
    const lines = [
      `👋 Welcome back, ${name}!`,
      `We're glad you're here.`,
      `Let’s make your bidding experience amazing.`
    ];

    let index = 0;
    if (welcomeBox) {
      welcomeBox.style.display = "block";
      welcomeBox.style.fontSize = "1.2rem";
      welcomeBox.style.padding = "1rem";
      welcomeBox.style.border = "1px solid #ccc";
      welcomeBox.style.borderRadius = "8px";
      welcomeBox.style.background = "#f0f8ff";
      welcomeBox.style.color = "#333";

      const typeLine = () => {
        if (index < lines.length) {
          welcomeBox.innerHTML += `<p>${lines[index]}</p>`;
          index++;
          setTimeout(typeLine, 800);
        }
      };

      typeLine();
    }
  }
});