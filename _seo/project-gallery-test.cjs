const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const {JSDOM}=require('jsdom');
function checkProjects(document){
 const source=fs.readFileSync('_seo/original-app.js','utf8'),start=source.indexOf('var hF='),end=source.indexOf('],gF=',start);
 const projects=vm.runInNewContext(source.slice(start+7,end+1));
 const dom=document?null:new JSDOM(fs.readFileSync('projects/index.html','utf8')),d=document||dom.window.document;
 assert.equal(d.querySelectorAll('.project-case-card').length,projects.length);
 for(const p of projects){const a=d.querySelector('.project-case-card a[href="/projects/'+p.slug+'"]');assert.ok(a);assert.equal(a.querySelector('h3').textContent,p.title);assert.equal(a.querySelector('.project-card-copy p').textContent,p.short);assert.equal(a.querySelector('.project-card-copy').firstElementChild.tagName,'H3');assert.ok(a.querySelector('.project-art'));}
 assert.equal(d.querySelectorAll('.gallery-slide').length,2);assert.equal(d.querySelector('.projects-eyebrow').textContent,'PROJECTS');
 assert.equal(d.querySelector('.projects-intro').textContent,'Explore our work in Windows drivers, embedded firmware and hardware integration. See development workflows and project demonstrations from our team.');
 for(const v of d.querySelectorAll('video')){assert.equal(v.getAttribute('preload'),'none');assert.ok(!v.hasAttribute('autoplay'));assert.ok(fs.statSync(v.getAttribute('src').slice(1)).size>100000);assert.ok(fs.existsSync(v.getAttribute('poster').slice(1)));}
 assert.ok(fs.existsSync(d.querySelector('.projects-hero-image').getAttribute('src').slice(1)));
 dom?.window.close();console.log('PASS: Projects gallery, all '+projects.length+' retained project titles/descriptions/links, category labels removed, local media.');
}
module.exports={checkProjects};if(require.main===module)checkProjects();
