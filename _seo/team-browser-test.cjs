const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const serve=require('./server.cjs');
const {checkTeam}=require('./team-test.cjs');
const {JSDOM}=require('jsdom');
const routes=require('./routes.json');
(async()=>{
 const {server,url}=await serve();let browser;
 try{
  for(const route of Object.keys(routes))assert.equal((await fetch(url+route)).status,200,route+' HTTP');
  for(const route of ['/not-a-real-page','/services/not-a-service','/projects/not-a-project'])assert.equal((await fetch(url+route)).status,404,route+' HTTP');
  console.log('PASS: 77 existing routes and 3 genuine HTTP 404 responses');
  browser=await chromium.launch({headless:true});
  fs.mkdirSync('_seo/test-results',{recursive:true});
  for(const width of [1440,768,390]){
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
   assert.equal(await section.locator('.grid').evaluateAll(grids=>grids.every(grid=>{const heights=[...grid.children].map(c=>c.getBoundingClientRect().height);return Math.max(...heights)-Math.min(...heights)<2})),true,'consistent card heights within categories');
   const grids=await section.locator('.grid').evaluateAll(grids=>grids.map(grid=>({columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,cards:grid.children.length,left:grid.getBoundingClientRect().left,right:grid.getBoundingClientRect().right})));
   assert.deepEqual(grids.map(g=>g.cards),[2,2,3,4]);
   assert.deepEqual(grids.map(g=>g.columns),width===1440?[2,2,3,4]:width===768?[2,2,2,2]:[1,1,1,1]);
   for(const grid of grids.slice(0,2))assert.ok(Math.abs(grid.left-(width-grid.right))<2,'paired grids centered');
   assert.deepEqual(errors,[]);
   // Capture beyond the viewport without scrolling the existing fixed navigation into the team image.
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.waitForTimeout(250);
   const clip=await section.boundingBox();
   await page.screenshot({path:`_seo/test-results/team-${width}.png`,fullPage:true,clip});
   await page.reload({waitUntil:'networkidle'});
   await page.getByRole('heading',{name:'Bedřich Said',exact:true}).waitFor();
   const refreshed=new JSDOM(await page.content());checkTeam(refreshed.window.document);refreshed.window.close();
   await page.close();console.log(`PASS: approved roster, React rendering, refresh and layout at ${width}px`);
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
