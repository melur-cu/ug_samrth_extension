// ---------- Remarks ----------
const REMARKS_URL = "https://raw.githubusercontent.com/melur-cu/ug_samrth_extension/main/configs/remarks.json";

let REMARKS = {}; // starts empty, filled after fetch
let removeList = [];

async function loadRemarks() {
  try {
    const response = await fetch(REMARKS_URL);
    if (!response.ok) throw new Error("Failed to fetch remarks");
    REMARKS = await response.json();
    removeList = REMARKS.menu_remove_list;
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



function removeLeftPanelItems(removeList = []) {
    // Get all sidebar links
    const links = document.querySelectorAll("dl.list-group a");

    links.forEach(link => {
        const dd = link.querySelector("dd");
        const text = dd?.querySelector("div")?.textContent?.trim()?.toUpperCase();

        if (!text) return;

        // Match with remove list
        const shouldRemove = removeList.some(item =>
            text.includes(item.toUpperCase())
        );

        if (shouldRemove) {
            link.remove();
        }
    });
}



// ---------- Dropdown Logic ----------
async function setupDropdownLogic() {
  await loadRemarks();
  removeLeftPanelItems(removeList);
}

// ---------- Safe DOM ready ----------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupDropdownLogic);
} else {
  setupDropdownLogic();
}