const path = require('path');
const fs = require('fs-extra');
const { marked } = require('marked');
const matter = require('gray-matter');

// Cesty
const contentDir = path.join(__dirname, 'content', 'aktuality');
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(publicDir, 'data');
const jsonPath = path.join(dataDir, 'aktuality.json');
const htmlPath = path.join(publicDir, 'aktuality.html');

// Načti všechny .md soubory
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

// Zpracuj aktuality
const aktuality = files.map(file => {
  const filepath = path.join(contentDir, file);
  const raw = fs.readFileSync(filepath, 'utf-8');
  const stats = fs.statSync(filepath);

  const parsed = matter(raw);
  const title = parsed.data.title || 'Bez názvu';
  const image = parsed.data.image || null;
  const date = parsed.data.date || stats.mtime.toISOString().split('T')[0];
  const contentHtml = marked(parsed.content.trim());

  return {
    title,
    image,
    date,
    contentHtml
  };
});

// Seřaď sestupně podle data
aktuality.sort((a, b) => new Date(b.date) - new Date(a.date));

// Ulož JSON
fs.ensureDirSync(dataDir);
fs.writeFileSync(jsonPath, JSON.stringify(aktuality, null, 2), 'utf-8');

// Vytvoř HTML stránku
const aktualityHtml = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <title>Aktuality</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Aktuality</h1>
  <div id="aktuality"></div>

  <script>
    fetch('data/aktuality.json')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('aktuality');

        if (!data || data.length === 0) {
          container.textContent = 'Žádné aktuality.';
          return;
        }

        const poslednichPatnact = data.slice(-15).reverse();
        poslednichPatnact.forEach(item => {
          const article = document.createElement('article');

          let imageHtml = '';
          if (item.image) {
            imageHtml = \`<img src="\${item.image}" alt="" class="aktualita-img" />\`;
          }

          article.innerHTML = \`
            <h2>\${item.title}</h2>
            <p><em>\${item.date}</em></p>
            \${imageHtml}
            \${item.contentHtml}
          \`;
          container.appendChild(article);
        });
      })
      .catch(err => {
        document.getElementById('aktuality').textContent = 'Nelze načíst aktuality.';
        console.error(err);
      });
  </script>
</body>
</html>
`;

// Ulož HTML
fs.writeFileSync(htmlPath, aktualityHtml, 'utf-8');

console.log('✅ Aktuality úspěšně vygenerovány:');
console.log('- JSON: ' + jsonPath);
console.log('- HTML: ' + htmlPath);
