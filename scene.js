const canvas=document.getElementById('scene'),SHOT=location.search.includes('static');
const fail=()=>{document.documentElement.classList.add('no-webgl');canvas.remove()};
try{
  const t=document.createElement('canvas');if(!(t.getContext('webgl2')||t.getContext('webgl')))throw 0;
  const THREE=await import('three');const {RoomEnvironment}=await import('three/addons/environments/RoomEnvironment.js');
  const mob=innerWidth<820;
  const R=new THREE.WebGLRenderer({canvas,antialias:!mob,powerPreference:'high-performance'});
  R.setPixelRatio(Math.min(devicePixelRatio,mob?1.3:1.6));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
  R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.outputColorSpace=THREE.SRGBColorSpace;
  const S=new THREE.Scene();const pm=new THREE.PMREMGenerator(R);S.environment=pm.fromScene(new RoomEnvironment(),.04).texture;S.environmentIntensity=.12;S.background=new THREE.Color(0x131613);S.fog=new THREE.FogExp2(0x131613,.085);
  const cam=new THREE.PerspectiveCamera(mob?40:28,1,.1,60);
  // procedural felt texture (noise) for realism
  const fc=document.createElement('canvas');fc.width=fc.height=256;const g=fc.getContext('2d');const id=g.createImageData(256,256);
  for(let i=0;i<id.data.length;i+=4){const n=200+Math.random()*55;id.data[i]=id.data[i+1]=id.data[i+2]=n;id.data[i+3]=255}g.putImageData(id,0,0);
  const fT=new THREE.CanvasTexture(fc);fT.wrapS=fT.wrapT=THREE.RepeatWrapping;fT.repeat.set(10,6);
  const W=6.4,D=3.4,r=.115,Y=.1;
  const felt=new THREE.Mesh(new THREE.BoxGeometry(W,.2,D),new THREE.MeshStandardMaterial({color:0x1d4a2e,roughness:1,map:fT,bumpMap:fT,bumpScale:.4}));felt.receiveShadow=true;S.add(felt);
  const wood=new THREE.MeshPhysicalMaterial({color:0x140b07,roughness:.32,clearcoat:.8,clearcoatRoughness:.25});
  const rail=(w,d,x,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,.26,d),wood);m.position.set(x,.13,z);m.receiveShadow=m.castShadow=true;S.add(m)};
  rail(W+.6,.3,0,D/2+.15);rail(W+.6,.3,0,-D/2-.15);rail(.3,D,W/2+.15,0);rail(.3,D,-W/2-.15,0);
  const cm=new THREE.MeshStandardMaterial({color:0x173b25,roughness:1});
  [[W,.07,0,D/2-.035],[W,.07,0,-D/2+.035]].forEach(([w,d,x,z])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,.1,d),cm);m.position.set(x,.14,z);S.add(m)});
  const body=new THREE.Mesh(new THREE.BoxGeometry(W+.6,1.2,D+.6),wood);body.position.y=-.72;S.add(body);
  const pk=new THREE.MeshBasicMaterial({color:0});
  [-1,0,1].forEach(a=>[-1,1].forEach(b=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.01,20),pk);p.position.set(a*(W/2-.04),.105,b*(D/2-.04));S.add(p)}));
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:0x101310,roughness:.5,metalness:.2}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.32;floor.receiveShadow=true;S.add(floor);
  // muted, realistic ball palette
  const pal=['#c9a227','#1e3a7a','#9e1b25','#3e2560','#c2621e','#1f5434','#5a1a14','#0e0e0e'];
  function tex(n){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d'),col=pal[(n-1)%8];
    x.fillStyle=n>8?'#e9e2d2':col;x.fillRect(0,0,512,256);if(n>8){x.fillStyle=col;x.fillRect(0,70,512,116)}
    x.fillStyle='#e9e2d2';x.beginPath();x.arc(128,128,34,0,7);x.fill();x.fillStyle='#111';x.font='600 38px Helvetica,Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(n,128,130);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}
  const geo=new THREE.SphereGeometry(r,mob?32:56,mob?20:40),balls=[];
  // a mid-game layout: a loose cluster + a few strays
  const spots=[[-1.55,.0],[-1.75,.12],[-1.75,-.12],[-1.95,.24],[-1.95,0.01],[-2.15,-.1],[-.4,.9],[.7,-.6],[1.6,.35],[-2.4,1.1],[.15,.15],[2.3,-1.2],[-1.0,-1.1],[-2.0,-.7],[.9,1.2]];
  spots.forEach(([x,z],i)=>{const m=new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({map:tex(i+1),roughness:.18,clearcoat:1,clearcoatRoughness:.04}));
    m.position.set(x,Y+r,z);m.rotation.set(Math.random()*6,Math.random()*6,Math.random()*6);m.castShadow=true;S.add(m);balls.push(m)});
  const cue=new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({color:0xefe9dc,roughness:.15,clearcoat:1}));cue.position.set(.55,Y+r,.05);cue.castShadow=true;S.add(cue);
  const stick=new THREE.Group(),sm=new THREE.Mesh(new THREE.CylinderGeometry(.012,.032,3.6,24),new THREE.MeshPhysicalMaterial({color:0xb08a5a,roughness:.35,clearcoat:.6}));
  sm.rotation.z=Math.PI/2;sm.position.x=1.95;stick.add(sm);const tip=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.03,12),new THREE.MeshStandardMaterial({color:0x2a4a6a}));tip.rotation.z=Math.PI/2;tip.position.x=.14;stick.add(tip);
  stick.position.set(.55,Y+r+.05,.05);stick.rotation.set(0,.32,-.07);sm.castShadow=true;S.add(stick);
  // single lamp
  const lamp=new THREE.SpotLight(0xffd9a0,62,10,.55,.75,1.6);lamp.position.set(-.6,3.1,0);lamp.target.position.set(-.6,0,0);lamp.castShadow=true;lamp.shadow.mapSize.set(mob?512:1536,mob?512:1536);lamp.shadow.bias=-.0004;lamp.shadow.radius=4;S.add(lamp,lamp.target);
  const shade=new THREE.Mesh(new THREE.CylinderGeometry(.18,.62,.36,48,1,true),new THREE.MeshStandardMaterial({color:0x8a6d22,metalness:.95,roughness:.3,side:THREE.DoubleSide}));shade.position.set(-.6,3.25,0);S.add(shade);
  const glow=new THREE.Mesh(new THREE.CircleGeometry(.6,48),new THREE.MeshBasicMaterial({color:0xffe6cc}));glow.rotation.x=Math.PI/2;glow.position.set(-.6,3.08,0);S.add(glow);
  const cord=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,4),new THREE.MeshBasicMaterial({color:0x151515}));cord.position.set(-.6,5.4,0);S.add(cord);
  const vol=new THREE.Mesh(new THREE.ConeGeometry(2.1,3.1,64,1,true),new THREE.MeshBasicMaterial({color:0xffcfa8,transparent:true,opacity:.035,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));vol.position.set(-.6,1.55,0);S.add(vol);
  S.add(new THREE.HemisphereLight(0x1a261c,0x050605,.35));
  const back=new THREE.PointLight(0xd4af37,2.2,9);back.position.set(4,1,-3);S.add(back);
  let mx=0,my=0,tx=0,ty=0,sc=0;
  addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
  addEventListener('scroll',()=>{sc=Math.min(1,scrollY/innerHeight)},{passive:true});
  function size(){const w=canvas.clientWidth,h=canvas.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}addEventListener('resize',size);size();
  let vis=true;new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(canvas);
  const clk=new THREE.Clock();let frames=0;
  function loop(){requestAnimationFrame(loop);if(!vis)return;const t=SHOT?6:clk.getElapsedTime();
    mx+=(tx-mx)*.03;my+=(ty-my)*.03;
    const a=-.55+Math.sin(t*.05)*.18+mx*.18,rad=mob?6.6:7.6,h=(mob?5.4:3.0)+my*.4+sc*1.8;
    cam.position.set(Math.sin(a)*rad-.6,h,Math.cos(a)*rad);cam.lookAt(-.7,mob?-1.25:-.05,0);
    lamp.intensity=60+Math.sin(t*1.3)*.8;stick.position.x=.55+.06+Math.sin(t*1.1)*.05;const rb=balls[6];rb.position.x=-.4+Math.sin(t*.25)*.35;rb.rotation.z=-rb.position.x/r;
    R.render(S,cam);if(SHOT&&++frames>3)loop=()=>{};}
  loop();
}catch(e){console.warn(e);fail()}
