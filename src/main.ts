import {Engine,Scene,Vector3,Color3,HemisphericLight,DirectionalLight,MeshBuilder,StandardMaterial,FreeCamera} from "@babylonjs/core";
import "./style.css";
const root=document.querySelector<HTMLDivElement>("#app")!;
root.innerHTML=`<canvas id="game"></canvas><header><span>序幕　／　醒來</span><span>林敬偉　・　06:18 AM</span></header><div id="reticle"></div><div id="hint"></div><section id="intro"><small>MEMORY REBIRTH</small><h1>記憶重生</h1><p>雨聲從窗外傳來。</p><p>頭痛像有什麼東西，在腦袋深處緩慢敲擊。</p><p>你睜開眼睛，熟悉的臥室卻有一瞬間讓你感到陌生。</p><button id="begin">醒來</button><footer>WASD 移動・滑鼠看向・E 調查・Esc 暫停</footer></section><section id="dialog" class="off"><p id="words"></p><button id="close">知道了</button></section><nav id="touch"><div><button data-k="w">▲</button><div><button data-k="a">◀</button><button data-k="s">▼</button><button data-k="d">▶</button></div></div><button id="inspect">調查</button></nav>`;
const canvas=document.querySelector<HTMLCanvasElement>("#game")!,engine=new Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true,adaptToDeviceRatio:true}),scene=new Scene(engine);
scene.clearColor=new Color3(.055,.065,.075).toColor4(1);scene.collisionsEnabled=true;scene.gravity=new Vector3(0,-.35,0);
const camera=new FreeCamera("player",new Vector3(0,1.65,2.7),scene);camera.setTarget(new Vector3(0,1.2,-1.5));camera.attachControl(canvas,true);camera.speed=.14;camera.angularSensibility=2300;camera.checkCollisions=true;camera.applyGravity=true;camera.ellipsoid=new Vector3(.32,.78,.32);camera.keysUp.push(87);camera.keysDown.push(83);camera.keysLeft.push(65);camera.keysRight.push(68);
const hemi=new HemisphericLight("ambient",new Vector3(0,1,0),scene);hemi.intensity=.72;hemi.diffuse=new Color3(.82,.78,.7);
const sun=new DirectionalLight("window light",new Vector3(-.6,-1,.35),scene);sun.position=new Vector3(3,5,-4);sun.intensity=1;
function mat(n:string,c:Color3,shine=10){const m=new StandardMaterial(n,scene);m.diffuseColor=c;m.specularColor=new Color3(.14,.12,.1);m.specularPower=shine;return m}
const plaster=mat("warm plaster",new Color3(.67,.62,.54)),walnut=mat("walnut",new Color3(.24,.14,.085),22),oak=mat("oak",new Color3(.43,.29,.18),18),linen=mat("linen",new Color3(.78,.75,.68)),duvet=mat("duvet",new Color3(.49,.48,.43)),metal=mat("dark metal",new Color3(.07,.075,.07),45),glass=mat("rain glass",new Color3(.16,.25,.3),60);glass.alpha=.48;
function block(n:string,p:Vector3,s:Vector3,m:StandardMaterial,collision=false){const o=MeshBuilder.CreateBox(n,{width:s.x,height:s.y,depth:s.z},scene);o.position=p;o.material=m;o.checkCollisions=collision;return o}
function cyl(n:string,p:Vector3,d:number,h:number,m:StandardMaterial){const o=MeshBuilder.CreateCylinder(n,{diameter:d,height:h,tessellation:48},scene);o.position=p;o.material=m;return o}
// Room shell and window
block("floor",new Vector3(0,-.12,-1.5),new Vector3(8,.24,8),oak,true);block("back wall",new Vector3(0,2.1,-5.5),new Vector3(8,4.2,.18),plaster,true);block("left wall",new Vector3(-4,2.1,-1.5),new Vector3(.18,4.2,8),plaster,true);block("right wall",new Vector3(4,2.1,-1.5),new Vector3(.18,4.2,8),plaster,true);block("ceiling",new Vector3(0,4.2,-1.5),new Vector3(8,.18,8),plaster,true);
block("window frame",new Vector3(-1.85,2.45,-5.37),new Vector3(2.2,1.55,.12),walnut,true);block("window glass",new Vector3(-1.85,2.45,-5.28),new Vector3(2,1.35,.035),glass);block("window vertical",new Vector3(-1.85,2.45,-5.22),new Vector3(.045,1.35,.04),linen);block("window horizontal",new Vector3(-1.85,2.45,-5.22),new Vector3(2,.045,.04),linen);
// Bed assembly
block("bed base",new Vector3(.65,.35,-3.15),new Vector3(2.65,.55,3.25),walnut,true);block("mattress",new Vector3(.65,.72,-3.05),new Vector3(2.52,.28,3.08),linen,true);block("duvet",new Vector3(.65,.89,-2.65),new Vector3(2.46,.12,2.15),duvet);const pillow=block("pillow",new Vector3(0,.98,-4.22),new Vector3(.88,.2,.55),linen);block("pillow other",new Vector3(1.25,.98,-4.22),new Vector3(.88,.2,.55),linen);block("headboard",new Vector3(.65,1.15,-4.83),new Vector3(2.7,1.05,.16),walnut,true);
// Nightstand, movable drawer, mechanical clock
block("nightstand",new Vector3(2.5,.65,-4.1),new Vector3(1.05,1.3,.85),walnut,true);block("nightstand top",new Vector3(2.5,1.34,-4.1),new Vector3(1.16,.09,.94),oak);
const drawer=block("drawer",new Vector3(2.5,.91,-3.64),new Vector3(.88,.34,.055),oak);const knob=cyl("drawer knob",new Vector3(2.5,.91,-3.57),.07,.06,metal);knob.rotation.x=Math.PI/2;
const clock=cyl("mechanical clock",new Vector3(2.5,1.72,-4.08),.48,.2,walnut);clock.rotation.x=Math.PI/2;const face=cyl("clock face",new Vector3(2.5,1.72,-3.97),.4,.012,linen);face.rotation.x=Math.PI/2;const center=cyl("clock center",new Vector3(2.5,1.72,-3.94),.035,.018,metal);center.rotation.x=Math.PI/2;
block("rug",new Vector3(-.8,.015,-1.35),new Vector3(3.2,.035,2.1),mat("woven rug",new Color3(.36,.29,.23)));block("dresser",new Vector3(-2.9,.85,-4.4),new Vector3(1.25,1.7,.72),walnut,true);for(let i=0;i<3;i++)block("dresser drawer "+i,new Vector3(-2.9,.48+i*.43,-4.01),new Vector3(1.08,.32,.045),oak);
let started=false,lifted=false,opened=false;const intro=document.querySelector<HTMLElement>("#intro")!,dialog=document.querySelector<HTMLElement>("#dialog")!,words=document.querySelector<HTMLElement>("#words")!,hint=document.querySelector<HTMLElement>("#hint")!;
function say(s:string){words.textContent=s;dialog.classList.remove("off")}document.querySelector("#close")!.addEventListener("click",()=>dialog.classList.add("off"));
const targets:{mesh:any;label:string;run:()=>void}[]=[
{mesh:pillow,label:"檢查枕頭",run:()=>{if(!lifted){pillow.position.y+=.42;pillow.rotation.z=-.16;lifted=true;say("你伸手掀起枕頭。床墊上只有一道被壓出的痕跡。\n\n槍不在這裡。\n\n……不可能。你明明一直把它放在這裡。")}else say("枕頭底下空空如也。那把槍不在這裡。")}},
{mesh:clock,label:"檢查木製機械鐘",run:()=>say("這是一座外觀普通的木製機械鐘。邊角有些磨損，背面似乎有可以拆開的接縫。\n\n錶盤下方刻著一組日期：0518。\n\n四枚齒輪的機關，也許藏在鐘的內部。")},
{mesh:drawer,label:"打開床頭櫃抽屜",run:()=>{if(!opened){drawer.position.z-=.36;opened=true;say("抽屜滑開，裡面只有幾張收據、一支沒水的原子筆，還有一張折起來的便利貼。\n\n「敬偉，頭痛記得吃藥！不要在那邊硬撐！」")}else say("抽屜已經打開。")}}
];
let action:(()=>void)|null=null;
function scan(){const hit=scene.pickWithRay(camera.getForwardRay(2.8),m=>targets.some(t=>t.mesh===m));const t=hit?.hit?targets.find(x=>x.mesh===hit.pickedMesh):undefined;action=t?.run??null;hint.textContent=t?"E　"+t.label:"";hint.classList.toggle("show",!!t)}
function interact(){if(!started)return;if(!dialog.classList.contains("off")){dialog.classList.add("off");return}action?.()}
scene.onBeforeRenderObservable.add(()=>{if(started&&dialog.classList.contains("off"))scan();else hint.classList.remove("show")});
window.addEventListener("keydown",e=>{if(e.code==="KeyE")interact();if(e.code==="Escape"&&started)say("已暫停。按「知道了」繼續探索。")});
document.querySelector("#begin")!.addEventListener("click",()=>{started=true;intro.classList.add("off");if(matchMedia("(pointer:fine)").matches)canvas.requestPointerLock?.()});
document.querySelector("#inspect")!.addEventListener("click",interact);
const keycodes:Record<string,number>={w:87,a:65,s:83,d:68};document.querySelectorAll<HTMLButtonElement>("[data-k]").forEach(b=>{const code=keycodes[b.dataset.k!]!;const down=()=>{if(!camera.keysUp.includes(code))camera.keysUp.push(code)};const up=()=>camera.keysUp=camera.keysUp.filter(k=>k!==code);b.addEventListener("pointerdown",down);b.addEventListener("pointerup",up);b.addEventListener("pointerleave",up);b.addEventListener("pointercancel",up)});
let tx=0,ty=0;canvas.addEventListener("touchstart",e=>{if(e.touches.length){tx=e.touches[0].clientX;ty=e.touches[0].clientY}},{passive:true});canvas.addEventListener("touchmove",e=>{if(e.touches.length&&started){const t=e.touches[0];camera.rotation.y+=(t.clientX-tx)*.004;camera.rotation.x=Math.max(-1.25,Math.min(1.25,camera.rotation.x+(t.clientY-ty)*.003));tx=t.clientX;ty=t.clientY}},{passive:true});
engine.runRenderLoop(()=>scene.render());window.addEventListener("resize",()=>engine.resize());
