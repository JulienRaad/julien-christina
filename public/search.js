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

const matchers = [
  { fn: isMatchByFullName, groupBy: "name" },
  { fn: isMatchByFamily, groupBy: "table" },
  { fn: isMatchByTable, groupBy: "table" },
];

searchBox.addEventListener("input", () => {
  const query = normalise(searchBox.value);
  if (!query) {
    renderSuggestions(allGuests, "name");
    return;
  }
  let filteredGuests = [];
  let groupBy = "name";

  for (const matcher of matchers) {
    filteredGuests = allGuests.filter((guest) => matcher.fn(guest, query));
    if (filteredGuests.length > 0) {
      groupBy = matcher.groupBy;
      break;
    }
  }

  renderSuggestions(filteredGuests, groupBy);
});

function renderSuggestions(matchedGuests, groupBy) {
  list.innerHTML = "";
  if (matchedGuests.length === 0) {
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
    const groupKey = getGroupKey(guest, groupBy);
    if (groupKey !== currentGroup) {
      currentGroup = groupKey;
      if (groupBy === "table") {
        addTableHeading(groupKey);
      } else {
        addTextHeading(groupKey);
      }
    }
    addGuestElement(guest, groupBy === "table");
  });
}

function getGroupKey(guest, groupBy) {
  return groupBy === "table" ? guest.table : guest.firstName.charAt(0).toUpperCase();
}

function addGuestElement(guest, isGroupedByTable) {
  const text = isGroupedByTable
    ? `<span class="name">${guest.firstName} ${guest.lastName}</span>`
    : `<span class="name">${guest.firstName} ${guest.lastName}</span> <span class="table">${guest.table}</span>`;
  const element = document.createElement("li");
  element.innerHTML = text;
  list.appendChild(element);
  element.addEventListener("click", () => {
    searchBox.value = guest.table;
    searchBox.dispatchEvent(new Event("input"));
  });
}

function addTableHeading(table) {
  const text = `Table ${table}`;
  const element = document.createElement("li");
  element.textContent = text;
  element.classList.add("group-heading");
  list.appendChild(element);
  element.addEventListener("click", () => {
    searchBox.value = table;
    searchBox.dispatchEvent(new Event("input"));
  });
}

function addTextHeading(text) {
  const element = document.createElement("li");
  element.textContent = text;
  element.classList.add("group-heading");
  list.appendChild(element);
}

function isMatchByFullName(guest, query) {
  const fullName = `${guest.firstName}${guest.lastName}`;
  return normalise(fullName).startsWith(query);
}

function isMatchByFamily(guest, query) {
  return normalise(guest.lastName).startsWith(query);
}

function isMatchByTable(guest, query) {
  return normalise(guest.table).startsWith(query);
}

function normalise(text) {
  return text
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replaceAll(" ", "");
}
