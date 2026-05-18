
function readData(keyValue) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('applicantData', (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError); // in case of error
        return;
      }

      const storedRows = result.applicantData || [];
      const row = storedRows.find(row => row[1] === keyValue); // use column index 1 as key

      if (row) {
        resolve(row);
      } else {
        resolve(null); // return null if not found
      }
    });
  });
}


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

function extractPassingYear() {
    // Find the element containing "Passing Year"
    const labels = document.querySelectorAll("strong.text-muted");

    for (let label of labels) {
        if (label.textContent.trim() === "Passing Year") {
            // Get the next sibling div containing the value
            const yearDiv = label.parentElement.querySelector(".field-value");

            if (yearDiv) {
                return yearDiv.textContent.trim();
            }
        }
    }

    return null;
}

function extractFormNumber() {
    // Find the element containing "Form Number"
    const labels = document.querySelectorAll("strong.text-muted");

    for (let label of labels) {
        if (label.textContent.trim() === "Form Number") {
            // Get the next sibling div containing the value
            const formDiv = label.parentElement.querySelector(".field-value");

            if (formDiv) {
                return formDiv.textContent.trim();
            }
        }
    }

    return null;
}



async function checkPassYear(){
 const items       = Array.from(document.querySelectorAll('.info-item'));
 const noticParent = document.querySelector('.row.g-3 .col-md-6');
 const passYear    = extractPassingYear()
 console.log("Passing Year:", passingYear);
 let formNumber    = extractFormNumber();

console.log(formNumber);
formNumber = formNumber.toString();
const result = await readData(formNumber);
console.log(result);
let subject = result[5].trim().toUpperCase().replace(/\s+/g, '_');
    subject = (subject)? subject : "BCA"

const noticeDiv           = document.createElement('div');
      noticeDiv.className = 'my-custom-box alert alert-info mt-3'; // Add any classes you like
      noticeDiv.innerHTML = '<strong>Notice:</strong> <br> Subject: ' + subject+'<br>Category: '+result[3] +'<br> Criteria: <ul> <li>' + subjectInfo[subject][0] + "</li><li>"
      +subjectInfo[subject][1] +"</li></ul>";
      noticeDiv.id        = 'notice';


 const currentURL = window.location.href;
 console.log(currentURL);
 const newUrl = new URL(currentURL);
 let stringUrl = "https://assam.samarth.ac.in/index.php/admissionhed25/admission-list/verify-documents-personal?id="+newUrl.searchParams.get("id")+"&programme_selection_id="+newUrl.searchParams.get("programme_selection_id");
 
 const docSrcBtn = document.createElement('a');
      docSrcBtn.href = stringUrl;
      docSrcBtn.innerHTML = "Document Scrutiny";
      docSrcBtn.className = "btn btn-primary";
 console.log(stringUrl);

 noticParent.appendChild(noticeDiv);
 const notice = document.getElementById('notice')
 notice.appendChild(docSrcBtn);
 if(passYear < 2022){
    let notice_text   = notice.innerHTML;
    notice.innerHTML  = notice_text + '<br> Candidates having more than 3 (three) years of study gap from the qualifying examination will not be eligible for admission.'
  }
 
 
 

}

// Wait for the page to load DOM elements
setTimeout(checkPassYear, 1000);

