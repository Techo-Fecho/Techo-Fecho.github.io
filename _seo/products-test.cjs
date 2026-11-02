const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const products=require('./products.json');
const d=new JSDOM(fs.readFileSync('products/index.html','utf8')).window.document;
assert.equal(d.querySelector('h1').textContent,'Windows apps by Haeman Tech');
assert.deepEqual([...d.querySelectorAll('.product-copy h2')].map(e=>e.textContent),products.map(p=>p.name));
for(const [i,p] of products.entries()){
 const row=d.querySelectorAll('.product-row')[i];
 assert.equal(row.querySelector('.product-copy>p').textContent,p.description);
 for(const a of row.querySelectorAll('a')){assert.equal(a.href,p.store);assert.equal(a.target,'_blank');assert.ok(a.rel.includes('noopener'));}
 const img=row.querySelector('img');assert.equal(img.getAttribute('src'),p.image);assert.ok(fs.statSync(p.image.slice(1)).size>1000);
}
assert.equal(d.querySelector('.product-support a').href,'mailto:official@haemantech.com');
for(const file of ['index.html','about/index.html','products/index.html']){const doc=new JSDOM(fs.readFileSync(file,'utf8')).window.document;assert.ok(doc.querySelector('header a[href="/products/"]'));assert.ok(doc.querySelector('footer a[href="/products/"]'));}
assert.equal(d.querySelector('link[rel=canonical]').href,'https://haemantech.com/products/');
console.log('PASS Products: names, copy, official Store destinations, original screenshots, navigation, support and canonical.');
