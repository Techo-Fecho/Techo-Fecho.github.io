const assert=require('node:assert/strict');
const sentence='Haeman Tech was founded by Muneeb Irfan and is led by Chief Executive Officer Bedřich Said.';
function checkOrganization(d){
 assert.equal(d.querySelectorAll('script[type="application/ld+json"]').length,1);
 const graph=JSON.parse(d.querySelector('#seo-structured-data').textContent)['@graph'];
 const organizations=graph.filter(n=>n['@type']==='Organization');assert.equal(organizations.length,1);
 const org=organizations[0];assert.equal(org['@id'],'https://haemantech.com/#organization');
 assert.deepEqual(org.founder,{'@type':'Person',name:'Muneeb Irfan'});
 assert.deepEqual(org.employee,{'@type':'Person',name:'Bedřich Said',jobTitle:'Chief Executive Officer (CEO)'});
 assert.ok(!('ceo' in org));assert.ok(!('foundingDate' in org));
}
function checkAbout(d){
 const p=[...d.querySelectorAll('main p')].filter(n=>n.textContent.includes(sentence));assert.equal(p.length,1,'one visible founder sentence');
 assert.ok(p[0].textContent.startsWith(sentence),'statement opens existing company introduction');
 assert.equal(p[0].querySelectorAll('a').length,0);
 require('./team-test.cjs').checkTeam(d);checkOrganization(d);
}
module.exports={sentence,checkAbout,checkOrganization};
