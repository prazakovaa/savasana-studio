const fsExtra = require("fs-extra");
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// Cesty
const contentDir = path.join(__dirname, 'content', 'aktuality');
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(publicDir, 'data');
const imagesSrcDir = path.join(__dirname, 'images', 'uploads');
const imagesDestDir = path.join(publicDir, 'images', 'uploads');

// 1. Zkopíruj obrázky z content/images/uploads do public/images/uploads
fsExtra.copySync(imagesSrcDir, imagesDestDir);

// 2. Načti všechny .md soubory z content/aktuality/
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

const aktuality = files.map(file => {
  const filepath = path.join(contentDir, file);
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    title: data.title || 'Bez názvu',
    date: data.date || '1970-01-01',
    contentHtml: marked(content)
  };
});

// 3. Seřadit sestupně podle data (nejnovější první)
aktuality.sort((a, b) => new Date(b.date) - new Date(a.date));

// 4. Ulož JSON do public/data/aktuality.json
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