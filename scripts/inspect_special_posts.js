const fs = require('fs');

async function inspectHtml(url, filename) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync(filename, html);

  // Search for any media.licdn.com or dms/image or data-delayed-url in html
  const matches = html.match(/https:\/\/[^"'<>\s]+(?:licdn\.com|dms)[^"'<>\s]*/g) || [];
  console.log(`=== ${url} ===`);
  console.log(`Saved to ${filename}, HTML size: ${html.length}`);
  console.log(`Media matches found: ${matches.length}`);
  [...new Set(matches)].forEach(m => console.log('  ', m));
}

async function run() {
  await inspectHtml('https://www.linkedin.com/posts/scnswf_body-pain-cause-cure-activity-7451968374018052096-EB8y', 'scripts/post2.html');
  await inspectHtml('https://www.linkedin.com/posts/scnswf_you-might-be-caring-for-your-parents-the-activity-7450423176137740289-X4q4', 'scripts/post3.html');
  await inspectHtml('https://www.linkedin.com/posts/scnswf_safety-tips-for-this-diwali-activity-7385872100776935424-ybXM', 'scripts/post6.html');
}

run();
