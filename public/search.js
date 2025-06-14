fetch("guests.json")
  .then((resp) => resp.json())
  .then((data) => {
    renderSuggestions(data, "name");
  })
  .catch((err) => {
    console.error("Could not load guests.json:", err);
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
  renderSuggestions(filtered, groupBy);
});

function renderSuggestions(data, groupBy = "name") {
  let matches = filtered.sort((a, b) => a.Name.localeCompare(b.Name));
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
