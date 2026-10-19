import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

const host = document.querySelector('#scene');
let renderer;
try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
catch (error) { document.querySelector('#error').hidden = false; throw error; }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
host.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 8; controls.maxDistance = 24;
controls.maxPolarAngle = Math.PI / 2.07;
controls.target.set(0, 1.4, 0);
function resetCamera() { camera.position.set(11, 9, 13); controls.target.set(0, 1.4, 0); controls.update(); }
resetCamera();
const model = new THREE.Group(); scene.add(model);
const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .8, ...extra });
const cream = mat('#f2e7c9'), green = mat('#345e4d'), wood = mat('#b88551'), dark = mat('#354a43'), orange = mat('#d57545'), white = mat('#fff2d3');
function box(w,h,d,x,y,z,material,parent=model) { const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material); m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m; }
function cylinder(r,h,x,y,z,material,r2=r,parent=model) {const m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r,h,16),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function textTexture(text,bg,fg,width=1024,height=256) { const c=document.createElement('canvas');c.width=width;c.height=height;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`700 ${height*.55}px "Noto Sans SC",sans-serif`;ctx.fillText(text,width/2,height/2,width*.92);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t; }
function sign(text,bg,fg,w,h,x,y,z) {const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:textTexture(text,bg,fg),roughness:.7}));m.position.set(x,y,z);model.add(m);return m;}
// Floating rounded street plinth and individual paving stones.
const base = new THREE.Mesh(new THREE.CylinderGeometry(4.65,4.45,.45,8),mat('#b6b4a0'));base.position.y=-.28;base.rotation.y=Math.PI/8;base.receiveShadow=true;model.add(base);
box(7.6,.15,6.7,0,-.02,0,mat('#d3cbb8'));
for(let i=0;i<15;i++)for(let j=0;j<3;j++)box(.48,.05,.52,-3.5+i*.5,.09,1.95+j*.55,mat((i+j)%3===0?'#bcbfad':'#c7cbb9'));
box(7.7,.17,.22,0,.08,3.13,mat('#e0ddc8'));
// Cutaway building: rear and left walls reveal all the interior.
box(5.45,.18,3.7,0,.2,-.65,wood);
for(let i=0;i<17;i++)box(.29,.025,3.5,-2.52+i*.315,.303,-.65,mat(i%3===0?'#c89e69':'#d0ab78'));
box(5.5,3.5,.15,0,2,-2.45,cream);
box(.15,3.5,3.75,-2.7,2,-.65,cream);
box(5.45,.65,.18,0,.65,-2.34,green);
box(.18,.65,3.6,-2.6,.65,-.65,green);
// Exposed ceiling beams and scalloped striped canvas awning.
for(const x of [-2.65,2.65]){box(.15,3.6,.17,x,2,1.14,green);box(.2,.22,3.8,x,3.7,-.65,green);}
box(5.65,.2,.25,0,3.7,1.14,green);
box(5.65,.7,.22,0,4.02,1.13,green);
sign('转 角 小 卖 部','#345e4d','#fff0c9',4.5,.52,0,4.03,1.251);
sign('日 用 百 货  ·  冰 凉 饮 品','#e9dfbd','#41624d',2.7,.16,0,3.57,1.29);
for(let i=0;i<14;i++){const stripe=box(.395,.09,1.05,-2.56+i*.394,3.35,1.58,i%2?cream:orange);stripe.rotation.x=.15;box(.395,.24,.08,-2.56+i*.394,3.2,2.08,i%2?cream:orange);const scallop=cylinder(.197,.07,-2.56+i*.394,3.08,2.08,i%2?cream:orange);scallop.rotation.x=Math.PI/2;scallop.scale.z=.5;}
// Back shelves, stocked with colorful tins, cartons, jars, and snacks.
box(3.15,2.45,.13,-.7,1.72,-2.2,wood);
for(let level=0;level<4;level++) {const y=.58+level*.63;box(3.2,.09,.5,-.7,y,-1.96,wood);for(let i=0;i<11;i++){const palette=['#c26a4b','#dbc267','#729477','#e8d3aa','#7396a2'];const col=palette[(i+level*2)%palette.length];const x=-2.07+i*.272;if(level%2===0){box(.18,.34,.21,x,y+.22,-1.93,mat(col));box(.16,.1,.015,x,y+.23,-1.812,white);}else{cylinder(.085,.3,x,y+.195,-1.94,mat(col));cylinder(.088,.025,x,y+.35,-1.94,cream);}}}
sign('好 物 在 架','#f2e7c9','#58745b',1.4,.22,-.7,3.21,-2.345);
// Refrigerator with framed glass door and illuminated rows of bottles.
box(1.05,2.75,.85,1.8,1.67,-1.87,white);
box(.88,2.32,.06,1.8,1.7,-1.407,mat('#a6c5bd'));
const fridgeGlow = mat('#c9eadc',{emissive:'#b6e6d4',emissiveIntensity:.35});
box(.8,2.12,.03,1.8,1.65,-1.36,fridgeGlow);
for(let row=0;row<4;row++){const y=.63+row*.52;box(.82,.035,.44,1.8,y,-1.23,white);for(let i=0;i<4;i++){const x=1.51+i*.19;const col=['#e9ac46','#77ad77','#b77a49','#dc7870'][i];cylinder(.055,.25,x,y+.15,-1.21,mat(col));cylinder(.027,.08,x,y+.31,-1.21,green);box(.08,.09,.012,x,y+.16,-1.148,cream);}}
const glass = mat('#d7f2ed',{transparent:true,opacity:.16,roughness:.12,metalness:.15});
box(.84,2.2,.02,1.8,1.67,-1.04,glass);
for(const x of [1.34,2.26])box(.045,2.3,.07,x,1.67,-1.02,green);
box(.045,.38,.07,2.13,1.6,-.96,dark);
sign('冷 藏 · FRESH','#345e4d','#f9efd3',.94,.2,1.8,2.94,-1.425);
// Checkout counter, register and paper shopping bag.
box(2.5,.95,.7,-.48,.8,.6,green);box(2.65,.13,.84,-.48,1.33,.6,wood);
for(let i=0;i<12;i++)box(.025,.76,.025,-1.58+i*.2,.8,.966,mat('#6f8a67'));
sign('欢迎光临','#345e4d','#e9ddba',1.15,.24,-.48,.9,.989);
box(.46,.12,.35,-.93,1.45,.52,dark);const register=box(.38,.28,.08,-.93,1.62,.55,dark);register.rotation.x=-.25;
box(.29,.18,.014,-.93,1.63,.603,mat('#9fc1a0',{emissive:'#9fc1a0',emissiveIntensity:.2}));
box(.3,.4,.23,.35,1.6,.56,mat('#dbbb83'));
// Outdoor produce stand.
box(1.16,.65,.67,-2.05,.62,1.6,wood);
for(let k=0;k<3;k++){box(.34,.13,.58,-2.43+k*.38,1,1.6,mat('#836445'));for(let j=0;j<6;j++){const fruit=new THREE.Mesh(new THREE.SphereGeometry(.095,12,10),mat(['#eaa14b','#a3b75b','#d77b4e'][k]));fruit.position.set(-2.53+k*.38+(j%2)*.18,1.12,1.43+Math.floor(j/2)*.16);fruit.castShadow=true;model.add(fruit);}}
// Side bench, freestanding chalkboard and street details.
for(let i=0;i<3;i++)box(1.1,.07,.13,2.1,.6,1.4+i*.16,wood);
for(const x of [1.66,2.54])for(const z of [1.42,1.8])box(.06,.5,.06,x,.32,z,green);
box(1.1,.28,.06,2.1,.91,1.38,wood);
const board=box(.66,.87,.08,.68,.66,2.03,wood);board.rotation.x=-.12;
const chalk=sign('今日好物','#304d43','#f5e5b9',.55,.24,.68,.88,2.13);chalk.rotation.x=-.12;
sign('汽水 ¥3','#304d43','#f5e5b9',.55,.23,.68,.61,2.16);
box(.66,.14,.02,.68,.4,2.2,green);
for(const x of [.4,.95])box(.06,.4,.06,x,.26,2.06,wood);
function plant(x,z,size=1){cylinder(.22*size,.38*size,x,.29*size,z,mat('#b67952'),.29*size);cylinder(.3*size,.06,x,.5*size,z,mat('#c69268'));for(let i=0;i<7;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.22*size,10,8),mat(i%2?'#698653':'#527547'));leaf.scale.set(.55,1.9,.55);leaf.position.set(x+Math.cos(i*2.4)*.15*size,.8*size,z+Math.sin(i*2.4)*.15*size);leaf.rotation.z=Math.cos(i*2.4)*.55;model.add(leaf);}}
plant(-3.1,1.4,1.1);plant(2.9,1.9,.8);
// Street lamp and warm interior pendants.
cylinder(.07,4.4,3.15,2.2,-.2,dark);cylinder(.19,.16,3.15,.15,-.2,dark);
box(.65,.07,.07,2.87,4.4,-.2,dark);
const bulbMat=mat('#fff1c4',{emissive:'#ffcf7e',emissiveIntensity:1});
cylinder(.28,.12,2.59,4.31,-.2,green,.13);cylinder(.19,.06,2.59,4.23,-.2,bulbMat);
const lamps=[];
for(const x of [-1.5,.7]){cylinder(.018,.4,x,3.45,-.5,dark);cylinder(.32,.18,x,3.16,-.5,green,.12);cylinder(.23,.035,x,3.06,-.5,bulbMat);const l=new THREE.PointLight('#ffcb83',12,6,2);l.position.set(x,2.9,-.5);scene.add(l);lamps.push(l);}
const streetLight=new THREE.PointLight('#ffd19a',0,8,2);streetLight.position.set(2.59,4,-.2);scene.add(streetLight);
// Soft studio floor catches the miniature's shadow.
const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.16}));floor.rotation.x=-Math.PI/2;floor.position.y=-.53;floor.receiveShadow=true;scene.add(floor);
const ambient=new THREE.HemisphereLight('#f7f2dd','#7e897a',2.8);scene.add(ambient);
const sun=new THREE.DirectionalLight('#fff0d0',4.5);sun.position.set(-3,9,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-7;sun.shadow.normalBias=.04;scene.add(sun);
const fill=new THREE.DirectionalLight('#c2d8ec',1);fill.position.set(5,5,-4);scene.add(fill);
// Real moving rain streaks, updated without allocating objects each frame.
const count=1700, positions=new Float32Array(count*6), speeds=new Float32Array(count);
for(let i=0;i<count;i++){const k=i*6;positions[k]=(Math.random()-.5)*15;positions[k+1]=Math.random()*12;positions[k+2]=(Math.random()-.5)*12;positions[k+3]=positions[k]-.035;positions[k+4]=positions[k+1]+.2;positions[k+5]=positions[k+2];speeds[i]=5+Math.random()*4;}
const rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));const rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:'#94aeb2',transparent:true,opacity:.5,depthWrite:false}));rain.visible=false;scene.add(rain);
let isNight=false, nightBlend=0;
function setNight(value){isNight=value;document.body.classList.toggle('night',value);for(const [id,active] of [['day',!value],['night',value]]){const el=document.getElementById(id);el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));}document.getElementById('time-label').textContent=value?'入夜 20:00':'午后 14:00';}
document.getElementById('day').onclick=()=>setNight(false);
document.getElementById('night').onclick=()=>setNight(true);
document.getElementById('rain').onclick=()=>{rain.visible=!rain.visible;document.getElementById('rain').setAttribute('aria-checked',String(rain.visible));};
document.getElementById('reset').onclick=resetCamera;
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w<600?65:36;camera.updateProjectionMatrix(); // Shift composition away from the editorial column.
camera.setViewOffset(w,h,w<600?-w*.03:-w*.055,w<600?-h*.035:0,w,h);}
window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.05);nightBlend=THREE.MathUtils.damp(nightBlend,isNight?1:0,4,dt);ambient.intensity=2.8-nightBlend*2.3;sun.intensity=4.5-nightBlend*4.3;fill.intensity=1-nightBlend*.5;sun.color.set(isNight?'#93b9e6':'#fff0d0');streetLight.intensity=nightBlend*22;bulbMat.emissiveIntensity=.8+nightBlend*2;lamps.forEach(l=>l.intensity=5+nightBlend*14);renderer.toneMappingExposure=1-nightBlend*.15;if(rain.visible){for(let i=0;i<count;i++){const k=i*6;positions[k+1]-=speeds[i]*dt;positions[k]-=dt*.6;if(positions[k+1]<-.4){positions[k+1]=10+Math.random()*2;positions[k]=(Math.random()-.5)*15;}positions[k+3]=positions[k]-.035;positions[k+4]=positions[k+1]+.2;}rainGeo.attributes.position.needsUpdate=true;}controls.update();renderer.render(scene,camera);});
