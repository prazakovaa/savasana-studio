const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const aktualityDir = path.join(__dirname, 'content', 'aktuality');
const outputDir = path.join(__dirname, 'public', 'data');
const outputFile = path.join(outputDir, 'aktuality.json');

const aktuality = [];

fs.readdirSync(aktualityDir).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(aktualityDir, file);
    const mdContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(mdContent);

    aktuality.push({
      title: data.title || 'Bez názvu',
      contentHtml: marked(content),
      slug: file.replace('.md', '')
    });
  }
});

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(aktuality, null, 2));
console.log('Aktuality JSON vygenerován:', outputFile);
