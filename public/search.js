let guests = [];

fetch("table_assignments.csv")
  .then((resp) => resp.text())
  .then((data) => {
    guests = parseCSV(data);
    renderSuggestions(guests);
  })
  .catch((err) => {
    console.error("Could not load table_assignments.csv:", err);
  });

const searchBox = document.getElementById("guest-search");
const list = document.getElementById("suggestions");
const title = document.querySelector(".title");

searchBox.addEventListener("input", () => {
  const query = searchBox.value.trim().toLowerCase();
  renderSuggestions(
    query
      ? guests.filter((guest) =>
          guest.Name.toLowerCase().startsWith(query)
        )
      : guests
  );
});

searchBox.addEventListener("focus", () => {
  // Hide title for more space
  title.classList.add("hidden");

  // Scroll input to top after a short delay (keyboard handling)
  setTimeout(() => {
    searchBox.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 150);
});

searchBox.addEventListener("blur", () => {
  // Show title back after input is unfocused
  title.classList.remove("hidden");
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

function renderSuggestions(matches) {
  list.innerHTML = "";
  matches.forEach((guest) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="name">${guest.Name}</span>
      <span class="table">${guest.Table}</span>
    `;
    list.appendChild(li);
  });
}
