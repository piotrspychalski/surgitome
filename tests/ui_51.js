// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Herniologia: kategoria „Herniologia” (przed badaniami), zabiegi: Lichtenstein, TAPP, TEP (test ui_53), przepuklina pępkowa (siatka przedotrzewnowa / szew), TAR, Ramirez.
// Warstwowy model powłok (TOOL_EXT.wall): wszystkie kadry bez błędów; ubytek — warstwy mięśniowo-powięziowe odsunięte bocznie, po odtworzeniu linii
// białej przyśrodkowe brzegi w linii pośrodkowej; przestrzenie (zamięśniowa, TAR) otwierają się i zamykają; siatka widoczna tylko od kadru „Siatka”;
// TK: własny rysunek (M.ctCustom), start na poziomie środka ubytku, RDR z modelu < 1 (wskazanie do uwolnienia); EN — teksty bez polskich znaków.
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
const drawn=[];
function boot(lang){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'}); const w=dom.window;
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1'); if(lang) w.localStorage.setItem('surgitome-lang',lang);
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); if(k==='fillText') return (t)=>drawn.push(String(t)); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
(async()=>{
  let w=boot(); await sleep(300); const $=id=>w.document.getElementById(id), A=w.ANAT;
  const cats=A.CATS.map(c=>c.id); ok(cats.indexOf('hernia')>=0 && cats.indexOf('hernia')===cats.indexOf('trials')-1,'kategoria hernia nie stoi przed badaniami: '+cats);
  const H=A.PROCS.filter(p=>p.cat==='hernia').map(p=>p.id); ok(H.join(',')==='lich,tapp,tep,umb,tar,acs','zabiegi herniologii: '+H);
  ok(A.WALL.rdr().ratio<1 && A.WALL.rdr().ratio>0.8,'RDR modelu TAR/Ramirez: '+A.WALL.rdr().ratio);
  const S=w.__sgTest.state();
  for(const id of H.filter(i=>['umb','tar','acs'].includes(i))){ const an=A.PROCS.findIndex(p=>p.id===id);
    for(let vi=0;vi<A.PROCS[an].variants.length;vi++){ const fr=w.__sgTest.open(an,vi,0), F=w.__sgTest.frames(), M=w.__sgTest.model();
      ok(M.wall,'brak modelu powłok: '+id);
      for(let fi=0;fi<F.length;fi++){ w.__sgTest.open(an,vi,fi); S.playing=false; w.__sgTest.at(F[fi].m1==null?F[fi].m0:F[fi].m1); await sleep(5);
        const vis=M.wall.labels.filter(L=>L.alpha>0).length; if(F[fi].kind!=='ct') ok(vis>0,id+' kadr '+fi+': brak etykiet');
        if(F[fi].kind==='ct'){ ok(!!M.ctCustom,'TK bez rysunku własnego: '+id); }
      }
    }
  }
  // TAR: ubytek i odtworzenie linii białej (przyśrodkowy brzeg pochewki przedniej po stronie lewej)
  const anT=A.PROCS.findIndex(p=>p.id==='tar'); w.__sgTest.open(anT,0,0); let M=w.__sgTest.model();
  const x0=M.wall.test.hwA(0), x6=M.wall.test.hwA(6);
  ok(x0>3,'TAR: brak ubytku na przekroju (przesunięcie brzegu '+x0.toFixed(2)+')'); ok(x6<0.05,'TAR: linia biała nie odtworzona ('+x6.toFixed(2)+')');
  // siatka niewidoczna przed kadrem „Siatka”
  w.__sgTest.open(anT,0,2); S.playing=false; w.__sgTest.at(2); const meshVis=M.wall.grp.children.some(c=>c.isMesh&&c.material&&c.material.map&&c.visible);
  ok(!meshVis,'TAR: siatka widoczna przed kadrem „Siatka”');
  // TK
  const F=w.__sgTest.frames(), ci=F.findIndex(f=>f.kind==='ct'); w.__sgTest.open(anT,0,ci); await sleep(50);
  ok(!$('ctPanel').hidden,'TK: panel ukryty'); ok(Math.abs(parseFloat($('ctLevel').value)+A.WALL.HER.inc.yc)<0.6,'TK: start nie na poziomie ubytku: '+$('ctLevel').value);
  ok(drawn.some(t=>/RDR/.test(t)),'TK: brak opisu RDR'); ok(drawn.some(t=>/Sabbagh/.test(t)),'TK: brak opisu utraty domeny');
  // EN
  w=boot('en'); await sleep(300); const A2=w.ANAT, an2=A2.PROCS.findIndex(p=>p.id==='tar'); const S2=w.__sgTest.state(), F2=A2.PROCS[an2].variants[0].singleFrames;
  const PL=/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/; const bad=[];
  for(let fi=0;fi<F2.length;fi++){ w.__sgTest.open(an2,0,fi); S2.playing=false; w.__sgTest.at(F2[fi].m1); await sleep(5);
    ['capTitle','capText'].forEach(id=>{ const t=w.document.getElementById(id).textContent; if(PL.test(t)) bad.push(fi+':'+id+':'+t.slice(0,60)); });
    [...w.document.querySelectorAll('#labels .lbl b, #labels .lbl small')].forEach(e=>{ if(PL.test(e.textContent)) bad.push(fi+':etykieta:'+e.textContent); }); }
  ok(!bad.length,'EN: polskie teksty: '+bad.slice(0,4).join(' | '));
  console.log('herniologia:',H.join(','),'| RDR',A.WALL.rdr().ratio.toFixed(2),'| brzeg ubytku',x0.toFixed(2),'→',x6.toFixed(2));
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
