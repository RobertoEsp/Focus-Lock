const toggle = document.getElementById("focus-toggle");
const timerDisplay = document.getElementById("timer");
const siteList = document.getElementById("site-list");
const newSiteInput = document.getElementById("new-site");
const addSiteButton = document.getElementById("add-site");
const focusInterface = document.getElementById("focus-interface");
const settingsInterface = document.getElementById("settings-interface");
const exitFocusButton = document.getElementById("exit-focus");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

let focusMode = false;
let startTime = null;
let blockedSites = {
  'tiktok.com': true,
  'instagram.com': true,
  'x.com': true,
  'facebook.com': true
};
let currentTheme = 'dark'; // Default theme

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
}

function updateTimer() {
  if (!focusMode || !startTime) {
    timerDisplay.textContent = "00:00";
    return;
  }
  const elapsed = Date.now() - startTime;
  timerDisplay.textContent = formatTime(elapsed);
  setTimeout(updateTimer, 1000);
}

function applyTheme(theme) {
  const body = document.body;
  
  // Remove existing theme classes
  body.classList.remove('light-theme', 'dark-theme');
  
  // Apply new theme
  if (theme === 'light') {
    body.classList.add('light-theme');
    themeIcon.textContent = '🌙'; // Moon emoji for light theme
  } else {
    body.classList.add('dark-theme');
    themeIcon.textContent = '☀️'; // Sun emoji for dark theme
  }
  
  currentTheme = theme;
}

function switchInterface() {
  if (focusMode) {
    focusInterface.classList.add("active");
    settingsInterface.classList.remove("active");
  } else {
    focusInterface.classList.remove("active");
    settingsInterface.classList.add("active");
  }
}

function renderSites() {
  siteList.innerHTML = "";
  for (const domain in blockedSites) {
    const entry = document.createElement("div");
    entry.className = "site-entry";
    entry.textContent = domain;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-btn";
    removeBtn.onclick = () => {
      delete blockedSites[domain];
      browser.storage.local.set({ blockedSites });
      renderSites();
    };

    entry.appendChild(removeBtn);
    siteList.insertBefore(entry, siteList.firstChild);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get(["focusMode", "startTime", "blockedSites", "theme"], (res) => {
    focusMode = res.focusMode || false;
    startTime = res.startTime || null;
    blockedSites = res.blockedSites || {
      'tiktok.com': true,
      'instagram.com': true,
      'x.com': true,
      'facebook.com': true
    };
    currentTheme = res.theme || 'dark';

    renderSites();
    updateTimer();
    switchInterface();
    applyTheme(currentTheme);
  });

  toggle.addEventListener("click", () => {
    focusMode = !focusMode;
    startTime = focusMode ? Date.now() : null;

    browser.storage.local.set({
      focusMode,
      startTime
    });

    updateTimer();
    switchInterface();
  });

  exitFocusButton.addEventListener("click", () => {
    focusMode = false;
    startTime = null;

    browser.storage.local.set({
      focusMode: false,
      startTime: null
    });

    updateTimer();
    switchInterface();
  });

  addSiteButton.addEventListener("click", () => {
    let domain = newSiteInput.value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    if (domain) {
      blockedSites[domain] = true;
      browser.storage.local.set({ blockedSites });
      renderSites();
      newSiteInput.value = "";
    }
  });

  // Allow Enter key to add sites
  newSiteInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addSiteButton.click();
    }
  });

  // Theme toggle button handler
  themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    browser.storage.local.set({ theme: newTheme });
  });
});
