
// =========================
// Chrome Extension Utility
// =========================

// ---------- Subject Rules ----------
const subjectInfo = {
  "POLITICAL_SCIENCE":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "ASSAMESE":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "HISTORY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "ENGLISH":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "PSYCHOLOGY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "ECONOMICS":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "ANTHROPOLOGY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "SOCIOLOGY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "BODO":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "EDUCATION":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "HINDI":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "PHILOSOPHY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "SANSKRIT":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "BENGALI":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "ARABIC":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "BIOTECHNOLOGY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose best 3 science subjects"],
  "COMPUTER_SCIENCE":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points with pass marks in Mathematics.","Choose best 3 science subjects"],
  "ZOOLOGY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points with pass marks in Biology.","Choose best 3 science subjects"],
  "BOTANY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points with pass marks in Biology.","Choose best 3 science subjects"],
  "PHYSICS":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points with 50% marks in Physics and pass marks in Mathematics.","Choose best 3 science subjects"],
  "CHEMISTRY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points with 50% marks in Chemistry and pass marks in Mathematics.","Choose best 3 science subjects"],
  "MATHEMATICS":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points with 50% marks in Mathematics.","If applicant passed in arts stream, then any 3 best subjects. If applicant passed in science stream, then best 3 science subjects."],
  "GEOLOGY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points with pass marks in Physics/Chemistry/Mathematics.","Choose best 3 science subjects"],
  "GEOGRAPHY":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points.","Choose any best 3 subjects"],
  "STATISTICS":["HS/10+2 standard pass with minimum 60% aggregate marks or equivalent grade points with pass marks in Mathematics.","If applicant passed in arts stream, then any 3 best subjects. If applicant passed in science stream, then best 3 science subjects."],
  "BCA":["10+2 standard pass with minimum 60% aggregate marks or equivalent grade points with pass marks in Mathematics/Applied Mathematics.","Choose any 3 best subjects with pass marks in Mathematics/Applied Mathematics"],


}





// ---------- Generic Extractor ----------
function extractFieldValue(labelText) {

  const labels = document.querySelectorAll("strong.text-muted");

  for (const label of labels) {

    if (label.textContent.trim() === labelText) {

      const valueElement =
        label.parentElement.querySelector(".field-value") ||
        label.parentElement.querySelector(".text-sm");

      if (valueElement) {
        return valueElement.textContent.trim();
      }
    }
  }

  return null;
}

function extractMajorName() {

    // Find all labels
    const labels = document.querySelectorAll("small.text-muted");

    for (const label of labels) {

        // Match the required section
        if (
            label.textContent.trim() ===
            "Scheme | Major/1st Minor"
        ) {

            // Get parent container
            const parent = label.parentElement;

            // Find all strong tags inside
            const strongTags = parent.querySelectorAll("strong");

            // Second <strong> contains Major name
            if (strongTags.length >= 2) {

                return strongTags[1]
                    .textContent
                    .trim();
            }
        }
    }

    return null;
}


// ---------- URL Generator ----------
function generateScrutinyURL() {

  const currentURL = new URL(window.location.href);

  return `https://assam.samarth.ac.in/index.php/admissionhed126/admission-list/verify-documents-personal?id=${currentURL.searchParams.get("id")}&programme_selection_id=${currentURL.searchParams.get("programme_selection_id")}`;

}

// ---------- Storage Reader ----------
async function getData() {
  try {
    const response = await fetch(generateScrutinyURL(), {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Request failed');

    const html = await response.text();

    return html;
    
    
  } catch (error) {
    console.error('Error:', error);
  }
}


// ---------- Notice UI ----------
function createNoticeBox(data) {

  const noticeDiv = document.createElement('div');

  noticeDiv.id = "notice-box";

  noticeDiv.className =
    "alert alert-info mt-3 shadow-sm";

  noticeDiv.style.borderLeft = "5px solid #0d6efd";

  noticeDiv.innerHTML = data;

  return noticeDiv;
}

function extractPersonalDetails(htmlString) {
    // Parse HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const result = {};

    // Find the "Personal Details" card
    const cards = doc.querySelectorAll(".card");

    let personalCard = null;

    cards.forEach(card => {
        const header = card.querySelector(".card-header h6");

        if (header && header.textContent.trim() === "Personal Details") {
            personalCard = card;
        }
    });

    if (!personalCard) {
        return result;
    }

    // Get all fields inside Personal Details section
    const fields = personalCard.querySelectorAll(".mb-1");

    fields.forEach(field => {
        const keyElement = field.querySelector("strong.text-muted");
        const valueElement = field.querySelector(".text-sm");

        if (keyElement && valueElement) {
            const key = keyElement.textContent.trim();
            const value = valueElement.textContent.trim();

            result[key] = value;
        }
    });

    return result;
}


// ---------- Main Logic ----------
async function main() {

  try {

    // Prevent duplicate insertion
    if (document.getElementById('notice-box')) {
      return;
    }

    // Extract values
    const passYear = parseInt(
      extractFieldValue("Passing Year")
    );

    const formNumber =
      extractFieldValue("Form Number");

    const parent =
      document.querySelector('.row.g-3 .col-md-6');

    if (!parent) {
      console.error("Parent container not found");
      return;
    }

    console.log("Passing Year:", passYear);
    console.log("Form Number:", formNumber);
    console.log("Extracting major name...",extractMajorName());
    

    if (!formNumber) {
      console.error("Form number not found");
      return;
    }

    // Extract subject
    
    let subject = extractMajorName() || "BCA";

    subject = subject
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_');
    console.log(subject);

    const subjectRule =
      subjectInfo[subject] || [
        "No criteria available.",
        "No subject rule available."
      ];
    
    let category = extractPersonalDetails(await getData())["Category"] || "N/A";

    // Create Notice HTML
    let html = `
      <h5 class="mb-3">Admission Criteria</h5>

      <p>
        <strong>Subject:</strong> ${subject}
      </p>

      <p>
        <strong>Category:</strong> ${category}
      </p>

      <ul>
        <li>${subjectRule[0]}</li>
        <li>${subjectRule[1]}</li>
      </ul>
    `;

    // Gap year validation
    if (passYear < 2023) {

      html += `
        <div class="alert alert-warning mt-2 mb-2">
          Candidates having more than 3 years
          study gap are not eligible for admission.
        </div>
      `;
    }

    // Add scrutiny button
    html += `
      <a href="${generateScrutinyURL()}"
         class="btn btn-primary btn-sm"
         target="_blank">
         Document Scrutiny

      </a>
    `;

    // Append UI
    parent.appendChild(
      createNoticeBox(html)
    );

  }
  catch (error) {

    console.error(
      "Extension Error:",
      error
    );

  }
}


// ---------- Wait Until Page Ready ----------
window.addEventListener('load', () => {

  setTimeout(() => {
    main();
  }, 1000);

});

