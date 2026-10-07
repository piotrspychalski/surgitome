// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Górne piętro: naczynia, sieci, mezopankreas i stacje węzłowe w zabiegach onkologicznych (gastrektomie D2 — JGCA, Whipple/PPPD/pankreatektomia dystalna — ISGPS/JPS, esofagektomie — AJCC 8); bez warstwy w zabiegach nieonkologicznych
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
  const A=w.ANAT, mesoOf=v=>v.cutTools.find(t=>t.type==='meso'), rem=d=>d.groups.list.filter(g=>g.removed).map(g=>g.code).sort().join(' '), keep=d=>d.groups.list.filter(g=>!g.removed).map(g=>g.code).sort().join(' ');
  const proc=id=>A.PROCS.find(p=>p.id===id), sort=a=>a.slice().sort().join(' ');
  // gastrektomia całkowita i dystalna: D2 wg JGCA 2021
  const tg=mesoOf(proc('tg').variants[0]);
  ok(rem(tg)===sort(['1','2','3a','3b','4sa','4sb','4d','5','6','7','8a','9','11p','11d','12a'])&&keep(tg)==='10','TG: zły zakres D2: '+rem(tg)+' | '+keep(tg));
  ok(['lga','rga','rgea','lgea'].every(k=>tg.vessels.find(x=>x.id===k).tie!=null)&&tg.vessels.filter(x=>/^sg\d/.test(x.id)).every(x=>x.tie!=null),'TG: brak podwiązań u odejścia lub krótkich tętnic');
  proc('dg').variants.forEach(v=>{ const d=mesoOf(v); ok(d&&rem(d)===sort(['1','3a','3b','4sb','4d','5','6','7','8a','9','11p','12a'])&&keep(d)===sort(['2','4sa','10','11d']),v.id+': zły zakres D2 dystalnej: '+(d&&rem(d)));
    ok(d.vessels.filter(x=>/^sg\d/.test(x.id)).every(x=>!x.removed&&x.tie==null),v.id+': krótkie tętnice żołądkowe powinny zostać (ukrwienie kikuta)'); ok(d.sheets.length===2&&d.sheets.every(s=>s.removed),v.id+': sieci'); });
  // trzustka: ISGPS
  const PD=sort(['5','6','8a','12b1','12b2','12c','13a','13b','14a','14b','17a','17b']);
  ['whip','pppd'].forEach(id=>proc(id).variants.forEach(v=>{ const d=mesoOf(v); ok(rem(d)===PD,v.id+': zły zakres ISGPS: '+rem(d));
    ok(d.vessels.find(x=>x.id==='gda').tie!=null&&d.vessels.find(x=>x.id==='ipda').tie!=null&&d.vessels.find(x=>x.id==='sma'&&!x.removed)&&d.vessels.find(x=>x.id==='pv'&&!x.removed),v.id+': GDA/IPDA podwiązane, SMA i PV zachowane');
    ok(d.sheets.length===1&&d.sheets[0].removed&&d.name==='Mezopankreas',v.id+': brak mezopankreasu');
    const rga=d.vessels.find(x=>x.id==='rga'); ok(id==='pppd'?rga.tie==null&&!rga.removed:rga.tie!=null,v.id+': RGA (PPPD zachowana, Whipple podwiązana)'); }));
  const dp=mesoOf(proc('dp').variants[0]); ok(rem(dp)===sort(['10','11p','11d','18'])&&dp.vessels.find(x=>x.id==='spa').tie!=null&&dp.vessels.find(x=>x.id==='sv').tie!=null,'DP: zakres 10, 11, 18 i podwiązania naczyń śledzionowych: '+rem(dp));
  // przełyk: AJCC 8, łuk RGEA za rurą
  const eso=proc('esoph'), E=id=>mesoOf(eso.variants.find(v=>v.id===id));
  ok(!E('eso-col'),'interpozycja okrężnicy: warstwa nie powinna być dodana');
  ['eso-il','eso-il-ss','eso-mck','eso-mck-ss','eso-the','eso-aki'].forEach(id=>{ const d=E(id); ok(d&&d.groups.system.startsWith('Numeracja AJCC'),id+': brak warstwy AJCC');
    const r=d.vessels.find(x=>x.id==='rgea'); ok(r&&!r.removed&&r.post&&d.morph,id+': łuk RGEA nie podąża za rurą'); ok(d.vessels.find(x=>x.id==='lga').tie!=null,id+': LGA niepodwiązana'); });
  ok(/8U/.test(rem(E('eso-mck')))&&!/8U/.test(rem(E('eso-il'))),'McKeown: górne śródpiersie, Ivor Lewis: bez 8U');
  ok(/1L/.test(rem(E('eso-aki')))&&!/1L/.test(rem(E('eso-mck'))),'Akiyama: węzły szyjne');
  ok(!/\b7\b/.test(rem(E('eso-the')))&&/8Lo/.test(rem(E('eso-the'))),'przezrozworowa: bez podostrogowych, z 8Lo');
  // śledziona jako narząd odniesienia (stacje 4sa, 10, 11d): zachowana w gastrektomiach, Whipple/PPPD i esofagektomiach z rurą; naczynia poza jej miąższem
  ['tg','dg','whip','pppd'].forEach(id=>proc(id).variants.forEach(v=>ok(v.objects.some(o=>o.id==='spleen'&&o.organ&&!o.offset)&&v.ctMap.spleen==='organ',v.id+': brak śledziony')));
  ok(eso.variants.filter(v=>v.id!=='eso-col').every(v=>v.objects.some(o=>o.id==='spleen')),'esofagektomia: brak śledziony');
  { const T3=w.THREE, sc=A.curveOf([[6.9,0.6,-3.4],[7.9,2.2,-3.0],[8.3,3.9,-2.2]]), R=t=>t<0.2?0.3+t/0.2:t<0.6?1.3+(t-0.2)/0.4*0.2:1.5-(t-0.6)/0.4*1.2;
    const inside=p=>{ const v=new T3.Vector3(...p); for(let i=0;i<=60;i++){ const t=i/60; if(sc.getPointAt(t).distanceTo(v)<R(t)-0.3) return true; } return false; };
    const bad=tg.vessels.filter(x=>x.id!=='spa'&&(x.segs?[].concat(...x.segs):x.pts).some(inside)).map(x=>x.id).concat(tg.nodes.filter(n=>inside(n.p)).map(n=>'węzeł '+n.g));
    ok(!bad.length,'naczynia lub węzły w miąższu śledziony: '+bad.join(', ')); }
  // bez warstwy w zabiegach nieonkologicznych i wątrobie
  ['sleeve','rygb','oagb','ds','bpd','gebp','hj','cdd','drain','liver','oltx','lvres'].forEach(id=>{ const p=proc(id); if(p) ok(p.variants.every(v=>!mesoOf(v)),id+': warstwa w zabiegu nieonkologicznym'); });
  // interfejs: przejście przez kadry, przełączniki widoczne, EN
  const visit=async(cat,tab,nv)=>{ [...$('cats').children].find(b=>b.textContent===cat).click(); await sleep(300); [...$('tabs').children].find(b=>b.textContent.startsWith(tab)).click(); await sleep(400);
    const vb=[...$('variants').querySelectorAll('.vbtn')]; for(let i=0;i<Math.max(1,Math.min(nv,vb.length));i++){ if(vb[i]){ vb[i].click(); await sleep(300); } ok(!$('togMeso').hidden&&!$('togNodes').hidden,tab+' '+i+': brak przełączników'); for(const s of [...$('strip').querySelectorAll('.step')].slice(0,5)){ s.click(); await sleep(100); } } };
  await visit('Żołądek','Gastrektomia całkowita',1); await visit('Żołądek','Resekcja dystalna',4);
  await visit('Trzustka i drogi żółciowe','Whipple',2); await visit('Trzustka i drogi żółciowe','Traverso',2); await visit('Trzustka i drogi żółciowe','Pankreatektomia dystalna',1);
  await visit('Przełyk','Esofagektomia',6);
  const vb6=[...$('variants').querySelectorAll('.vbtn')]; vb6[vb6.length-1].click(); await sleep(400); ok($('togMeso').hidden&&$('togNodes').hidden,'interpozycja okrężnicy: przełączniki widoczne: '+vb6.map(b=>b.textContent).join('/')+' meso:'+$('togMeso').hidden+' nodes:'+$('togNodes').hidden);
  [...$('cats').children].find(b=>b.textContent==='Bariatria').click(); await sleep(300); ok($('togMeso').hidden,'bariatria: przełącznik krezki widoczny');
  [...$('cats').children].find(b=>b.textContent==='Żołądek').click(); await sleep(300); [...$('tabs').children].find(b=>b.textContent.startsWith('Gastrektomia całkowita')).click(); await sleep(400);
  $('strip').querySelectorAll('.step')[1].click(); await sleep(200); $('optNodes').click(); await sleep(200); $('btnLang').click(); await sleep(300);
  const en=[...$('labels').children].filter(e=>e.style.display!=='none').map(e=>e.textContent).join(' | ');
  ok(/Coeliac trunk/.test(en)&&/infrapyloric/.test(en)&&!/Pień trzewny|pododźwiernikowe/.test(en),'EN: nieprzetłumaczone podpisy: '+en.slice(0,240));
  ok(/JGCA numbering/.test($('nodeSys').textContent),'EN: opis numeracji JGCA');
  console.log('errors',JSON.stringify(errs.concat(fails)));
  process.exit(0);
})();
