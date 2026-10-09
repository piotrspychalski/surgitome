// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Krezka i mezorektum w resekcjach lewostronnych (hemikolektomia lewa, resekcja odbytnicy — TME, przednia ściana — PME z dłuższym kikutem, Hartmann): podwiązania, część usuwana i pozostająca, przełącznik, kadry, EN;
// kolektomia całkowita (IRA, IPAA — krezka całej okrężnicy, grupy JSCCR) i ileostomie (krezka jelita krętego za pętlą, bez podwiązań i węzłów)
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
  const X={ lh:{tie:'lc,sb',rem:'lc,lca,sb',keep:'ima,sb2,sra',rect:'pozostaje'}, ar:{tie:'ima,lc',rem:'ima,sb,sb2,sra',keep:'lc,lca',rect:'usuwane w całości (TME)'}, arp:{tie:'ima,lc,sra',rem:'ima,sb,sb2,sraTop',keep:'lc,lca,sra',rect:'częściowo usuwane (PME)'}, hart:{tie:'ima,sra',rem:'ima,sb,sb2,sraTop',keep:'imaTop,lc,lca,sra',rect:'pozostaje z kikutem odbytnicy'} };
  const T={ lh:[L.colT([2.4,4.0,2.5]),L.colT([2.6,-8.2,2.2])], ar:[L.colT([7.4,-6.0,-0.3]),0.985], arp:[L.colT([7.4,-6.0,-0.3]),L.colT([0.2,-15.1,-1.0])], hart:[L.colT([7.4,-6.0,-0.3]),L.colT([0.5,-12.8,0.9])] };
  for(const m of ['lh','ar','arp','hart']){
    const d=L.mesoLeft(m), x=X[m]; console.log(m,'| podwiązania:',tie(d),'| usuwane:',rem(d),'| zostają:',keep(d));
    ok(d.type==='meso'&&d.name==='Krezka z węzłami chłonnymi'&&d.sub==='usuwana z preparatem',m+': zły opis krezki');
    ok(tie(d)===x.tie&&rem(d)===x.rem&&keep(d)===x.keep,m+': złe podwiązania lub naczynia usuwane');
    // arkusze: usuwane tylko w zakresie preparatu, ciągłe (bez przerw poza zagięciem śledzionowym), mezorektum usuwane tylko w resekcji odbytnicy
    const sh=d.sheets, eps=1e-6;
    ok(sh.filter(s=>s.removed).every(s=>s.rows.every(r=>r[2]>=T[m][0]-eps&&r[2]<=T[m][1]+eps)),m+': krezka usuwana poza zakresem preparatu');
    ok(sh.filter(s=>!s.removed).every(s=>s.rows.slice(1,-1).every(r=>r[2]<T[m][0]||r[2]>T[m][1])),m+': krezka pozostająca w zakresie preparatu');
    const all=sh.flatMap(s=>s.rows.map(r=>r[2])); ok(Math.max(...all)>0.98&&Math.min(...all)<T.lh[0],m+': arkusze nie obejmują poprzecznicy lub mezorektum');
    const rect=m==='ar'?sh.filter(s=>s.rows.some(r=>r[2]>0.9)):sh.filter(s=>s.rows.some(r=>r[2]>Math.max(0.9,T[m][1])+0.005)); ok(rect.length&&rect.every(s=>s.removed===(m==='ar')),m+': mezorektum: zła część (usuwana/pozostaje)');
    ok(d.labels&&d.labels.length===1&&d.labels[0].name==='Mezorektum'&&d.labels[0].sub===x.rect&&d.labels[0].removed===(m==='ar'),m+': brak lub zły podpis mezorektum');
    ok(sh.some(s=>s.mob)===(m!=='lh')&&(m==='lh'||d.mobOpacity&&d.mobOpacity[1][1]===0),m+': krezka odcinka sprowadzanego (mob) niezgodna');
    ok(d.nodes.some(n=>n.removed)&&d.nodes.some(n=>!n.removed),m+': brak węzłów usuwanych lub pozostających');
    if(m==='hart'){ const top=d.vessels.find(v=>v.id==='imaTop'); ok(top&&top.nodesRemoved,'hart: węzły u korzenia IMA powinny być usuwane'); }
    if(m==='hart'||m==='arp') ok(d.vessels.find(v=>v.id==='sraTop').nodes,m+': brak węzłów w usuwanej części SRA/mezorektum');
    ok(JSON.stringify(d.offset[1][1])===JSON.stringify(m==='lh'?[7,1,5]:[-6,2,6]),m+': krezka nie odjeżdża razem z preparatem');
  }
  // zabiegi: każdy wariant ma krezkę, przełącznik widoczny, przejście przez wszystkie kadry bez błędów; hemikolektomia prawa bez zmian
  [...$('cats').children].find(b=>b.textContent==='Jelito grube').click(); await sleep(400);
  for(const [tab,n] of [['Hemikolektomia lewa',3],['Resekcja odbytnicy',4],['Hartmann',1]]){
    [...$('tabs').children].find(b=>b.textContent.startsWith(tab)).click(); await sleep(500);
    const vb=[...$('variants').querySelectorAll('.vbtn')]; ok(Math.max(1,vb.length)===n,tab+': zła liczba wariantów');
    for(let i=0;i<n;i++){
      if(vb[i]){ vb[i].click(); await sleep(400); }
      ok(!$('togMeso').hidden,tab+' '+i+': brak przełącznika krezki');
      const st=[...$('strip').querySelectorAll('.step')]; for(const s of st.slice(0,5)){ s.click(); await sleep(120); }
    }
  }
  const procs=w.ANAT.PROCS.filter(p=>['lh','ar','hartmann'].includes(p.id));
  // przednia ściana: dłuższy kikut odbytnicy (wyższe przecięcie) i PME; linia przez środek i rakieta: TME
  const AR=w.ANAT.PROCS.find(p=>p.id==='ar'), sub=id=>AR.variants.find(v=>v.id===id).cutTools.find(t=>t.type==='meso').labels[0].sub;
  ok(sub('ar-side')==='częściowo usuwane (PME)'&&sub('ar-center')==='usuwane w całości (TME)'&&sub('ar-racket')==='usuwane w całości (TME)','resekcja odbytnicy: zły zakres mezorektum w wariantach');
  const stump=id=>{ const o=AR.variants.find(v=>v.id===id).objects.find(o=>o.id==='rect'); return L.colT(o.pre.path[0]); };
  console.log('początek kikuta (t): środek',stump('ar-center').toFixed(3),'| przednia ściana',stump('ar-side').toFixed(3));
  ok(stump('ar-side')<stump('ar-center')-0.02,'przednia ściana: kikut odbytnicy nie jest dłuższy niż w zespoleniu koniec-do-końca');
  ok(procs.length===3&&procs.every(p=>p.variants.every(v=>v.cutTools.filter(t=>t.type==='meso').length===1)),'nie każdy wariant lewostronny ma krezkę');
  // kolektomia całkowita (wersja onkologiczna): krezka całej okrężnicy; IRA — mezorektum zostaje, IPAA — TME; ileostomie — krezka jelita krętego za pętlą, bez podwiązań i węzłów
  const ms=id=>w.ANAT.PROCS.find(p=>p.id===id).variants.map(v=>v.cutTools.filter(t=>t.type==='meso'));
  for(const id of ['ira','ipaa']){ const M=ms(id)[0], d=M[0], ties=d.vessels.filter(v=>v.tie!=null).map(v=>v.id), remA=d.vessels.filter(v=>v.removed&&v.kind==='a').map(v=>v.id), codes=d.groups.list.map(g=>g.code);
    console.log(id,'— podwiązania:',ties.join(','),'| z preparatem:',remA.join(','),'| mezorektum:',d.labels[0].sub,'| grup:',codes.length);
    ok(M.length===1&&['ic','rc','mc','ima'].every(x=>ties.includes(x))&&['rbmc','lbmc','sb','sb2'].every(x=>remA.includes(x)),id+': niepełna krezka okrężnicy');
    ok(['203','223','253'].every(c=>codes.includes(c)),id+': brak grup JSCCR');
    ok(id==='ira'?d.labels[0].sub==='pozostaje'&&!d.labels[0].removed:d.labels[0].sub==='usuwane w całości (TME)'&&remA.includes('sra'),id+': zły zakres mezorektum'); }
  ms('ileo').forEach((M,i)=>{ const d=M[0]; ok(M.length===1&&d.morph&&d.sheets.every(s=>s.post)&&!d.vessels.some(v=>v.tie!=null)&&!d.nodes.length&&!d.groups,'ileostomia '+i+': krezka jelita krętego');
    const B=w.ANAT.BODY; ok(d.sheets.every(s=>s.post.every(r=>r[0][2]<=B.z(r[0][0],r[0][1])-0.6)),'ileostomia '+i+': krezka ponad powłokami'); });
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
