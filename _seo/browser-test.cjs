const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const serve=require('./server.cjs');
const routes=require('./routes.json');
(async()=>{
 const {server,url}=await serve();
 const browser=await chromium.launch({headless:true});
 const results=[];
 fs.mkdirSync('_seo/test-results',{recursive:true});
 try{
  // Test real static file serving, including every route and unknown paths.
  for(const route of Object.keys(routes)){
   const response=await fetch(url+route);
   assert.equal(response.status,200,route+' HTTP');
  }
  for(const route of ['/not-a-real-page','/services/not-a-service','/projects/not-a-project'])assert.equal((await fetch(url+route)).status,404);
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:900},timezoneId:'UTC'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const route of ['/','/services/','/projects/','/about/','/contact/','/services/windows-kernel/kmdf-driver-development/']){
    const response=await page.goto(url+route,{waitUntil:'networkidle'});assert.equal(response.status(),200);
    await page.locator('h1').waitFor({state:'visible'});
    await page.waitForTimeout(850);
    const check=await page.evaluate(()=>({h1:document.querySelector('h1').textContent,overflow:document.documentElement.scrollWidth>innerWidth+2,images:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),canonical:document.querySelector('link[rel=canonical]').href}));
    assert.equal(check.overflow,false,route+' horizontal overflow at '+width);
    assert.deepEqual(check.images,[],route+' images');
    assert.equal(check.canonical,'https://haemantech.com'+route);
    await page.reload({waitUntil:'networkidle'});await page.locator('h1').waitFor({state:'visible'});
    const height=await page.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=600;y<height;y+=600){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(90)}
    await page.waitForTimeout(800);await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:`_seo/test-results/${width}-${route.replace(/\//g,'_')||'home'}.png`,fullPage:true});
    results.push({width,route,...check});
   }
   // Client-side transitions must update canonical, robots and breadcrumbs without a reload.
   await page.goto(url+'/insights/kmdf-vs-wdm/');
   assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex, follow');
   await page.getByRole('link',{name:'Contact Engineering Team',exact:true}).click();
   await page.waitForURL('**/contact');
   assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'index, follow');
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://haemantech.com/contact/');
   await page.getByRole('button',{name:'Windows Driver',exact:true}).click();
   await page.getByRole('button',{name:'Continue',exact:true}).click();
   await page.getByRole('button',{name:'Prototype',exact:true}).waitFor({state:'visible'});
   await page.goto(url+'/careers/');
   await page.getByRole('link').filter({hasText:'Windows Kernel Driver Engineer'}).click();
   await page.getByRole('heading',{name:'Windows Kernel Driver Engineer',exact:true}).waitFor({state:'visible'});
   assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex, follow');
   if(width===390){
    await page.goto(url+'/');
    const buttons=await page.getByRole('button').allTextContents();
    const menu=page.getByRole('button',{name:/menu/i});
    assert.equal(await menu.count(),1,'mobile menu available');await menu.click();
    await page.locator('nav').getByRole('link',{name:/^About$/i}).filter({visible:true}).click();
    await page.waitForURL('**/about');
    await page.getByRole('heading',{level:1}).waitFor({state:'visible'});
   }
   assert.deepEqual(errors,[],'runtime exceptions');await page.close();
  }
  fs.writeFileSync('_seo/test-results/browser-results.json',JSON.stringify(results,null,2));
  console.log('PASS: 77 HTTP routes, 3 genuine 404s, desktop/mobile, refresh, assets, SPA metadata, contact steps and career navigation.');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});
