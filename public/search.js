let allGuests = [];
const list = document.getElementById("suggestions");
const searchBox = document.getElementById("guest-search");

fetch("guests.json")
    .then((resp) => resp.json())
    .then((data) => {
        allGuests = data;
        renderSuggestions(allGuests, "name");
    })
    .catch((err) => {
        console.error("Could not load guests.json:", err);
    });

// Add a popstate event listener to handle browser back navigation
window.addEventListener("popstate", () => {
    if (searchBox.value.trim().length > 0) {
        searchBox.value = ""; 
    }
});

searchBox.addEventListener("input", () => {
    const query = searchBox.value.trim().toLowerCase();
    if (!query) {
        renderSuggestions(allGuests, "name");
        return;
    }
    history.pushState(null, '', '');
    let groupBy = "name";
    let filteredGuests = allGuests.filter((guest) => guest.name.toLowerCase().startsWith(query));
    if (filteredGuests.length === 0) {
        filteredGuests = allGuests.filter((guest) => guest.table === query);
        groupBy = "table";
    }
    renderSuggestions(filteredGuests, groupBy);
});

function renderSuggestions(matchedGuests, groupBy) {
    list.innerHTML = "";
    // Sort by table (numerically) first if grouping by table, then by name within each table
    const sortedMatchedGuests = matchedGuests.sort((a, b) => {
        if (groupBy === "table") {
            // Convert table to number for numerical sorting, then sort by name within the same table
            const tableA = parseInt(a.table, 10);
            const tableB = parseInt(b.table, 10);
            return tableA - tableB || a.name.localeCompare(b.name);
        }
        // Default: sort by name only
        return a.name.localeCompare(b.name);
    });

    let currentGroup = null;

    sortedMatchedGuests.forEach((guest) => {
        const groupKey = groupBy === "table" ? guest.table : guest.name.charAt(0).toUpperCase();
        if (groupKey !== currentGroup) {
            currentGroup = groupKey;
            const heading = document.createElement("li");
            heading.textContent = groupBy === "table" ? `Table ${groupKey}` : groupKey;
            heading.classList.add("group-letter");
            list.appendChild(heading);
        }
        const li = document.createElement("li");
        li.innerHTML = groupBy === "table" ? `<span class="name">${guest.name}</span>` : `<span class="name">${guest.name}</span> <span class="table">${guest.table}</span>`;
        list.appendChild(li);
    });
}
