// Approved Products showcase: additive route and navigation; original bundle retained.
const fs=require('node:fs');
module.exports=bundle=>{
 const replace=(before,after)=>{if(!bundle.includes(before))throw Error('Products integration boundary missing: '+before);bundle=bundle.split(before).join(after)};
 replace('{label:`Projects`,path:`/projects`}','{label:`Projects`,path:`/projects`},{label:`Products`,path:`/products/`}');
 replace('(0,I.jsx)(qo,{path:`/projects`,element:(0,I.jsx)(vF,{})})','(0,I.jsx)(qo,{path:`/projects`,element:(0,I.jsx)(vF,{})}),(0,I.jsx)(qo,{path:`/products`,element:(0,I.jsx)(HaemanProducts,{})})');
 return 'const HaemanProductsData='+JSON.stringify(require('./products.json'))+';\nconst HaemanProductsCSS='+JSON.stringify(fs.readFileSync('_seo/products.css','utf8'))+';\n'+fs.readFileSync('_seo/products-component.js','utf8')+'\n'+bundle;
};
