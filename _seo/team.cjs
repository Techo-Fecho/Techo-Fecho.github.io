// Apply approved team content while retaining the shipped React components and styles.
const groups = require('./team.json');
const heading = 'The People Behind Haeman Tech';
const introduction = 'Our team brings together specialists in kernel development, embedded firmware, Windows applications, and hardware integration, supported by dedicated leadership and project coordination.';
module.exports = function updateTeam(bundle) {
  const replaceOnce = (before, after) => {
    if (bundle.split(before).length !== 2) throw Error('Team source boundary missing or ambiguous: ' + before.slice(0, 80));
    bundle = bundle.replace(before, () => after);
  };
  const start = bundle.indexOf('var bF=');
  const end = bundle.indexOf(',xF=', start);
  if (start < 0 || end < 0) throw Error('Team roster source boundary missing');
  const members = groups.flatMap((group, index) => group.members.map((member, i) => ({
    slug: `team-${index}-${i}`, name: member.name, role: member.role,
    specialization: member.description, bio: '', linkedin: '', stack: [], category: group.category,
  })));
  bundle = bundle.slice(0, start) + 'var bF=' + JSON.stringify(members) + bundle.slice(end);
  replaceOnce('The engineers behind the work.', heading);
  replaceOnce('A specialized team of Windows kernel developers, embedded firmware engineers, and system software developers.', introduction);
  const groupStart = bundle.indexOf('(0,I.jsxs)(`div`,{className:`mt-12`,children:[', bundle.indexOf('function TF()'));
  const groupEnd = bundle.indexOf(']})]})}),(0,I.jsx)(`section`', groupStart);
  if (groupStart < 0 || groupEnd < 0) throw Error('Team category source boundary missing');
  const categoryBlocks = groups.map((group, index) =>
    `(0,I.jsxs)('div',{className:'${index === 0 ? 'mt-12' : 'mt-8'}',children:[(0,I.jsx)('h3',{className:'label-mono mb-4 text-primary/60',children:${JSON.stringify(group.category)}}),(0,I.jsx)('div',{className:'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',style:{gridAutoRows:'1fr'},children:bF.filter(e=>e.category===${JSON.stringify(group.category)}).map(e=>(0,I.jsx)(wF,{member:e},e.slug))})]})`
  ).join(',');
  // Replace both old category blocks, preserving the enclosing section and later content.
  bundle = bundle.slice(0, groupStart) + categoryBlocks + bundle.slice(groupEnd + ']})'.length);
  // Descriptions use the existing body typography; each card retains initials and hover styling.
  replaceOnce('mt-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground/80', 'mt-2 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80');
  replaceOnce('group relative flex flex-col overflow-hidden rounded-2xl border bg-card/40 transition-all duration-300 hover:border-primary/50 hover:bg-card/60', 'group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card/40 transition-all duration-300 hover:border-primary/50 hover:bg-card/60');
  // Do not show empty social profile placeholders.
  replaceOnce('(0,I.jsx)(`div`,{className:`mt-5 border-t border-border pt-4`', 'e.linkedin&&(0,I.jsx)(`div`,{className:`mt-5 border-t border-border pt-4`');
  return bundle;
};
module.exports.heading = heading;
module.exports.introduction = introduction;
