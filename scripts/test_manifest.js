async function testManifest() {
  const url = 'https://media.licdn.com/dms/document/pl/v2/D561FAQGpRFCXiOvZdA/feedshare-document-master-manifest/B56Zn_jBhqKIBc-/0/1760929007967?e=2147483647&v=beta&t=HeRsci7Xnm6q-F8JokDFkqmzahVcho12MhbQYHmeNf8';
  const res = await fetch(url);
  console.log('Status:', res.status, res.headers.get('content-type'));
  const txt = await res.text();
  console.log('Text preview:', txt.substring(0, 500));
}
testManifest();
