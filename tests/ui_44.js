// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Krezka i mezorektum w resekcjach lewostronnych (hemikolektomia lewa, resekcja odbytnicy, Hartmann): podwiązania, część usuwana i pozostająca, przełącznik, kadry, EN
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
function ok(c,m){ if(!c) fails.push(m); }
(async()=>{ await sleep(300);
  const L=w.ANAT._lib, tie=d=>d.vessels.filter(v=>v.tie!=null).map(v=>v.id).join(','), rem=d=>d.vessels.filter(v=>v.removed&&v.kind==='a').map(v=>v.id).join(','), keep=d=>d.vessels.filter(v=>!v.removed&&v.kind==='a').map(v=>v.id).join(',');
  const X={ lh:{tie:'lc,sb',rem:'lc,lca,sb',keep:'ima,sb2,sra',rect:'pozostaje'}, ar:{tie:'ima,lc',rem:'ima,sb,sb2,sra',keep:'lc,lca',rect:'usuwane w całości (TME)'}, hart:{tie:'ima,sra',rem:'ima,sb,sb2,sraTop',keep:'imaTop,lc,lca,sra',rect:'pozostaje z kikutem odbytnicy'} };
  const T={ lh:[L.colT([2.4,4.0,2.5]),L.colT([2.6,-8.2,2.2])], ar:[L.colT([7.4,-6.0,-0.3]),0.985], hart:[L.colT([7.4,-6.0,-0.3]),L.colT([0.5,-12.8,0.9])] };
  for(const m of ['lh','ar','hart']){
    const d=L.mesoLeft(m), x=X[m]; console.log(m,'| podwiązania:',tie(d),'| usuwane:',rem(d),'| zostają:',keep(d));
    ok(d.type==='meso'&&d.name==='Krezka z węzłami chłonnymi'&&d.sub==='usuwana z preparatem',m+': zły opis krezki');
    ok(tie(d)===x.tie&&rem(d)===x.rem&&keep(d)===x.keep,m+': złe podwiązania lub naczynia usuwane');
    // arkusze: usuwane tylko w zakresie preparatu, ciągłe (bez przerw poza zagięciem śledzionowym), mezorektum usuwane tylko w resekcji odbytnicy
    const sh=d.sheets, eps=1e-6;
    ok(sh.filter(s=>s.removed).every(s=>s.rows.every(r=>r[2]>=T[m][0]-eps&&r[2]<=T[m][1]+eps)),m+': krezka usuwana poza zakresem preparatu');
    ok(sh.filter(s=>!s.removed).every(s=>s.rows.slice(1,-1).every(r=>r[2]<T[m][0]||r[2]>T[m][1])),m+': krezka pozostająca w zakresie preparatu');
    const all=sh.flatMap(s=>s.rows.map(r=>r[2])); ok(Math.max(...all)>0.98&&Math.min(...all)<T.lh[0],m+': arkusze nie obejmują poprzecznicy lub mezorektum');
    const rect=sh.filter(s=>s.rows.some(r=>r[2]>0.9)); ok(rect.length&&rect.every(s=>s.removed===(m==='ar')),m+': mezorektum: zła część (usuwana/pozostaje)');
    ok(d.labels&&d.labels.length===1&&d.labels[0].name==='Mezorektum'&&d.labels[0].sub===x.rect&&d.labels[0].removed===(m==='ar'),m+': brak lub zły podpis mezorektum');
    ok(sh.some(s=>s.mob)===(m!=='lh')&&(m==='lh'||d.mobOpacity&&d.mobOpacity[1][1]===0),m+': krezka odcinka sprowadzanego (mob) niezgodna');
    ok(d.nodes.some(n=>n.removed)&&d.nodes.some(n=>!n.removed),m+': brak węzłów usuwanych lub pozostających');
    ok(JSON.stringify(d.offset[1][1])===JSON.stringify(m==='lh'?[7,1,5]:[-6,2,6]),m+': krezka nie odjeżdża razem z preparatem');
  }
  // zabiegi: każdy wariant ma krezkę, przełącznik widoczny, przejście przez wszystkie kadry bez błędów; hemikolektomia prawa bez zmian
  [...$('cats').children].find(b=>b.textContent==='Jelito grube').click(); await sleep(400);
  for(const [tab,n] of [['Hemikolektomia lewa',3],['Resekcja odbytnicy',3],['Hartmann',1]]){
    [...$('tabs').children].find(b=>b.textContent.startsWith(tab)).click(); await sleep(500);
    const vb=[...$('variants').querySelectorAll('.vbtn')]; ok(Math.max(1,vb.length)===n,tab+': zła liczba wariantów');
    for(let i=0;i<n;i++){
      if(vb[i]){ vb[i].click(); await sleep(400); }
      ok(!$('togMeso').hidden,tab+' '+i+': brak przełącznika krezki');
      const st=[...$('strip').querySelectorAll('.step')]; for(const s of st.slice(0,5)){ s.click(); await sleep(120); }
    }
  }
  const procs=w.ANAT.PROCS.filter(p=>['lh','ar','hartmann'].includes(p.id));
  ok(procs.length===3&&procs.every(p=>p.variants.every(v=>v.cutTools.filter(t=>t.type==='meso').length===1)),'nie każdy wariant lewostronny ma krezkę');
  ok(w.ANAT.PROCS.filter(p=>['ira','ipaa','ileo'].includes(p.id)).every(p=>p.variants.every(v=>!v.cutTools.some(t=>t.type==='meso'))),'krezka w zabiegu, w którym jej nie dodawano');
  // EN: podpisy krezki i mezorektum przetłumaczone
  [...$('tabs').children].find(b=>b.textContent.startsWith('Resekcja odbytnicy')).click(); await sleep(500);
  $('strip').querySelectorAll('.step')[1].click(); await sleep(200);
  $('btnLang').click(); await sleep(300);
  const lab=[...$('labels').children].map(e=>e.textContent).join(' | ');
  ok(/Mesorectum/.test(lab)&&/removed entirely \(TME\)/.test(lab)&&/Mesentery with lymph nodes/.test(lab),'podpisy krezki nieprzetłumaczone: '+lab.slice(0,300));
  ok(!/Mezorektum|usuwane w całości/.test(lab),'polskie podpisy w EN');
  console.log('errors',JSON.stringify(errs.concat(fails)));
  process.exit(0);
})();
