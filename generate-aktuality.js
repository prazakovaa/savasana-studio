const path = require('path');
const fs = require('fs-extra');

// Zdrojová složka se fotkami:
const sourceDir = path.join(__dirname, 'public', 'images', 'uploads');

// Cílová složka, kam chceš fotky zkopírovat - třeba do public/images/kamkoliv
const targetDir = path.join(__dirname, 'public', 'nějaká_cílová_složka'); // uprav podle potřeby

fs.copySync(sourceDir, targetDir);

const { marked } = require('marked');

const contentDir = path.join(__dirname, 'content', 'aktuality');
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(publicDir, 'data');

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

const aktuality = files.map(file => {
  const filepath = path.join(contentDir, file);
  const raw = fs.readFileSync(filepath, 'utf-8');

  // Načti metadata a obsah
  // Pokud nemáš front matter, můžeš přeskočit gray-matter
  // const { data, content } = matter(raw);

  // Načti čas poslední změny souboru (mtime)
  const stats = fs.statSync(filepath);
  const fileDate = stats.mtime.toISOString().split('T')[0]; // např. "2025-06-06"

  // Titulek - první řádek s #
  const lines = raw.split('\n');
  const title = lines[0].replace(/^#\s*/, '').trim();
  const contentMd = lines.slice(1).join('\n').trim();

  return {
    title: title || 'Bez názvu',
    date: fileDate,
    contentHtml: marked(contentMd)
  };
});

// Seřaď sestupně podle data (nejnovější nahoře)
aktuality.sort((a, b) => new Date(b.date) - new Date(a.date));

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'aktuality.json'), JSON.stringify(aktuality, null, 2), 'utf-8');

// 5. Vygeneruj jednoduchou aktuality.html stránku do public/
const aktualityHtml = `
<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8" />
<title>Aktuality</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<h1>Aktuality</h1>
<div id="aktuality-container"></div>

<script src="script.js"></script>
<script>
  fetch('data/aktuality.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('aktuality-container');
      data.forEach(item => {
        const article = document.createElement('article');
        article.innerHTML = '<h2>' + item.title + '</h2>' +
                            '<p><em>' + item.date + '</em></p>' +
                            item.contentHtml;
        container.appendChild(article);
      });
    })
    .catch(err => {
      document.getElementById('aktuality-container').textContent = 'Chyba načítání aktualit.';
      console.error(err);
    });
</script>

</body>
</html>
`;

// Ulož HTML stránku
fs.writeFileSync(path.join(publicDir, 'aktuality.html'), aktualityHtml, 'utf-8');

console.log('Aktuality vygenerovány.');