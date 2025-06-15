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
    let filteredGuests = allGuests.filter((guest) => guest.name.toLowerCase().startsWith(query));
    if (filteredGuests.length === 0) {
        filteredGuests = allGuests.filter((guest) => guest.table === query);
        groupBy = "table";
    }
    renderSuggestions(filteredGuests, groupBy);
});

function renderSuggestions(matchedGuests, groupBy) {
    list.innerHTML = "";
    if (matchedGuests.length == 0){
       addChildElementToList("No results found");
       return;
    }
    const sortedMatchedGuests = matchedGuests.sort((a, b) => {
        if (groupBy === "table") {
            const tableA = parseInt(a.table, 10);
            const tableB = parseInt(b.table, 10);
            return tableA - tableB || a.name.localeCompare(b.name);
        }
        return a.name.localeCompare(b.name);
    });

    let currentGroup = null;
    sortedMatchedGuests.forEach((guest) => {
        const groupKey = groupBy === "table" ? guest.table : guest.name.charAt(0).toUpperCase();
        if (groupKey !== currentGroup) {
            currentGroup = groupKey;
            addListHeadingElementText(groupBy === "table" ? `Table ${groupKey}` : groupKey);
        }
        addListElementInnerHtml(groupBy === "table" ? `<span class="name">${guest.name}</span>` : `<span class="name">${guest.name}</span> <span class="table">${guest.table}</span>`);
    });
}

function addListElementInnerHtml(innerHtml){
     const li = document.createElement("li");
     li.innerHTML = innehHtml;
     list.appendChild(li);
}

function addListHeadingElementText(text){
      const heading = document.createElement("li");
      heading.textContent = text;
      heading.classList.add("group-letter");
      list.appendChild(heading);
}
