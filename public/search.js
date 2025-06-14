let allGuests = [];

fetch("guests.json")
  .then((resp) => resp.json())
  .then((data) => {
    allGuests = data
    renderSuggestions(allGuests, "name");
  })
  .catch((err) => {
    console.error("Could not load guests.json:", err);
  });

const searchBox = document.getElementById("guest-search");
searchBox.addEventListener("input", () => {
  const query = searchBox.value.trim().toLowerCase();
  if (!query) {
    renderSuggestions(allGuests, "name");
    return;
  }
  let groupBy = "name";
  let filteredGuests = []
  filteredGuests = allGuests.filter((guest) => guest.name.toLowerCase().startsWith(query));
  if (filteredGuests.length === 0) {
    filteredGuests = allGuests.filter((guest) => guest.table === query)
    groupBy = "table"
  }
  renderSuggestions(filteredGuests, groupBy);
});

function renderSuggestions(matchedGuests, groupBy) {
  list.innerHTML = "";

  const list = document.getElementById("suggestions");
  const sortedMatchedGuests = matchedGuests.sort((a, b) => a.Name.localeCompare(b.Name));
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
    li.innerHTML = groupBy === "table" ? `<span class="name">${guest.name}</span>`: `<span class="name">${guest.name}</span> <span class="table">${guest.table}</span>`;
    list.appendChild(li);
  });
}
