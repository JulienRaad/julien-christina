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
  list.innerHTML = "";

  matches.forEach((guest) => {
    const li = document.createElement("li");
    li.className = "card";

    li.innerHTML = `
      <span class="name">${guest.name}</span><br/>
      <span class="table">Table ${guest.table}</span>
    `;

    list.appendChild(li);
  });
}
