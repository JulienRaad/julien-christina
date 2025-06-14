let guests = [];

fetch("table_assignments.csv")
  .then((resp) => resp.text())
  .then((data) => {
    guests = parseCSV(data).sort((a, b) => a.Name.localeCompare(b.Name));
    renderSuggestions(guests, "name");
  })
  .catch((err) => {
    console.error("Could not load table_assignments.csv:", err);
  });

const searchBox = document.getElementById("guest-search");
const list = document.getElementById("suggestions");

searchBox.addEventListener("input", () => {
  const query = searchBox.value.trim().toLowerCase();

  if (!query) {
    renderSuggestions(guests, "name");
    return;
  }

  const isNumber = /^\d+$/.test(query); // check if query is all digits

  const filtered = isNumber
    ? guests.filter((guest) => guest.Table === query)
    : guests.filter((guest) => guest.Name.toLowerCase().startsWith(query));

  const groupBy = isNumber ? "table" : "name";

  // Sort guests by name regardless of grouping
  filtered.sort((a, b) => a.Name.localeCompare(b.Name));

  renderSuggestions(filtered, groupBy);
});

function parseCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const headers = rows[0].split(",").map((header) => header.trim());
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(",").map((value) => value.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    result.push(obj);
  }

  return result;
}

function renderSuggestions(matches, groupBy = "name") {
  list.innerHTML = "";

  let currentGroup = null;

  matches.forEach((guest) => {
    const groupKey =
      groupBy === "table"
        ? guest.Table
        : guest.Name.charAt(0).toUpperCase();

    if (groupKey !== currentGroup) {
      currentGroup = groupKey;
      const heading = document.createElement("li");
      heading.textContent =
        groupBy === "table" ? `Table ${groupKey}` : groupKey;
      heading.classList.add("group-letter");
      list.appendChild(heading);
    }

    const li = document.createElement("li");

    li.innerHTML =
      groupBy === "table"
        ? `<span class="name">${guest.Name}</span>`
        : `<span class="name">${guest.Name}</span> <span class="table">${guest.Table}</span>`;

    list.appendChild(li);
  });
}
