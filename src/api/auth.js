const USERS_KEY = "crm_users";
const SESSION_KEY = "crm_session";

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);
  const defaults = [
    { id: 1, username: "admin", password: "admin123", name: "מנהל", role: "administrator" },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function login(username, password) {
  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) throw new Error("שם משתמש או סיסמה שגויים");
  const session = { id: user.id, username: user.username, name: user.name, roles: [user.role] };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getAllUsers() {
  return getUsers().map(({ password: _, ...u }) => u);
}

export function addUser({ username, password, name, role }) {
  const users = getUsers();
  if (users.find((u) => u.username === username)) throw new Error("שם משתמש כבר קיים");
  const id = Date.now();
  users.push({ id, username, password, name, role: role || "viewer" });
  saveUsers(users);
  return { id, username, name, roles: [role || "viewer"] };
}

export function deleteUser(id) {
  const users = getUsers().filter((u) => u.id !== id);
  saveUsers(users);
}

export function updateUserPassword(id, newPassword) {
  const users = getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error("משתמש לא נמצא");
  user.password = newPassword;
  saveUsers(users);
}
