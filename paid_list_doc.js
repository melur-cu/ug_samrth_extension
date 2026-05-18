

function tableToArray(table){
	const columnsToRemove = [0,3,4,5,6,10,12,13,14,15,16,17,18,19,20];
	let rows = Array.from(table.rows).slice(2);
	
	return rows.map(row => {
		const cells = Array.from(row.cells);
		return cells.map(cell => cell.innerText.trim())
					.filter((_,index)=>!columnsToRemove.includes(index));
	});

}



function mergeUniqueRows(oldRows, newRows) {
	const keyColumnIndex = 1;
  
  const rowMap = new Map();

  // Add old rows first
  for (const row of oldRows) {
    const key = row[keyColumnIndex];
    rowMap.set(key, row);
  }

  // Add new rows, overwriting if same key exists
  for (const row of newRows) {
    const key = row[keyColumnIndex];
    rowMap.set(key, row); // this ensures latest row replaces previous
  }

  return Array.from(rowMap.values());
}

function dataStorage(){

const table = document.querySelector('table');

	if (!table) return console.log("No table found.");


const currentTableData = tableToArray(table); 

	chrome.storage.local.get('applicantData', (result) => {
	    const storedRows = result.applicantData || [];

	    const updatedData = mergeUniqueRows(storedRows, currentTableData);
	    console.log(updatedData);
	    chrome.storage.local.set({ applicantData: updatedData}, () => {
	      console.log("Stored updated table (skipped first 2 rows):", updatedData);
	    });
	  });

}

// Wait for the page to load DOM elements
setTimeout(dataStorage, 1000);

