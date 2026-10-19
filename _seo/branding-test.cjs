const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{JSDOM}=require('jsdom');
const baseline=require('./branding-baseline.json'),assets=require('./branding-assets.json');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
// Restore only the deliberately changed logo image for existing chrome hash checks.
// Every non-brand navigation/footer element remains covered by its original hash.
function normalizeLogo(node){
 const img=node.querySelector('a[aria-label="Haeman Tech home"] img.brand-logo');if(!img)return;
 const attributes=baseline.logoAttributes[node.tagName==='FOOTER'?'footer':'header'];
 for(const attr of [...img.attributes])img.removeAttribute(attr.name);
 for(const [name,value]of attributes)img.setAttribute(name,value);
}
function checkDocument(d,route){
 const before=baseline.routes[route];assert.ok(before,route);
 assert.equal(hash((d.querySelector('main')||d.getElementById('root')).textContent.replace(/\s+/g,' ').trim()),before.text,route+' original content');
 assert.equal(hash(JSON.stringify([...d.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')))),before.linksHash,route+' all destinations retained');
 assert.equal(d.title,before.title);assert.equal(hash(JSON.stringify([...d.querySelectorAll('meta')].map(n=>n.outerHTML))),before.metaHash);
 assert.equal(d.querySelector('link[rel=canonical]')?.href??null,before.canonical);
 const schema=JSON.parse(d.getElementById('seo-structured-data').textContent);assert.equal(schema['@graph'][0].logo,'https://haemantech.com/haeman-logo.png?v='+assets.version);delete schema['@graph'][0].logo;assert.equal(hash(JSON.stringify(schema)),before.schemaHash,'only Organization logo reference changes');
 const icons=[...d.querySelectorAll('link[rel=icon]')];assert.equal(icons.length,4);
 for(const size of [16,32,48])assert.ok(icons.some(n=>n.getAttribute('sizes')===size+'x'+size&&n.getAttribute('href')==='/favicon-'+size+'x'+size+'.png?v='+assets.version));
 assert.ok(icons.some(n=>n.getAttribute('href')==='/favicon.ico?v='+assets.version));
 assert.ok(d.querySelector('link[href="/branding.css?v='+assets.version+'"]'));
 for(const img of d.querySelectorAll('a[aria-label="Haeman Tech home"] img')){assert.ok(img.classList.contains('brand-logo'));assert.equal(img.alt,'Haeman Tech');assert.ok(['/haeman-logo.png?v=','/haeman-logo-dark.png?v='].some(prefix=>img.getAttribute('src')===prefix+assets.version));assert.equal(img.getAttribute('width'),String(assets.width));assert.equal(img.getAttribute('height'),String(assets.height));}
}
function checkBranding(){
 for(const [name,expected]of Object.entries(assets.sources))assert.equal(hash(fs.readFileSync('_seo/brand-assets/'+name)),expected,'approved source '+name);
 for(const [name,expected]of Object.entries(assets.assets))assert.equal(hash(fs.readFileSync(name)),expected,'derived asset '+name);
 for(const size of [16,32,48]){const png=fs.readFileSync('favicon-'+size+'x'+size+'.png');assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);}
 const ico=fs.readFileSync('favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);assert.deepEqual([0,1,2].map(i=>ico[6+16*i]).sort((a,b)=>a-b),[16,32,48]);
 for(const route of Object.keys(baseline.routes)){const file=route==='/__404'?'404.html':route==='/'?'index.html':route.slice(1)+'/index.html';const dom=new JSDOM(fs.readFileSync(file,'utf8'));checkDocument(dom.window.document,route);dom.window.close();}
 console.log('PASS branding: exact source/asset hashes, PNG/ICO sizes, 77 routes + 404; content, links and SEO unchanged apart from Organization logo.');
}
module.exports={normalizeLogo,checkBranding,checkDocument};
if(require.main===module)checkBranding();
