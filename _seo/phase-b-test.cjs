const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');const content=require('./phase-b-content.json');const baseline=require('./phase-b-baseline.json');
const {checkTeam,teamSection}=require('./team-test.cjs');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const clean=node=>{const copy=node.cloneNode(true);copy.querySelectorAll('[style]').forEach(e=>e.removeAttribute('style'));copy.removeAttribute('style');return copy.outerHTML};
const text=node=>node.textContent.replace(/\s+/g,' ').trim();
const label=value=>value.split(' → ')[0];
function checkPhaseB(doc,path){
 const home=path==='/',main=doc.querySelector('main');assert.ok(main);
 const expectedTitle=content[home?'metaHome':'metaAbout']['SEO title'];
 assert.equal(doc.title,expectedTitle);assert.equal(text(doc.querySelector('h1')),content[home?'H01':'A01'].H1);
 // Existing navigation distinguishes /about from /about/ for the active-link class.
 assert.ok(baseline.headerHashes[path].includes(hash(clean(doc.querySelector('header')))),'header unchanged apart from existing active-link state');
 assert.equal(hash(clean(doc.querySelector('footer'))),baseline.footerHash,'footer unchanged');
 const expected=[];
 const add=(section,fields)=>fields.forEach(field=>expected.push(content[section][field]));
 if(home){
  add('H01',['Eyebrow','Supporting description','Primary CTA','Secondary CTA']);add('H02',['H2','Introduction']);
  for(const i of [1,2,3])add('H02.'+i,['H3','Summary','Link label']);
  const related=main.querySelector('nav[aria-label="Related engineering services"]');assert.ok(related,'dedicated related-service navigation');
  assert.deepEqual([...related.querySelectorAll('a')].map(a=>a.getAttribute('href')),content['H02.4'].Links.map(l=>l.href));
  for(const l of content['H02.4'].Links)assert.ok(text(related).includes(l.text));
  assert.ok(!text(main).includes('Where a project also needs a desktop interface'));
  assert.ok(!text(main).includes('Explore embedded firmware development and embedded Linux development'));
  assert.equal(main.querySelectorAll('p a').length,0,'body paragraphs contain no inserted links');
  add('H03',['H2','Description']);add('H04',['H2','Introduction']);
  expected.push(content.H04['Stage 01'].split(': ').slice(1).join(': '));
  add('H05',['H2','Description']);add('H06',['H2','Introduction']);
  for(const i of [1,2,3,4]){add('H06.'+i,['Card heading','Body']);expected.push(label(content['H06.'+i].Footer));}
  add('H07',['H2','Paragraph']);
  assert.equal([...main.querySelectorAll('a[href]')].filter(a=>a.getAttribute('href').replace(/\/$/,'')==='/contact').length>=4,true);
  const problems=[...main.querySelectorAll('section')].find(s=>s.querySelector('h2')?.textContent===content.H06.H2);
  assert.equal(problems.querySelectorAll('h3').length,4);assert.equal(problems.querySelectorAll('blockquote').length,0);
 }else{
  add('A01',['Hero description']);add('A02',['H2','Paragraph 1','Paragraph 2','Paragraph 3']);add('A03',['H2']);add('A04',['H2']);
  for(const [key,value] of Object.entries(content.A03).filter(([key])=>key.startsWith('Principle '))){const i=value.indexOf(': ');expected.push(value.slice(0,i),value.slice(i+2));}
  for(const i of [1,2,3,4,5]){add('A04.'+i,['H3','Description']);expected.push(label(content['A04.'+i]['Related link']));}
  add('A06',['Section heading','Paragraph']);
  assert.equal(main.querySelectorAll('p a').length,0,'About paragraph copy is free of inline links');
  checkTeam(doc);assert.equal(hash(clean(teamSection(doc))),baseline.teamSectionHash,'approved team markup/content unchanged');
 }
 for(const value of expected)assert.ok(text(main).includes(value),path+' missing approved copy: '+value);
 for(const value of ['What partners say','Enterprise Security Vendor','Pro Audio Hardware','In-Vehicle Systems','Industrial IoT','40,000','WHQL Certified','The path so far.','2021','2022','2023','2024','signed, certified, and stable','We master the machine.'])assert.ok(!text(main).includes(value),path+' old claim: '+value);
 assert.equal(doc.querySelector('link[rel=canonical]').href,'https://haemantech.com'+(home?'/':'/about/'));
 return expected.length;
}
function checkProtectedFiles(){
 assert.equal(hash(fs.readFileSync('_seo/team.json')),baseline.teamDataHash,'team data unchanged');
 const routes=require('./routes.json');assert.equal(Object.keys(routes).length,77);
 for(const [path,before] of Object.entries(baseline.routes)){
  const after=routes[path];assert.ok(after,path+' retained');assert.equal(after.noindex,before.noindex);
  if(!['/','/about'].includes(path))assert.deepEqual(after,before,path+' metadata unchanged');
 }
 assert.equal(fs.readFileSync('robots.txt','utf8'),'User-agent: *\nAllow: /\nDisallow: /_seo/\n\nSitemap: https://haemantech.com/sitemap.xml\n');
 const sitemap=new JSDOM(fs.readFileSync('sitemap.xml','utf8'),{contentType:'application/xml'}).window.document;
 assert.deepEqual([...sitemap.querySelectorAll('loc')].map(e=>e.textContent),Object.entries(baseline.routes).filter(([,r])=>!r.noindex).map(([p])=>'https://haemantech.com'+(p==='/'?'/':p+'/')));
}
module.exports={checkPhaseB,checkProtectedFiles};
if(require.main===module){checkProtectedFiles();let strings=0;for(const [path,file] of [['/','index.html'],['/about','about/index.html']]){const dom=new JSDOM(fs.readFileSync(file,'utf8'));strings+=checkPhaseB(dom.window.document,path);dom.window.close();}console.log('PASS: Phase B initial HTML, '+strings+' approved copy checks; team, header/footer, other metadata, sitemap and robots preserved.');}
