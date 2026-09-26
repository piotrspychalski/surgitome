// zrzut geometrii wariantu (stan przed i po) do JSON do podglądu rzutów
globalThis.THREE=require('three'); require(require('path').resolve(process.argv[2]));
const id=process.argv[3]; const v=[].concat(...ANAT.PROCS.map(p=>p.variants)).find(x=>x.id===id);
const out={objs:[],marks:[]};
for(const o of v.objects){ for(const st of ['pre','post']){ const d=o[st]; if(!d||!d.path) continue; const c=ANAT.curveOf(d.path); const pts=[];
  for(let i=0;i<=60;i++){ const t=i/60,p=c.getPointAt(t); pts.push([p.x,p.y,p.z,d.r(t)]); } out.objs.push({id:o.id,st,pts,col:o.color||(o.colors&&o.colors[o.colors.length-1][1])||'#888',solid:!!o.solid,organ:!!o.organ}); } }
for(const m of v.marks){ if(m.pts) out.marks.push({name:m.name,pts:m.pts,col:m.color}); else if(m.pos) out.marks.push({name:m.name,pts:[m.pos],col:m.color}); else if(m.center) out.marks.push({name:m.name,pts:[m.center],col:'#000'}); }
console.log(JSON.stringify(out));
