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
    const query = searchBox.value.trim().toLowerCase();
    if (!query) {
        renderSuggestions(allGuests, "name");
        return;
    }
    let groupBy = "name";
    let filteredGuests = allGuests.filter((guest) => guest.firstName.toLowerCase().startsWith(query));
    if (filteredGuests.length === 0) {
        filteredGuests = allGuests.filter((guest) => guest.lastName.toLowerCase().startsWith(query));
        groupBy = "name";
    }
    if (filteredGuests.length === 0) {
        filteredGuests = allGuests.filter((guest) => guest.table === query);
        groupBy = "table";
    }
    renderSuggestions(filteredGuests, groupBy);
});

function renderSuggestions(matchedGuests, groupBy) {
    list.innerHTML = "";
    if (matchedGuests.length === 0){
       addListElement("No results found.", true);
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
        const groupKey = groupBy === "table" ? guest.table : guest.firstName.charAt(0).toUpperCase();
        if (groupKey !== currentGroup) {
            currentGroup = groupKey;
            addListElement(groupBy === "table" ? `Table ${groupKey}` : groupKey, true);
        }
        addListElement(groupBy === "table" ? `<span class="name">${guest.firstName}</span>` : `<span class="name">${guest.firstName}</span> <span class="table">${guest.table}</span>`);
    });
}

function addListElement(text, isHeading = false){
      const element = document.createElement("li");
      element.innerHTML = text;
      if (isHeading === true){
         element.classList.add("group-heading");
      }
      list.appendChild(element);
}
