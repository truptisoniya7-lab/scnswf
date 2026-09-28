const fs = require('fs');
const path = require('path');

const baseDirs = ['public/images', 'frontend/public/images'];
const subDirs = ['hero', 'about', 'healthcare', 'education', 'livelihood', 'events', 'gallery', 'stories'];

// Ensure all directories exist
baseDirs.forEach(base => {
  subDirs.forEach(sub => {
    const dir = path.join(base, sub);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
});

// Master mapping of assets: source file -> targets
// All source files are currently in scripts/ or existing public/images
const assetMap = [
  {
    name: 'scnswf-logo.png',
    src: 'frontend/public/images/about/scnswf-logo.png',
    targets: ['about', 'gallery']
  },
  {
    name: 'polio-free-india-awareness.jpg',
    src: 'frontend/public/images/healthcare/polio-free-india-awareness.jpg',
    targets: ['hero', 'healthcare', 'gallery']
  },
  {
    name: 'community-health-outreach.jpg',
    src: 'frontend/public/images/healthcare/polio-free-india-awareness.jpg',
    targets: ['hero']
  },
  {
    name: 'child-health-handwashing.jpg',
    src: 'frontend/public/images/education/child-health-handwashing.jpg',
    targets: ['education', 'gallery']
  },
  {
    name: 'global-handwashing-day.jpg',
    src: 'scripts/global-handwashing-day.jpg',
    targets: ['education', 'events', 'gallery']
  },
  {
    name: 'world-polio-day.jpg',
    src: 'frontend/public/images/events/world-polio-day.jpg',
    targets: ['healthcare', 'events', 'gallery']
  },
  {
    name: 'geriatric-care-parents.jpg',
    src: 'frontend/public/images/about/geriatric-care-parents.jpg',
    targets: ['about', 'healthcare', 'stories', 'gallery']
  },
  {
    name: 'body-pain-causes-cures.jpg',
    src: 'frontend/public/images/healthcare/body-pain-causes-cures.jpg',
    targets: ['healthcare', 'gallery']
  },
  {
    name: 'diwali-celebration-greeting.jpg',
    src: 'frontend/public/images/events/diwali-celebration-greeting.jpg',
    targets: ['events', 'gallery']
  },
  {
    name: 'diwali-community-safety.jpg',
    src: 'frontend/public/images/events/diwali-community-safety.jpg',
    targets: ['events', 'healthcare', 'gallery']
  },
  {
    name: 'raja-parba-homso.jpg',
    src: 'frontend/public/images/about/raja-parba-homso.jpg',
    targets: ['about', 'events', 'gallery']
  }
];

baseDirs.forEach(base => {
  assetMap.forEach(item => {
    if (!fs.existsSync(item.src)) {
      console.warn(`Source not found: ${item.src}`);
      return;
    }
    const content = fs.readFileSync(item.src);
    item.targets.forEach(target => {
      const dest = path.join(base, target, item.name);
      fs.writeFileSync(dest, content);
      console.log(`Copied ${item.name} -> ${dest} (${content.length} bytes)`);
    });
  });
});

console.log('All image assets cleanly organized and synchronized!');
