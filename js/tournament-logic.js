/**
 * THE CHESS GURUKUL - Tournament Logic (V33 Master)
 * Standard: Blog Master 50 Styling & Triggering
 */

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTfhTmO3FfIAxgxgNoSZJ2f1veT9kFlnQoYYHuj6AKwl8wrxIBvPtRLOF2QmYHVyVvi8ywiAnl__Fif/pub?output=csv';
let allTournaments = [];

function parseSheetDate(dateStr) {
    if (!dateStr) return new Date(NaN);
    const cleanDate = dateStr.trim().replace(/-/g, '/');
    return new Date(cleanDate);
}

function init() {
    console.log("V33 Master: Initializing fetch...");
    Papa.parse(publicSpreadsheetUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            allTournaments = results.data.filter(row => row['Date'] && row['Date'].trim() !== "");
            
            if (allTournaments.length === 0) {
                document.getElementById('loading').innerText = "No data found in the spreadsheet.";
                return;
            }

            populateMonthFilter(allTournaments);
            displayTournaments(allTournaments);
            
            document.getElementById('monthFilter').addEventListener('change', filterData);
            document.getElementById('ratingFilter').addEventListener('change', filterData);
        },
        error: (err) => {
            document.getElementById('loading').innerText = "Connection failed. Please refresh.";
        }
    });
}

function populateMonthFilter(data) {
    const monthSelect = document.getElementById('monthFilter');
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
    tableBody.innerHTML = "";
    
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No tournaments found.</td></tr>';
    } else {
        data.forEach(row => {
            const dateObj = parseSheetDate(row['Date']);
            const dayName = isNaN(dateObj) ? "" : dateObj.toLocaleDateString('en-US', { weekday: 'long' }) + ", ";
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${dayName}<br>${row['Date']}</td>
                <td>${row['Tournament Name']}</td>
                <td>${row['Type']}</td>
                <td>${row['Location']}</td>
                <td><a href="${row['Link'] || '#'}" target="_blank" rel="noopener" class="reg-link">View Details</a></td>
            `;
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
