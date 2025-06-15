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

searchBox.addEventListener("input", () => {
    const query = normalise(searchBox.value);
    if (!query) {
        renderSuggestions(allGuests, "name");
        return;
    }
    let groupBy = "name";
    let filteredGuests = allGuests.filter((guest) => isMatchByFullName(guest, query));
    if (filteredGuests.length === 0) {
        filteredGuests = allGuests.filter((guest) => isMatchByFamily(guest, query));
        groupBy = "table";
    }
    if (filteredGuests.length === 0) {
        filteredGuests = allGuests.filter((guest) => isMatchByTable(guest, query));
        groupBy = "table";
    }
    renderSuggestions(filteredGuests, groupBy);
});

function renderSuggestions(matchedGuests, groupBy) {
    list.innerHTML = "";
    if (matchedGuests.length === 0){
       addTextHeading("No results found.");
       return;
    }
    const sortedMatchedGuests = matchedGuests.sort((a, b) => {
        if (groupBy === "table") {
            const tableA = parseInt(a.table, 10);
            const tableB = parseInt(b.table, 10);
            return tableA - tableB || a.firstName.localeCompare(b.firstName);
        }
        return a.firstName.localeCompare(b.firstName);
    });
    let currentGroup = null;
    sortedMatchedGuests.forEach((guest) => {
        const isGroupedByTable = groupBy === "table";
        const groupKey = isGroupedByTable ? guest.table : guest.firstName.charAt(0).toUpperCase();
        if (groupKey !== currentGroup) {
            currentGroup = groupKey;
            if (isGroupedByTable){
                addTableHeading(groupKey)
            } else {
                addTextHeading(groupKey)
            }
        }
        addGuestElement(guest, isGroupedByTable);
    });
}

function addGuestElement(guest, isGroupedByTable){
    const text = isGroupedByTable
        ? `<span class="name">${guest.firstName} ${guest.lastName}</span>`
        : `<span class="name">${guest.firstName} ${guest.lastName}</span> <span class="table">${guest.table}</span>`;
    const element = document.createElement("li");
    element.innerHTML = text;
    list.appendChild(element);
    element.addEventListener('click', function() {
        searchBox.value = guest.table;
        searchBox.dispatchEvent(new Event('input'));
    });
}

function addTableHeading(table){
    const text = `Table ${table}`
    const element = document.createElement("li");
    element.innerHTML = text;
    element.classList.add("group-heading");
    list.appendChild(element);
    element.addEventListener('click', function() {
        searchBox.value = table;
        searchBox.dispatchEvent(new Event('input'));
    });
}

function addTextHeading(text){
    const element = document.createElement("li");
    element.innerHTML = text;
    element.classList.add("group-heading");
    list.appendChild(element);
}

function isMatchByFullName(guest, query){
    const fullName = `${guest.firstName}${guest.lastName}`;
    return normalise(fullName).startsWith(query);
}

function isMatchByFamily(guest, query){
    return normalise(guest.lastName).startsWith(query);
}

function isMatchByTable(guest, query){
    return normalise(guest.table).startsWith(query);
}

function normalise(text){
    return text.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replaceAll(" ", "");
}
