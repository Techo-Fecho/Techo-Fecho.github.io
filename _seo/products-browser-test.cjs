const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright'),serve=require('./server.cjs'),products=require('./products.json');
(async()=>{const {server,url}=await serve();const browser=await chromium.launch({headless:true});
try{fs.mkdirSync('_seo/test-results',{recursive:true});
for(const width of [1440,1024,768,390]){
 const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 assert.equal((await page.goto(url+'/products/',{waitUntil:'networkidle'})).status(),200);
 await page.locator('.product-row').last().scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>[...document.querySelectorAll('.product-visual img')].every(i=>i.complete&&i.naturalWidth>0));
 assert.equal(await page.locator('.product-row').count(),3);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'overflow '+width);
 assert.equal(await page.locator('.product-row').first().evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),width<768?1:2);
 for(const [i,p]of products.entries()){assert.equal(await page.locator('.product-store').nth(i).getAttribute('href'),p.store);assert.equal(await page.locator('.product-visual').nth(i).getAttribute('href'),p.store);}
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(350);
 // All desktop navigation links must remain inside the visible header container.
 if(width>=1024){assert.equal(await page.locator('header nav a').evaluateAll(es=>es.some(e=>{const r=e.getBoundingClientRect();const h=e.closest('header').getBoundingClientRect();return r.left<h.left||r.right>h.right})),false,'header navigation '+width);}
 await page.screenshot({path:`_seo/test-results/products-${width}.png`,fullPage:true});
 await page.getByRole('button',{name:/theme/i}).first().click();await page.waitForTimeout(250);await page.screenshot({path:`_seo/test-results/products-light-${width}.png`,fullPage:true});
 assert.equal((await page.reload({waitUntil:'networkidle'})).status(),200);await page.locator('.product-row').first().waitFor();
 await page.locator('header a[aria-label="Haeman Tech home"]').click();await page.waitForURL(url+'/');
 await page.locator('footer a[href="/products/"]').click();await page.waitForURL(url+'/products/');await page.locator('.product-row').first().waitFor();
 assert.equal(await page.title(),'Windows Apps | Haeman Tech Products');assert.deepEqual(errors,[]);await page.close();
}
console.log('PASS Products browser: desktop, tablet, mobile, themes, refresh, navigation and assets.');
}finally{await browser.close();await new Promise(r=>server.close(r))}})().catch(e=>{console.error(e);process.exit(1)});
