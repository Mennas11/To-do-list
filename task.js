// CRUD, filters, search, drawing tasks


const currentUserId = Number(getCurrentUser());
if (!currentUserId) {
  window.location.href = "index.html";
}

const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const searchInput = document.querySelector("#search");
const filterButtons = {
  all: document.querySelector("#all-btn"),
  pending: document.querySelector("#pending-btn"),
  done: document.querySelector("#done-btn"),
};

let currentFilter = "all";
let editingId = null;

// ---------- Logout ----------
document.querySelector("#logout-btn").addEventListener("click", () => {
  removeCurrentUser();
  window.location.href = "index.html";
});

function getMyTasks() {
  return getTasks().filter((t) => t.userId === currentUserId);
}

function renderTasks() {
  const search = searchInput.value.trim().toLowerCase();
  const today = new Date().toISOString().split("T")[0];

  const tasks = getMyTasks().filter((t) => {
    if (currentFilter === "pending" && t.completed) return false;
    if (currentFilter === "done" && !t.completed) return false;
    return t.title.toLowerCase().includes(search);
  });

  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `<li class="empty">No tasks yet</li>`;
    return;
  }

  tasks.forEach((task) => {
    const overdue = !task.completed && task.dueDate && task.dueDate < today;
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " done" : "");
    li.innerHTML = `
      <input type="checkbox" data-action="toggle" data-id="${task.id}" ${task.completed ? "checked" : ""}>
      <div class="task-info">
        <span class="task-title"></span>
        <small>
          <span class="badge ${task.priority}">${task.priority}</span>
          ${task.dueDate ? `📅 ${task.dueDate}` : ""}
          ${overdue ? `<span class="badge overdue">Overdue</span>` : ""}
        </small>
      </div>
      <button data-action="edit" data-id="${task.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
      <button data-action="delete" data-id="${task.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
    `;
    li.querySelector(".task-title").textContent = task.title;
    taskList.appendChild(li);
  });
}

// ---------- Add / Update ----------
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#task-title").value.trim();
  const dueDate = document.querySelector("#task-due").value;
  const priority = document.querySelector("#task-priority").value;

  if (!title) return;

  const allTasks = getTasks();

  if (editingId) {
    const task = allTasks.find((t) => t.id === editingId);
    task.title = title;
    task.dueDate = dueDate;
    task.priority = priority;
    editingId = null;
    document.querySelector("#add-btn").textContent = "Add Task";
  } else {
    allTasks.push({
      id: Date.now(),
      title,
      dueDate,
      priority,
      completed: false,
      userId: currentUserId,
      createdAt: new Date().toISOString(),
    });
  }

  saveTasks(allTasks);
  taskForm.reset();
  renderTasks();
});

// ---------- Toggle / Edit / Delete ----------
taskList.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;

  const id = Number(el.dataset.id);
  const action = el.dataset.action;
  let allTasks = getTasks();

  if (action === "toggle") {
    const task = allTasks.find((t) => t.id === id);
    task.completed = !task.completed;
    saveTasks(allTasks);
  }

  if (action === "delete") {
    if (!confirm("Delete this task?")) return;
    allTasks = allTasks.filter((t) => t.id !== id);
    saveTasks(allTasks);
  }

  if (action === "edit") {
    const task = allTasks.find((t) => t.id === id);
    document.querySelector("#task-title").value = task.title;
    document.querySelector("#task-due").value = task.dueDate;
    document.querySelector("#task-priority").value = task.priority;
    document.querySelector("#add-btn").textContent = "Update Task";
    editingId = id;
    return;
  }

  renderTasks();
});

// ---------- Filters ----------
Object.entries(filterButtons).forEach(([name, btn]) => {
  btn.addEventListener("click", () => {
    currentFilter = name;
    Object.values(filterButtons).forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks();
  });
});

// ---------- Search ----------
searchInput.addEventListener("input", renderTasks);

renderTasks();