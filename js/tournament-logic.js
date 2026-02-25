/**
 * THE CHESS GURUKUL - Hardened Tournament Logic (V35 Master)
 * Standard: Blog Master 50 Styling & Elite Security Validation
 */

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTfhTmO3FfIAxgxgNoSZJ2f1veT9kFlnQoYYHuj6AKwl8wrxIBvPtRLOF2QmYHVyVvi8ywiAnl__Fif/pub?output=csv';
let allTournaments = [];

function parseSheetDate(dateStr) {
    if (!dateStr) return new Date(NaN);
    const cleanDate = dateStr.trim().replace(/-/g, '/');
    return new Date(cleanDate);
}

function init() {
    console.log("V35 Master: Initializing secure fetch...");
    
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
    
    // Safe DOM Clearing
    while (tableBody.firstChild) { tableBody.removeChild(tableBody.firstChild); }
    
    if (data.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '5');
        td.className = "no-data";
        td.textContent = "No tournaments found.";
        tr.appendChild(td);
        tableBody.appendChild(tr);
    } else {
        data.forEach(row => {
            const tr = document.createElement('tr');
            const dateObj = parseSheetDate(row['Date']);
            const dayName = isNaN(dateObj) ? "" : dateObj.toLocaleDateString('en-US', { weekday: 'long' }) + ", ";

            // 1. Date Column
            const dateTd = document.createElement('td');
            dateTd.className = "col-date";
            dateTd.appendChild(document.createTextNode(dayName));
            dateTd.appendChild(document.createElement('br'));
            dateTd.appendChild(document.createTextNode(row['Date'] || ""));
            tr.appendChild(dateTd);

            // 2. Tournament Name Column
            const nameTd = document.createElement('td');
            nameTd.className = "col-name";
            nameTd.textContent = row['Tournament Name'] || "";
            tr.appendChild(nameTd);

            // 3. Type Column
            const typeTd = document.createElement('td');
            typeTd.className = "col-type";
            typeTd.textContent = row['Type'] || "";
            tr.appendChild(typeTd);

            // 4. Location Column
            const locTd = document.createElement('td');
            locTd.className = "col-loc";
            locTd.textContent = row['Location'] || "";
            tr.appendChild(locTd);

            // 5. Details Link Column (Strong Protocol Validation)
            const linkTd = document.createElement('td');
            linkTd.className = "col-link";
            const a = document.createElement('a');
            
            let finalUrl = "#";
            try {
                const rawUrl = (row['Link'] || "").trim();
                const cleanUrl = new URL(rawUrl);
                // Only allow HTTP/HTTPS
                if (cleanUrl.protocol === 'https:' || cleanUrl.protocol === 'http:') {
                    finalUrl = cleanUrl.href;
                }
            } catch (e) {
                finalUrl = "#";
            }
            
            a.href = finalUrl;
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
