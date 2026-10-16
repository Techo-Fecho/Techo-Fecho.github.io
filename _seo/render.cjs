const fs=require('node:fs');
const {JSDOM,VirtualConsole}=require('jsdom');
module.exports=async function render(route,{original=false}={}){
 const errors=[];const virtualConsole=new VirtualConsole();
 virtualConsole.on('jsdomError',e=>{if(!/Not implemented: HTMLCanvasElement/.test(e.message))errors.push(e.message)});
 const dom=new JSDOM(fs.readFileSync('_seo/shell.html','utf8'),{url:'https://haemantech.com'+route,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole});
 const w=dom.window;
 w.matchMedia=()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
 w.scrollTo=()=>{};
 w.IntersectionObserver=class{constructor(callback){this.callback=callback}observe(target){this.callback([{target,isIntersecting:true,intersectionRatio:1}],this)}unobserve(){}disconnect(){}};
 w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
 w.fetch=async()=>({ok:false,status:404,json:async()=>({})});
 w.XMLHttpRequest.prototype.send=function(){this.abort()};
 if(!original)w.eval(fs.readFileSync('seo.js','utf8'));
 w.eval(fs.readFileSync(original?'_seo/original-app.js':'app-v2.js','utf8'));
 for(let n=0;n<40&&!w.document.querySelector('h1');n++)await new Promise(r=>setTimeout(r,50));
 if(!w.document.querySelector('h1')){w.close();throw Error('Render failed '+route+': '+errors.join('; '))}
 await new Promise(r=>setTimeout(r,750));
 return {dom,errors};
};
