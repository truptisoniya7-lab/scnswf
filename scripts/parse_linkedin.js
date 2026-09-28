const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\0dc98258-7401-4902-b287-6c5cbd5ba0c5\\.system_generated\\steps\\25\\content.md', 'utf-8');

// Find all URLs and image mentions
const postRegex = /https:\/\/www\.linkedin\.com\/posts\/[^\s\)\]]+/g;
const posts = [...new Set(content.match(postRegex) || [])];

console.log(`Found ${posts.length} posts:`);
posts.forEach(p => console.log(p));

// Also search for any images or media urls
const mediaRegex = /https:\/\/[^\s\)\]]+licdn\.com[^\s\)\]]+/g;
const mediaUrls = [...new Set(content.match(mediaRegex) || [])];
console.log(`Found ${mediaUrls.length} media URLs:`);
mediaUrls.forEach(m => console.log(m));
