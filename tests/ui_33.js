// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Zgłaszanie uwag: przycisk, formularz, kontekst (zabieg/wariant/kadr), wysyłka (Web3Forms, podmieniony fetch), błąd → link mailto, klawisze podczas pisania, EN
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1');
w.matchMedia=()=>({matches:false,addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const sent=[]; let mode='ok';
w.fetch=(url,opt)=>{ sent.push({url,body:JSON.parse(opt.body)}); if(mode==='fail') return Promise.reject(new Error('offline')); return Promise.resolve({ok:true,json:()=>Promise.resolve({success:true,message:'Email sent successfully!'})}); };
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id), sleep=ms=>new Promise(r=>setTimeout(r,ms)), fails=[];
function ok(c,m){ if(!c) fails.push(m); }
const key=(k,el)=>(el||w.document).dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true}));
(async()=>{ await sleep(300);
  // wybór zabiegu i wariantu z wyszukiwarki
  const q=$('q'); q.value='poszerzona'; q.dispatchEvent(new w.Event('input')); key('Enter',q); await sleep(600);
  $('strip').querySelectorAll('.step')[2].click(); await sleep(300);
  ok(!!$('fbBtn'),'brak przycisku uwag'); $('fbBtn').click(); await sleep(50);
  ok(!$('fb').hidden,'formularz się nie otwiera');
  console.log('kontekst:',$('fbCtx').textContent);
  ok(/Hemikolektomia prawa — Poszerzona — izoperystaltyczne · Kadr 3/.test($('fbCtx').textContent),'zły kontekst w formularzu');
  // klawisze podczas pisania nie działają jak skróty
  const fav0=w.localStorage.getItem('surgitome-fav'), fr0=w.__sgTest.state().frame;
  $('fbMsg').focus(); key('f',$('fbMsg')); key('ArrowRight',$('fbMsg')); await sleep(50);
  ok(w.localStorage.getItem('surgitome-fav')===fav0 && w.__sgTest.state().frame===fr0,'klawisze w formularzu przełączają ulubione lub kadry');
  // pusta uwaga
  $('fbForm').dispatchEvent(new w.Event('submit',{cancelable:true})); await sleep(20);
  ok(sent.length===0 && /Wpisz/.test($('fbStatus').textContent),'pusta uwaga została wysłana');
  // wysyłka
  $('fbMsg').value='Test: kolor krezki za jasny'; $('fbMail').value='czytelnik@example.com';
  $('fbForm').dispatchEvent(new w.Event('submit',{cancelable:true})); await sleep(80);
  const b=sent[0]&&sent[0].body; console.log('wysłano do:',sent[0]&&sent[0].url,'| temat:',b&&b.subject,'| pola:',b&&Object.keys(b).join(', '));
  ok(sent[0]&&sent[0].url==='https://api.web3forms.com/submit'&&b.access_key==='fe2f2a94-ba69-47b4-8c24-65c63ec31d85'&&b.replyto==='czytelnik@example.com','zły adres wysyłki lub klucz');
  ok(b&&b['Uwaga']==='Test: kolor krezki za jasny'&&b.email==='czytelnik@example.com'&&/rh-ext/.test(b['Identyfikatory'])&&/kadr 3/.test(b['Zabieg / wariant / kadr']),'brak treści lub kontekstu w wiadomości');
  ok(/Dziękuję/.test($('fbStatus').textContent),'brak potwierdzenia wysyłki'); await sleep(1900); ok($('fb').hidden,'formularz nie zamyka się po wysłaniu');
  // błąd sieci → link do programu pocztowego
  mode='fail'; $('fbBtn').click(); $('fbMsg').value='Druga uwaga'; $('fbForm').dispatchEvent(new w.Event('submit',{cancelable:true})); await sleep(80);
  const a=$('fbStatus').querySelector('a'); console.log('po błędzie:',$('fbStatus').textContent.slice(0,60),'|',a&&a.href.slice(0,70));
  ok(a&&/^mailto:piotr\.spychalski@gumed\.edu\.pl\?subject=/.test(a.href)&&/Druga%20uwaga/.test(a.href),'brak zapasowego linku mailto');
  mode='err'; w.fetch=(url,opt)=>Promise.resolve({ok:false,json:()=>Promise.resolve({success:false,message:'Invalid access key'})});
  $('fbForm').dispatchEvent(new w.Event('submit',{cancelable:true})); await sleep(80);
  console.log('błąd serwisu:',$('fbStatus').textContent.slice(0,70)); ok(/Invalid access key/.test($('fbStatus').textContent)&&$('fbStatus').querySelector('a'),'brak komunikatu serwisu przy błędzie');
  key('Escape'); await sleep(20); ok($('fb').hidden,'Esc nie zamyka formularza');
  // EN
  $('btnLang').click(); await sleep(50); $('fbBtn').click(); await sleep(30);
  console.log('EN:',$('fbTitle').textContent,'|',$('fbSend').textContent,'|',$('fbCtx').textContent);
  ok($('fbTitle').textContent==='Send feedback'&&$('fbSend').textContent==='Send'&&/Extended right hemicolectomy|Right hemicolectomy/.test($('fbCtx').textContent),'formularz nieprzetłumaczony');
  console.log('errors',JSON.stringify(errs.concat(fails)));
  process.exit(0);
})();
