const SHOT=location.search.includes('static');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const mobile=()=>innerWidth<=860;
// dots
document.querySelectorAll('.dots').forEach(d=>{const v=+d.dataset.v;for(let i=0;i<5;i++){const b=document.createElement('b');if(i<v)b.className='f';d.appendChild(b)}});
// carousel
const data=[
 ['קוקטיילים','בר מלא, כוסות תלויות מעל הראש, והאפי האוור.','לשריין מקום','https://ontopo.com/he/il/page/29160960'],
 ['ביליארד','לבד, מנורות נמוכות ועוד משחק אחד. ואז עוד אחד.','לשריין שולחן','https://ontopo.com/he/il/page/29160960'],
 ['אוכל','מגשים לשולחן. כשר למהדרין.','לשריין מקום','https://ontopo.com/he/il/page/29160960'],
 ['לילות DJ','שלישי, חמישי ומוצאי שבת. הליינאפ באינסטגרם.','@billibar6','https://instagram.com/billibar6'],
 ['אירועים','ימי הולדת, אירועי חברה, מסיבות רווקות.','עדן 050-573-7094','tel:0505737094']];
const items=[...document.querySelectorAll('.c-item')],info=document.querySelector('.c-info');
let cur=0;
function layout(){const n=items.length,m=mobile(),gap=m?56:24;
  items.forEach((el,i)=>{let o=((i-cur)%n+n)%n;if(o>n/2)o-=n;const a=Math.abs(o);
    let x,op;
    if(m){x=-o*62;op=a===0?1:a===1?.4:0}
    else{x=o>=0?-8-o*23:14;op=o===0?1:o===1?.42:o===2?.16:0}
    const s=a===0?1:a===1?.7:.5;
    el.style.transform=`translate(calc(-50% + ${x}vw),-50%) scale(${s})`;
    el.style.opacity=op;el.style.zIndex=10-a;el.classList.toggle('on',a===0);el.style.pointerEvents=(+el.style.opacity>0)?'auto':'none'})}
function setInfo(){const [t,p,l,h]=data[cur];info.classList.add('out');
  setTimeout(()=>{info.querySelector('.c-num').textContent=`0${cur+1} / 05`;info.querySelector('.c-title').textContent=t;info.querySelector('.c-text').textContent=p;const a=info.querySelector('.c-link');a.textContent=l;a.href=h;a.target=h.startsWith('http')?'_blank':'';info.classList.remove('out')},SHOT?0:450)}
function go(d){cur=(cur+d+items.length)%items.length;layout();setInfo()}
document.querySelectorAll('.c-ctrl button').forEach(b=>b.onclick=()=>go(+b.dataset.dir));
items.forEach((el,i)=>el.onclick=()=>{if(i!==cur){cur=i;layout();setInfo()}});
let sx=0;document.querySelector('.c-stage').addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
document.querySelector('.c-stage').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)go(dx>0?1:-1)});
addEventListener('resize',layout);layout();
// nav + mobile cta
const nav=document.querySelector('.nav'),mb=document.querySelector('.m-book');
addEventListener('scroll',()=>{nav.classList.toggle('solid',scrollY>60);mb.classList.toggle('on',scrollY>innerHeight*.8)},{passive:true});
// motion
if(!SHOT&&!reduce&&window.gsap){
  gsap.registerPlugin(ScrollTrigger);
  const lenis=window.Lenis?new Lenis({lerp:.07}):null;
  if(lenis){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{duration:1.6})}}))}
  gsap.from('.hero-in>*',{y:40,opacity:0,duration:1.6,stagger:.14,ease:'power3.out',delay:.2});
  gsap.utils.toArray('h2,.lead,.traits,.acc,.btns,.hours,.sig-head .cap,.c-info,.map,.f-logo').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  gsap.utils.toArray('.dots b.f').forEach((b,i)=>gsap.from(b,{scale:0,duration:.6,ease:'back.out(2)',delay:(i%5)*.08,scrollTrigger:{trigger:'.traits',start:'top 80%'}}));
  gsap.to('.watermark',{xPercent:-8,ease:'none',scrollTrigger:{trigger:'.signature',scrub:1}});
  gsap.to('.par-y',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.house',scrub:1}});
  ScrollTrigger.matchMedia({'(min-width:861px)':()=>{
    const track=document.querySelector('.col-track');
    const dist=()=>track.scrollWidth-innerWidth;
    const tw=gsap.to(track,{x:()=>dist(),ease:'none',scrollTrigger:{trigger:'.collage',pin:'.col-pin',start:'top top',end:()=>'+='+dist(),scrub:1,invalidateOnRefresh:true}});
    gsap.utils.toArray('.m img').forEach((img,i)=>gsap.fromTo(img,{xPercent:i%2?6:-6},{xPercent:i%2?-6:6,ease:'none',scrollTrigger:{trigger:img.parentElement,containerAnimation:tw,start:'left right',end:'right left',scrub:true}}));
  }});
}
