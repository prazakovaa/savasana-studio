const fsExtra = require("fs-extra");
fsExtra.copySync("images/uploads", "public/images/uploads");

const fs = require('fs');
const path = require('path');
const { marked } = require('marked'); // opravený import

// Cesty
const contentDir = path.join(__dirname, 'content', 'aktuality');
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(publicDir, 'data');

// 1. Načti všechny .md soubory z content/aktuality/
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

const aktuality = files.map(file => {
  const filepath = path.join(contentDir, file);
  const text = fs.readFileSync(filepath, 'utf-8');

  // Jednoduchý parse: první řádek nadpis (title), zbytek obsah
  const lines = text.split('\n');
  const title = lines[0].replace(/^#\s*/, '').trim();
  const contentMd = lines.slice(1).join('\n').trim();

  // Převod markdown -> HTML
  const contentHtml = marked(contentMd);

  return {
    title,
    contentHtml
  };
});

// 2. Ulož JSON do public/data/aktuality.json
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'aktuality.json'), JSON.stringify(aktuality, null, 2), 'utf-8');

// 3. Vygeneruj jednoduchou aktuality.html stránku do public/
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
  // Po načtení dat z aktuality.json se vykreslí obsah
  fetch('data/aktuality.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('aktuality-container');
      data.forEach(item => {
        const el = document.createElement('article');
        el.innerHTML = '<h2>' + item.title + '</h2>' + item.contentHtml;
        container.appendChild(el);
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

// Ulož aktuality
fs.writeFileSync(path.join(publicDir, 'aktuality.html'), aktualityHtml, 'utf-8');

console.log('Aktuality vygenerovány.');