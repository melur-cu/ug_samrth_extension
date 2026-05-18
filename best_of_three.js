// =========================
// Configuration
// =========================

const CONFIG = {
  SUBJECT_INFO_URL:
    "https://raw.githubusercontent.com/melur-cu/ug_samrth_extension/main/configs/subject_info.json",

  GAP_YEAR_CUTOFF: 2023,

  SCRUTINY_BASE:
    "https://assam.samarth.ac.in/index.php/admissionhed126/admission-list/verify-documents-personal",

  ST_CATEGORIES: [
    "SCHEDULE TRIBE (PLAINS)",
    "SCHEDULE TRIBE (HILLS)",
    "SCHEDULED CASTE (SC)",
    "OBC-NCL"
  ]
};

let SUBJECT_INFO = {};


// =========================
// Utilities
// =========================

const normalizeText = (text = "") =>
  text.trim().toUpperCase();

const normalizeSubject = (text = "") =>
  normalizeText(text).replace(/\s+/g, "_");

const getQueryParams = () =>
  new URL(window.location.href).searchParams;

const generateScrutinyURL = () => {
  const params = getQueryParams();

  return `${CONFIG.SCRUTINY_BASE}?id=${params.get("id")}&programme_selection_id=${params.get("programme_selection_id")}`;
};


// =========================
// Subject Loader
// =========================

async function loadSubjectInfo() {
  try {
    const response = await fetch(CONFIG.SUBJECT_INFO_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    SUBJECT_INFO = await response.json();

    console.log("Subject info loaded");
  } catch (error) {
    console.error("Failed to load subject info:", error);
    SUBJECT_INFO = {};
  }
}


// =========================
// DOM Helpers
// =========================

function findFieldValue(labelText) {

  const labels = document.querySelectorAll("strong.text-muted");

  for (const label of labels) {

    if (label.textContent.trim() !== labelText) continue;

    const parent = label.parentElement;

    const valueElement =
      parent.querySelector(".field-value") ||
      parent.querySelector(".text-sm");

    return valueElement?.textContent.trim() || null;
  }

  return null;
}

function extractMajorName() {

  const labels = document.querySelectorAll("small.text-muted");

  for (const label of labels) {

    if (label.textContent.trim() !== "Scheme | Major/1st Minor") {
      continue;
    }

    const strongs = label.parentElement.querySelectorAll("strong");

    return strongs[1]?.textContent.trim() || null;
  }

  return null;
}


// =========================
// Scrutiny Data
// =========================

async function fetchScrutinyHTML() {

  const response = await fetch(generateScrutinyURL(), {
    method: "GET",
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.text();
}

function parsePersonalDetails(html) {

  const doc = new DOMParser().parseFromString(html, "text/html");

  const result = {
    category: "N/A",
    documents: []
  };

  // Personal Details Card
  const personalCard = [...doc.querySelectorAll(".card")]
    .find(card => {

      const heading = card.querySelector(".card-header h6");

      return heading?.textContent.trim() === "Personal Details";
    });

  if (personalCard) {

    for (const field of personalCard.querySelectorAll(".mb-1")) {

      const key = field
        .querySelector("strong.text-muted")
        ?.textContent.trim();

      const value = field
        .querySelector(".text-sm")
        ?.textContent.trim();

      if (key === "Category") {
        result.category = value || "N/A";
      }
    }
  }

  // Sidebar documents
  result.documents = [
    ...doc.querySelectorAll("dl.list-group dd div")
  ]
    .map(el => el.textContent.trim());

  return result;
}


// =========================
// Business Logic
// =========================

function isReservedCategory(category) {

  return CONFIG.ST_CATEGORIES.includes(
    normalizeText(category)
  );
}

function hasNCLCertificate(documents = []) {

  return documents.some(doc =>
    normalizeText(doc).includes("NCL")
  );
}

function getSubjectRule(subject, isReserved) {

  const fallback = {
    ot: "No criteria available.",
    st: "No criteria available."
  };

  const rule = SUBJECT_INFO[subject] || fallback;

  return isReserved
    ? rule.st || fallback.st
    : rule.ot || fallback.ot;
}


// =========================
// UI
// =========================

function createNoticeBox(data) {

  const {
    subject,
    category,
    passYear,
    isReserved,
    isNCL,
    ruleText
  } = data;

  const hasGapIssue =
    passYear < CONFIG.GAP_YEAR_CUTOFF;

  const alertType =
    hasGapIssue ? "danger" : "info";

  const borderColor =
    hasGapIssue ? "#dc3545" : "#0d6efd";

  const buttonClass =
    hasGapIssue ? "btn-danger" : "btn-primary";

  const div = document.createElement("div");

  div.id = "notice-box";

  div.className =
    `alert alert-${alertType} mt-3 shadow-sm`;

  div.style.borderLeft =
    `5px solid ${borderColor}`;

  div.innerHTML = `
    <p class="mb-1">
      <strong>Subject:</strong> ${subject}
      &nbsp;&nbsp;

      <strong>Category:</strong> ${category}

      ${isReserved
        ? '<span class="badge bg-success ms-2">Relaxation Applied</span>'
        : ""
      }

      ${isNCL
        ? '<span class="badge bg-warning ms-2">NCL Category</span>'
        : ""
      }
    </p>

    <h5 class="mb-2">
      Admission Criteria
    </h5>

    <p class="mb-2">
      ${ruleText}
    </p>

    ${
      hasGapIssue
        ? `
          <div class="alert alert-danger mt-2 mb-2">
            ⚠️ Candidates having more than 3 years study gap are
            <strong>not eligible</strong> for admission.
          </div>
        `
        : ""
    }

    <a
      href="${generateScrutinyURL()}"
      class="btn ${buttonClass} btn-sm"
      target="_blank"
    >
      Document Scrutiny
    </a>
  `;

  return div;
}


// =========================
// Main
// =========================

async function main() {

  try {

    // Prevent duplicate injection
    if (document.getElementById("notice-box")) {
      return;
    }

    await loadSubjectInfo();

    const studentInfoCard =
      document.querySelector(".student-info-card");

    if (!studentInfoCard) {
      throw new Error("Student info card not found");
    }

    const passYear = parseInt(
      findFieldValue("Passing Year")
    );

    const rawSubject = normalizeSubject(
      extractMajorName() || "COMPUTER_APPLICATION"
    );

    // Fetch scrutiny page
    const scrutinyHTML = await fetchScrutinyHTML();

    const personalData =
      parsePersonalDetails(scrutinyHTML);

    const category =
      personalData.category;

    const isNCL =
      hasNCLCertificate(personalData.documents);

    const isReserved =
      isNCL || isReservedCategory(category);

    const ruleText =
      getSubjectRule(rawSubject, isReserved);

    console.log({
      passYear,
      subject: rawSubject,
      category,
      isReserved,
      isNCL
    });

    const noticeBox = createNoticeBox({
      subject: rawSubject,
      category,
      passYear,
      isReserved,
      isNCL,
      ruleText
    });

    studentInfoCard.insertAdjacentElement(
      "afterend",
      noticeBox
    );

  } catch (error) {

    console.error(
      "Extension initialization failed:",
      error
    );
  }
}


// =========================
// Init
// =========================

window.addEventListener("load", () => {
  setTimeout(main, 1000);
});