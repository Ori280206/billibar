const SHOT=location.search.includes('static');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const isMob=()=>innerWidth<=860;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const BOOK='https://ontopo.com/he/il/page/29160960';
// characteristic dots
$$('.dots').forEach(d=>{for(let i=0;i<5;i++){const b=document.createElement('b');if(i<+d.dataset.v)b.className='f';d.appendChild(b)}});
// the night, in five moments
const data=[
 {t:'20:00',name:'קוקטיילים',line:'מגיעים, מתיישבים, מזמינים את הראשון.',sub:'בר מלא · האפי האוור',rate:5,text:'בר מלא, כוסות תלויות מעל הראש וברמנים שיודעים מה הם עושים. יש האפי האוור.'},
 {t:'21:30',name:'ביליארד',line:'מישהו כבר שובר.',sub:'לבד · מנורות · עוד משחק',rate:5,text:'שולחן, מנורות נמוכות ועוד משחק אחד. ואז עוד אחד. לא צריך להיות מקצוען.'},
 {t:'22:30',name:'אוכל',line:'מגשים לשולחן, לחלוק או לא.',sub:'כשר למהדרין',rate:4,text:'מגשים לשולחן, ליד הקוקטייל ובין המשחקים. הכול כשר למהדרין, אז כולם יושבים יחד.'},
 {t:'23:30',name:'DJ',line:'האורות יורדים, המוזיקה עולה.',sub:'שלישי · חמישי · מוצ״ש',rate:5,text:'שלישי — לילה חריף. חמישי — DJ. במוצאי שבת מסיבה. הליינאפ מתפרסם באינסטגרם.'},
 {t:'01:00',name:'אירועים',line:'יום הולדת? סוגרים לכם ערב.',sub:'ימי הולדת · חברות · רווקות',rate:0,text:'ימי הולדת, אירועי חברה ומסיבות רווקות. לתיאום מדברים עם עדן: 050-573-7094.'}];
const items=$$('.c-item'),info=$('.c-info'),dotsEl=$('.c-dots');
data.forEach((d,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',d.name);b.onclick=()=>set(i);dotsEl.appendChild(b)});
let cur=0,opened=false;
function layout(){const n=items.length,m=isMob();
  items.forEach((el,i)=>{let o=((i-cur)%n+n)%n;if(o>n/2)o-=n;const a=Math.abs(o);
    let x,sc,op;if(m){x=-o*64;sc=a===0?1:.7;op=a===0?1:a===1?.38:0}else if(o>=0){x=-9-o*24;sc=o===0?1:o===1?.7:.5;op=o===0?1:o===1?.38:o===2?.12:0}else{x=o===-1?13:30;sc=.6;op=o===-1?.14:0}const s=sc;
    el.style.transform=`translate(calc(-50% + ${x}vw),-50%) scale(${s})`;el.style.opacity=op;el.style.zIndex=10-a;
    el.classList.toggle('on',a===0);el.style.pointerEvents=op?'auto':'none'});
  $$('.c-dots button').forEach((b,i)=>b.classList.toggle('on',i===cur))}
function fillInfo(){const d=data[cur];info.querySelector('.c-time').textContent=d.t;info.querySelector('.c-title').textContent=d.name;info.querySelector('.c-text').textContent=d.line}
function set(i,quiet){if(i===cur&&!quiet)return;cur=(i+items.length)%items.length;layout();
  if(SHOT){fillInfo();return}info.classList.add('out');setTimeout(()=>{fillInfo();info.classList.remove('out')},500);restartAuto()}
let auto;function restartAuto(){clearInterval(auto);if(!SHOT&&!reduce)auto=setInterval(()=>{if(!opened&&scrollY<innerHeight*.3&&!pinActive)set(cur+1)},5200)}
$$('.c-ctrl button').forEach(b=>b.onclick=()=>set(cur+ +b.dataset.dir));
// drag / swipe
let sx=null;const stage=$('.stage');
stage.addEventListener('pointerdown',e=>{sx=e.clientX});
addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>50){set(cur+(dx>0?1:-1));dragged=true;setTimeout(()=>dragged=false,50)}});
let dragged=false;
items.forEach((el,i)=>el.addEventListener('click',()=>{if(dragged)return;if(i!==cur)set(i);else openDetail()}));
$('.c-open').onclick=openDetail;
addEventListener('resize',layout);fillInfo();layout();restartAuto();
// detail: shared-element FLIP
const detail=$('.detail'),dImg=$('.d-img'),nav=$('.nav');
function fillDetail(){const d=data[cur];$('.d-time').textContent=d.t;$('.d-title').textContent=d.name;$('.d-sub').textContent=d.sub;$('.d-text').textContent=d.text;
  const g=$('.gold-dots');g.innerHTML='';$('.d-rate').style.display=d.rate?'':'none';for(let i=0;i<5;i++){const b=document.createElement('b');if(i<d.rate)b.className='f';g.appendChild(b)}}
let moved=null;
function openDetail(){if(opened)return;opened=true;fillDetail();const fig=items[cur],img=fig.querySelector('img');
  const state=window.Flip?Flip.getState(img):null;
  moved={img,fig};img.classList.add('c-img');dImg.appendChild(img);detail.classList.add('open');detail.setAttribute('aria-hidden','false');document.body.classList.add('locked');nav.classList.add('show');lenis&&lenis.stop();
  if(state&&!reduce&&!SHOT){Flip.from(state,{duration:1.25,ease:'power3.inOut',absolute:true,scale:true});
    gsap.fromTo('.d-body>*',{opacity:0,y:24},{opacity:1,y:0,duration:1,stagger:.06,ease:'power3.out',delay:.55})}
  else gsap.set('.d-body>*',{opacity:1,y:0})}
function closeDetail(){if(!opened)return;const {img,fig}=moved;
  const finish=()=>{const st=window.Flip?Flip.getState(img):null;fig.appendChild(img);img.classList.remove('c-img');detail.classList.remove('open');detail.setAttribute('aria-hidden','true');document.body.classList.remove('locked');opened=false;lenis&&lenis.start();updateNav();
    if(st&&!reduce)Flip.from(st,{duration:1.1,ease:'power3.inOut',absolute:true,scale:true})};
  gsap.to('.d-body>*',{opacity:0,y:16,duration:.4,stagger:.02,onComplete:finish})}
$('.d-close').onclick=closeDetail;addEventListener('keydown',e=>{if(e.key==='Escape')closeDetail()});
// nav / clock / mobile CTA
const mb=$('.m-book'),ct=$('.clock-t'),cl=$('.clock-line i');
function updateNav(){const sh=opened||scrollY>innerHeight*.6;nav.classList.toggle('show',sh&&!(opened&&isMob()));document.querySelector('.clock').classList.toggle('show',scrollY>innerHeight*.6)}
function tick(){updateNav();mb.classList.toggle('on',scrollY>innerHeight*.7);
  const max=document.documentElement.scrollHeight-innerHeight,p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
  const mins=20*60+Math.round(p*360/15)*15,h=Math.floor(mins/60)%24,mm=mins%60;ct.textContent=`${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  cl.style.transform=isMob()?`scaleX(${p})`:`scaleY(${p})`}
addEventListener('scroll',tick,{passive:true});tick();
// motion
let lenis=null,pinActive=false;
if(!SHOT&&!reduce&&window.gsap){
  gsap.registerPlugin(ScrollTrigger,Flip);
  if(window.Lenis){lenis=new Lenis({lerp:.07});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{duration:1.8})}}))}
  const intro=gsap.timeline({defaults:{ease:'power3.out'}});
  intro.from('.watermark',{opacity:0,scale:1.06,duration:2.2}).from('.col-head>*',{y:40,opacity:0,duration:1.4,stagger:.12},0.2).from('.c-item',{y:80,opacity:0,duration:1.6,stagger:.08,clearProps:'opacity'},0.3).from('.c-info,.c-foot',{opacity:0,y:20,duration:1.2},0.9);
  gsap.to('.watermark',{xPercent:-10,ease:'none',scrollTrigger:{trigger:'.collection',start:'top top',end:'bottom top',scrub:1}});
  gsap.utils.toArray('.visit h2,.visit .cap,.visit .btns,.hours div,.f-logo,.f-tag').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}}));
  ScrollTrigger.matchMedia({'(min-width:861px)':()=>{
    const track=$('.n-track'),dist=()=>track.scrollWidth-innerWidth;
    const tw=gsap.to(track,{x:()=>dist(),ease:'none',scrollTrigger:{trigger:'.nights',pin:'.n-pin',start:'top top',end:()=>'+='+dist()*1.1,scrub:1.2,invalidateOnRefresh:true}});
    gsap.utils.toArray('.m img').forEach((img,i)=>gsap.fromTo(img,{xPercent:i%2?7:-7},{xPercent:i%2?-7:7,ease:'none',scrollTrigger:{trigger:img.parentElement,containerAnimation:tw,start:'left right',end:'right left',scrub:true}}));
    gsap.from('.n-intro>*',{y:40,opacity:0,stagger:.1,duration:1.2,scrollTrigger:{trigger:'.nights',start:'top 70%'}});
  }});
}
