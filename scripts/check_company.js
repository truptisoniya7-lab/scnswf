async function checkCompany() {
  const res = await fetch('https://www.linkedin.com/company/scnswf/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  require('fs').writeFileSync('scripts/company.html', html);

  // Search for background / banner image / cover / logo
  const imgs = html.match(/https:\/\/[^"'<>\s]+(?:licdn\.com)[^"'<>\s]*/g) || [];
  console.log('Total licdn images found:', imgs.length);
  [...new Set(imgs)].forEach(img => {
    if (img.includes('company-logo') || img.includes('cover') || img.includes('background') || img.includes('banner') || img.includes('profile')) {
      console.log('Logo/banner candidate:', img);
    }
  });
}
checkCompany();
