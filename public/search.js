    let guests = [];

    fetch("guests.json")
      .then((resp) => resp.json())
      .then((data) => {
        guests = data;
        renderSuggestions([]); // preload empty
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