const fs=require('node:fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom'),{chromium}=require('playwright'),serve=require('./server.cjs'),{sentence,checkAbout}=require('./founder-test.cjs'),{checkPhaseB}=require('./phase-b-test.cjs');
(async()=>{const browser=await chromium.launch({headless:true});fs.mkdirSync('_seo/test-results',{recursive:true});try{
 for(const source of [false,true]){
  const {server,url}=await serve({source});try{for(const width of [1440,390]){
   const p=await browser.newPage({viewport:{width,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
   const response=await p.goto(url+'/about/',{waitUntil:'networkidle'});
   if(!source){const dom=new JSDOM(await response.text());checkAbout(dom.window.document);dom.window.close()}
   for(let refresh=0;refresh<2;refresh++){
    if(refresh)await p.reload({waitUntil:'networkidle'});await p.getByText(sentence,{exact:false}).waitFor({state:'visible'});
    const dom=new JSDOM(await p.content());checkAbout(dom.window.document);checkPhaseB(dom.window.document,'/about');dom.window.close();
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   }
   await p.getByText(sentence,{exact:false}).scrollIntoViewIfNeeded();await p.waitForTimeout(700);
   await p.screenshot({path:`_seo/test-results/founder-about-${source?'react':'static'}-${width}.png`});
   const bounds=await p.getByText(sentence,{exact:false}).evaluate(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,height:r.height,scroll:n.scrollWidth,width:n.clientWidth}});assert.ok(bounds.left>=0&&bounds.right<=width+1&&bounds.height>0&&bounds.scroll<=bounds.width+1);assert.deepEqual(errors,[]);await p.close();
   console.log('PASS founder/CEO: '+(source?'React source':'prerendered HTML + hydration')+' '+width+'px, refresh, exact team preservation and readable introduction.');
  }}finally{server.close()}
 }
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
