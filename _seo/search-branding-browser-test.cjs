const assert=require('node:assert/strict'),{chromium}=require('playwright'),{JSDOM}=require('jsdom'),serve=require('./server.cjs'),{checkHomepage}=require('./search-branding-test.cjs');
(async()=>{const {server,url}=await serve(),browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage();
 const home=async()=>{const dom=new JSDOM(await page.content());checkHomepage(dom.window.document);dom.window.close()};
 await page.goto(url,{waitUntil:'networkidle'});await home();await page.reload({waitUntil:'networkidle'});await home();
 for(let i=0;i<2;i++){
  await page.evaluate(()=>{history.pushState({},'','/about/');dispatchEvent(new PopStateEvent('popstate'))});await page.waitForTimeout(300);
  assert.equal(await page.locator('meta[name="twitter:title"],meta[name="twitter:description"]').count(),0);
  const types=await page.locator('#seo-structured-data').evaluate(n=>JSON.parse(n.textContent)['@graph'].map(x=>x['@type']));assert.ok(!types.includes('WebSite'));assert.ok(types.includes('BreadcrumbList'));
  await page.evaluate(()=>{history.pushState({},'','/');dispatchEvent(new PopStateEvent('popstate'))});await page.waitForTimeout(300);await home();
 }
 console.log('PASS homepage initial render, hydration, refresh and repeated SPA navigation: unique metadata and WebSite/Organization schema.');
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
