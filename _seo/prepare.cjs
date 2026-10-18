// Preserve the shipped React bundle; apply only routing and head-management changes.
const fs = require('node:fs');
const vm = require('node:vm');
const original = fs.readFileSync('_seo/original-app.js', 'utf8');
const array = (name, end) => vm.runInNewContext(original.slice(original.indexOf(`var ${name}=`)+name.length+5, original.indexOf(end,original.indexOf(`var ${name}=`))+1).replace(/icon:\w+/g,'icon:null'));
const services=array('bm','],xm='), projects=array('hF','],gF='), articles=array('EF','],DF='), jobs=array('jF','],MF=');
const pages={};
const add=(path,title,description,label,noindex=false)=>pages[path]={title,description,label,noindex};
for(const [route,fn,label] of [['/','IN','Home'],['/services','uP','Services'],['/projects','vF','Projects'],['/about','TF','About'],['/insights','kF','Insights'],['/careers','PF','Careers'],['/contact','VF','Contact']]){
 const segment=original.slice(original.indexOf(`function ${fn}(`));
 const m=segment.match(/VC,\{title:`([^`]+)`,description:`([^`]+)`/);
 if(!m)throw Error(`Missing metadata: ${route}`);
 add(route,m[1],m[2],label,route==='/insights');
}
for(const s of services){
 add('/services/'+s.slug,s.name+' | Haeman Tech',s.description,s.name);
 for(const x of s.subServices)add(`/services/${s.slug}/${x.slug}`,`${x.name} | ${s.short} | Haeman Tech`,x.description,x.name);
}
for(const p of projects)add('/projects/'+p.slug,p.title+' | Case Study | Haeman Tech',p.short,p.title);
for(const a of articles)add('/insights/'+a.slug,a.title+' | Haeman Tech Insights',a.excerpt,a.title,true);
for(const j of jobs)add('/careers/'+j.slug,j.title+' | Careers | Haeman Tech',j.summary,j.title,true);
add('/privacy','Privacy Policy | Haeman Tech','How Haeman Tech handles your data.','Privacy Policy');
add('/terms','Terms of Service | Haeman Tech','How Haeman Tech handles the use of our services.','Terms of Service');
const phaseB=require('./phase-b-content.json');
Object.assign(pages['/'],{title:phaseB.metaHome['SEO title'],description:phaseB.metaHome['Meta description']});
Object.assign(pages['/about'],{title:phaseB.metaAbout['SEO title'],description:phaseB.metaAbout['Meta description']});
fs.writeFileSync('_seo/routes.json',JSON.stringify(pages,null,2)+'\n');
let bundle=original.replace(/function VC\([\s\S]+?(?=var HC=)/,'function VC(){return null}');
const extra=`
function SEOHead(){let{pathname:p}=vo();(0,y.useLayoutEffect)(()=>{window.HaemanSEO.apply(p)},[p]);return null}
function SEOCareer(){let{slug}=To(),job=jF.find(j=>j.slug===slug);if(!job)return(0,I.jsx)(GF,{});return(0,I.jsxs)('div',{children:[(0,I.jsx)($N,{eyebrow:'Careers',title:job.title,description:job.summary}),(0,I.jsxs)('section',{className:'py-16 sm:py-24',children:[(0,I.jsxs)('div',{className:'mx-auto max-w-3xl space-y-6 px-4 sm:px-6',children:[(0,I.jsx)(W,{to:'/careers',className:'text-primary',children:'Careers'}),(0,I.jsx)('p',{className:'text-muted-foreground',children:[job.department,job.location,job.type,job.experience].join(' · ')}),...[[ 'Responsibilities',job.responsibilities],['Skills',job.skills],['Preferred Skills',job.preferredSkills]].map(([heading,items])=>(0,I.jsxs)('div',{children:[(0,I.jsx)('h2',{className:'font-heading text-xl font-bold',children:heading}),(0,I.jsx)('ul',{className:'mt-3 space-y-2 text-muted-foreground',children:items.map(text=>(0,I.jsx)('li',{children:text},text))})]},heading)),(0,I.jsx)('a',{className:'inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground',href:'mailto:'+Tm.email+'?subject='+encodeURIComponent(job.title),children:Tm.email})]})]})]})}
`;
bundle=bundle.replace('var KF=()=>',extra+'var KF=()=>');
bundle=bundle.replace('(0,I.jsx)(mm,{})','(0,I.jsx)(mm,{}),(0,I.jsx)(SEOHead,{})');
bundle=bundle.replace('(0,I.jsx)(qo,{path:`/careers`,element:(0,I.jsx)(PF,{})})','(0,I.jsx)(qo,{path:`/careers`,element:(0,I.jsx)(PF,{})}),(0,I.jsx)(qo,{path:`/careers/:slug`,element:(0,I.jsx)(SEOCareer,{})})');
// The existing FAQ label has no FAQ content. Route it to the inquiry destination.
bundle=bundle.replace('{label:`FAQs`,path:`/about`}','{label:`FAQs`,path:`/contact`}');
bundle=require('./team.cjs')(bundle);
bundle=require('./phase-b.cjs')(bundle);
fs.writeFileSync('app-v2.js',bundle);
const runtime=fs.readFileSync('_seo/runtime.js','utf8').replace('/* ROUTES */',JSON.stringify(pages));
fs.writeFileSync('seo.js',runtime);
console.log(`Prepared ${Object.keys(pages).length} routes; ${Object.values(pages).filter(p=>!p.noindex).length} indexable.`);
