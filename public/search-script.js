// Fetch guest data once when the page loads
let guests = [];

fetch("guests.json")
  .then((resp) => resp.json())
  .then((data) => {
    guests = data;
  })
  .catch((err) => {
    console.error("Could not load guests.json:", err);
  });

const searchBox = document.getElementById("guest-search");
const list = document.getElementById("suggestions");

searchBox.addEventListener("input", () => {
  const query = searchBox.value.trim().toLowerCase();
  renderSuggestions(
    query
      ? guests.filter((g) => g.name.toLowerCase().includes(query))
      : []
  );
});

function renderSuggestions(matches) {
  list.innerHTML = ""; // Clear previous suggestions

  matches.forEach((guest) => {
    const li = document.createElement("li");
    li.className = "card";

    li.innerHTML = `
      <span class="name">${highlightMatch(guest.name)}</span><br/>
      <span class="table">Table ${guest.table}</span>
    `;

    list.appendChild(li);
  });
}

function highlightMatch(name) {
  const q = searchBox.value.trim();
  if (!q) return name;
  const regex = new RegExp(`(${escapeRegExp(q)})`, "gi");
  return name.replace(regex, "<mark>$1</mark>");
}

function escapeRegExp(text) {
  return text.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}
