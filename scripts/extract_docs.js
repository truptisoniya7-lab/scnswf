const fs = require('fs');

['scripts/post2.html', 'scripts/post3.html', 'scripts/post6.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf-8');
  console.log(`=== ${f} ===`);
  const iframeMatch = html.match(/<iframe[^>]+>/g);
  if (iframeMatch) {
    iframeMatch.forEach(ifm => console.log('iframe:', ifm));
  }
  const docMatches = html.match(/https:\/\/[^"'<>\s]+(?:feedshare-document|feedshare-shrink|feedshare-image)[^"'<>\s]*/g) || [];
  [...new Set(docMatches)].forEach(d => console.log('doc match:', d));
});
