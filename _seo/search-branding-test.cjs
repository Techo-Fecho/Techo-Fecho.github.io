const assert=require('node:assert/strict');
const title='Haeman Tech | Kernel & Embedded Engineering';
const description='Haeman Tech specializes in Windows and Linux kernel development, embedded firmware, embedded Linux, and C/C++ systems programming.';
function checkHomepage(d){
 assert.equal(d.title,title);
 for(const [attribute,name,value]of [['name','description',description],['property','og:title',title],['property','og:description',description],['name','twitter:title',title],['name','twitter:description',description]]){
  const nodes=d.querySelectorAll(`meta[${attribute}="${name}"]`);assert.equal(nodes.length,1,name+' unique');assert.equal(nodes[0].content,value);
 }
 assert.equal(d.querySelectorAll('link[rel=canonical]').length,1);assert.equal(d.querySelector('link[rel=canonical]').href,'https://haemantech.com/');
 assert.equal(d.querySelectorAll('script[type="application/ld+json"]').length,1);
 const schema=JSON.parse(d.getElementById('seo-structured-data').textContent);assert.equal(schema['@context'],'https://schema.org');
 assert.equal(schema['@graph'].filter(n=>n['@type']==='Organization').length,1);
 assert.deepEqual(schema['@graph'].filter(n=>n['@type']==='WebSite'),[{'@type':'WebSite','@id':'https://haemantech.com/#website',name:'Haeman Tech',alternateName:'HaemanTech',url:'https://haemantech.com/'}]);
 assert.equal(new Set(schema['@graph'].map(n=>n['@id'])).size,schema['@graph'].length);
}
module.exports={checkHomepage};
