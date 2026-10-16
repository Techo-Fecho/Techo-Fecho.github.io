const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const groups=require('./team.json');
const {heading,introduction}=require('./team.cjs');
function teamSection(doc){
 const title=[...doc.querySelectorAll('h2')].find(el=>[heading,'The engineers behind the work.'].includes(el.textContent));
 assert.ok(title,'team heading exists');return title.closest('section');
}
function checkTeam(doc){
 const section=teamSection(doc);
 assert.equal(section.querySelector('h2').textContent,heading);
 assert.ok(section.textContent.includes(introduction));
 assert.deepEqual([...section.querySelectorAll('h3.label-mono')].map(el=>el.textContent),groups.map(g=>g.category));
 const cards=[...section.querySelectorAll('.group')];
 assert.equal(cards.length,10);
 const expected=groups.flatMap(g=>g.members);
 cards.forEach((card,i)=>{
  assert.equal(card.querySelector('h3').textContent,expected[i].name);
  assert.equal(card.querySelector('p').textContent,expected[i].role);
  assert.ok(card.textContent.includes(expected[i].description));
  assert.ok(card.textContent.includes(expected[i].name.split(' ').map(n=>n[0]).join('')));
  assert.equal(card.querySelectorAll('img,a').length,0,'no unverified photos or links');
 });
 for(const old of ['Muzammil Ahmad','Waqar Iqbal','Bedrich Said','Junior Embedded Developer','Senior C++ Developer'])assert.ok(!section.textContent.includes(old),old+' removed from team');
}
module.exports={teamSection,checkTeam};
if(require.main===module){const dom=new JSDOM(fs.readFileSync('about/index.html','utf8'));checkTeam(dom.window.document);dom.window.close();console.log('PASS: initial HTML contains the approved 10-member roster, categories, descriptions and initials.');}
