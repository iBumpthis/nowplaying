let tableData = [];    // Full data from the sheet
let filteredData = []; // Data after applying search/dropdown filters
let selectedRow = null; // Track currently highlighted row

async function loadGoogleSheetsData() {
    const sheetId = "INSERT_SHEET_ID"; // Replace with your Google Sheets ID
    const apiKey = "INSERT_KEY";   // Replace with your Google API key
    const sheetName = "INSERT_SHEET_NAME"; // Change if necessary

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Loaded data:", data);

        tableData = data.values || [];
        if (tableData.length === 0) {
            document.getElementById("csvTable").innerHTML = "<p>No data found.</p>";
            return;
        }
        // Create header once using the first row (header row)
        populateHeader(tableData[0]);
        // Initially, all data rows are unfiltered
        filteredData = tableData.slice(1);
        populateBody(filteredData);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Create the table header with dropdown filters for columns C (index 2) and D (index 3) and F (index 5)
function populateHeader(headerRowData) {
    const thead = document.getElementById("csvTable").querySelector("thead");
    let headerRow = "<tr>";
    let filterRow = "<tr>";

    headerRowData.forEach((header, index) => {
        headerRow += `<th>${header}</th>`;

        // For columns C and D and F add a dropdown filter
        if (index === 2 || index === 3 || index === 5) {
            const uniqueValues = [...new Set(tableData.slice(1).map(row => row[index]))].sort();
            filterRow += `
          <th>
            <select id="filter-${index}" onchange="applyFilters()">
              <option value="">All</option>
              ${uniqueValues.map(value => `<option value="${value}">${value}</option>`).join('')}
            </select>
          </th>`;
        } else {
            filterRow += `<th></th>`;
        }
    });

    headerRow += "</tr>";
    filterRow += "</tr>";
    thead.innerHTML = headerRow + filterRow;
}

// Populate only the table body based on an array of rows (excluding the header row)
function populateBody(rows) {
    const tbody = document.getElementById("csvTable").querySelector("tbody");
    tbody.innerHTML = rows
        .map((row, rowIndex) => {
            return `<tr data-index="${rowIndex + 1}">` +
                row
                    .map((cell, cellIndex) => {
                        // For Column B (index 1), create a hyperlink if Column E (index 4) has a value.
                        if (cellIndex === 1) {
                            if (row.length > 4 && row[4]) {
                                const discogsReleaseID = row[4].trim();
                                // Use the original text from Column B (cell) as the link text.
                                return `<td><a href="https://www.discogs.com/release/${discogsReleaseID}" target="_blank">${cell}</a></td>`;
                            } else {
                                return `<td>${cell}</td>`;
                            }
                        } else {
                            return `<td>${cell}</td>`;
                        }
                    })
                    .join('') +
                `</tr>`;
        })
        .join('');
    
        // Updates the Row Count in Real Time
        document.getElementById("rowCount").textContent = `Chooses from Filters/Search: ${rows.length}`;
}

// Applies filters based on dropdown selection to the table (for columns C and D and F)
function applyFilters() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filterC = document.getElementById("filter-2")?.value.toLowerCase() || "";
    const filterD = document.getElementById("filter-3")?.value.toLowerCase() || "";
    const filterF = document.getElementById("filter-5")?.value.toLowerCase() || "";

    filteredData = tableData.slice(1).filter(row => {
        const matchesSearch = row.some(cell => cell.toLowerCase().includes(searchTerm));
        const matchesFilterC = filterC === "" || (row[2] && row[2].toLowerCase() === filterC);
        const matchesFilterD = filterD === "" || (row[3] && row[3].toLowerCase() === filterD);
        const matchesFilterF = filterF === "" || (row[5] && row[5].toLowerCase() === filterF);
        return matchesSearch && matchesFilterC && matchesFilterD && matchesFilterF;
    });

    populateBody(filteredData);
}

// Pick a random row from the currently filtered data and highlight it
// Next phase for this will be to pop out a "Now Playing" info box for the selected record (instead of highlighting a Row)
function pickRandomRow() {
    if (selectedRow) {
        selectedRow.classList.remove("highlight");
        selectedRow = null;
        return;
    }
    if (filteredData.length === 0) {
        alert("No data available to pick from!");
        return;
    }
    // Data-index values in tbody start at 1 up to filteredData.length
    const randomIndex = Math.floor(Math.random() * filteredData.length) + 1;
    selectedRow = document.querySelector(`tr[data-index="${randomIndex}"]`);

    if (selectedRow) {
        selectedRow.classList.add("highlight");
        selectedRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

loadGoogleSheetsData();

/* DISCOGS URL FORMAT */
// `https://www.discogs.com/release/{$discogsReleaseID}`