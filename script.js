const timeElement = document.querySelector("#time");
const periodElement = document.querySelector("#period");
const dayElement = document.querySelector("#day");
const dateElement = document.querySelector("#date");
const greetingElement = document.querySelector("#greeting");
const formatButton = document.querySelector("#format-toggle");
const formatLabel = document.querySelector("#format-label");
const themeButton = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");
const themeIcon = document.querySelector("#theme-icon");
const fullscreenButton = document.querySelector("#fullscreen-toggle");

let is24Hour = localStorage.getItem("clock-format") === "24";
let isDark = localStorage.getItem("clock-theme") === "dark";

const pad = (number) => String(number).padStart(2, "0");

function getGreeting(hour) {
  if (hour < 5) return "Good night 🌙";
  if (hour < 12) return "Good morning ☀️";
  if (hour < 17) return "Good afternoon 🌤️";
  if (hour < 21) return "Good evening 🌆";
  return "Good night 🌙";
}

function updateControls() {
  formatLabel.textContent = is24Hour ? "12-hour" : "24-hour";
  formatButton.setAttribute(
    "aria-label",
    `Switch to ${is24Hour ? "12" : "24"}-hour time`,
  );
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeButton.setAttribute(
    "aria-label",
    `Enable ${isDark ? "light" : "dark"} mode`,
  );
}

function updateClock() {
  const now = new Date();
  const hour24 = now.getHours();
  const period = hour24 >= 12 ? "PM" : "AM";
  const shownHour = is24Hour ? hour24 : hour24 % 12 || 12;

  timeElement.innerHTML = `${pad(shownHour)}<span class="colon">:</span>${pad(now.getMinutes())}<span class="colon">:</span>${pad(now.getSeconds())}`;
  periodElement.textContent = period;
  periodElement.classList.toggle("is-hidden", is24Hour);
  dayElement.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
  }).format(now);
  dateElement.textContent = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  greetingElement.textContent = getGreeting(hour24);
}

function setTheme() {
  document.body.classList.toggle("dark", isDark);
  updateControls();
}

formatButton.addEventListener("click", () => {
  is24Hour = !is24Hour;
  localStorage.setItem("clock-format", is24Hour ? "24" : "12");
  updateControls();
  updateClock();
});

themeButton.addEventListener("click", () => {
  isDark = !isDark;
  localStorage.setItem("clock-theme", isDark ? "dark" : "light");
  setTheme();
});

fullscreenButton.addEventListener("click", async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
});

document.addEventListener("fullscreenchange", () => {
  const active = Boolean(document.fullscreenElement);
  fullscreenButton.setAttribute(
    "aria-label",
    active ? "Exit fullscreen mode" : "Enter fullscreen mode",
  );
  fullscreenButton.title = active ? "Exit fullscreen" : "Fullscreen";
});

setTheme();
updateClock();
setInterval(updateClock, 1000);
