const fs = require('fs');
const path = require('path');

const downloads = [
  {
    url: 'https://media.licdn.com/dms/image/v2/D5622AQFqEiDx3poN-Q/feedshare-image-high-res/B56Znl.ZYEKIAo-/0/1760499966102?e=2147483647&v=beta&t=Ado_u-nzTDY9e2khqX-6ay-Z78AE3TfmiPspX1G0tNs',
    filename: 'global-handwashing-day.jpg'
  },
  {
    url: 'https://media.licdn.com/dms/image/v2/D561FAQFzpZ0bhXfYrw/feedshare-document-cover-images_480/B56Z2U4Ud3KQBE-/1/1776319287920?e=2147483647&v=beta&t=G7LJ3lJyEIXErCxbtx0JxhoBQYaPwzuhFMBGv0Y5SME',
    filename: 'geriatric-care-page2.jpg'
  },
  {
    url: 'https://media.licdn.com/dms/image/v2/D561FAQGh4SKI1MZTrA/feedshare-document-cover-images_480/B56Z2q1uqoGgBA-/1/1776687705846?e=2147483647&v=beta&t=xOuvwaYNacjGuNEYvqQ82mlRLytOvg3-Qw3CuTcp76s',
    filename: 'body-pain-page2.jpg'
  },
  {
    url: 'https://media.licdn.com/dms/image/v2/D561FAQGpRFCXiOvZdA/feedshare-document-cover-images_480/B56Zn_jBhqKIBM-/1/1760929007409?e=2147483647&v=beta&t=Y8v_qOeP6qMd0bI5-ZFQS7Fxlw9ic_Lvo8fTD4eK4Lw',
    filename: 'diwali-safety-page2.jpg'
  }
];

async function downloadAll() {
  for (const item of downloads) {
    try {
      console.log(`Downloading ${item.filename}...`);
      const res = await fetch(item.url);
      if (!res.ok) {
        console.error(`Failed ${item.filename}: ${res.statusText}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join('scripts', item.filename), buffer);
      console.log(`Saved ${item.filename}, size: ${buffer.length} bytes`);
    } catch (e) {
      console.error(`Error downloading ${item.filename}:`, e.message);
    }
  }
}

downloadAll();
