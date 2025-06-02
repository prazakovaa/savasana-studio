document.addEventListener('DOMContentLoaded', async function () {
  const aktualityDiv = document.getElementById('aktuality');
  aktualityDiv.innerHTML = '<p>Načítám aktuality...</p>';

  try {
    const response = await fetch('/data/aktuality.json');
    if (!response.ok) throw new Error('Chyba při načítání aktualit');

    const data = await response.json();

    // Vygeneruj HTML pro každou aktualitu
    const obsah = data.map(post => `
      <article>
        <h2>${post.title}</h2>
        <div>${post.contentHtml}</div>
        <hr>
      </article>
    `).join('');

    aktualityDiv.innerHTML = obsah;

  } catch (error) {
    aktualityDiv.innerHTML = '<p>Nepodařilo se načíst aktuality.</p>';
    console.error(error);
  }
});