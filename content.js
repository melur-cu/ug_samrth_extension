// ---------- Remarks ----------
const REMARKS = {
  photo:                  "Invalid photo. Upload a passport-size photo.",
  signature:              "Invalid signature. Upload on white paper.",
  id_proof_upload:        "Invalid ID proof. Upload a govt-issued ID.",
  categoryCertificate:    "Invalid certificate. Treated as Unreserved.",
  nclcategoryCertificate: "Invalid NCL certificate. Treated as Unreserved.",
  incomeCertificate:      "Invalid document. Upload ration card only.",
  domicile_state_upload:  "Invalid domicile. Aadhaar not accepted.",
  cca_quota_upload:       "Invalid document. Upload valid certificate.",
};

// ---------- Dropdown Logic ----------
function setupDropdownLogic() {
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