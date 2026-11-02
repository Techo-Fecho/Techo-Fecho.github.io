// Scoped Projects index redesign. Detail routes and original bundle are retained.
const fs=require('node:fs');
module.exports=bundle=>{
 const start=bundle.indexOf('function vF(){'),end=bundle.indexOf('function yF(){',start);
 if(start<0||end<start)throw Error('Projects component boundary missing');
 return 'const HaemanGalleryCSS='+JSON.stringify(fs.readFileSync('_seo/project-gallery.css','utf8'))+';\n'+fs.readFileSync('_seo/project-gallery-component.js','utf8')+'\n'+bundle.slice(0,start)+'function vF(){return (0,I.jsx)(HaemanProjects,{})}'+bundle.slice(end);
};
