const optionsMapping = {
    Photo: {
        message: "Invalid photo. Reupload the image."
    },

    Signature: {
        message: "Invalid signature. Reupload the image."
    },

    IDProofDocument: {
        message: "Not an acceptable document."
    },

    CategoryCertificate: {
        message: "Invalid category certificate."
    },

    RationCardwithclearlyvisibledetailsofbeneficiary: {
        message: "Upload a ration card with clearly visible beneficiary details."
    },

    DomicileStateUpload: {
        message: "Not a valid domicile certificate."
    }
};



function setupDropdownLogic() {
  let option = new URL(window.location.href).searchParams.get("field");
  console.log("Dropdown field identified:", option);
  /*
  const selects = Array.from(document.querySelectorAll('select'));
  const textareas = Array.from(document.querySelectorAll('textarea'));
  console.log(selects[0].id)

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
  */
}

// Wait for the page to load DOM elements
setTimeout(setupDropdownLogic, 1000);