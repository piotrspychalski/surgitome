// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Wspólny model ściany (ANAT.BODY, 03z-powloki + 12-powloki): jedno źródło warstw, grubości, kolorów i naczyń dla slajdu „Dostęp”, herniologii
// (przekrój TAR / Ramirez / pępkowa, pachwina) i przeszczepienia nerki; warstwy w kolejności od skóry bez nakładania; slajd „Dostęp” — tylko
// poziom szczegółu 0 (naczynia nabrzuszne, bez nerwów i drobnych naczyń); przekrój — naczynia nabrzuszne na mięśniu prostym, perforatory przecięte
// przy płatach (Ramirez); siatka — wspólny materiał (dzianina, świeci, obramowanie) w przekroju, Lichtensteinie i TAPP.
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
const drawn=[];
function boot(lang){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'}); const w=dom.window;
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1'); w.localStorage.setItem('surgitome-dostep','lap'); if(lang) w.localStorage.setItem('surgitome-lang',lang);
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true;}});};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
(async()=>{
  let w=boot(); await sleep(300); const A=w.ANAT, B=A.BODY, G=A.GROIN, S=w.__sgTest.state();
  // jedno źródło: grubości, kresa łukowata, kolory, przebieg naczyń
  ok(A.WALL.T===B.T && A.WALL.ARC===B.ARC && A.WALL.NV===B.NV,'WALL nie korzysta ze wspólnego modelu');
  ok(Math.abs(G.D.fat-(B.T.skin+B.T.fatGroin))<1e-9,'pachwina: grubość tkanki podskórnej spoza modelu');
  ok(A.KTX.COL.art===B.COL.art && A.KTX.COL.vein===B.COL.vein,'przeszczepienie nerki: kolory naczyń spoza modelu');
  const epi=B.VESSELS.find(v=>v.id==='epiInf'); ok(G.IEV.length===epi.pts.length && G.IEV.every((q,i)=>{ const p=G.xy(q[0],q[1]); return Math.hypot(p[0]+epi.pts[i][0],p[1]-epi.pts[i][1])<1e-6; }),'pachwina: naczynia nabrzuszne dolne poza wspólnym przebiegiem');
  // warstwy od skóry w głąb bez nakładania (siatka punktów po obu stronach kresy łukowatej i półksiężycowatej)
  const ORD=['skin','fat','eo','alba','rect','io','post','ta','tf','pre','per']; let nb=0;
  for(let x=0;x<=10;x+=0.5) for(let y=-14;y<=6;y+=1){ let last=0; ORD.forEach(id=>{ const L=B.layer(id,x,y); if(!L) return; if(!(L[1]>L[0])||(id!=='alba'&&L[0]<last-1e-6)){   /* kresa biała = zrośnięte rozcięgna (to samo co pochewka przednia) */ if(nb++<3) fails.push('warstwa '+id+' w ('+x+', '+y+'): '+L.map(v=>v.toFixed(2))+' po '+last.toFixed(2)); } if(['alba','rect','io','post','ta'].indexOf(id)<0||id==='ta') last=Math.max(last,L[1]); }); }
  ok(B.LAYERS.filter(l=>l.lod===0).map(l=>l.id).join(',')==='skin,rect','slajd „Dostęp”: warstwy poziomu 0');
  const by=(id,col)=>{ const out=[]; w.__sgTest.model().group.traverse(o=>{ if(o.isMesh&&o.visible&&o.material&&o.material.color&&o.material.color.getHexString()===col.slice(1)) out.push(o); }); return out; };
  // slajd „Dostęp” (hemikolektomia prawa): tylko naczynia poziomu 0 — nabrzuszne dolne i górne, obie strony, tętnica i żyła
  const rh=A.PROCS.findIndex(p=>p.id==='rh'); w.__sgTest.open(rh,0,0); w.__sgTest.at(-0.5); await sleep(5);
  const accArt=by('a',B.COL.art), accVein=by('v',B.COL.vein); ok(accArt.length===4 && accVein.length===4,'Dostęp: naczynia '+accArt.length+'/'+accVein.length+' (oczekiwano 4/4 — bez naczyń poziomu 1)');
  // przekrój TAR: naczynia nabrzuszne w plastrze, siatka wspólnym materiałem
  const tar=A.PROCS.findIndex(p=>p.id==='tar'); w.__sgTest.open(tar,0,0); w.__sgTest.at(0); await sleep(5);
  ok(by('a',B.COL.art).length>=2 && by('v',B.COL.vein).length>=2,'TAR: brak naczyń nabrzusznych w przekroju');
  const F=w.__sgTest.frames(), mi=F.findIndex(f=>f.k==='mesh'); w.__sgTest.open(tar,0,mi); S.playing=false; w.__sgTest.at(F[mi].m1); await sleep(5);
  const meshes=M=>{ const out=[]; M.group.traverse(o=>{ if(o.isMesh&&o.visible&&o.material&&o.material.emissiveMap&&o.material.map===o.material.emissiveMap&&o.material.opacity>0.95) out.push(o); }); return out; };
  ok(meshes(w.__sgTest.model()).length>=2,'TAR: siatka bez wspólnego materiału');
  // Ramirez: perforatory przecięte przy płatach (etykieta)
  const acs=A.PROCS.findIndex(p=>p.id==='acs'); w.__sgTest.open(acs,1,0); const FA=w.__sgTest.frames(), fl=FA.findIndex(f=>f.k==='flap'); w.__sgTest.open(acs,1,fl); S.playing=false; w.__sgTest.at(FA[fl].m1-0.05); await sleep(5);
  ok(w.__sgTest.model().wall.labels.some(L=>/Perforatory/.test(L.el.textContent)&&L.alpha===1),'Ramirez: perforatory nie przecięte w kadrze płatów');
  // pachwina: siatka wspólnym materiałem (Lichtenstein, TAPP)
  ['lich','tapp'].forEach(id=>{ const an=A.PROCS.findIndex(p=>p.id===id); w.__sgTest.open(an,0,0); const FG=w.__sgTest.frames(), gi=FG.findIndex(f=>f.k==='mesh'); w.__sgTest.open(an,0,gi); S.playing=false; w.__sgTest.at(FG[gi].m1); ok(meshes(w.__sgTest.model()).length>=1,id+': siatka bez wspólnego materiału'); });
  console.log('model ściany: warstwy',B.LAYERS.length,'| naczynia',B.VESSELS.map(v=>v.id+'('+v.lod+')').join(','),'| Dostęp',accArt.length+accVein.length);
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
