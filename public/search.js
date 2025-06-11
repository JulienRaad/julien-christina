    let guests = [];

fetch("table_assignments.csv")
  .then((resp) => resp.text())
  .then((data) => {
    // Parse CSV data
    guests = parseCSV(data);
  })
  .catch((err) => {
    console.error("Could not load table_assignments.csv:", err);
  });

// Function to parse CSV data
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

    const searchBox = document.getElementById("guest-search");
    const list = document.getElementById("suggestions");

    searchBox.addEventListener("input", () => {
      const query = searchBox.value.trim().toLowerCase();
      renderSuggestions(
        query
          ? guests.filter((g) => g.name.toLowerCase().startsWith(query))
          : []
      );
    });

    function renderSuggestions(matches) {
      list.innerHTML = "";

      matches.forEach((guest) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="name">${guest.name}</span>
          <span class="table">${guest.table}</span>
        `;
        list.appendChild(li);
      });
    }