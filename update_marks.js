// function dataStorage() {
//     document.getElementById("academicmarksv2-1-12-submaxmarks").value = 100;
//     document.getElementById("academicmarksv2-2-12-submaxmarks").value = 100;
//     document.getElementById("academicmarksv2-3-12-submaxmarks").value = 100;
//     document.getElementById("academicmarksv2-4-12-submaxmarks").value = 100;
//     document.getElementById("academicmarksv2-5-12-submaxmarks").value = 100;
//   }
  
//   // Wait for the page to load DOM elements
//   setTimeout(dataStorage, 1000);
  

function dataStorage() {
    for (let i = 1; i <= 6; i++) {
      const id = `academicmarksv2-${i}-12-submaxmarks`;
      const el = document.getElementById(id);
      
      if (el && el.value.trim() !== "") {
        el.value = 100;
      }
    }
  }
  
  function tickDeclaration() {
    const checkbox = document.getElementById("academicv2-declaration");
    if (checkbox) {
      checkbox.checked = true;
    } else {
      console.warn("Checkbox not found");
    }
  }

// Call both functions after DOM loads
// Run dataStorage after 1 second
setTimeout(dataStorage, 1000);

// Run tickDeclaration after 2 seconds
setTimeout(tickDeclaration, 2000);