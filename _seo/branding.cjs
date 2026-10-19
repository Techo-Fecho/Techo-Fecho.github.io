// Keep the approved artwork and logo's home link separate from all page content.
const {version,width,height}=require('./branding-assets.json');
module.exports=function branding(bundle){
 const start=bundle.indexOf('function ym('),end=bundle.indexOf('var bm=',start);
 if(start<0||end<=start)throw Error('Missing shared logo component');
 bundle=bundle.slice(0,start)+`function ym({className:e='',height:t='h-9'}){let{theme:n}=_m();return(0,I.jsx)(W,{to:'/',className:ri('flex min-w-0 items-center',e),'aria-label':'Haeman Tech home',children:(0,I.jsx)('img',{src:n==='light'?vm:'/haeman-logo-dark.png?v=${version}',alt:'Haeman Tech',width:${width},height:${height},className:t==='h-12'?'brand-logo brand-logo-footer':'brand-logo',draggable:!1})})}`+bundle.slice(end);
 const old='/haeman-logo.png?v=20261016-logo';if(!bundle.includes(old))throw Error('Missing old logo URL');
 return bundle.split(old).join('/haeman-logo.png?v='+version);
};
