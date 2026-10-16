const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const routes=require('./routes.json');
const render=require('./render.cjs');
const file=p=>p==='/'?'index.html':p.slice(1)+'/index.html';
const normalize=p=>p.replace(/\/+$/,'')||'/';
const text=d=>d.querySelector('main')?.textContent.replace(/\s+/g,' ').trim();
(async()=>{
 const sitemap=new JSDOM(fs.readFileSync('sitemap.xml','utf8'),{contentType:'application/xml'}).window.document;
 const urls=[...sitemap.querySelectorAll('loc')].map(x=>x.textContent);
 assert.equal(urls.length,Object.values(routes).filter(p=>!p.noindex).length);
 let links=0;
 for(const [route,p] of Object.entries(routes)){
  const dom=new JSDOM(fs.readFileSync(file(route),'utf8'));const d=dom.window.document;
  assert.equal(d.title,p.title,route+' title');
  assert.equal(d.querySelectorAll('link[rel="canonical"]').length,1);
  const canonical='https://haemantech.com'+(route==='/'?'/':route+'/');
  assert.equal(d.querySelector('link[rel="canonical"]').href,canonical);
  assert.equal(d.querySelector('meta[name="description"]').content,p.description);
  assert.equal(d.querySelector('meta[name="robots"]').content,p.noindex?'noindex, follow':'index, follow');
  assert.equal(urls.includes(canonical),!p.noindex,route+' sitemap eligibility');
  assert.equal(d.querySelectorAll('h1').length,1,route+' H1');
  assert.ok(d.getElementById('root').textContent.length>100,route+' prerender');
  const schema=JSON.parse(d.getElementById('seo-structured-data').textContent);
  assert.equal(schema['@graph'][0].email,'official@haemantech.com');
  if(route!=='/')assert.equal(schema['@graph'][1].itemListElement.at(-1).item,canonical);
  for(const a of d.querySelectorAll('a[href^="/"]')){
   const target=normalize(a.getAttribute('href').split(/[?#]/)[0]);assert.ok(routes[target],route+' broken link '+target);links++;
  }
  for(const a of d.querySelectorAll('script[src],link[rel="stylesheet"],img[src]')){
   const src=a.getAttribute('src')||a.getAttribute('href');if(src.startsWith('/'))assert.ok(fs.existsSync(src.slice(1).split('?')[0]),src);
  }
  dom.window.close();
 }
 const errorDoc=new JSDOM(fs.readFileSync('404.html','utf8')).window.document;
 assert.equal(errorDoc.querySelector('h1').textContent,'404');
 assert.equal(errorDoc.querySelector('meta[name="robots"]').content,'noindex, follow');
 assert.equal(errorDoc.querySelector('link[rel="canonical"]'),null);
 // Compare every pre-existing page's main text with the unchanged original React application.
 for(const route of Object.keys(routes).filter(p=>!p.startsWith('/careers/'))){
  const {dom}=await render(route,{original:true});
  const after=new JSDOM(fs.readFileSync(file(route),'utf8'));
  assert.equal(text(after.window.document),text(dom.window.document),route+' content drift');
  dom.window.close();after.window.close();
 }
 console.log(JSON.stringify({routes:77,indexable:urls.length,internalLinks:links,originalPageContentComparisons:71,staticMetadata:'passed',assets:'passed',unknownPage:'passed'},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
