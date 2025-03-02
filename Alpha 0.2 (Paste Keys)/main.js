let tableData = [];         // Full Data from Google Sheet
let filteredData = [];      // Filtered Data from Google Sheet
let selectedRow = null;     // Tracks a Selected or Randomly Selected Row

async function loadGoogleSheetsData() {
    const sheetId   =   /*YOUR GOOGLE SHEET ID BETWEEN QUOTES */    "";
    const apiKey    =   /*YOUR GOOGLE API KEY BETWEEN QUOTES */     "";
    const sheetName = "Primary"; // Google Sheet Name - Change as Required

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

// Create the table header with dropdown filters for columns C (index 2), D (index 3),
// F (index 5) and G (index 6)
function populateHeader(headerRowData) {
    const thead = document.getElementById("csvTable").querySelector("thead");
    let headerRow = "<tr>";
    let filterRow = "<tr>";

    headerRowData.forEach((header, index) => {
        headerRow += `<th>${header}</th>`;

        // For columns C, D, F and G add a dropdown filter
        if (index === 2 || index === 3 || index === 5 || index === 6) {
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
            // Add an onclick handler to the row so clicking it opens the modal with that row's info.
            return `<tr data-index="${rowIndex + 1}" onclick="showRowInfo(${rowIndex})">` +
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
                        }
                        // For Column G (index 6), display a checkbox based on the cell value.
                        else if (cellIndex === 6) {
                            const isChecked = String(cell).toLowerCase() === "true";
                            return `<td style="text-align:center;"><input type="checkbox" ${isChecked ? "checked" : ""}></td>`;
                        } else {
                            return `<td>${cell}</td>`;
                        }
                    })
                    .join('') +
                `</tr>`;
        })
        .join('');
    
    // Updates the Row Count in Real Time
    document.getElementById("rowCount").textContent = `Chooses from Filters/Search: [${rows.length}] Records Available`;
}

// Applies filters based on dropdown selection to the table (for columns C, D, F and G)
function applyFilters() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filterC = document.getElementById("filter-2")?.value.toLowerCase() || "";
    const filterD = document.getElementById("filter-3")?.value.toLowerCase() || "";
    const filterF = document.getElementById("filter-5")?.value.toLowerCase() || "";
    const filterG = document.getElementById("filter-6")?.value.toLowerCase() || "";

    filteredData = tableData.slice(1).filter(row => {
        const matchesSearch = row.some(cell => cell.toLowerCase().includes(searchTerm));
        const matchesFilterC = filterC === "" || (row[2] && row[2].toLowerCase() === filterC);
        const matchesFilterD = filterD === "" || (row[3] && row[3].toLowerCase() === filterD);
        const matchesFilterF = filterF === "" || (row[5] && row[5].toLowerCase() === filterF);
        const matchesFilterG = filterG === "" || (row[6] && row[6].toLowerCase() === filterG);
        return matchesSearch && matchesFilterC && matchesFilterD && matchesFilterF && matchesFilterG;
    });

    populateBody(filteredData);
}

// Instead of just highlighting, pick a random row and show a modal dialog with info about that record.
function pickRandomRow() {
    if (filteredData.length === 0) {
        alert("No data available to pick from!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredData.length);
    const rowData = filteredData[randomIndex];
    showModal(rowData);
}

// When a row is clicked, show the modal dialog for that row.
function showRowInfo(index) {
    const rowData = filteredData[index];
    showModal(rowData);
}

function showModal(rowData) {
    console.log("showModal() triggered:", rowData); // Debugging output

    let modal = document.getElementById("randomDialog");
    if (!modal) {
        console.error("Error: Info Modal (randomDialog) not found!");
        return;
    }

    modal.style.display = "flex"; // Ensure modal is being set to visible
    let discogsID = rowData[4] || ""; // If empty, no image should load
    let thumbPathJPG = `./records/thumbs/${discogsID}.jpg`;
    let placeholderThumb = `./records/thumbs/placeholder.jpg`;
    let fullImageJPG = `./records/full/${discogsID}.jpg`;

    // Build modal content
    let content = `
        <div><a href="#" onclick="showFullImage('${fullImageJPG}')" class="spin-it-link">[SPIN IT]</a></div>
        <div><br /></div>
        <div><span class="modal-title">${rowData[1] || ""}</span><br>Album<br></div>
        <div><br /></div>
        <div><span class="modal-title">${rowData[0] || ""}</span><br>Artist<br></div>
        <div><br /></div>
        <div id="modalImageContainer"></div> <!-- Image will be inserted here -->
        <div><br /></div>
        <div>${rowData[2] || ""} (<em>${rowData[3] || ""}</em>)<br><strong>Genre</strong><br></div>
        <div><br /></div>
        <div><a href="https://www.discogs.com/release/${rowData[4]}" target="_blank">${rowData[4] || ""}</a><br><strong>Discogs URL</strong><br></div>
        <div><br /></div>
        <div>This album resides in your record <strong>${rowData[5] || ""}</strong></div>
        <br>
        <div class="info-modal-buttons">
            <button onclick="closeInfoModal()">Close</button>
        </div>
    `;

    document.getElementById("dialogContent").innerHTML = content;

    // Only add image if discogsID is not empty
    if (discogsID) {
        let thumbImage = document.createElement("img");
        thumbImage.className = "modal-thumbnail";
        thumbImage.alt = "Album Thumbnail";
        thumbImage.src = thumbPathJPG;

        // Fallback to placeholder if the main image doesn't exist
        thumbImage.onerror = function () {
            console.log("Thumbnail image not found - defaulting to placeholder image"); // Log to browser console
            this.onerror = null; // Prevents looping in case placeholder also fails
            this.src = placeholderThumb;
        };

        // Clicking the thumbnail opens the full-size image
        thumbImage.onclick = function () {
            showFullImage(fullImageJPG);
        };

        document.getElementById("modalImageContainer").appendChild(thumbImage);
    }

    // Show the info modal
    document.getElementById("randomDialog").style.display = "block";
}

function closeInfoModal() {
    document.getElementById("randomDialog").style.display = "none";
}

function showFullImage(fullImageJPG) {
    let placeholderFull = `./records/full/placeholder.jpg`; // Placeholder image path

    // Create a separate modal for full image viewing
    let fullImageModal = document.createElement("div");
    fullImageModal.className = "full-image-modal";
    fullImageModal.id = "fullImageModal";

    fullImageModal.innerHTML = `
        <div class="full-image-modal-content">
            <span class="modal-header">Now Spinning...</span><br />
            <img id="fullImageElement" src="${fullImageJPG}" alt="Full Album Image" class="modal-full-image">
            <div class="full-image-buttons">
                <button onclick="closeFullImageModal()">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(fullImageModal);
    document.getElementById("fullImageModal").style.display = "flex";

    // Get the full-size image element
    let fullImage = document.getElementById("fullImageElement");

    // If the full-size image is missing, log it and switch to the placeholder
    fullImage.onerror = function () {
        console.log("Album image not found - using placeholder image"); // Log to console
        this.onerror = null; // Prevents infinite loop
        this.src = placeholderFull;
    };
}

function closeFullImageModal() {
    let modal = document.getElementById("fullImageModal");
    if (modal) {
        modal.remove(); // Completely remove the full-image modal from the DOM
    }
}

function showModalFromFull() {
    document.getElementById("randomDialog").style.display = "none"; // Hide modal
    showModal(selectedRow); // Restore modal with previous details
}

// Closes the modal dialog
function closeRandomDialog() {
    document.getElementById("randomDialog").style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    let infoModal = document.getElementById("randomDialog");
    let imageModal = document.getElementById("fullImageModal");

    if (event.target === infoModal) {
        closeInfoModal();
    }
    if (event.target === imageModal) {
        closeFullImageModal();
    }
};

loadGoogleSheetsData();