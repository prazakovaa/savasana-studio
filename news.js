fetch('data/aktuality.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('posledni-aktualita');

      if (data.length === 0) {
        container.textContent = 'Žádné aktuality.';
        return;
      }

      // Vezmi poslední přidanou aktualitu (poslední prvek v poli)
      const posledniPridana = data[data.length - 1];

      const article = document.createElement('article');
      article.innerHTML = `<h2>${posledniPridana.title}</h2><p><em>${posledniPridana.date}</em></p>${posledniPridana.contentHtml}`;
      container.appendChild(article);
    })
    .catch(err => {
      document.getElementById('posledni-aktualita').textContent = 'Nelze načíst aktuality.';
      console.error(err);
    });


  fetch('data/aktuality.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('posledni-aktuality');

      if (data.length === 0) {
        container.textContent = 'Žádné aktuality.';
        return;
      }

      // Vezmi poslední 3 aktuality (od konce)
      const posledniTri = data.slice(-3).reverse(); // reverse = nejnovější nahoře

      posledniTri.forEach(item => {
        const article = document.createElement('article');
        article.innerHTML = `<h2>${item.title}</h2><p><em>${item.date}</em></p>${item.contentHtml}`;
        container.appendChild(article);
      });
    })
    .catch(err => {
      document.getElementById('posledni-aktuality').textContent = 'Nelze načíst aktuality.';
      console.error(err);
    });

    fetch('data/aktuality.json')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('vsechny-aktuality');

        if (!data || data.length === 0) {
          container.textContent = 'Žádné aktuality.';
          return;
        }

        const poslednichPatnact = data.slice(-15).reverse(); // prvních 15 nejnovějších
        poslednichPatnact.forEach(item => {
          const article = document.createElement('article');
          article.innerHTML = `<h2>${item.title}</h2><p><em>${item.date}</em></p>${item.contentHtml}`;
          container.appendChild(article);
        });
      })
      .catch(err => {
        document.getElementById('vsechny-aktuality').textContent = 'Nelze načíst aktuality.';
        console.error(err);
      });
