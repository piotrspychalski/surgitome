// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Audyt przybliżenia kadrów animacji (zakres, stapler, usunięcie, zespolenie): jaka część modelu i ile narządów mieści się w kadrze przy różnych proporcjach ekranu.
// Użycie: [RAW=1] node tests/audyt_zoom.js [prog_modelu=0.6] [prog_narzadow=0.5] [filtr id] — wypisuje kadry poniżej progów (najgorsze najpierw); kod wyjścia 1, gdy są takie kadry.
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1');
w.matchMedia=()=>({matches:false,addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id), sleep=ms=>new Promise(r=>setTimeout(r,ms)), fails=[];
const TH_PTS=+(process.argv[2]||0.6), TH_OBJ=+(process.argv[3]||0.5), ONLY=process.argv[4]||'', RAW=!!process.env.RAW; // RAW=1 — ujęcia bez ochrony kontekstu
const ASP={ 'komputer':2.25, 'laptop':1.6, 'tablet':0.85, 'telefon':0.62 };
(async()=>{ await sleep(300);
  const A=w.ANAT, T=w.__sgTest, TH=w.THREE, rows=[];
  function camFor(p,aspect){ const c=new TH.PerspectiveCamera(34,aspect,0.1,800), a=p.az*Math.PI/180, e=p.el*Math.PI/180;
    c.position.set(p.t.x+p.d*Math.cos(e)*Math.sin(a), p.t.y+p.d*Math.sin(e), p.t.z+p.d*Math.cos(e)*Math.cos(a)); c.lookAt(p.t); c.updateMatrixWorld(); c.updateProjectionMatrix(); return c; }
  // punkty co ok. 0,5 jednostki długości (długie narządy ważą więcej niż wyrostek czy kikut); narządy krótsze niż 3 jednostki pomijane w mierze „narządy w kadrze”
  function sample(){ const M=T.model(), objs=[]; M.objs.forEach(o=>{ if(!(o.op>0.3)||!o.st) return; const L=o.st.len||o.st.curve.getLength(), n=Math.max(4,Math.round(L/0.5)), pts=[]; for(let i=0;i<=n;i++) pts.push(o.st.curve.getPointAt(i/n).clone().add(o.grp.position)); objs.push({id:o.def.id,pts,big:L>=3}); }); return objs; }
  function score(objs,cam){ let n=0,tot=0,ov=0; const v=new TH.Vector3();
    let nb=0; objs.forEach(o=>{ let k=0; o.pts.forEach(p=>{ v.copy(p).project(cam); const inn=Math.abs(v.x)<=1&&Math.abs(v.y)<=1&&v.z<1; if(inn) k++; }); tot+=o.pts.length; n+=k; if(o.big){ nb++; if(k/o.pts.length>=0.4) ov++; } });
    return { pts:tot?n/tot:1, objs:nb?ov/nb:1 }; }
  A.PROCS.forEach((P,pi)=>{ if(P.split) return; P.variants.forEach((V,vi)=>{
    if(ONLY && !(P.id+' '+V.id).includes(ONLY)) return;
    let FR; try { T.open(pi,vi,0); FR=T.frames(); } catch(e){ fails.push(P.id+'/'+V.id+': '+e.message); return; }
    FR.forEach((fr,fi)=>{
      if(fr.kind!=='orbit'||!(fr.m1>fr.m0||fr.k==='normal')) return;
      T.open(pi,vi,fi);
      const ms=fr.m1>fr.m0?[fr.m0+(fr.m1-fr.m0)*0.5,fr.m1]:[fr.m0];
      const res={};
      Object.keys(ASP).forEach(k=>{ const asp=ASP[k], p=RAW?T.preset(fr.cam,asp):T.presetFor(fr,asp), full=T.preset('full',asp); let worst=null;
        ms.forEach(m=>{ T.at(m); const s=score(sample(),camFor(p,asp)); if(!worst||s.pts<worst.pts) worst=s; });
        res[k]={pts:worst.pts,objs:worst.objs,k:p.d/full.d}; });
      rows.push({ id:P.id+' / '+V.id, fr:fr.num+' '+(fr.short||fr.k), cam:fr.cam, res });
    });
  }); });
  // progi jak w aplikacji (ochrona kontekstu, ekran pionowy wyżej) albo podane w wierszu poleceń; tolerancja 3 pkt % na krok wyszukiwania
  const th=k=>process.argv[2]?{pts:TH_PTS,org:TH_OBJ}:T.ctxMin(ASP[k]), TOL=0.03;
  const bad=rows.map(r=>({r, minPts:Math.min(...Object.values(r.res).map(x=>x.pts)), fail:Object.keys(ASP).some(k=>r.res[k].pts<th(k).pts-TOL||r.res[k].objs<th(k).org-TOL)})).filter(x=>x.fail).sort((a,b)=>a.minPts-b.minPts);
  const f=x=>(x*100).toFixed(0).padStart(3)+'%';
  console.log('Kadry animacji:',rows.length,'| poniżej progu kontekstu (komputer: model ≥60%, narządy ≥50%; telefon/tablet: ≥72%, ≥60%):',bad.length);
  console.log('zabieg / wariant'.padEnd(34),'kadr'.padEnd(18),'kamera'.padEnd(9),Object.keys(ASP).map(k=>(k+' model/narz./zoom').padEnd(26)).join(''));
  bad.forEach(({r})=>console.log(r.id.padEnd(34),r.fr.padEnd(18),r.cam.padEnd(9),Object.keys(ASP).map(k=>(f(r.res[k].pts)+' '+f(r.res[k].objs)+' k='+r.res[k].k.toFixed(2)).padEnd(26)).join('')));
  if(fails.length) console.log('BŁĘDY:',fails);
  const dz=path.join(__dirname,'..','zrzuty'); fs.mkdirSync(dz,{recursive:true}); fs.writeFileSync(path.join(dz,'audyt_zoom.json'),JSON.stringify(rows,null,1)); // pełne wyniki (nie w repozytorium)
  process.exit(bad.length||fails.length?1:0);
})();
