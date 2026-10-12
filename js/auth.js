const STORAGE_USERS = "sbb_users";
const STORAGE_SESSION = "sbb_session";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_SESSION) || "null");
  } catch {
    return null;
  }
}

function setSession(user) {
  const safe = {
    userId: user.userId,
    username: user.username,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    institutionId: user.institutionId,
  };
  sessionStorage.setItem(STORAGE_SESSION, JSON.stringify(safe));
}

function clearSession() {
  sessionStorage.removeItem(STORAGE_SESSION);
}

async function seedDemoUser() {
  const users = getUsers();
  if (users.some((u) => u.email === "staff@bloodbank.pk")) return;
  users.push({
    userId: 1,
    fullName: "Demo Staff",
    username: "staffdemo",
    email: "staff@bloodbank.pk",
    passwordHash: await sha256("Staff@123"),
    role: "STAFF",
    institutionId: "FUSST-BB",
    phone: "03001234567",
    bloodGroup: "O+",
  });
  saveUsers(users);
}

async function registerUser(payload) {
  const users = getUsers();
  const username = payload.username.trim().toLowerCase();
  const email = payload.email.trim().toLowerCase();
  if (users.some((u) => u.username.toLowerCase() === username)) {
    throw new Error("That username is already taken.");
  }
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists.");
  }
  const user = {
    userId: Date.now(),
    fullName: payload.fullName.trim(),
    username: payload.username.trim(),
    email: payload.email.trim().toLowerCase(),
    passwordHash: await sha256(payload.password),
    role: payload.role,
    institutionId: payload.institutionId.trim().toUpperCase(),
    phone: payload.phone.replace(/[\s-]/g, ""),
    bloodGroup: payload.bloodGroup,
  };
  users.push(user);
  saveUsers(users);
  setSession(user);
  return user;
}

async function loginUser(identity, password) {
  await seedDemoUser();
  const users = getUsers();
  const key = identity.trim().toLowerCase();
  const user = users.find(
    (u) => u.username.toLowerCase() === key || u.email.toLowerCase() === key
  );
  if (!user) throw new Error("No account found for that username or email.");
  const hash = await sha256(password);
  if (hash !== user.passwordHash) throw new Error("Incorrect password.");
  setSession(user);
  return user;
}

function logoutUser() {
  clearSession();
  window.location.href = "index.html";
}

function requireGuest() {
  if (getSession()) window.location.replace("index.html");
}

function renderChrome() {
  const session = getSession();
  const nav = document.querySelector("[data-nav]");
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
  if (!nav) return;
  const page = document.body.dataset.page;
  const link = (href, key, label) =>
    `<a href="${href}" class="${page === key ? "active" : ""}">${label}</a>`;
  if (session) {
    nav.innerHTML = `
      ${link("index.html", "home", "Home")}
      ${link("contact.html", "contact", "Contact")}
      <span class="user-chip">${session.fullName} · ${session.role.replaceAll("_", " ")}</span>
      <button class="btn btn-ghost" type="button" id="logoutBtn">Log out</button>
    `;
    document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
  } else {
    nav.innerHTML = `
      ${link("index.html", "home", "Home")}
      ${link("contact.html", "contact", "Contact")}
      ${link("login.html", "login", "Sign in")}
      <a class="btn btn-primary" href="register.html">Register</a>
    `;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await seedDemoUser();
  renderChrome();
});
