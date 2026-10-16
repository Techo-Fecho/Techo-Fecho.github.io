const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const serve=require('./server.cjs');
const {checkTeam}=require('./team-test.cjs');
const {JSDOM}=require('jsdom');
(async()=>{
 const {server,url}=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true});
  fs.mkdirSync('_seo/test-results',{recursive:true});
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:900}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(url+'/about/',{waitUntil:'networkidle'});
   assert.equal(response.status(),200);
   await page.getByRole('heading',{name:'The People Behind Haeman Tech',exact:true}).waitFor();
   const section=page.locator('section').filter({has:page.getByRole('heading',{name:'The People Behind Haeman Tech',exact:true})});
   await section.scrollIntoViewIfNeeded();
   await page.waitForTimeout(900);
   const dom=new JSDOM(await page.content());checkTeam(dom.window.document);dom.window.close();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'page overflow');
   assert.equal(await section.locator('.group').evaluateAll(cards=>cards.some(c=>c.scrollWidth>c.clientWidth+2)),false,'card overflow');
   assert.deepEqual(errors,[]);
   await section.screenshot({path:`_seo/test-results/team-${width}.png`});
   await page.reload({waitUntil:'networkidle'});
   await page.getByRole('heading',{name:'Bedřich Said',exact:true}).waitFor();
   await page.close();console.log(`PASS: approved roster, React rendering, refresh and layout at ${width}px`);
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
