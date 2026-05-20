const FALLBACK_CONFIG = {
  sites: [
    "https://assam.samarth.ac.in/index.php/site/reset-password",
    "https://assam.samarth.ac.in/index.php/dashboard/dashboard/index"
  ],
  redirect_root: [
    "https://assam.samarth.ac.in/index.php/admissionhed126/applicants/paid-list-acad"
  ]
};

let siteList = [];
let redirectRootList = [];

async function loadDashboard() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/melur-cu/ug_samrth_extension/main/configs/dashboard.json"
    );

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const { sites, redirect_root } = await response.json();
    siteList = sites ?? FALLBACK_CONFIG.sites;
    redirectRootList = redirect_root ?? FALLBACK_CONFIG.redirect_root;

    console.log("Sites loaded from remote:", siteList);
  } catch (error) {
    console.warn("Failed to load remote config, using fallback:", error);
    siteList = FALLBACK_CONFIG.sites;
    redirectRootList = FALLBACK_CONFIG.redirect_root;
  }
}

function redirect() {
  const target = redirectRootList[0];
  if (target && siteList.includes(window.location.href)) {
    window.location.replace(target);
  }
}

async function init() {
  await loadDashboard();
  redirect();
}

// ---------- Safe DOM ready ----------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}