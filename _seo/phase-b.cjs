// Phase B editorial source: page-scoped transforms of the preserved React bundle.
// The original application and shared service data remain the regression baseline.
const content=require('./phase-b-content.json');
const q=JSON.stringify;
const label=value=>value.split(' → ')[0];
const link=value=>{const [text,href]=value.split(' → ');return {text,href}};
const jsxLink=(text,href)=>`(0,I.jsx)(W,{to:${q(href)},className:'text-primary hover:underline',children:${q(text)}})`;
function replace(code,before,after){
 if(!code.includes(before))throw Error('Phase B source boundary missing: '+before.slice(0,100));
 return code.split(before).join(after);
}
function literal(code,before,after){return replace(code,'`'+before+'`',q(after))}
module.exports=function phaseB(bundle){
 const current=require('./phase-b-replacements.json');
 const edit=(name,end,transform)=>{
  const start=bundle.indexOf('function '+name+'('),finish=bundle.indexOf(end,start);
  if(start<0||finish<=start)throw Error('Phase B component boundary missing: '+name);
  bundle=bundle.slice(0,start)+transform(bundle.slice(start,finish))+bundle.slice(finish);
 };
 const fields=(code,section,keys)=>{
  for(const key of keys){const item=current[section][key];code=literal(code,item.current,content[section][key]);}
  return code;
 };
 edit('IN','var LN=',code=>{
  code=fields(code,'H01',['Eyebrow','Supporting description','Primary CTA','Secondary CTA']);
  code=replace(code,'children:[`Engineering`,(0,I.jsx)(`br`,{}),(0,I.jsx)(`span`,{className:`gradient-text`,children:`Below the`}),(0,I.jsx)(`br`,{}),`Surface.`]',"children:['Low-Level ',(0,I.jsx)('br',{}),(0,I.jsx)('span',{className:'gradient-text',children:'Software Engineering '}),(0,I.jsx)('br',{}),'for Complex Systems']");
  return replace(code,'to:`/projects`','to:`/services/`');
 });
 edit('VN','function HN(',code=>{
  code=fields(code,'H02',['H2','Introduction']);
  code=replace(code,'children:bm.map((e,t)=>',"children:bm.map((service,index)=>({...service,...HaemanPhaseB.cards[index]})).map((e,t)=>");
  code=replace(code,'to:`/services/${e.slug}`','to:e.href');
  code=replace(code,'children:e},e)),','children:e===`Smart-card Drivers`?`Smart Card Drivers`:e},e)),');
  code=replace(code,'(0,I.jsxs)(`span`,{className:`rounded-md border border-border bg-background/50 px-2 py-1 font-mono text-[10px] text-muted-foreground/60`,children:[`+`,e.capabilities.length-6,` more`]})','e.capabilities.length>6&&(0,I.jsxs)(`span`,{className:`rounded-md border border-border bg-background/50 px-2 py-1 font-mono text-[10px] text-muted-foreground/60`,children:[`+`,e.capabilities.length-6,` more`]})');
  // Keep the existing cards; align their action labels at the bottom of each row.
  code=replace(code,'mt-6 flex items-center gap-1.5 border-t border-border pt-5','mt-auto flex items-center gap-1.5 border-t border-border pt-5');
  const linkedParagraph=(text,anchors)=>{
   const children=[];let rest=text;
   for(const [anchor,href] of anchors){const index=rest.indexOf(anchor);if(index<0)throw Error('Missing Phase B anchor');children.push(q(rest.slice(0,index)),jsxLink(anchor,href));rest=rest.slice(index+anchor.length);}
   children.push(q(rest));return `(0,I.jsxs)('p',{className:'mt-5 text-sm leading-relaxed text-muted-foreground',children:[${children.join(',')}]})`;
  };
  const extra=linkedParagraph(content['H02.4']['Service links paragraph'],[['embedded firmware development','/services/embedded/firmware-development/'],['embedded Linux development','/services/embedded/embedded-linux/'],['discuss your Linux kernel requirements with us','/contact/']])+','+linkedParagraph(content['H02.4']['Complementary capability paragraph'],[['Windows application development','/services/windows-applications/']]);
  return replace(code,'},e.slug)})})]})})}', '},e.slug)})}),'+extra+']})})}');
 });
 edit('HN','var UN=',code=>literal(code,'DRIVER · IOCTL','DRIVER IOCTL'));
 edit('WN','var GN=',code=>fields(code,'H03',['Eyebrow','H2','Description']));
 // Only the homepage uses GN. Preserve the seven-stage interaction and animation.
 const process=Object.entries(content.H04).filter(([k])=>k.startsWith('Stage ')).map(([key,value])=>{const i=value.indexOf(': ');return {num:key.slice(-2),name:value.slice(0,i),desc:value.slice(i+2)}});
 let a=bundle.indexOf('var GN='),b=bundle.indexOf(';function KN(',a);
 if(a<0||b<0)throw Error('Missing homepage process data');
 bundle=bundle.slice(0,a)+'var GN='+q(process)+bundle.slice(b);
 edit('KN','var qN=',code=>fields(code,'H04',['Eyebrow','H2','Introduction']));
 a=bundle.indexOf('var qN=');b=bundle.indexOf(',JN=',a);
 if(a<0||b<0)throw Error('Missing homepage trust data');
 bundle=bundle.slice(0,a)+'var qN=HaemanPhaseB.problems'+bundle.slice(b);
 edit('YN','function XN(',code=>fields(code,'H05',['Eyebrow','H2','Description']));
 edit('XN','function ZN(',code=>{
  code=fields(code,'H06',['Eyebrow','H2','Introduction']);
  const index=code.indexOf('qN.map((e,t)=>');if(index<0)throw Error('Missing problem card rendering');
  return code.slice(0,index)+`qN.map((e,t)=>(0,I.jsxs)('div',{className:'flex w-[88%] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-card/40 p-7 sm:w-[440px]',children:[(0,I.jsxs)('div',{children:[(0,I.jsx)('h3',{className:'font-heading text-xl font-bold',children:e.title}),(0,I.jsx)('p',{className:'mt-4 text-base leading-relaxed text-foreground/90',children:e.description})]}),(0,I.jsx)(W,{to:e.href,className:'mt-6 border-t border-border pt-5 text-sm font-semibold text-primary hover:underline',children:e.link})]},t))})]})})}`;
 });
 edit('ZN','function QN(',code=>{
  code=fields(code,'H07',['Eyebrow','Paragraph']);
  code=replace(code,'children:[`Have a Windows kernel or`,(0,I.jsx)(`br`,{}),(0,I.jsx)(`span`,{className:`gradient-text`,children:`firmware problem?`})]',`children:${q(content.H07.H2)}`);
  code=literal(code,'Start a Project',label(content.H07['Primary CTA']));code=literal(code,'See Case Studies',label(content.H07['Secondary CTA']));
  return replace(code,'to:`/projects`','to:`/services/`');
 });
 // Preserve the About principle icons; change only their approved editorial data.
 a=bundle.indexOf(',xF=');b=bundle.indexOf(',SF=',a);
 if(a<0||b<0)throw Error('Missing About principles');
 bundle=bundle.slice(0,b)+`.map((item,index)=>({...item,...HaemanPhaseB.principles[index]}))`+bundle.slice(b);
 a=bundle.indexOf(',SF=');b=bundle.indexOf(';function CF(',a);
 if(a<0||b<0)throw Error('Missing About discipline data');
 bundle=bundle.slice(0,a)+',SF=HaemanPhaseB.disciplines'+bundle.slice(b);
 edit('TF','var EF=',code=>{
  code=fields(code,'A01',['H1','Hero description']);
  code=fields(code,'A02',['Eyebrow','H2','Paragraph 1','Paragraph 2','Paragraph 3']);
  code=literal(code,'Talk to us about your project →',label(content.A02['Contact link']));
  code=fields(code,'A03',['Eyebrow','H2']);code=fields(code,'A04',['Eyebrow','H2']);
  code=replace(code,'(0,I.jsx)(`p`,{className:`mt-1.5 text-sm text-muted-foreground`,children:e.desc})',"(0,I.jsx)(`p`,{className:`mt-1.5 text-sm text-muted-foreground`,children:e.desc}),(0,I.jsx)(W,{to:e.href,className:'mt-3 inline-flex text-sm text-primary hover:underline',children:e.link})");
  code=fields(code,'A06',['Section heading','Paragraph']);code=literal(code,'Start a Project',label(content.A06.CTA));
  // Independent CTA heading keeps its appearance; protected team headings are untouched.
  return replace(code,'(0,I.jsx)(`h3`,{className:`font-heading text-xl font-bold`,children:'+q(content.A06['Section heading'])+'})','(0,I.jsx)(`h2`,{className:`font-heading text-xl font-bold`,children:'+q(content.A06['Section heading'])+'})');
 });
 const cards=[1,2,3].map((i)=>{
  const c=content['H02.'+i];const card={name:c.H3,description:c.Summary,cta:c['Link label'],href:i===1?'/services/windows-kernel/':i===2?'/services/embedded/':'/contact/'};
  if(i===3)card.capabilities=['Linux Kernel','C','C++','Device Interfaces','Systems Software'];return card;
 });
 const problems=[1,2,3,4].map(i=>{const c=content['H06.'+i],l=link(c.Footer);return {title:c['Card heading'],description:c.Body,link:l.text,href:l.href}});
 const principles=Object.entries(content.A03).filter(([key])=>key.startsWith('Principle ')).map(([,value])=>{const i=value.indexOf(': ');return {title:value.slice(0,i),desc:value.slice(i+2)}});
 const disciplines=[1,2,3,4,5].map(i=>{const c=content['A04.'+i],l=link(c['Related link']);return {year:c.Label,title:c.H3,desc:c.Description,link:l.text,href:l.href}});
 return 'const HaemanPhaseB='+q({cards,problems,principles,disciplines})+';\n'+bundle;
};
module.exports.content=content;
