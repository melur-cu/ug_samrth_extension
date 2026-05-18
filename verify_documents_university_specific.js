const optionsMapping = {
    "Photo": {
                "ACCEPTED": {
                            update: "NO",
                            message: ""
                            },
        "REJECTED": {
          update: "NO",
          message: "Inalid Photo"
        },
        "HOLD": {
          update: "YES",
          message: "Invalid Photo Reupload the Image"
        },
        "QUERY": {
          update: "YES",
          message: "Upload clear passport photo"
        }
      },

      "Signature": {
                "ACCEPTED": {
                            update: "NO",
                            message: ""
                            },
        "REJECTED": {
          update: "NO",
          message: "Signature Photo"
        },
        "HOLD": {
          update: "YES",
          message: "Invalid Photo Reupload the Image"
        },
        "QUERY": {
          update: "YES",
          message: "Upload clear Full Signature"
        }
      },

      "IDProofDocument": {
                "ACCEPTED": {
                            update: "NO",
                            message: ""
                            },
          "REJECTED": {
            update: "NO",
            message: "Not Accptable Document"
          },
          "HOLD": {
            update: "YES",
            message: "Invalid ID "
          },
          "QUERY": {
            update: "YES",
            message: "Invalid ID"
          }
        },
      "CategoryCertificate": {
                "ACCEPTED": {
                            update: "NO",
                            message: ""
                            },
          "REJECTED": {
            update: "NO",
            message: "Invalid Category Certificate"
          },
          "HOLD": {
            update: "YES",
            message: "Upload clear Caste certificate issued by competent authority of Assam \n Upload Candidate caste certificate issued by competent authority of Assam \n Upload valid Income and Asset Certificate issued by Circle officer within one year"
          },
          "QUERY": {
            update: "YES",
            message: "Upload clear Caste certificate issued by competent authority of Assam \n Upload Candidate caste certificate issued by competent authority of Assam \n Upload valid Income and Asset Certificate issued by Circle officer within one year"
          }
        },
        "RationCardwithclearlyvisibledetailsofbeneficiary":{
                "ACCEPTED": {
                            update: "NO",
                            message: ""
                            },
          "REJECTED": {
            update: "NO",
            message: "Not Valid Category Certificate"
          },
          "HOLD": {
            update: "YES",
            message: "Upload ration card"
          },
          "QUERY": {
            update: "YES",
            message: "Upload ration card"
          }
        },
        "DomicileStateUpload":{
                "ACCEPTED": {
                            update: "NO",
                            message: ""
                            },
          "REJECTED": {
            update: "NO",
            message: "Not Valid  Certificate"
          },
          "HOLD": {
            update: "YES",
            message: "Not Valid  Certificate "
          },
          "QUERY": {
            update: "YES",
            message: "Not Valid  Certificate"
          }
        }


  
};



function setupDropdownLogic() {
  const selects = Array.from(document.querySelectorAll('select'));
  const textareas = Array.from(document.querySelectorAll('textarea'));
  //console.log(selects[0].id)

  const header = document.querySelector(".card-header.d-flex.justify-content-between");
  let headerText = Array.from(header.childNodes)
                        .filter(node => node.nodeType === Node.TEXT_NODE)
                        .map(node => node.textContent.trim())
                        .filter(text => text.length > 0)
                        .join(" ");
  
      headerText=headerText.replace(/\s+/g, "")
      console.log(headerText)

  selects.forEach(select => {
    select.addEventListener('change', () => {
      const selectedValue = select.value;
      console.log(selectedValue)

      const logic = optionsMapping[headerText][selectedValue];
      
      if (!logic) return;
        
      selects.forEach(otherSelect => {
        if (otherSelect !== select) {
          const hasValue = Array.from(otherSelect.options).some(
            opt => opt.value === logic.update
          );
          if (hasValue) {
            otherSelect.value = logic.update;
          }
        }
      });

      textareas.forEach(textarea => {
        textarea.value = logic.message;
      });
    });
  });
}

// Wait for the page to load DOM elements
setTimeout(setupDropdownLogic, 1000);