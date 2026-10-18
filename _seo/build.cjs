const fs=require('node:fs'),path=require('node:path');
const render=require('./render.cjs');
const routes=require('./routes.json');
const editorialVersion='phase-b-'+require('node:crypto').createHash('sha256').update(fs.readFileSync('app-v2.js')).update(fs.readFileSync('seo.js')).digest('hex').slice(0,12);
(async()=>{
 for(const route of [...Object.keys(routes),'/__seo_missing_page__']){
  const {dom,errors}=await render(route);
  const doc=dom.window.document;
  doc.querySelectorAll('script[src]').forEach(el=>el.remove());
  // A static snapshot is visible before React mounts. Runtime animation code is unchanged.
  doc.querySelectorAll('#root [style]').forEach(el=>{if(el.style.opacity==='0')el.style.opacity='1'});
  const version=route==='/'||route==='/about'?editorialVersion:'20261016-seo';
  const seo=doc.createElement('script');seo.src='/seo.js?v='+version;doc.head.append(seo);
  const app=doc.createElement('script');app.type='module';app.src='/app-v2.js?v='+version;doc.body.append(app);
  const dest=route==='/__seo_missing_page__'?'404.html':route==='/'?'index.html':route.slice(1)+'/index.html';
  fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,dom.serialize()+'\n');
  if(errors.length)throw Error(route+': '+errors.join('; '));
  dom.window.close();console.log(dest);
 }
 const urls=Object.entries(routes).filter(([,p])=>!p.noindex).map(([p])=>'https://haemantech.com'+(p==='/'?'/':p+'/'));
 fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'  <url><loc>'+u+'</loc></url>').join('\n')+'\n</urlset>\n');
 fs.writeFileSync('robots.txt','User-agent: *\nAllow: /\nDisallow: /_seo/\n\nSitemap: https://haemantech.com/sitemap.xml\n');
})().catch(e=>{console.error(e);process.exit(1)});
