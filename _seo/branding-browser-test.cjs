const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright'),{JSDOM}=require('jsdom');
const serve=require('./server.cjs'),assets=require('./branding-assets.json'),{checkDocument}=require('./branding-test.cjs');
(async()=>{
 const {server,url}=await serve();const browser=await chromium.launch({headless:true});fs.mkdirSync('_seo/test-results',{recursive:true});
 try{
  for(const width of [1440,768,390]){
   const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const route of ['/','/about/']){
    await page.goto(url+route,{waitUntil:'networkidle'});await page.locator('header img.brand-logo').waitFor({state:'visible'});await page.waitForTimeout(700);
    const data=await page.locator('header img.brand-logo').evaluate(i=>{const r=i.getBoundingClientRect(),s=getComputedStyle(i);return {src:i.getAttribute('src'),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,w:r.width,h:r.height,x:r.x,right:r.right,border:s.borderWidth,shadow:s.boxShadow,overflow:document.documentElement.scrollWidth>innerWidth+1}});
    assert.equal(data.src,'/haeman-logo-dark.png?v='+assets.version);assert.equal(data.naturalWidth,assets.width);assert.equal(data.naturalHeight,assets.height);assert.ok(Math.abs(data.w/data.h-assets.width/assets.height)<0.002,'correct artwork proportions');assert.equal(data.h,width>=1024?60:52);assert.equal(data.border,'0px');assert.equal(data.shadow,'none');assert.ok(!data.overflow&&data.x>=0&&data.right<=width);
    const dom=new JSDOM(await page.content());checkDocument(dom.window.document,route==='/'?'/':'/about');dom.window.close();
    await page.screenshot({path:`_seo/test-results/branding-${route==='/'?'home':'about'}-header-${width}.png`,clip:{x:0,y:0,width,height:145}});
    await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(500);assert.equal(await page.locator('header img.brand-logo').getAttribute('src'),data.src);
   }
   // Compare opaque source pixels with their exact locations in the trimmed assets.
   const pixelChecks=await page.evaluate(async()=>{
    const load=async src=>{const i=new Image();i.src=src;await i.decode();const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const x=c.getContext('2d');x.drawImage(i,0,0);return {i,pixel:(a,b)=>[...x.getImageData(a,b,1,1).data],data:x.getImageData(0,0,c.width,c.height).data}};
    const original=await load('/_seo/brand-assets/full-logo-original.png'),light=await load('/haeman-logo.png'),dark=await load('/haeman-logo-dark.png'),symbolOriginal=await load('/_seo/brand-assets/symbol-original.png'),symbol=await load('/haeman-symbol.png');
    const samples=[[363,557],[890,557],[450,350]].map(([x,y])=>({original:original.pixel(x,y),light:light.pixel(x-120,y-223),dark:dark.pixel(x-120,y-223)}));
    const symbolSamples=[[145,432],[670,432],[260,220]].map(([x,y])=>({original:symbolOriginal.pixel(x,y),derived:symbol.pixel(x-44,y-61)}));
    const icons=[];for(const n of [16,32,48]){const p=await load('/favicon-'+n+'x'+n+'.png');let blue=0,teal=0,transparent=0;for(let k=0;k<p.data.length;k+=4){const [r,g,b,a]=p.data.slice(k,k+4);if(a===0)transparent++;if(a>100&&b>r*1.5&&b>g*1.3)blue++;if(a>100&&g>r*1.1&&b>r*1.1&&Math.abs(g-b)<65)teal++;}icons.push({n,w:p.i.naturalWidth,h:p.i.naturalHeight,blue,teal,transparent});}
    return {samples,symbolSamples,corners:[light.pixel(0,0),dark.pixel(0,0),symbol.pixel(0,0)],icons};
   });
   for(const sample of pixelChecks.samples){assert.deepEqual(sample.light,sample.original,'full logo source colors');assert.deepEqual(sample.dark,sample.original,'dark logo symbol source colors');}
   for(const sample of pixelChecks.symbolSamples)assert.deepEqual(sample.derived,sample.original,'favicon master source colors');
   assert.ok(pixelChecks.corners.every(p=>p[3]===0),'no white background');for(const icon of pixelChecks.icons){assert.equal(icon.w,icon.n);assert.equal(icon.h,icon.n);assert.ok(icon.blue>0&&icon.teal>0&&icon.transparent>0,'recognizable two-color transparent icon');}
   const theme=page.getByRole('button',{name:/theme/i});await theme.click();await page.waitForTimeout(350);assert.equal(await page.locator('header img.brand-logo').getAttribute('src'),'/haeman-logo.png?v='+assets.version);await page.screenshot({path:`_seo/test-results/branding-light-header-${width}.png`,clip:{x:0,y:0,width,height:145}});await theme.click();
   if(width<1024){await page.getByRole('button',{name:/menu/i}).click();await page.getByRole('link',{name:'About',exact:true}).filter({visible:true}).first().click();await page.waitForURL('**/about');}
   await page.locator('header a[aria-label="Haeman Tech home"]').click();await page.waitForURL(url+'/');assert.deepEqual(errors,[]);await page.close();
   console.log('PASS branding',width,'source colors, transparency, favicon sizes, proportions, desktop/mobile navigation, theme and refresh');
  }
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
