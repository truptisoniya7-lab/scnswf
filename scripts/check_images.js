const fs = require('fs');
const path = require('path');

const files = [
  'frontend/public/images/healthcare/polio-free-india-awareness.jpg',
  'frontend/public/images/education/child-health-handwashing.jpg',
  'frontend/public/images/education/global-handwashing-day.jpg',
  'frontend/public/images/events/world-polio-day.jpg',
  'frontend/public/images/about/raja-parba-homso.jpg',
  'frontend/public/images/events/diwali-celebration-greeting.jpg',
  'frontend/public/images/events/diwali-community-safety.jpg',
  'frontend/public/images/about/geriatric-care-parents.jpg',
  'frontend/public/images/healthcare/body-pain-causes-cures.jpg',
  'frontend/public/images/about/scnswf-logo.png'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const stat = fs.statSync(f);
    console.log(`${f}: ${stat.size} bytes`);
  } else {
    console.log(`${f}: NOT FOUND`);
  }
});
