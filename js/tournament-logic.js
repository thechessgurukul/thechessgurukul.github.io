/**
 * THE CHESS GURUKUL - Tournament Logic (V33 Master)
 * Purpose: Securely fetch, parse, and filter tournament data from Google Sheets.
 */

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTfhTmO3FfIAxgxgNoSZJ2f1veT9kFlnQoYYHuj6AKwl8wrxIBvPtRLOF2QmYHVyVvi8ywiAnl__Fif/pub?output=csv';
let allTournaments = [];

function parseSheetDate(dateStr) {
    if (!dateStr) return new Date(NaN);
    const cleanDate = dateStr.trim().replace(/-/g, '/');
    return new Date(cleanDate);
}

// THIS IS THE MAIN FUNCTION
function init() {
    console.log("Starting data fetch..."); // Helpful for debugging
    Papa.parse(publicSpreadsheetUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            console.log("Data received:", results.data);
            allTournaments = results.data.filter(row => row['Date'] && row['Date'].trim() !== "");
            
            if (allTournaments.length === 0) {
                const loadingEl = document.getElementById('loading');
                if(loadingEl) loadingEl.innerText = "No data found in the spreadsheet.";
                return;
            }

            populateMonthFilter(allTournaments);
            displayTournaments(allTournaments);
            
            document.getElementById('monthFilter').addEventListener('change', filterData);
            document.getElementById('ratingFilter').addEventListener('change', filterData);
        },
        error: (err) => {
            console.error("PapaParse Error:", err);
            const loadingEl = document.getElementById('loading');
            if(loadingEl) loadingEl.innerText = "Error loading spreadsheet. Please check link.";
        }
    });
}

function populateMonthFilter(data) {
    const monthSelect = document.getElementById('monthFilter');
    const monthsFound = new Set();
    
    data.forEach(row => {
        const d = parseSheetDate(row['Date']);
        if (!isNaN(d)) {
            monthsFound.add(d.toLocaleString('default', { month: 'long' }));
        }
    });

    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const sortedMonths = Array.from(monthsFound).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

    sortedMonths.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        monthSelect.appendChild(opt);
    });
}

function filterData() {
    const monthVal = document.getElementById('monthFilter').value;
    const ratingVal = document.getElementById('ratingFilter').value;

    const filtered = allTournaments.filter(row => {
        const d = parseSheetDate(row['Date']);
        const rowMonth = isNaN(d) ? "" : d.toLocaleString('default', { month: 'long' });
        const rowType = (row['Type'] || "").trim();
        
        const matchMonth = (monthVal === 'all' || rowMonth === monthVal);
        const matchRating = (ratingVal === 'all' || rowType === ratingVal);
        return matchMonth && matchRating;
    });

    displayTournaments(filtered);
}

function displayTournaments(data) {
    const tableBody = document.getElementById('table-body');
    const table = document.getElementById('tournament-table');
    const loading = document.getElementById('loading');
    
    if (!tableBody || !table) return;

    tableBody.innerHTML = "";
    
    if (data.length === 0) {
        const emptyTr = document.createElement('tr');
        const emptyTd = document.createElement('td');
        emptyTd.setAttribute('colspan', '5');
        emptyTd.style.textAlign = "center";
        emptyTd.style.padding = "20px";
        emptyTd.textContent = "No tournaments found for this selection.";
        emptyTr.appendChild(emptyTd);
        tableBody.appendChild(emptyTr);
    } else {
        data.forEach(row => {
            const dateObj = parseSheetDate(row['Date']);
            const dayName = isNaN(dateObj) ? "" : dateObj.toLocaleDateString('en-US', { weekday: 'long' }) + ", ";
            
            const tr = document.createElement('tr');

            const dateTd = document.createElement('td');
            dateTd.appendChild(document.createTextNode(dayName));
            dateTd.appendChild(document.createElement('br'));
            dateTd.appendChild(document.createTextNode(row['Date']));
            tr.appendChild(dateTd);

            const nameTd = document.createElement('td');
            nameTd.textContent = row['Tournament Name'];
            tr.appendChild(nameTd);

            const typeTd = document.createElement('td');
            typeTd.textContent = row['Type'];
            tr.appendChild(typeTd);

            const locTd = document.createElement('td');
            locTd.textContent = row['Location'];
            tr.appendChild(locTd);

            const actionTd = document.createElement('td');
            const link = document.createElement('a');
            
            try {
                const cleanUrl = row['Link'] ? row['Link'].trim() : "#";
                link.href = cleanUrl;
            } catch (e) {
                link.href = "#";
            }

            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.className = "reg-link";
            link.textContent = "View Details";
            actionTd.appendChild(link);
            tr.appendChild(actionTd);

            tableBody.appendChild(tr);
        });
    }

    loading.classList.add('hidden');
    table.classList.remove('hidden'); 
}

// CRITICAL FIX: Tell the browser to actually run the init function
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
