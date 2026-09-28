const fs = require('fs');
const html = fs.readFileSync('scripts/company.html', 'utf-8');

const profileMatches = html.match(/https:\/\/media\.licdn\.com\/dms\/image\/[^"'<>\s]*profile-displayphoto[^"'<>\s]*/g) || [];
console.log('Profile photo matches:', profileMatches.length);
[...new Set(profileMatches)].forEach(p => console.log(p));
