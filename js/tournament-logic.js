/**
 * THE CHESS GURUKUL - Hardened Tournament Logic (V34 Master)
 * Standard: Blog Master 50 Styling & Enhanced Security
 */

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTfhTmO3FfIAxgxgNoSZJ2f1veT9kFlnQoYYHuj6AKwl8wrxIBvPtRLOF2QmYHVyVvi8ywiAnl__Fif/pub?output=csv';
let allTournaments = [];

function parseSheetDate(dateStr) {
    if (!dateStr) return new Date(NaN);
    const cleanDate = dateStr.trim().replace(/-/g, '/');
    return new Date(cleanDate);
}

function init() {
    console.log("V34 Master: Initializing secure fetch...");
    
    // Attach event listeners in JS (Required for strict CSP)
    const monthF = document.getElementById('monthFilter');
    const rateF = document.getElementById('ratingFilter');
    if(monthF) monthF.addEventListener('change', filterData);
    if(rateF) rateF.addEventListener('change', filterData);

    Papa.parse(publicSpreadsheetUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            allTournaments = results.data.filter(row => row['Date'] && row['Date'].trim() !== "");
            if (allTournaments.length === 0) {
                document.getElementById('loading').textContent = "No data found in the spreadsheet.";
                return;
            }
            populateMonthFilter(allTournaments);
            displayTournaments(allTournaments);
        },
        error: (err) => {
            console.error("Connection Error:", err);
            document.getElementById('loading').textContent = "Connection failed. Please refresh.";
        }
    });
}

function populateMonthFilter(data) {
    const monthSelect = document.getElementById('monthFilter');
    if (!monthSelect) return;
    const monthsFound = new Set();
    data.forEach(row => {
        const d = parseSheetDate(row['Date']);
        if (!isNaN(d)) monthsFound.add(d.toLocaleString('default', { month: 'long' }));
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
        return (monthVal === 'all' || rowMonth === monthVal) && (ratingVal === 'all' || rowType === ratingVal);
    });
    displayTournaments(filtered);
}

function displayTournaments(data) {
    const tableBody = document.getElementById('table-body');
    const table = document.getElementById('tournament-table');
    const loading = document.getElementById('loading');
    
    // Safe Clear
    while (tableBody.firstChild) { tableBody.removeChild(tableBody.firstChild); }
    
    if (data.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '5');
        td.style.textAlign = 'center';
        td.style.padding = '20px';
        td.textContent = "No tournaments found.";
        tr.appendChild(td);
        tableBody.appendChild(tr);
    } else {
        data.forEach(row => {
            const tr = document.createElement('tr');
            const dateObj = parseSheetDate(row['Date']);
            const dayName = isNaN(dateObj) ? "" : dateObj.toLocaleDateString('en-US', { weekday: 'long' }) + ", ";

            // 1. Date (Bold/Blue styling kept)
            const dateTd = document.createElement('td');
            dateTd.style.fontWeight = 'bold';
            dateTd.style.color = 'var(--navy)';
            dateTd.appendChild(document.createTextNode(dayName));
            dateTd.appendChild(document.createElement('br'));
            dateTd.appendChild(document.createTextNode(row['Date'] || ""));
            tr.appendChild(dateTd);

            // 2. Name
            const nameTd = document.createElement('td');
            nameTd.style.fontWeight = '600';
            nameTd.textContent = row['Tournament Name'] || "";
            tr.appendChild(nameTd);

            // 3. Type
            const typeTd = document.createElement('td');
            typeTd.textContent = row['Type'] || "";
            tr.appendChild(typeTd);

            // 4. Location
            const locTd = document.createElement('td');
            locTd.textContent = row['Location'] || "";
            tr.appendChild(locTd);

            // 5. Details Link (Protocol safety included)
            const linkTd = document.createElement('td');
            const a = document.createElement('a');
            let rawLink = row['Link'] || "#";
            // Ensure link starts with http or https
            a.href = (rawLink.startsWith('http')) ? rawLink : "#";
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.className = "reg-link";
            a.textContent = "View Details";
            linkTd.appendChild(a);
            tr.appendChild(linkTd);

            tableBody.appendChild(tr);
        });
    }
    loading.classList.add('hidden');
    table.classList.remove('hidden'); 
}

// THE ULTIMATE TRIGGER
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(init, 1);
} else {
    document.addEventListener("DOMContentLoaded", init);
}
