const redirectUrl = "https://robertoesparza.dev/focuslock/";

let focusMode = false;
let startTime = null;
let blockedSites = {};

browser.storage.local.get(["focusMode", "blockedSites", "startTime"], (res) => {
  focusMode = res.focusMode || false;
  blockedSites = res.blockedSites || {};
  startTime = res.startTime || null;
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.focusMode) focusMode = changes.focusMode.newValue;
  if (changes.blockedSites) blockedSites = changes.blockedSites.newValue;
  if (changes.startTime) startTime = changes.startTime.newValue;
});

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!focusMode) return {};

    const url = new URL(details.url);
    const domain = url.hostname.replace(/^www\./, "");

    if (blockedSites[domain]) {
      return { redirectUrl };
    }
    return {};
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
