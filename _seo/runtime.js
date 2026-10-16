(()=>{
const pages=/* ROUTES */;
const origin='https://haemantech.com';
const normalize=p=>p.replace(/\/index\.html$/,'/').replace(/\/+$/,'')||'/';
const url=p=>origin+(p==='/'?'/':p+'/');
const organization={'@type':'Organization','@id':origin+'/#organization',name:'Haeman Tech',url:origin+'/',logo:origin+'/haeman-logo.png',email:'official@haemantech.com'};
function apply(path){
 const key=normalize(path),page=pages[key];
 document.title=page?.title||'404 | Haeman Tech';
 const set=(attribute,name,content)=>{
  let el=document.head.querySelector(`meta[${attribute}="${name}"]`);
  if(!el){el=document.createElement('meta');el.setAttribute(attribute,name);document.head.append(el)}
  el.content=content;
 };
 set('name','description',page?.description||'The requested route could not be resolved.');
 set('name','robots',!page||page.noindex?'noindex, follow':'index, follow');
 set('property','og:title',document.title);set('property','og:description',page?.description||'The requested route could not be resolved.');
 set('property','og:type','website');
 let canonical=document.head.querySelector('link[rel="canonical"]');
 if(page){if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical)}canonical.href=url(key);set('property','og:url',url(key));}
 else{canonical?.remove();document.head.querySelector('meta[property="og:url"]')?.remove()}
 const graph=[organization];
 if(page&&key!=='/'){
  const parts=key.split('/').filter(Boolean);const crumbs=[{name:'Home',item:url('/')}];
  for(let i=0;i<parts.length;i++){let route='/'+parts.slice(0,i+1).join('/');if(pages[route])crumbs.push({name:pages[route].label,item:url(route)})}
  graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))});
 }
 let data=document.getElementById('seo-structured-data');
 if(!data){data=document.createElement('script');data.id='seo-structured-data';data.type='application/ld+json';document.head.append(data)}
 data.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph});
}
window.HaemanSEO={apply};
apply(location.pathname);
})();
