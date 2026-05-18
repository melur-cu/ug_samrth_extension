// ---------- Remarks ----------
const REMARKS_URL = "https://raw.githubusercontent.com/melur-cu/ug_samrth_extension/main/configs/remarks.json";

let REMARKS = {}; // starts empty, filled after fetch

async function loadRemarks() {
  try {
    const response = await fetch(REMARKS_URL);
    if (!response.ok) throw new Error("Failed to fetch remarks");
    REMARKS = await response.json();
    console.log("Remarks loaded:", REMARKS);
  } catch (error) {
    console.error("Could not load remarks, using fallback:", error);
    // Fallback in case fetch fails
    REMARKS = {
      photo: "Invalid photo. Upload a passport-size photo.",
      // ...other fallbacks
    };
  }
}


// ---------- Dropdown Logic ----------
async function setupDropdownLogic() {
  await loadRemarks();
  const field = new URL(window.location.href).searchParams.get("field") || "photo";
  console.log("Dropdown field identified:", field);

  const checkbox         = document.getElementById("reupload-checkbox");
  const remarksContainer = document.getElementById("remarks-container");
  const statusSaveButton = document.getElementById("status-save-button");
  const textarea         = document.getElementById("admuploadstatus-document_remarks");

  if (!checkbox || !textarea) return;

  // Neutralize the page's inline onchange and jQuery DOMContentLoaded call
  window.toggleRemarksField = () => {};

  function updateRemarks() {
    const show = checkbox.checked;
    remarksContainer.style.display = show ? "block" : "none";
    statusSaveButton.style.display = show ? "block" : "none";
    textarea.value                 = show ? (REMARKS[field] ?? "") : "";
  }

  updateRemarks();
  checkbox.addEventListener("change", updateRemarks);
}

// ---------- Safe DOM ready ----------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupDropdownLogic);
} else {
  setupDropdownLogic();
}