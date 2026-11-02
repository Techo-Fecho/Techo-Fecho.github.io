function HaemanProducts(){
 const jsx=I.jsx,jsxs=I.jsxs;
 const windows=jsx('svg',{viewBox:'0 0 24 24',width:28,height:28,'aria-hidden':true,fill:'currentColor',children:jsx('path',{d:'M1 3.5 10 2.3V11H1zm10-1.4L23 .5V11H11zM1 12h9v8.7l-9-1.2zm10 0h12v10.5L11 20.9z'})});
 return jsxs('div',{className:'products-page',children:[
  jsx('style',{children:HaemanProductsCSS}),
  jsxs('section',{className:'products-intro products-container',children:[jsx('p',{className:'products-eyebrow',children:'OUR PRODUCTS'}),jsxs('h1',{children:[jsx('span',{className:'gradient-text',children:'Windows apps'}),' by Haeman Tech']}),jsx('p',{className:'products-lead',children:'Explore our Windows utilities. View each app on Microsoft Store for details and installation.'})]}),
  jsx('div',{className:'products-container',children:HaemanProductsData.map((p,index)=>jsxs('section',{className:'product-row'+(index===1?' product-row-reverse':''),'aria-labelledby':'product-title-'+index,children:[
   jsxs('div',{className:'product-copy',children:[jsx('h2',{id:'product-title-'+index,children:p.name}),jsx('p',{children:p.description}),jsxs('div',{className:'product-platform',children:[windows,jsx('span',{children:'Windows'})]}),jsxs('a',{className:'product-store',href:p.store,target:'_blank',rel:'noopener noreferrer','aria-label':'View '+p.name+' on Microsoft Store (opens in a new tab)',children:['View on Microsoft Store',jsx('span',{'aria-hidden':true,children:'↗'})]})]}),
   jsx('a',{className:'product-visual'+(index===2?' product-visual-portrait':''),href:p.store,target:'_blank',rel:'noopener noreferrer','aria-label':'View '+p.name+' on Microsoft Store (opens in a new tab)',children:jsx('img',{src:p.image,alt:p.name+' screenshot from Microsoft Store',width:p.width,height:p.height,loading:index===0?'eager':'lazy',decoding:'async'})})
  ]},p.name))}),
  jsx('div',{className:'products-container',children:jsxs('aside',{className:'product-support',children:[jsx('span',{className:'product-support-icon','aria-hidden':true,children:'?'}),jsxs('div',{children:[jsx('h2',{children:'Need help with an app?'}),jsx('p',{children:'Get support for our Windows applications.'})]}),jsxs('a',{href:'mailto:official@haemantech.com',children:['Contact support',jsx('span',{'aria-hidden':true,children:'→'})]})]})})
 ]});
}
