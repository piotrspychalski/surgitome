// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Przełyk — slajd „Dostęp” w esofagektomii (decyzja autora 2026-11-25): model tułowia (szyja, klatka piersiowa, nadbrzusze); Ivor Lewis, McKeown
// i Akiyama — otwarty, hybrydowy, małoinwazyjny (MIE), robotyczny (RAMIE); przezrozworowa — otwarty i laparoskopowy; interpozycja okrężnicy — otwarty.
// Kolejność etapów (Ivor Lewis: brzuch → klatka; McKeown: klatka → brzuch → szyja), torakotomia tylno-boczna prawa (Ivor Lewis V, McKeown IV
// przestrzeń międzyżebrowa) poniżej kąta dolnego łopatki, trokary torakoskopii i robota po prawej stronie, cięcie na szyi po lewej (4–8 cm),
// schemat ułożenia na lewym boku tylko w etapie piersiowym, podpis kadru wg etapu, klawisze 1–4, przyciski w jelicie grubym bez zmian; EN.
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
const lblOn=w=>[...w.document.querySelectorAll('#labels .lbl')].filter(e=>e.style.display!=='none'&&e.style.opacity!=='0');
const key=(w,k)=>w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true}));
const CM=1.64;   // 1 jednostka modelu ≈ 1,64 cm
(async()=>{
  let w=boot(); await sleep(300); const $=id=>w.document.getElementById(id), A=w.ANAT, S=w.__sgTest.state();
  const an=A.PROCS.findIndex(p=>p.id==='esoph'), P=A.PROCS[an]; ok(an>=0&&P.cat==='eso','brak esofagektomii w kategorii Przełyk');
  const T=A.ACCESS['eso-il'].torso; ok(T&&T.at&&T.ics,'brak modelu tułowia');
  const vis=()=>[...w.document.querySelectorAll('#acc .accopt')].filter(b=>!b.hidden);
  const EXP={ 'eso-il':'open,hyb,lap,rob', 'eso-il-ss':'open,hyb,lap,rob', 'eso-mck':'open,hyb,lap,rob', 'eso-mck-ss':'open,hyb,lap,rob', 'eso-aki':'open,hyb,lap,rob', 'eso-the':'open,lap', 'eso-col':'open' };
  const ORDER={ 'eso-il':'abd,thx', 'eso-mck':'thx,abd,neck', 'eso-aki':'thx,abd,neck', 'eso-the':'abd,neck', 'eso-col':'abd,neck' };
  const len=pts=>{ let L=0; for(let i=1;i<pts.length;i++) L+=T.at(pts[i][0],pts[i][1],0,0).distanceTo(T.at(pts[i-1][0],pts[i-1][1],0,0)); return L; };
  const dense=pts=>{ const out=[]; for(let i=1;i<pts.length;i++) for(let j=0;j<10;j++){ const u=j/10; out.push([pts[i-1][0]+(pts[i][0]-pts[i-1][0])*u, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*u]); } out.push(pts[pts.length-1]); return out; };
  for(let vi=0;vi<P.variants.length;vi++){
    const v=P.variants[vi], X=A.ACCESS[v.access]; ok(X&&X.torso,v.id+': brak dostępu z modelem tułowia');
    w.__sgTest.open(an,vi,0); await sleep(40);
    const F=w.__sgTest.frames(); ok(F[0].k==='access'&&F[1].k==='normal',v.id+': pierwszy kadr to nie „Dostęp”');
    ok(!$('acc').hidden,v.id+': brak okna wyboru dostępu');
    const kinds=vis().map(b=>b.dataset.acc).join(); ok(kinds===EXP[v.id],v.id+': przyciski '+kinds);
    ok(vis().every((b,i)=>b.querySelector('kbd').textContent===String(i+1)),v.id+': numery klawiszy nie po kolei');
    if(EXP[v.id].includes('hyb')) ok(vis().map(b=>b.querySelector('b').textContent).join()==='Otwarty,Hybrydowy,Małoinwazyjny (MIE),Robotyczny',v.id+': nazwy przycisków');
    const base=v.id.replace('-ss','');
    ['open','hyb','lap','rob'].forEach(k=>{ const D=X[k]; if(!D) return;
      ok(D.title&&D.short&&D.phases.every(ph=>ph.text&&ph.title&&ph.name),v.id+'/'+k+': brak tytułu, podpisu lub opisu etapu');
      ok(D.phases.map(ph=>ph.part).join()===ORDER[base],v.id+'/'+k+': kolejność etapów '+D.phases.map(ph=>ph.part).join());
      D.phases.forEach(ph=>{
        const pp=(ph.ports||[]).map(p=>ph.part==='abd'?[T.fx(p.at[0],p.at[1]),p.at[1]]:p.at);
        if(ph.part==='abd') (ph.ports||[]).forEach((p,i)=>ok(Math.abs(p.at[0])<A.BODY.W(p.at[1])*0.92&&p.at[1]<A.BODY.LM.xiph[1]&&p.at[1]>-10,v.id+'/'+k+': port brzuszny '+i+' poza nadbrzuszem'));
        if(ph.part==='thx'){ pp.forEach((q,i)=>ok(q[0]<-45&&q[0]>-165&&q[1]>7&&q[1]<20,v.id+'/'+k+': port piersiowy '+i+' poza prawą ścianą klatki ('+q.map(x=>x.toFixed(1))+')'));
          ok(ph.pose&&ph.pose.thx&&/lewym boku/.test(ph.pose.title),v.id+'/'+k+': etap piersiowy bez schematu ułożenia na lewym boku'); }
        pp.forEach((a,i)=>pp.forEach((b,j)=>{ if(j>i){ const d=T.at(a[0],a[1],0,0).distanceTo(T.at(b[0],b[1],0,0))*CM; ok(d>4,v.id+'/'+k+'/'+ph.part+': porty '+i+' i '+j+' bliżej niż 4 cm ('+d.toFixed(1)+')'); } }));
        if(ph.line){ const [a,b]=ph.line; (ph.ports||[]).filter(p=>!p.assist).forEach((p,i)=>{ const q=ph.part==='abd'?[T.fx(p.at[0],p.at[1]),p.at[1]]:p.at, d=Math.abs((b[0]-a[0])*(q[1]-a[1])-(b[1]-a[1])*(q[0]-a[0]))/Math.hypot(b[0]-a[0],b[1]-a[1]); ok(d<0.6,v.id+'/'+k+': port robota '+i+' poza linią portów'); }); }
        if(ph.part==='thx'&&ph.cuts){ const c=ph.cuts[0].pts, tip=T.LM.scapTip, near=dense(c).filter(q=>Math.abs(q[0]-tip[0])<2);
          ok(c.every(q=>q[0]<-50),v.id+'/'+k+': torakotomia nie po prawej stronie');
          ok(near.length&&Math.max(...near.map(q=>q[1]))<tip[1]-0.8,v.id+'/'+k+': torakotomia nie poniżej kąta dolnego łopatki');
          ok(ph.ics&&ph.ics.k===(base==='eso-il'?5:4),v.id+'/'+k+': przestrzeń międzyżebrowa '+(ph.ics&&ph.ics.k)); }
        if(ph.part==='neck'){ const c=ph.cuts[0].pts, L=len(dense(c))*CM; ok(c.every(q=>q[0]>0),v.id+': cięcie na szyi nie po lewej'); ok(L>4&&L<8,v.id+': długość cięcia na szyi '+L.toFixed(1)+' cm'); }
      });
    });
  }
  // przebieg slajdu: Ivor Lewis, dostęp otwarty — etap brzuszny, potem piersiowy (kamera i schemat ułożenia), elementy etapu 1 zostają
  w.__sgTest.open(an,0,0); await sleep(40); $('acc').querySelector('.accopt[data-acc="open"]').click(); await sleep(40); S.playing=false;
  let Tl=w.__sgTest.model().access; ok(Tl&&Tl.torso&&Tl.sets.open,'Ivor Lewis: brak narzędzia slajdu');
  w.__sgTest.at(-0.6); await sleep(20);
  ok(Tl.ph===0&&/etap brzuszny/.test($('capTitle').textContent)&&$('pose').hidden,'Ivor Lewis: etap brzuszny (podpis / schemat): '+$('capTitle').textContent);
  ok(Tl.sets.open.phases[0].cuts[0].mesh.visible&&!Tl.sets.open.phases[1].cuts[0].mesh.visible,'Ivor Lewis: cięcie piersiowe widoczne w etapie brzusznym');
  w.__sgTest.at(-0.1); await sleep(20);
  ok(Tl.ph===1&&/etap piersiowy/.test($('capTitle').textContent)&&!$('pose').hidden&&/lewym boku/.test($('pose').textContent),'Ivor Lewis: etap piersiowy (podpis / schemat ułożenia)');
  ok(Tl.sets.open.phases[0].cuts[0].mesh.visible&&!Tl.sets.open.phases[0].cuts[0].wm.visible&&Tl.sets.open.phases[1].cuts[0].wm.visible,'Ivor Lewis: na końcu laparotomia nie zszyta albo torakotomia nie otwarta');
  ok(Tl.sets.open.phases[1].ics.g.visible,'Ivor Lewis: brak przestrzeni międzyżebrowej');
  // McKeown, MIE: 3 etapy, porty torakoskopii po kolei, na końcu szyja
  w.__sgTest.open(an,2,0); await sleep(40); key(w,'3'); await sleep(40); S.playing=false; Tl=w.__sgTest.model().access;
  ok(w.__sgTest.state()&&Tl.sets.lap&&Tl.sets.lap.g.visible,'McKeown: klawisz 3 nie wybiera dostępu małoinwazyjnego');
  w.__sgTest.at(-0.75); await sleep(20); const th=Tl.sets.lap.phases[0].ports.filter(p=>p.g.visible).length;
  w.__sgTest.at(-0.02); await sleep(20);
  // po zmianie ułożenia trokary piersiowe usunięte (zostaje miejsce wkłucia); brzuch i szyja jednocześnie — trokary brzuszne zostają
  ok(th>=4&&Tl.ph===2&&Tl.sets.lap.phases[2].cuts[0].wm.visible&&Tl.sets.lap.phases[0].ports.every(p=>!p.g.visible&&p.ent.visible)&&Tl.sets.lap.phases[1].ports.every(p=>p.g.visible),'McKeown MIE: przebieg etapów ('+th+', '+Tl.ph+')');
  ok(/etap szyjny \(3\/3\)/.test($('capTitle').textContent),'McKeown: podpis etapu szyjnego: '+$('capTitle').textContent);
  ok($('pose').hidden,'McKeown: schemat ułożenia poza etapem piersiowym');
  key(w,'Escape'); await sleep(20);
  // Ivor Lewis MIE: w etapie piersiowym trokary brzuszne usunięte i bez odmy
  w.__sgTest.open(an,0,0); await sleep(40); $('acc').querySelector('.accopt[data-acc="lap"]').click(); await sleep(40); S.playing=false; Tl=w.__sgTest.model().access;
  w.__sgTest.at(-0.6); await sleep(20); const zA=Tl.grp.children[0].geometry.attributes.position.array.slice();
  ok(Tl.sets.lap.phases[0].ports.every(p=>p.g.visible),'Ivor Lewis MIE: trokary brzuszne niewidoczne w etapie brzusznym');
  w.__sgTest.at(-0.05); await sleep(20);
  ok(Tl.sets.lap.phases[0].ports.every(p=>!p.g.visible&&p.ent.visible)&&Tl.sets.lap.phases[1].ext.g.visible,'Ivor Lewis MIE: trokary brzuszne w etapie piersiowym albo brak poszerzenia otworu w IV przestrzeni');
  const zB=Tl.grp.children[0].geometry.attributes.position.array; let dz=0; for(let i=2;i<zB.length;i+=3) dz=Math.max(dz,zA[i]-zB[i]);
  ok(dz>0.5,'Ivor Lewis MIE: odma nie schodzi po zmianie ułożenia ('+dz.toFixed(2)+')');
  // klawisz 2 = hybrydowy; „Zmień dostęp”
  $('accChange').click(); await sleep(20); ok(!$('acc').hidden,'„Zmień dostęp” nie otwiera okna'); key(w,'2'); await sleep(40); S.playing=false; w.__sgTest.at(-0.5);
  ok(Tl.sets.hyb.g.visible&&!Tl.sets.lap.g.visible,'klawisz 2 nie wybiera dostępu hybrydowego');
  // poza slajdem model tułowia niewidoczny
  w.__sgTest.open(an,2,1); await sleep(40); ok(!w.__sgTest.model().access.grp.visible&&$('acc').hidden&&$('pose').hidden,'model tułowia lub okno widoczne poza slajdem');
  // jelito grube bez zmian: trzy przyciski z domyślnymi nazwami i klawiszami 1–3
  const rh=A.PROCS.findIndex(p=>p.id==='rh'); w.__sgTest.open(rh,0,0); await sleep(40);
  ok(vis().map(b=>b.dataset.acc+':'+b.querySelector('b').textContent+':'+b.querySelector('kbd').textContent).join()==='open:Otwarty:1,lap:Laparoskopowy:2,rob:Robotyczny:3','hemikolektomia prawa: przyciski '+vis().map(b=>b.querySelector('b').textContent).join());
  ok(!w.__sgTest.model().access.torso,'hemikolektomia prawa: model tułowia zamiast powłok brzucha');
  // EN
  w=boot('en'); await sleep(300); { const A2=w.ANAT, an2=A2.PROCS.findIndex(p=>p.id==='esoph'); w.__sgTest.open(an2,0,0); await sleep(40);
    const b=[...w.document.querySelectorAll('#acc .accopt')].filter(x=>!x.hidden).map(x=>x.querySelector('b').textContent).join();
    ok(b==='Open,Hybrid,Minimally invasive (MIE),Robotic','EN: przyciski '+b);
    w.document.querySelector('#acc .accopt[data-acc="hyb"]').click(); await sleep(40); w.__sgTest.state().playing=false; w.__sgTest.at(-0.1); await sleep(20);
    const cap=w.document.getElementById('capTitle').textContent+' '+w.document.getElementById('capText').textContent;
    ok(/thoracic stage/.test(cap)&&!/[ąćęłńóśźż]/i.test(cap),'EN: podpis etapu: '+cap.slice(0,120));
    const lbl=[...w.document.querySelectorAll('#labels .lbl')].filter(e=>e.style.display!=='none'&&e.style.opacity!=='0').map(e=>e.textContent).join(' | ');
    ok(!/[ąćęłńóśźż]/i.test(lbl),'EN: polskie etykiety: '+lbl.slice(0,200)); }
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
