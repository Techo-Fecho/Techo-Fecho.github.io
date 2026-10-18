const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright'),{JSDOM}=require('jsdom');
const serve=require('./server.cjs'),content=require('./phase-b-content.json');
const {checkPhaseB}=require('./phase-b-test.cjs');
(async()=>{
 const {server,url}=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true});fs.mkdirSync('_seo/test-results',{recursive:true});
  for(const width of [1440,768,390]){
   const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const path of ['/','/about/']){
    const response=await page.goto(url+path,{waitUntil:'networkidle'});assert.equal(response.status(),200);
    await page.locator('h1').waitFor({state:'visible'});await page.waitForTimeout(900);
    let dom=new JSDOM(await page.content());checkPhaseB(dom.window.document,path==='/'?'/':'/about');dom.window.close();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,path+' horizontal overflow at '+width);
    const height=await page.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=500;y<height;y+=650){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(100)}
    await page.waitForTimeout(700);
    if(path==='/'){
     const section=title=>page.locator('section').filter({has:page.getByRole('heading',{name:title,exact:true})});
     const pipeline=section(content.H04.H2);
     for(const [key,value] of Object.entries(content.H04).filter(([k])=>k.startsWith('Stage '))){const split=value.indexOf(': '),name=value.slice(0,split),desc=value.slice(split+2);await pipeline.getByRole('button',{name:new RegExp(name+'$')}).click();await pipeline.getByText(desc,{exact:true}).waitFor({state:'visible'});}
     await pipeline.getByRole('button',{name:/Discover$/}).click();await pipeline.getByText(content.H04['Stage 01'].slice('Discover: '.length),{exact:true}).waitFor({state:'visible'});
     assert.ok(await pipeline.locator('button,p').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1})), 'all process controls and descriptions fit viewport');
     const tools=section(content.H05.H2);await tools.getByRole('button',{name:/Platforms/}).click();await tools.getByText('Windows 10/11',{exact:true}).waitFor({state:'visible'});await tools.getByRole('button',{name:/Languages/}).click();
     const problems=section(content.H06.H2);await problems.scrollIntoViewIfNeeded();await problems.getByRole('button',{name:'Next',exact:true}).click();await page.waitForTimeout(550);
     const strip=problems.locator('.snap-x');assert.ok(await strip.evaluate(e=>e.scrollLeft)>0,'problem carousel advances');
     await problems.getByRole('button',{name:'Previous',exact:true}).click();await page.waitForTimeout(550);await strip.evaluate(e=>e.scrollLeft=0);
     const cards=section(content.H02.H2).locator('a.group').filter({has:page.locator('h3')});assert.equal(await cards.count(),3);
     const boxes=await cards.evaluateAll(nodes=>nodes.map(n=>({x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,w:n.clientWidth,h:n.clientHeight,overflow:n.scrollWidth>n.clientWidth+2})));
     assert.ok(boxes.every(b=>!b.overflow),'service card text wraps');if(width===1440)assert.ok(Math.max(...boxes.map(b=>b.h))-Math.min(...boxes.map(b=>b.h))<2,'service card heights aligned');
    }
    if(path==='/about/'){
     const disciplines=page.locator('section').filter({has:page.getByRole('heading',{name:content.A04.H2,exact:true})});
     assert.equal(await disciplines.locator('a').count(),5);
     const panels=await disciplines.locator('.phase-b-discipline-content').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,w:r.width}}));
     if(width===1440)assert.ok(panels[0].x>=width/2&&panels[1].x<width/2,'desktop alternating timeline retained');
     else assert.ok(panels.every(p=>p.w>width*.8),'discipline cards use readable tablet/mobile width');
     assert.ok(await disciplines.locator('a').evaluateAll(nodes=>nodes.every(a=>{const r=a.getBoundingClientRect(),p=a.previousElementSibling.getBoundingClientRect();return r.top>p.bottom&&r.left>=0&&r.right<=innerWidth})), 'five consistent discipline actions below their descriptions');
    }
    await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(600);
    const finalWidth=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2&&!e.closest('.snap-x')).slice(0,8).map(e=>({tag:e.tagName,cls:e.className?.baseVal??e.className,right:e.getBoundingClientRect().right}))}));
    assert.ok(finalWidth.scroll<=width+2,JSON.stringify(finalWidth));
    const captureHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
    await page.screenshot({path:`_seo/test-results/phase-b-${path==='/'?'home':'about'}-${width}.png`,fullPage:true,clip:{x:0,y:0,width,height:captureHeight}});
    // Readable section captures supplement full-page visual review.
    const sections=page.locator('main section');
    for(let i=0;i<await sections.count();i++){
     const box=await sections.nth(i).boundingBox();
     if(box&&box.width>0)await page.screenshot({path:`_seo/test-results/section-${path==='/'?'home':'about'}-${width}-${i}.png`,fullPage:true,clip:{x:0,y:Math.max(0,box.y),width,height:box.height}});
    }
    await page.reload({waitUntil:'networkidle'});await page.locator('h1').waitFor({state:'visible'});await page.waitForTimeout(850);
    dom=new JSDOM(await page.content());checkPhaseB(dom.window.document,path==='/'?'/':'/about');dom.window.close();
    console.log('PASS Phase B:',path,width,'approved copy, refresh, overflow, protected content'+(path==='/'?', pipeline/tabs/carousel':''));
   }
   await page.goto(url+'/',{waitUntil:'networkidle'});await page.getByRole('link',{name:'Discuss Your Project',exact:true}).first().click();await page.waitForURL('**/contact');assert.equal(await page.locator('h1').textContent(),'Tell us about your Windows driver or embedded firmware project.');
   if(width<1024)await page.getByRole('button',{name:/menu/i}).click();
   await page.getByRole('link',{name:'About',exact:true}).filter({visible:true}).first().click();await page.waitForURL('**/about');assert.equal(await page.title(),content.metaAbout['SEO title']);
   assert.deepEqual(errors,[],'runtime errors');await page.close();
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
