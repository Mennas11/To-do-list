// 	Register, login, logout, validation

const registerBox = document.querySelector(".registration");
const loginBox = document.querySelector(".login");
const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
const registerMsg = document.querySelector("#register-error");
const loginMsg = document.querySelector("#login-message");

if (getCurrentUser()) {
  window.location.href = "app.html";
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = "message " + type; // type = "error" أو "success"
}

document.querySelector("#show-login").addEventListener("click", (e) => {
  e.preventDefault();
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

document.querySelector("#show-register").addEventListener("click", (e) => {
  e.preventDefault();
  loginBox.classList.add("hidden");
  registerBox.classList.remove("hidden");
});

// ---------- Register ----------
registerForm.addEventListener("submit", (e) => {
  e.preventDefault(); 

  const email = document.querySelector("#email").value.trim().toLowerCase();
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;
  const users = getUsers();

  if (username.length < 3) {
    showMessage(registerMsg, "Username must be at least 3 characters", "error");
    return;
  }
  if (password.length < 6) {
    showMessage(registerMsg, "Password is too short (min 6 characters)", "error");
    return;
  }
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    showMessage(registerMsg, "Username already exists", "error");
    return;
  }
  if (users.some((u) => u.email === email)) {
    showMessage(registerMsg, "Email already registered", "error");
    return;
  }

  users.push({ id: Date.now(), username, email, password });
  saveUsers(users);

  registerForm.reset();
  registerMsg.textContent = "";
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
  showMessage(loginMsg, "Account created! Please sign in", "success");
});

// ---------- Login ----------
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const identifier = document.querySelector("#login-identifier").value.trim().toLowerCase();
  const password = document.querySelector("#login-password").value;

  const user = getUsers().find(
    (u) => u.username.toLowerCase() === identifier || u.email === identifier
  );

  if (!user || user.password !== password) {
    showMessage(loginMsg, "Invalid username or password", "error");
    return;
  }

  saveCurrentUser(user.id);
  window.location.href = "app.html";
});