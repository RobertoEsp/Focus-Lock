const toggle = document.getElementById("focus-toggle");
const timerDisplay = document.getElementById("timer");
const siteList = document.getElementById("site-list");
const newSiteInput = document.getElementById("new-site");
const addSiteButton = document.getElementById("add-site");
const focusInterface = document.getElementById("focus-interface");
const settingsInterface = document.getElementById("settings-interface");
const exitFocusButton = document.getElementById("exit-focus");

let focusMode = false;
let startTime = null;
let blockedSites = {};
let currentTheme = 'green'; // Default theme

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
  const root = document.documentElement;
  
  switch(theme) {
    case 'purple':
      root.style.setProperty('--primary', 'var(--purple-primary)');
      root.style.setProperty('--secondary', 'var(--purple-secondary)');
      root.style.setProperty('--accent', 'var(--purple-accent)');
      root.style.setProperty('--accent-hover', 'var(--purple-accent-hover)');
      root.style.setProperty('--accent-active', 'var(--purple-accent-active)');
      root.style.setProperty('--border', 'var(--purple-border)');
      root.style.setProperty('--border-active', 'var(--purple-border-active)');
      root.style.setProperty('--input-bg', 'var(--purple-input-bg)');
      root.style.setProperty('--placeholder', 'var(--purple-placeholder)');
      break;
    case 'blue':
      root.style.setProperty('--primary', 'var(--blue-primary)');
      root.style.setProperty('--secondary', 'var(--blue-secondary)');
      root.style.setProperty('--accent', 'var(--blue-accent)');
      root.style.setProperty('--accent-hover', 'var(--blue-accent-hover)');
      root.style.setProperty('--accent-active', 'var(--blue-accent-active)');
      root.style.setProperty('--border', 'var(--blue-border)');
      root.style.setProperty('--border-active', 'var(--blue-border-active)');
      root.style.setProperty('--input-bg', 'var(--blue-input-bg)');
      root.style.setProperty('--placeholder', 'var(--blue-placeholder)');
      break;
    case 'green':
      root.style.setProperty('--primary', 'var(--green-primary)');
      root.style.setProperty('--secondary', 'var(--green-secondary)');
      root.style.setProperty('--accent', 'var(--green-accent)');
      root.style.setProperty('--accent-hover', 'var(--green-accent-hover)');
      root.style.setProperty('--accent-active', 'var(--green-accent-active)');
      root.style.setProperty('--border', 'var(--green-border)');
      root.style.setProperty('--border-active', 'var(--green-border-active)');
      root.style.setProperty('--input-bg', 'var(--green-input-bg)');
      root.style.setProperty('--placeholder', 'var(--green-placeholder)');
      break;
  }
  
  // Update theme select value
  document.getElementById('theme-select').value = theme;
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
    siteList.appendChild(entry);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get(["focusMode", "startTime", "blockedSites", "theme"], (res) => {
    focusMode = res.focusMode || false;
    startTime = res.startTime || null;
    blockedSites = res.blockedSites || {};
    currentTheme = res.theme || 'green';

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

  // Theme button click handlers
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      currentTheme = theme;
      applyTheme(theme);
      browser.storage.local.set({ theme });
    });
  });

  // Theme select change handler
  document.getElementById('theme-select').addEventListener('change', (e) => {
    const theme = e.target.value;
    currentTheme = theme;
    applyTheme(theme);
    browser.storage.local.set({ theme });
  });
});
