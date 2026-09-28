const fs = require('fs');
const path = require('path');

const baseDirs = ['public/images', 'frontend/public/images'];

baseDirs.forEach(base => {
  // 1. Hero image: real photo of Dr. Pragyan Kumar Routray
  const heroSrc = path.join(base, 'healthcare/geriatric-care-parents.jpg');
  const heroDest = path.join(base, 'hero/doctor-healthcare-consultation.jpg');
  if (fs.existsSync(heroSrc)) {
    fs.copyFileSync(heroSrc, heroDest);
    console.log(`Copied ${heroSrc} -> ${heroDest}`);
  }

  // 2. Also keep community-health-outreach.jpg pointing to real photo of doctor
  const heroDest2 = path.join(base, 'hero/community-health-outreach.jpg');
  if (fs.existsSync(heroSrc)) {
    fs.copyFileSync(heroSrc, heroDest2);
    console.log(`Copied ${heroSrc} -> ${heroDest2}`);
  }

  // 3. Community photo
  const commSrc = path.join(base, 'events/diwali-celebration-greeting.jpg');
  const commDest = path.join(base, 'about/community-festive-outreach.jpg');
  if (fs.existsSync(commSrc)) {
    fs.copyFileSync(commSrc, commDest);
    console.log(`Copied ${commSrc} -> ${commDest}`);
  }
});
console.log('Hero and section assets updated!');
