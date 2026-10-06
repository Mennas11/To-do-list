// localStorage only

function getUsers() {
  const data = localStorage.getItem("users");
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getTasks() {
  const data = localStorage.getItem("tasks");
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function saveCurrentUser(id) {
  localStorage.setItem("currentUser", id);
}

function removeCurrentUser() {
  localStorage.removeItem("currentUser");
}