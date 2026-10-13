// small 3D accent: a slowly turning 8-ball under a warm lamp
const canvas=document.getElementById('ball'),SHOT=location.search.includes('static');
try{
  const t=document.createElement('canvas');if(!(t.getContext('webgl2')||t.getContext('webgl')))throw 0;
  const THREE=await import('three');const {RoomEnvironment}=await import('three/addons/environments/RoomEnvironment.js');
  const R=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
  R.toneMapping=THREE.ACESFilmicToneMapping;R.outputColorSpace=THREE.SRGBColorSpace;
  const S=new THREE.Scene();const pm=new THREE.PMREMGenerator(R);S.environment=pm.fromScene(new RoomEnvironment(),.04).texture;S.environmentIntensity=.25;
  const cam=new THREE.PerspectiveCamera(30,1,.1,20);cam.position.set(0,0,4.2);
  const c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d');
  x.fillStyle='#0d0d0d';x.fillRect(0,0,1024,512);x.fillStyle='#efe9dc';x.beginPath();x.arc(256,256,70,0,7);x.fill();
  x.fillStyle='#0d0d0d';x.font='500 92px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText('8',256,262);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
  const ball=new THREE.Mesh(new THREE.SphereGeometry(1,96,64),new THREE.MeshPhysicalMaterial({map:tex,roughness:.12,clearcoat:1,clearcoatRoughness:.03}));
  ball.rotation.set(.3,.35,.12);S.add(ball);
  const key=new THREE.SpotLight(0xffd79a,30,10,.5,.6,1.5);key.position.set(1.4,3,2.5);S.add(key);
  const rim=new THREE.PointLight(0xd4af37,6,8);rim.position.set(-2.2,-.5,-1.5);S.add(rim);
  function size(){const w=canvas.clientWidth,h=canvas.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}size();addEventListener('resize',size);
  let vis=false;new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(canvas);
  let sy=0;addEventListener('scroll',()=>sy=scrollY,{passive:true});
  const clk=new THREE.Clock();let fr=0;
  (function loop(){if(SHOT&&++fr>4)return;requestAnimationFrame(loop);if(!vis&&!SHOT)return;const t=clk.getElapsedTime();
    ball.rotation.y=.35+Math.sin(t*.3)*.9+sy*.0015;ball.position.y=Math.sin(t*.8)*.04;R.render(S,cam)})();
}catch(e){canvas.remove()}
