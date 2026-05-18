// =========================
// Chrome Extension Utility
// =========================

// ---------- Subject Rules ----------
const SUBJECT_INFO_URL = "https://raw.githubusercontent.com/melur-cu/ug_samrth_extension/main/configs/subject_info.json";
const SUBJECT_INFO = {}; // starts empty, filled after fetch

async function loadSubjectInfo() {
  try {
    const response = await fetch(SUBJECT_INFO_URL);
    if (!response.ok) throw new Error("Failed to fetch subject info");
    SUBJECT_INFO = await response.json();
    console.log("Subject info loaded:", SUBJECT_INFO);
  } catch (error) {
    console.error("Could not load subject info, using fallback:", error);
    // Fallback in case fetch fails
    SUBJECT_INFO = {};
  }
}



// Categories that qualify for ST relaxation
const ST_CATEGORIES = ["SCHEDULE TRIBE (PLAINS)","SCHEDULE TRIBE (HILLS)","SCHEDULED CASTE (SC)","OBC-NCL"];

const GAP_YEAR_CUTOFF = 2023;
const SCRUTINY_BASE   = "https://assam.samarth.ac.in/index.php/admissionhed126/admission-list/verify-documents-personal";


// ---------- URL Helpers ----------
function getQueryParams() {
  return new URL(window.location.href).searchParams;
}

function generateScrutinyURL() {
  const params = getQueryParams();
  return `${SCRUTINY_BASE}?id=${params.get("id")}&programme_selection_id=${params.get("programme_selection_id")}`;
}


// ---------- DOM Extractors ----------
function extractFieldValue(labelText) {
  for (const label of document.querySelectorAll("strong.text-muted")) {
    if (label.textContent.trim() !== labelText) continue;

    const parent = label.parentElement;
    const value  = parent.querySelector(".field-value") ?? parent.querySelector(".text-sm");
    if (value) return value.textContent.trim();
  }
  return null;
}

function extractMajorName() {
  for (const label of document.querySelectorAll("small.text-muted")) {
    if (label.textContent.trim() !== "Scheme | Major/1st Minor") continue;

    const strongs = label.parentElement.querySelectorAll("strong");
    if (strongs.length >= 2) return strongs[1].textContent.trim();
  }
  return null;
}

function extractPersonalDetails(htmlString) {
  const doc    = new DOMParser().parseFromString(htmlString, "text/html");
  const result = {};

  const personalCard = [...doc.querySelectorAll(".card")].find(card => {
    const header = card.querySelector(".card-header h6");
    return header?.textContent.trim() === "Personal Details";
  });

  if (!personalCard) return result;

  for (const field of personalCard.querySelectorAll(".mb-1")) {
    const key   = field.querySelector("strong.text-muted")?.textContent.trim();
    const value = field.querySelector(".text-sm")?.textContent.trim();
    if (key && value) result[key] = value;
  }

  // ---------- DD List (sidebar document list) ----------
  const ddItems = [...doc.querySelectorAll("dl.list-group dd")];

  result["list_of"] = ddItems.map(dd => dd.querySelector("div")?.textContent.trim()).filter(Boolean);

  console.log("Extracted Personal Details:", result);

  return result;
}


// ---------- Data Fetcher ----------
async function fetchScrutinyHTML() {
  const response = await fetch(generateScrutinyURL(), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.text();
}


// ---------- Notice UI ----------
function createNoticeBox({ subject, category, subjectRule, passYear,isNCL }) {
  const isGapYearViolation = passYear < GAP_YEAR_CUTOFF;
  const isSTCategory       = isNCL ? true: ST_CATEGORIES.includes(category.trim().toUpperCase());

  // Pick the correct rule string based on category
  const ruleText = isSTCategory
    ? (subjectRule.st ?? subjectRule.ot ?? "No criteria available.")
    : (subjectRule.ot ?? "No criteria available.");

  const alertType   = isGapYearViolation ? "danger" : "info";
  const borderColor = isGapYearViolation ? "#dc3545" : "#0d6efd";
  const btnClass    = isGapYearViolation ? "btn-danger" : "btn-primary";

  const gapYearWarning = isGapYearViolation
    ? `<div class="alert alert-danger mt-2 mb-2">
         ⚠️ Candidates having more than 3 years study gap are <strong>not eligible</strong> for admission.
       </div>`
    : "";

  const div = document.createElement("div");
  div.id               = "notice-box";
  div.className        = `alert alert-${alertType} mt-3 shadow-sm`;
  div.style.borderLeft = `5px solid ${borderColor}`;

  div.innerHTML = `
    <p class="mb-1">
      <strong>Subject:</strong> ${subject}&nbsp;&nbsp;
      <strong>Category:</strong> ${category}
      ${isSTCategory ? '<span class="badge bg-success ms-2">Relaxation Applied</span>' : ""}
      &nbsp;&nbsp;
      ${isNCL ? '<span class="badge bg-warning ms-2">NCL Category</span>' : ""}
      
    </p>
    <h5 class="mb-2">Admission Criteria</h5>
    <p class="mb-2">${ruleText}</p>
    ${gapYearWarning}
    <a href="${generateScrutinyURL()}" class="btn ${btnClass} btn-sm" target="_blank">
      Document Scrutiny
    </a>
  `;

  return div;
}


// ---------- Main ----------
async function main() {
  await loadSubjectInfo();
  if (document.getElementById("notice-box")) return;

  const studentInfoCard = document.querySelector(".student-info-card");
  if (!studentInfoCard) {
    console.error("Student info card not found");
    return;
  }

  const passYear   = parseInt(extractFieldValue("Passing Year"));
  const formNumber = extractFieldValue("Form Number");

  if (!formNumber) {
    console.error("Form number not found");
    return;
  }

  const rawSubject  = (extractMajorName() ?? "COMPUTER_APPLICATION").trim().toUpperCase().replace(/\s+/g, "_");
  const subjectRule = SUBJECT_INFO[rawSubject] ?? { ot: "No criteria available.", st: "No criteria available." };

  const scrutinyHTML = await fetchScrutinyHTML();
  const category     = extractPersonalDetails(scrutinyHTML)["Category"] ?? "N/A";
  const isNCL       = extractPersonalDetails(scrutinyHTML)["list_of"]?.some(item => item.toUpperCase().includes("NCLCATEGORY CERTIFICATE")) ?? false;

  console.log({ passYear, formNumber, subject: rawSubject, category, isSTCategory: ST_CATEGORIES.includes(category.trim().toUpperCase()),isNCL });

  studentInfoCard.insertAdjacentElement("afterend", createNoticeBox({
    subject: rawSubject,
    category,
    subjectRule,
    passYear,
    isNCL
  }));
}


// ---------- Init ----------
window.addEventListener("load", () => setTimeout(main, 1000));