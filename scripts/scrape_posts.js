const posts = [
  'https://www.linkedin.com/posts/scnswf_rajaparba-happyaraja-odishaculture-activity-7471743894645485569-pXSl',
  'https://www.linkedin.com/posts/scnswf_body-pain-cause-cure-activity-7451968374018052096-EB8y',
  'https://www.linkedin.com/posts/scnswf_you-might-be-caring-for-your-parents-the-activity-7450423176137740289-X4q4',
  'https://www.linkedin.com/posts/scnswf_poliofreeindia-vaccinationmatters-activity-7387361677379325952-m5Yj',
  'https://www.linkedin.com/posts/scnswf_worldpolioday-polioeradication-activity-7387357154342731776-IfG-',
  'https://www.linkedin.com/posts/scnswf_safety-tips-for-this-diwali-activity-7385872100776935424-ybXM',
  'https://www.linkedin.com/posts/scnswf_scnswf-happydiwali2025-activity-7385867997435043840-xisj',
  'https://www.linkedin.com/posts/scnswf_scnswf-childhealth-handhygiene-activity-7384090667158921216-G-0x',
  'https://www.linkedin.com/posts/activity-7384072057833082880-eRtB'
];

async function checkPost(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const ogImg = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i)
      || html.match(/content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i);
    const ogTitle = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i)
      || html.match(/content=["']([^"']+)["']\s+(?:property|name)=["']og:title["']/i);
    const ogDesc = html.match(/<meta\s+(?:property|name)=["']og:description["']\s+content=["']([^"']+)["']/i)
      || html.match(/content=["']([^"']+)["']\s+(?:property|name)=["']og:description["']/i);

    console.log(`URL: ${url}`);
    console.log(`Title: ${ogTitle ? ogTitle[1] : 'N/A'}`);
    console.log(`Image: ${ogImg ? ogImg[1].replace(/&amp;/g, '&') : 'N/A'}`);
    console.log(`Description: ${ogDesc ? ogDesc[1].substring(0, 100) : 'N/A'}`);
    console.log('---');
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
  }
}

async function run() {
  for (const p of posts) {
    await checkPost(p);
  }
}

run();
