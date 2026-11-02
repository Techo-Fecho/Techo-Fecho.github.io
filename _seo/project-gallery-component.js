function HaemanProjectArt({slug}){
 const j=I.jsx,js=I.jsxs;
 const specs={
 'virtual-audio-driver':['Audio app','Windows driver','Virtual audio','speaker','windows','speaker'],
 'smart-card-functional-driver':['Smart card','CCID driver','Reader','card','chip','device'],
 'embedded-dsp-anc-platform':['Microphone','ADAU1787 DSP','Audio','mic','chip','speaker'],
 'raspberry-pi-fast-boot':['Camera','Raspberry Pi','Recording','camera','chip','storage'],
 'stm32-led-controller':['Control','STM32','LED output','device','chip','led'],
 'bluetooth-multi-speaker':['Audio','Wireless link','Speakers','speaker','radio','speaker'],
 'windows-mfa-system':['Sign in','Windows','Authentication','device','windows','shield'],
 'windows-folder-protection':['Application','File filter','Protected files','device','shield','storage'],
 'virtual-71-audio':['Audio app','Virtual driver','Audio outputs','speaker','windows','speaker'],
 'sandboxie-system':['Process','Isolation','Resources','device','shield','storage'],
 'vostok-shared-memory':['User mode','Shared memory','Kernel mode','device','storage','chip'],
 'driver-signing':['Driver package','Signing','Deployment','storage','shield','windows'],
 'esp32-mixamp-rust':['Audio input','ESP32','Audio mix','mic','chip','speaker'],
 'ws2812-stm32-nucleo':['Firmware','STM32','LED strip','device','chip','led'],
 'bldc-motor-controller':['Control','Controller','Motor','device','chip','motor'],
 'rp2040-thonny':['Thonny','RP2040','Firmware','device','chip','storage'],
 'fpga-radar':['Signal input','FPGA','Processing','radio','chip','device'],
 'perfexcrm-offline':['Desktop app','Local data','CRM','windows','storage','device'],
 'pikvm-remote':['Remote client','PiKVM','Target system','device','chip','device'],
 'virtual-device-driver':['Application','Virtual driver','Device interface','device','windows','chip'],
 'embedded-linux-system':['Hardware','Embedded Linux','Application','chip','storage','device']
 };
 const s=specs[slug];if(!s)return null;
 const icon=(type,x)=>{
 const common={fill:'none',stroke:'currentColor',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'};
 const shapes={
 windows:j('path',{d:'M-23 -21L-2 -24V-2H-23ZM3 -25L27 -29V-2H3ZM-23 3H-2V25L-23 22ZM3 3H27V30L3 26Z',fill:'#2299f5',stroke:'none'}),
 chip:js('g',{children:[j('rect',{x:-23,y:-23,width:46,height:46,rx:5}),j('rect',{x:-15,y:-15,width:30,height:30,rx:2}),...[-16,-8,0,8,16].flatMap(n=>[j('path',{d:`M${n} -23v-8 M${n} 23v8 M-23 ${n}h-8 M23 ${n}h8`},n)])]}),
 device:js('g',{children:[j('rect',{x:-27,y:-20,width:54,height:36,rx:4}),j('path',{d:'M-13 25H13 M0 16v9 M-19 -11h16 M-19 -4h26 M-19 3h20'})]}),
 speaker:js('g',{children:[j('rect',{x:-15,y:-29,width:30,height:58,rx:6}),j('circle',{cx:0,cy:-15,r:4}),j('circle',{cx:0,cy:10,r:10}),j('circle',{cx:0,cy:10,r:4})]}),
 mic:js('g',{children:[j('rect',{x:-9,y:-27,width:18,height:33,rx:9}),j('path',{d:'M-17 -5v5a17 17 0 0034 0v-5 M0 17v13 M-11 30h22'})]}),
 card:js('g',{children:[j('rect',{x:-29,y:-19,width:58,height:38,rx:5}),j('rect',{x:-21,y:-10,width:16,height:18,rx:2}),j('path',{d:'M3 -7h17 M3 0h12 M-21 13h39'})]}),
 storage:js('g',{children:[j('ellipse',{cx:0,cy:-20,rx:24,ry:8}),j('path',{d:'M-24 -20v40c0 11 48 11 48 0v-40 M-24 0c0 11 48 11 48 0'})]}),
 shield:j('path',{d:'M0 -29L25 -19v19c0 18-25 30-25 30S-25 18-25 0v-19Z M-11 0l8 8L13 -9'}),
 camera:js('g',{children:[j('rect',{x:-28,y:-18,width:56,height:38,rx:5}),j('circle',{cx:0,cy:1,r:12}),j('path',{d:'M-15 -18l5-9h20l5 9'})]}),
 radio:js('g',{children:[j('circle',{cx:0,cy:13,r:4}),j('path',{d:'M0 17v15 M-11 3a16 16 0 0122 0 M-21 -7a30 30 0 0142 0 M-30 -17a43 43 0 0160 0'})]}),
 led:js('g',{children:[...[-22,0,22].map(n=>js('g',{children:[j('rect',{x:n-7,y:-10,width:14,height:20,rx:3}),j('path',{d:`M${n} -16v-7 M${n} 16v7`})]},n))]}),
 motor:js('g',{children:[j('circle',{cx:0,cy:0,r:25}),j('circle',{cx:0,cy:0,r:8}),j('path',{d:'M0 -25v17 M25 0H8 M0 25V8 M-25 0h17'})]})
 };
 return j('g',{transform:`translate(${x} 78)`,...common,children:shapes[type]||shapes.chip});
 };
 return js('svg',{viewBox:'0 0 420 180',className:'project-art','aria-hidden':true,children:[
 j('path',{className:'art-traces',d:'M0 20h54l20 20h82 M420 23h-50l-22 22h-65 M0 152h65l20-20h55 M420 150h-58l-20-20h-61 M115 0v20l25 25 M305 180v-20l-25-25',fill:'none',stroke:'currentColor',strokeWidth:1}),
 j('path',{d:'M110 78h52l-7-5m7 5-7 5 M258 78h52l-7-5m7 5-7 5',fill:'none',stroke:'#238cda',strokeWidth:1.5}),
 icon(s[3],66),icon(s[4],210),icon(s[5],354),
 ...[66,210,354].map((x,i)=>j('text',{x,y:140,textAnchor:'middle',fill:'currentColor',fontSize:12,fontFamily:'inherit',children:s[i]},i))
 ]});
}
const HaemanProjectVideos=[
 {title:'Hardware Bench Testing',description:'A short view of our hardware setup and bench measurements.',src:'/assets/projects/hardware-bench.mp4',poster:'/assets/projects/hardware-poster.jpg',duration:'0:05'},
 {title:'DSP Development',description:'A view of our DSP signal flow and development workflow in SigmaStudio.',src:'/assets/projects/dsp-development.mp4',poster:'/assets/projects/dsp-poster.jpg',duration:'0:38'}
];
function HaemanVideoGallery(){
 const j=I.jsx,js=I.jsxs,[active,setActive]=y.useState(0),[playing,setPlaying]=y.useState(null),[error,setError]=y.useState(''),rail=y.useRef(null),videos=y.useRef([]),cards=y.useRef([]),lastFocus=y.useRef(null),pointer=y.useRef(null);
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const pauseAll=()=>videos.current.forEach(v=>{if(v)v.pause()});
 const choose=i=>{pauseAll();setPlaying(null);setError('');setActive(i);const r=rail.current,c=cards.current[i];if(r&&c)r.scrollTo({left:c.offsetLeft-rail.current.firstElementChild.offsetLeft,behavior:reduced()?'auto':'smooth'});};
 const play=i=>{pauseAll();setError('');setPlaying(i);lastFocus.current=document.activeElement;};
 y.useEffect(()=>{if(playing===null)return;const v=videos.current[playing];if(v){v.muted=false;v.play().catch(()=>setError('Playback could not start. Use the video controls to try again.'));v.focus();}},[playing]);
 y.useEffect(()=>()=>{videos.current.forEach(v=>{if(v)v.pause()})},[]);
 const preview=(i,on)=>{const v=videos.current[i];if(!v||playing!==null||reduced()||!window.matchMedia('(hover: hover)').matches)return;if(on){v.muted=true;v.play().catch(()=>{});}else{v.pause();v.currentTime=0;}};
 return js('section',{className:'engineering-gallery','aria-labelledby':'engineering-gallery-title',children:[
 j('div',{className:'gallery-ambient',style:{backgroundImage:`url(${HaemanProjectVideos[active].poster})`},'aria-hidden':true}),
 js('div',{className:'gallery-heading projects-container',children:[js('div',{children:[j('p',{className:'gallery-eyebrow',children:'PROJECT VIDEOS'}),j('h2',{id:'engineering-gallery-title',children:'Inside Our Engineering Work'})]}),j('p',{className:'gallery-lead',children:'A closer look at our development and testing process.'})]}),
 js('div',{className:'gallery-rail',ref:rail,tabIndex:0,role:'region','aria-label':'Project videos. Use left and right arrow keys to browse.',onKeyDown:e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'){e.preventDefault();choose(Math.min(1,active+1));}if(e.key==='ArrowLeft'){e.preventDefault();choose(Math.max(0,active-1));}},onPointerDown:e=>{if(e.pointerType==='mouse'&&!e.target.closest('button,video[controls]'))pointer.current={x:e.clientX,left:rail.current.scrollLeft};},onPointerMove:e=>{if(pointer.current&&e.buttons===1)rail.current.scrollLeft=pointer.current.left+pointer.current.x-e.clientX;},onPointerUp:()=>{pointer.current=null;},onPointerLeave:()=>{pointer.current=null;},onScroll:()=>{const r=rail.current;if(!r)return;const next=Math.round(r.scrollLeft/(cards.current[1]?.offsetLeft-cards.current[0]?.offsetLeft||1));const selected=Math.max(0,Math.min(1,next));if(selected!==active){pauseAll();setPlaying(null);setError('');}setActive(selected);},children:[
 ...HaemanProjectVideos.map((p,i)=>js('article',{className:'gallery-slide',ref:el=>cards.current[i]=el,'aria-label':p.title,children:[
 js('div',{className:'gallery-media',onMouseEnter:()=>preview(i,true),onMouseLeave:()=>preview(i,false),children:[
 j('video',{ref:el=>videos.current[i]=el,poster:p.poster,src:p.src,preload:'none',playsInline:true,controls:playing===i,tabIndex:playing===i?0:-1,'aria-label':p.title+' video',onError:()=>{if(playing===i)setError('This video could not load. Please retry or open the video file.');}}),
 playing!==i&&js('button',{className:'gallery-play',onClick:()=>play(i),'aria-label':'Play '+p.title,children:[j('span',{className:'gallery-play-circle','aria-hidden':true,children:j('svg',{viewBox:'0 0 24 24',width:25,height:25,children:j('path',{d:'M8 4v16l12-8Z',fill:'currentColor'})})}),j('span',{children:p.duration})]}),
 playing===i&&j('button',{className:'gallery-stop',onClick:()=>{pauseAll();setPlaying(null);setError('');lastFocus.current?.focus();},'aria-label':'Close video playback',children:'×'})
 ]}),js('div',{className:'gallery-caption',children:[j('h3',{children:p.title}),j('p',{children:p.description})]})
 ]},p.src)),j('div',{className:'gallery-end-space','aria-hidden':true})]}),
 js('div',{className:'gallery-bottom projects-container',children:[j('span',{className:'gallery-hint',children:'Drag to explore'}),js('div',{className:'gallery-navigation',children:[j('button',{className:'gallery-arrow',disabled:active===0,onClick:()=>choose(0),'aria-label':'Previous project video',children:'←'}),j('span',{'aria-live':'polite','aria-atomic':true,children:(active===0?'01':'02')+' / 02'}),j('button',{className:'gallery-arrow',disabled:active===1,onClick:()=>choose(1),'aria-label':'Next project video',children:'→'})]}),j('div',{className:'gallery-progress','aria-hidden':true,children:j('span',{style:{transform:`translateX(${active*100}%)`}})})]}),
 error&&js('p',{className:'gallery-error projects-container',role:'alert',children:[error,' ',j('a',{href:HaemanProjectVideos[playing??active].src,children:'Open video'})]})
 ]});
}
function HaemanProjects(){
 const j=I.jsx,js=I.jsxs,[filter,setFilter]=y.useState('All'),shown=filter==='All'?hF:hF.filter(p=>p.categories.includes(filter));
 return js('div',{className:'haeman-projects',children:[j('style',{children:HaemanGalleryCSS}),
 js('section',{className:'projects-hero projects-container',children:[js('div',{children:[j('p',{className:'projects-eyebrow',children:'PROJECTS'}),j('h1',{children:'Windows driver and embedded firmware case studies.'}),j('p',{className:'projects-intro',children:'Explore our work in Windows drivers, embedded firmware and hardware integration. See development workflows and project demonstrations from our team.'})]}),j('img',{className:'projects-hero-image',src:'/assets/projects/engineering-hero.webp',width:1672,height:941,alt:'Conceptual illustration of software layers above a processor and circuit board',fetchPriority:'high',decoding:'async'})]}),
 j(HaemanVideoGallery,{}),
 js('section',{className:'projects-catalog projects-container','aria-label':'Engineering case studies',children:[j('div',{className:'projects-filters',role:'group','aria-label':'Filter projects',children:gF.map(f=>j('button',{onClick:()=>setFilter(f),'aria-pressed':filter===f,children:f},f))}),j('div',{className:'projects-grid',children:j(tw,{mode:'popLayout',children:shown.map(p=>j(Z.article,{layout:true,initial:{opacity:0,scale:.97},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.97},transition:{duration:.25},className:'project-case-card',children:js(W,{to:'/projects/'+p.slug,children:[j('div',{className:'project-card-visual',children:j(HaemanProjectArt,{slug:p.slug})}),js('div',{className:'project-card-copy',children:[j('h3',{children:p.title}),j('p',{children:p.short}),js('span',{className:'project-case-link',children:['View Case Study ',j('span',{'aria-hidden':true,children:'→'})]})]})]})},p.slug))})})]})
 ]});
}
