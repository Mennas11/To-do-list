// Light/dark mode (used by both pages)

const themeBtn = document.querySelector("#theme-btn");
const themeIcon = themeBtn ? themeBtn.querySelector("i") : null;

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

applyTheme(localStorage.getItem("theme") || "light");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}