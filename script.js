document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('aktuality');

  fetch('/data/aktuality.json')
    .then(res => res.json())
    .then(data => {
      container.innerHTML = ''; // vyčistit

      data.forEach(item => {
        const el = document.createElement('div');
        el.innerHTML = `
          <h2>${item.title}</h2>
          <div>${item.contentHtml}</div>
          <hr>
        `;
        container.appendChild(el);
      });
    })
    .catch(err => {
      container.innerHTML = '<p>Aktuality se nepodařilo načíst.</p>';
      console.error('Chyba při načítání aktualit:', err);
    });
});