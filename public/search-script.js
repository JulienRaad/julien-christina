document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    let guests = [];

    // Fetch the JSON file
    fetch('guests.json')
        .then(response => response.json())
        .then(data => {
            guests = data;
        })
        .catch(error => {
            resultsDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            resultsDiv.classList.add('populated');
        });

    // Filter names as user types
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        resultsDiv.innerHTML = '';
        resultsDiv.classList.remove('populated');

        if (query.length === 0) return;

        const matches = guests.filter(guest =>
            guest.name.toLowerCase().startsWith(query)
        );

        if (matches.length === 0) {
            resultsDiv.innerHTML = '<p>No matches found.</p>';
            resultsDiv.classList.add('populated');
            return;
        }

        matches.forEach(guest => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.textContent = `${guest.name} | Table ${guest.table}`;
            resultsDiv.appendChild(div);
        });
        resultsDiv.classList.add('populated');
    });
});
