// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Herniologia — pachwina (TOOL_EXT.groin): Lichtenstein (widok od przodu), TAPP i TEP (widok laparoskopowy od tyłu, model obrócony).
// Wszystkie kadry bez błędów i z etykietami; pierścień głęboki bocznie od naczyń nabrzusznych dolnych; Lichtenstein — skóra rozsunięta w kadrach 3–5,
// worek odprowadzony przed siatką, siatka niewidoczna przed kadrem „Siatka”; TAPP/TEP — wrota widoczne na początku, po odprowadzeniu worka znikają,
// siatka od kadru „Siatka”, w TAPP pinezki tylko przy mocowaniu i szew otrzewnej na końcu; trójkąty zagłady i bólu w kadrze przestrzeni; EN — bez polskich znaków.
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
function boot(lang){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'}); const w=dom.window;
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1'); if(lang) w.localStorage.setItem('surgitome-lang',lang);
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
const IDS=['lich','tapp','tep'];
(async()=>{
  let w=boot(); await sleep(300); const A=w.ANAT, S=w.__sgTest.state(), G=A.GROIN;
  // pierścień głęboki bocznie od naczyń nabrzusznych dolnych (na wysokości pierścienia s naczyń mniejsze)
  const iev=G.IEV.find(p=>p[1]>=G.RING[1]-0.1); ok(iev && iev[0]<G.RING[0],'pierścień głęboki nie leży bocznie od naczyń nabrzusznych dolnych');
  for(const id of IDS){ const an=A.PROCS.findIndex(p=>p.id===id); ok(an>=0,'brak zabiegu '+id); if(an<0) continue; ok(A.PROCS[an].cat==='hernia',id+': kategoria');
    w.__sgTest.open(an,0,0); const F=w.__sgTest.frames(), M=w.__sgTest.model(); ok(M.groin,'brak modelu pachwiny: '+id);
    for(let fi=0;fi<F.length;fi++){ w.__sgTest.open(an,0,fi); S.playing=false; w.__sgTest.at(F[fi].m1); await sleep(4);
      ok(M.groin.labels.some(L=>L.alpha>0&&L.anchor),id+' kadr '+fi+': brak etykiet'); }
    const st=M.groin.test.state, iM=F.findIndex(f=>f.k==='mesh');
    ok(st(F[iM].m0-0.01).meshIn===0 && st(F[iM].m0-0.01).mesh===0,id+': siatka przed kadrem „Siatka”'); ok(Math.max(st(F[iM].m1).meshIn,st(F[iM].m1).mesh)>0.99,id+': brak siatki po kadrze „Siatka”');
    ok(st(0).sac===1 && st(F[iM].m0).sac<0.01,id+': worek nie odprowadzony przed siatką');
    if(id==='lich'){ ok(st(2).open>0.99 && st(4).open>0.99 && st(5).open<0.01,'Lichtenstein: rana nie otwarta w kadrach 3–5 lub nie zamknięta'); ok(M.groin.grp.rotation.x===0,'Lichtenstein: model obrócony'); }
    else { ok(Math.abs(M.groin.grp.rotation.x+Math.PI/2)<1e-6,id+': widok od tyłu bez obrotu modelu');
      w.__sgTest.open(an,0,0); S.playing=false; w.__sgTest.at(0); ok(M.groin.test.lap.hole.visible,id+': wrota przepukliny niewidoczne na początku');
      w.__sgTest.open(an,0,iM); S.playing=false; w.__sgTest.at(F[iM].m1); ok(!M.groin.test.lap.hole.visible,id+': wrota widoczne po odprowadzeniu worka');
      const iS=F.findIndex(f=>f.k==='flap'||f.k==='lat'); w.__sgTest.open(an,0,iS); S.playing=false; w.__sgTest.at(F[iS].m1); ok(M.groin.test.lap.doom.mesh.visible,id+': brak trójkątów zagłady i bólu w kadrze przestrzeni');
      if(id==='tapp'){ ok(st(F[iM].m0).tacks===0 && st(F[iM].m1).tacks>0.99,'TAPP: pinezki poza mocowaniem'); ok(st(5).pSut>0.99 && st(4).pSut===0,'TAPP: szew otrzewnej nie na końcu'); }
      else ok(st(5).des>0.99,'TEP: brak desuflacji'); }
  }
  // EN
  w=boot('en'); await sleep(300); const A2=w.ANAT, S2=w.__sgTest.state(), PL=/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/, bad=[];
  for(const id of IDS){ const an=A2.PROCS.findIndex(p=>p.id===id); w.__sgTest.open(an,0,0); const F=w.__sgTest.frames();
    for(let fi=0;fi<F.length;fi++){ w.__sgTest.open(an,0,fi); S2.playing=false; w.__sgTest.at(F[fi].m1); await sleep(3);
      ['capTitle','capText'].forEach(k=>{ const t=w.document.getElementById(k).textContent; if(PL.test(t)) bad.push(id+' '+fi+':'+t.slice(0,50)); });
      [...w.document.querySelectorAll('#labels .lbl b, #labels .lbl small')].forEach(e=>{ if(PL.test(e.textContent)) bad.push(id+' '+fi+':'+e.textContent); }); } }
  ok(!bad.length,'EN: polskie teksty: '+bad.slice(0,4).join(' | '));
  console.log('pachwina:',IDS.join(','));
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
