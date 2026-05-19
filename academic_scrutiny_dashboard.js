// =========================
// Table Manipulator
// =========================

// ---------- Constants ----------
const CONFIG_URL = "https://raw.githubusercontent.com/melur-cu/ug_samrth_extension/main/configs/academic_scrutiny_dashboard.json";

// ---------- Default Config ----------
const DEFAULT_CONFIG = {
  highlightRows: true,
  categoryColors: {
    "SCHEDULE TRIBE (PLAINS)":  { bg: "#fff3cd", badge: "warning" },
    "SCHEDULED TRIBE (PLAINS)": { bg: "#fff3cd", badge: "warning" },
    "SCHEDULE TRIBE (HILLS)":   { bg: "#cfe2ff", badge: "primary" },
    "SCHEDULED TRIBE (HILLS)":  { bg: "#cfe2ff", badge: "primary" },
    "SCHEDULED CASTE (SC)":     { bg: "#d1e7dd", badge: "success" },
    "OBC / MOBC":               { bg: "#f8d7da", badge: "danger"  },
    "OBC-NCL":                  { bg: "#f8d7da", badge: "danger"  },
    "GENERAL":                  { bg: "#ffffff", badge: "secondary"},
  },
  columnVisibility: {
    "Email":   false,
    "Mobile":  false,
    "Gender":  true,
  },
  percentageThreshold: 60,
};

let CONFIG = { ...DEFAULT_CONFIG };

// ---------- Remote Config Loader ----------
async function loadTableConfig() {
  try {
    const response = await fetch(CONFIG_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    CONFIG = await response.json();
    console.log("Table config loaded:", CONFIG);
  } catch (error) {
    console.warn("Using default table config:", error);
    CONFIG = { ...DEFAULT_CONFIG };
  }
}


// ---------- Table Helpers ----------
function getTable() {
  return document.querySelector("#applicants table");
}

function getHeaders() {
  return [...document.querySelectorAll("#applicants thead tr:first-child th")]
    .map(th => th.textContent.trim());
}

function getColumnIndex(headers, name) {
  return headers.findIndex(h => h === name);
}


// ---------- Row Highlighter ----------
function highlightRows() {
  if (!CONFIG.highlightRows) return;

  const headers     = getHeaders();
  const categoryIdx = getColumnIndex(headers, "Category");
  const pctIdx      = getColumnIndex(headers, "XII - Percentage");

  if (categoryIdx === -1) return;

  document.querySelectorAll("#applicants tbody tr").forEach(row => {
    const cells      = row.querySelectorAll("td");
    const category   = cells[categoryIdx]?.textContent.trim().toUpperCase() ?? "";
    const percentage = parseFloat(cells[pctIdx]?.textContent.trim()) || 0;
    const colorInfo  = CONFIG.categoryColors?.[category];

    // Category background
    if (colorInfo) {
      row.style.backgroundColor = colorInfo.bg;

      // Replace plain category text with a badge
      const catCell = cells[categoryIdx];
      if (catCell && !catCell.querySelector(".badge")) {
        catCell.innerHTML = `<span class="badge bg-${colorInfo.badge}">${cells[categoryIdx].textContent.trim()}</span>`;
      }
    }

    // Flag low percentage
    if (pctIdx !== -1 && percentage < CONFIG.percentageThreshold) {
      const pctCell = cells[pctIdx];
      if (pctCell && !pctCell.querySelector(".blink")) {
        pctCell.innerHTML = `<span class="blink text-danger">${percentage.toFixed(4)}</span>`;
      }
    }
  });
}


// ---------- Column Visibility ----------
function applyColumnVisibility() {
  const visibility = CONFIG.columnVisibility;
  if (!visibility) return;

  const headers = getHeaders();

  Object.entries(visibility).forEach(([colName, visible]) => {
    if (visible) return; // skip visible columns

    const idx = getColumnIndex(headers, colName);
    if (idx === -1) return;

    // Hide header
    const thList = document.querySelectorAll("#applicants thead tr");
    thList.forEach(tr => {
      const cells = tr.querySelectorAll("th, td");
      if (cells[idx]) cells[idx].style.display = "none";
    });

    // Hide body cells
    document.querySelectorAll("#applicants tbody tr").forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells[idx]) cells[idx].style.display = "none";
    });
  });
}


// ---------- Summary Bar ----------
function injectSummaryBar() {
  if (document.getElementById("ext-summary-bar")) return;

  const headers     = getHeaders();
  const categoryIdx = getColumnIndex(headers, "Category");
  const rows        = [...document.querySelectorAll("#applicants tbody tr")];

  // Count by category
  const counts = {};
  rows.forEach(row => {
    const cat = row.querySelectorAll("td")[categoryIdx]
      ?.textContent.trim() ?? "Unknown";
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const badges = Object.entries(counts).map(([cat, count]) => {
    const colorInfo = CONFIG.categoryColors?.[cat.toUpperCase()];
    const badge     = colorInfo?.badge ?? "secondary";
    return `<span class="badge bg-${badge} me-2">${cat}: ${count}</span>`;
  }).join("");

  const bar = document.createElement("div");
  bar.id        = "ext-summary-bar";
  bar.className = "alert alert-light border mb-2 py-2";
  bar.innerHTML = `<strong>Page Summary:</strong> ${badges} <span class="text-muted small ms-2">(${rows.length} shown)</span>`;

  const table = document.querySelector("#applicants");
  table?.insertAdjacentElement("beforebegin", bar);
}


// ---------- Main ----------
async function tableMain() {
  if (!document.querySelector("#applicants table")) return;
  console.log("Academic Scrutiny Dashboard: Initializing...");

  await loadTableConfig();

  highlightRows();
  applyColumnVisibility();
  injectSummaryBar();
}


// ---------- Init ----------
window.addEventListener("load", () => setTimeout(tableMain, 1000));