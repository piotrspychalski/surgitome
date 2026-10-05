// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
globalThis.THREE = require('three'); require(process.env.CORE || require('path').join(__dirname,'../dist/core.js'));
const A=globalThis.ANAT, K=90;
function kf(arr,m,def){ if(!arr) return def; if(m<=arr[0][0]) return arr[0][1]; for(let i=1;i<arr.length;i++) if(m<=arr[i][0]){const a=arr[i-1],b=arr[i];return a[1]+(b[1]-a[1])*(m-a[0])/(b[0]-a[0]);} return arr[arr.length-1][1]; }
function state(o,f){ const pre=o.pre, post=o.post||o.pre; const a=A.curveOf(pre.path).getSpacedPoints(K-1), b=A.curveOf(post.path).getSpacedPoints(K-1);
  const pts=a.map((p,i)=>p.clone().lerp(b[i],f)); const rs=[]; for(let i=0;i<K;i++){const t=i/(K-1); rs.push(pre.r(t)+(post.r(t)-pre.r(t))*f);}
  const c=new THREE.CatmullRomCurve3(pts,false,'centripetal'); const r=t=>{const x=t*(K-1),i=Math.floor(x); return i>=K-1?rs[K-1]:rs[i]+(rs[i+1]-rs[i])*(x-i);};
  const op=o.open||[false,false]; return {curve:c,r,len:c.getLength(),caps:[!op[0],!op[1]]}; }
const only=process.argv[2]; const quick=process.argv[3]==='q';
for (const an of [].concat(...A.PROCS.map(p => p.variants), ...(A.TRIALS || []).filter(t => !A.PROCS.includes(t)).map(t => t.variants))) for (const [rk,f,m] of [['routePre',0,0],['routePost',1,an.mEnd]]) {
  if(only && !an.id.startsWith(only)) continue;
  const S={}; for(const o of an.objects){ if(o.solid||o.organ||o.noEndo||kf(o.opacity,m,1)<0.5) continue; S[o.id]=state(o,o.morph?f:0); }
  const ids=Object.keys(S); const geos=A.endoGeometries(ids.map(id=>S[id]));
  const mat=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}); const meshes=geos.map(g=>new THREE.Mesh(g,mat));
  let pp=null; if(an.papilla && S[an.papilla.obj]) pp=A.papillaPoint(S[an.papilla.obj].curve,S[an.papilla.obj].r,an.papilla.near,an.papilla.dir);
  const R=an[rk]; if(!R) continue; const variants = Array.isArray(R)? [['',R]] : R.branches.map(b=>[b.label, R.prefix.concat(b.steps)]);
  for(const [lab,steps] of variants){
  const pts=[]; let outside=0;
  for(const st of steps){ if(st.pt){ pts.push(new THREE.Vector3(...st.pt)); outside=1; continue; } const s=S[st.obj]; if(!s){console.log('MISSING',st.obj);continue;}
    const res=(v,d)=>v===undefined?d:typeof v==='number'?v:v==='papilla'?A.nearestT(s.curve,pp.axis,1000):A.nearestT(s.curve,v);
    const t0=res(st.from,0),t1=res(st.to,1),n=Math.max(2,Math.ceil(s.len*Math.abs(t1-t0)/0.35));
    for(let i=0;i<=n;i++){const p=s.curve.getPointAt(Math.min(1,Math.max(0,t0+(t1-t0)*i/n))); if(!pts.length||pts[pts.length-1].distanceTo(p)>0.12) pts.push(p);} }
  const route=new THREE.CatmullRomCurve3(pts,false,'centripetal'), L=route.getLength(), rc=new THREE.Raycaster();
  let voids=0,tot=0,vs=[],cross=[]; const s0=outside?4.2:0;
  for(let s=s0;s<L-0.5;s+=quick?0.8:0.4){ const u=s/L,pos=route.getPointAt(u),ahead=route.getPointAt(Math.min(1,(s+1.8)/L)); const fwd=ahead.clone().sub(pos).normalize(); let up=new THREE.Vector3(0,0,1); if(Math.abs(up.dot(fwd))>0.9) up.set(1,0,0); const right=new THREE.Vector3().crossVectors(fwd,up).normalize(); up.crossVectors(right,fwd).normalize();
    let v=0; for(let h=-60;h<=60;h+=15) for(let e=-45;e<=45;e+=15){ const d=fwd.clone().add(right.clone().multiplyScalar(Math.tan(h*Math.PI/180))).add(up.clone().multiplyScalar(Math.tan(e*Math.PI/180))).normalize(); rc.set(pos,d); rc.far=60; tot++; if(!rc.intersectObjects(meshes).length) v++; }
    voids+=v; if(v) vs.push(s.toFixed(1)+':'+v); }
  for(let s=outside?3.0:0;s<L-0.1;s+=0.1){ const a=route.getPointAt(s/L), b=route.getPointAt(Math.min(1,(s+0.1)/L)); const d=b.clone().sub(a); rc.set(a,d.clone().normalize()); rc.far=d.length(); const h=rc.intersectObjects(meshes); if(h.length) cross.push(s.toFixed(1)+'@'+ids[meshes.indexOf(h[0].object)]); }
  console.log(`${an.id} ${rk}${lab?' ['+lab+']':''}: len ${L.toFixed(0)} voids ${voids}/${tot} ${vs.slice(0,10).join(' ')} | cross ${cross.length} ${cross.slice(0,6).join(' ')}`);
  }
  if(!quick){ const samp={}; for(const id of ids){samp[id]=[];for(let i=0;i<=160;i++){const t=i/160;samp[id].push([S[id].curve.getPointAt(t),S[id].r(t),t]);}}
   const ov=[]; for(let a=0;a<ids.length;a++)for(let b=a+1;b<ids.length;b++){let mm=1e9,at;for(const [p,r,t] of samp[ids[a]])for(const [q,r2,t2] of samp[ids[b]]){const c=p.distanceTo(q)-r-r2;if(c<mm){mm=c;at=[t.toFixed(2),t2.toFixed(2)];}} if(mm<0.25) ov.push(`${ids[a]}x${ids[b]} ${mm.toFixed(2)}@${at}`);}
   console.log('   post overlaps: '+ov.join('; ')); }
}
