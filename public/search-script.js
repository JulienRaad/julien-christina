<script>
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const resultsDiv  = document.getElementById('results');
  let guests = [];
  
  /* ---- Load guest data ---- */
  fetch('guests.json')
    .then(res => res.json())
    .then(data => { guests = data; })
    .catch(err => {
      resultsDiv.textContent = `Error: ${err.message}`;
      resultsDiv.classList.add('populated');
    });

  /* ---- Helper to clear list ---- */
  const clearResults = () => {
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('populated');
  };

  /* ---- Live-filter as user types ---- */
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    clearResults();                         // reset every keystroke
    if (!query) return;                     // nothing typed yet

    const matches = guests.filter(g =>
      g.name.toLowerCase().startsWith(query)
    );

    if (matches.length === 0) return;       // no results → show nothing

    matches.forEach(g => {
      const item = document.createElement('div');
      item.className = 'result-item';
      item.textContent = `${g.name} | Table ${g.table}`;
      resultsDiv.appendChild(item);
    });
    resultsDiv.classList.add('populated');  // reveal the list
  });
});
</script>
