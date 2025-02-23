let tableData = []; // Store original data for sorting & filtering
let filteredData = []; // Store filtered data for random selection

async function loadGoogleSheetsData() {
    const sheetId = "INSERT_SHEET_ID"; // Replace with your Google Sheets ID
    const apiKey = "INSERT_KEY";   // Replace with your Google API key
    const sheetName = "INSERT_SHEET_NAME"; // Change if necessary

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        tableData = data.values || []; // Store original data

        populateTable(tableData); // Load table with data

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Populate table and lock header row
function populateTable(rows) {
    const table = document.getElementById("csvTable");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    if (!rows.length) {
        table.innerHTML = "<p>No data found.</p>";
        return;
    }

    // Create table header once and do not change it
    if (thead.innerHTML.trim() === "") {
        thead.innerHTML = "<tr>" + rows[0].map((header, index) =>
            `<th onclick="sortTable(${index})">${header} ⬍</th>`).join('') + "</tr>";
    }

    // Populate table body with data rows only (excluding header)
    tbody.innerHTML = rows.slice(1).map((row, rowIndex) =>
        `<tr data-index="${rowIndex + 1}">${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
    ).join('');

    filteredData = rows.slice(1); // Store filtered rows for random selection
}

// Sort table by column index while keeping header row fixed
let sortDirection = {}; // Track sort direction per column
function sortTable(colIndex) {
    sortDirection[colIndex] = !sortDirection[colIndex]; // Toggle sort direction

    const sortedData = [...tableData.slice(1)].sort((a, b) => {
        let valA = a[colIndex].toLowerCase();
        let valB = b[colIndex].toLowerCase();
        return sortDirection[colIndex] ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    populateTable([tableData[0], ...sortedData]); // Keep header row intact
}

// Filter table rows based on search input
function filterTable() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    filteredData = tableData.slice(1).filter(row =>
        row.some(cell => cell.toLowerCase().includes(searchTerm))
    ); // Store filtered rows

    populateTable([tableData[0], ...filteredData]); // Keep header row
}

let selectedRow = null; // Track the currently selected row

function pickRandomRow() {
    if (selectedRow) {
        // Unselect previously selected row
        selectedRow.classList.remove("highlight");
        selectedRow = null;
        return;
    }

    if (filteredData.length === 0) {
        alert("No data available to pick from!");
        return;
    }

    // Select a random row index
    const randomIndex = Math.floor(Math.random() * filteredData.length) + 1; // +1 to skip header row
    selectedRow = document.querySelector(`tr[data-index="${randomIndex}"]`);

    if (selectedRow) {
        selectedRow.classList.add("highlight");
        selectedRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

loadGoogleSheetsData(); // Load data on page load