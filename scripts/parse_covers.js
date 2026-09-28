const fs = require('fs');

['scripts/post2.html', 'scripts/post3.html', 'scripts/post6.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf-8');
  console.log(`=== ${f} ===`);
  const match = html.match(/&quot;coverPages&quot;:(\[[^\]]+\])/);
  if (match) {
    const raw = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    try {
      const parsed = JSON.parse(raw);
      console.log('Cover pages count:', parsed.length);
      parsed.forEach((p, idx) => console.log(`  Page ${idx}:`, p.config && p.config.src));
    } catch (e) {
      console.log('JSON parse error:', e.message);
      console.log('Raw:', raw);
    }
  } else {
    console.log('No coverPages match found');
  }
});
