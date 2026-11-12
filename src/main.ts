import { Engine, Scene, Vector3, Color3, HemisphericLight, DirectionalLight, MeshBuilder, StandardMaterial, FreeCamera, TransformNode, Mesh } from "@babylonjs/core";
import "./style.css";

const root = document.querySelector<HTMLDivElement>("#app")!;
root.innerHTML = `
<canvas id="game"></canvas>
<header><span>序幕　／　醒來</span><span>林敬偉　・　06:18 AM</span></header>
<div id="reticle"></div><div id="hint"></div>
<section id="intro"><small>MEMORY REBIRTH</small><h1>記憶重生</h1><p>雨聲從窗外傳來。</p><p>頭痛像有什麼東西，在腦袋深處緩慢敲擊。</p><p>你睜開眼睛，熟悉的臥室卻有一瞬間讓你感到陌生。</p><button id="begin">醒來</button><footer>WASD 移動・滑鼠看向・E 調查・Esc 暫停</footer></section>
<section id="dialog" class="off"><p id="words"></p><button id="close">知道了</button></section>
<section id="gearPanel" class="off"><div class="gearHead"><b>機械鐘｜內部機構</b><span>四枚獨立齒輪</span></div><p>選取齒輪並轉動，觀察其他齒輪的連動。</p><div class="gearButtons"><button data-gear="0">齒輪 I　↻</button><button data-gear="1">齒輪 II　↻</button><button data-gear="2">齒輪 III　↻</button><button data-gear="3">齒輪 IV　↻</button></div><small>目前為機關操作測試。正確解法尚未設定，不會提前判定解謎成功。</small><button id="gearClose">收起機關</button></section>
<nav id="touch"><div><button data-k="w">▲</button><div><button data-k="a">◀</button><button data-k="s">▼</button><button data-k="d">▶</button></div></div><button id="inspect">調查</button></nav>`;

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, adaptToDeviceRatio: true });
const scene = new Scene(engine);
scene.clearColor = new Color3(.055,.065,.075).toColor4(1);
scene.collisionsEnabled = true;
scene.gravity = new Vector3(0,-.35,0);
const camera = new FreeCamera("player",new Vector3(0,1.65,2.7),scene);
camera.setTarget(new Vector3(0,1.2,-1.5)); camera.attachControl(canvas,true);
camera.speed=.14; camera.angularSensibility=2300; camera.checkCollisions=true; camera.applyGravity=true;
camera.ellipsoid=new Vector3(.32,.78,.32);
camera.keysUp.push(87); camera.keysDown.push(83); camera.keysLeft.push(65); camera.keysRight.push(68);

const hemi=new HemisphericLight("ambient",new Vector3(0,1,0),scene);
hemi.intensity=.72; hemi.diffuse=new Color3(.82,.78,.7);
const sun=new DirectionalLight("window light",new Vector3(-.6,-1,.35),scene);
sun.position=new Vector3(3,5,-4); sun.intensity=1;
function mat(n:string,c:Color3,shine=10){const m=new StandardMaterial(n,scene);m.diffuseColor=c;m.specularColor=new Color3(.14,.12,.1);m.specularPower=shine;return m}
const plaster=mat("warm plaster",new Color3(.67,.62,.54));
const walnut=mat("walnut",new Color3(.24,.14,.085),22);
const oak=mat("oak",new Color3(.43,.29,.18),18);
const linen=mat("linen",new Color3(.78,.75,.68));
const duvet=mat("duvet",new Color3(.49,.48,.43));
const metal=mat("dark metal",new Color3(.07,.075,.07),45);
const brass=mat("aged brass",new Color3(.48,.32,.13),35);
const gearSteel=mat("clockwork steel",new Color3(.29,.30,.28),55);
const glass=mat("rain glass",new Color3(.16,.25,.3),60); glass.alpha=.48;
function block(n:string,p:Vector3,s:Vector3,m:StandardMaterial,collision=false){
 const o=MeshBuilder.CreateBox(n,{width:s.x,height:s.y,depth:s.z},scene);o.position=p;o.material=m;o.checkCollisions=collision;return o;
}
function cyl(n:string,p:Vector3,d:number,h:number,m:StandardMaterial){
 const o=MeshBuilder.CreateCylinder(n,{diameter:d,height:h,tessellation:48},scene);o.position=p;o.material=m;return o;
}

// 房間結構
block("floor",new Vector3(0,-.12,-1.5),new Vector3(8,.24,8),oak,true);
block("back wall",new Vector3(0,2.1,-5.5),new Vector3(8,4.2,.18),plaster,true);
block("left wall",new Vector3(-4,2.1,-1.5),new Vector3(.18,4.2,8),plaster,true);
block("right wall",new Vector3(4,2.1,-1.5),new Vector3(.18,4.2,8),plaster,true);
block("ceiling",new Vector3(0,4.2,-1.5),new Vector3(8,.18,8),plaster,true);
block("window frame",new Vector3(-1.85,2.45,-5.37),new Vector3(2.2,1.55,.12),walnut,true);
block("window glass",new Vector3(-1.85,2.45,-5.28),new Vector3(2,1.35,.035),glass);
block("window vertical",new Vector3(-1.85,2.45,-5.22),new Vector3(.045,1.35,.04),linen);
block("window horizontal",new Vector3(-1.85,2.45,-5.22),new Vector3(2,.045,.04),linen);

// 床與寢具
block("bed base",new Vector3(.65,.35,-3.15),new Vector3(2.65,.55,3.25),walnut,true);
block("mattress",new Vector3(.65,.72,-3.05),new Vector3(2.52,.28,3.08),linen,true);
block("duvet",new Vector3(.65,.89,-2.65),new Vector3(2.46,.12,2.15),duvet);
const pillow=block("pillow",new Vector3(0,.98,-4.22),new Vector3(.88,.2,.55),linen);
block("pillow other",new Vector3(1.25,.98,-4.22),new Vector3(.88,.2,.55),linen);
block("headboard",new Vector3(.65,1.15,-4.83),new Vector3(2.7,1.05,.16),walnut,true);

// 床頭櫃與可滑動抽屜
block("nightstand",new Vector3(2.5,.65,-4.1),new Vector3(1.05,1.3,.85),walnut,true);
block("nightstand top",new Vector3(2.5,1.34,-4.1),new Vector3(1.16,.09,.94),oak);
const drawer=block("drawer front",new Vector3(2.5,.91,-3.64),new Vector3(.88,.34,.055),oak);
const knob=cyl("drawer knob",new Vector3(2.5,.91,-3.57),.07,.06,metal);knob.rotation.x=Math.PI/2;
// 抽屜內盒：底板、左右側板與後板分開建模，拉開時整組同步移動
const drawerTray=[
 block("drawer inner base",new Vector3(2.5,.735,-3.94),new Vector3(.82,.055,.61),oak),
 block("drawer left side",new Vector3(2.08,.86,-3.94),new Vector3(.045,.25,.61),walnut),
 block("drawer right side",new Vector3(2.92,.86,-3.94),new Vector3(.045,.25,.61),walnut),
 block("drawer rear side",new Vector3(2.5,.86,-4.245),new Vector3(.82,.25,.045),walnut)
];
// 暗層實體先建立但保持隱藏；正式開啟條件須等齒輪謎題答案確認後再接上
const hiddenCompartment=[
 block("hidden compartment base",new Vector3(2.5,.665,-3.94),new Vector3(.72,.035,.48),oak),
 block("hidden compartment left",new Vector3(2.13,.70,-3.94),new Vector3(.035,.07,.48),walnut),
 block("hidden compartment right",new Vector3(2.87,.70,-3.94),new Vector3(.035,.07,.48),walnut),
 block("hidden compartment rear",new Vector3(2.5,.70,-4.18),new Vector3(.72,.07,.035),walnut)
];
hiddenCompartment.forEach(m=>m.setEnabled(false));

// 木製機械鐘：前面錶盤與可翻轉外殼
const clockRoot=new TransformNode("mechanical clock assembly",scene);
clockRoot.position=new Vector3(2.5,1.72,-4.08);
const clockBody=cyl("clock wooden case",Vector3.Zero(),.5,.22,walnut);clockBody.rotation.x=Math.PI/2;clockBody.parent=clockRoot;
const clockFace=cyl("clock dial",new Vector3(0,0,.119),.405,.012,linen);clockFace.rotation.x=Math.PI/2;clockFace.parent=clockRoot;
const clockRim=cyl("clock brass rim",new Vector3(0,0,.128),.435,.018,brass);clockRim.rotation.x=Math.PI/2;clockRim.parent=clockRoot;
const clockHub=cyl("clock hand hub",new Vector3(0,0,.146),.035,.018,metal);clockHub.rotation.x=Math.PI/2;clockHub.parent=clockRoot;
const handA=block("clock hand hour",new Vector3(0,.055,.15),new Vector3(.018,.13,.012),metal);
const handB=block("clock hand minute",new Vector3(.045,0,.15),new Vector3(.12,.018,.012),metal);
handA.parent=clockRoot;handB.parent=clockRoot;
for(let i=0;i<12;i++){
 const a=i*Math.PI/6;
 const tick=block("dial mark "+i,new Vector3(Math.sin(a)*.165,Math.cos(a)*.165,.15),new Vector3(.012,.035,.008),brass);
 tick.rotation.z=-a;tick.parent=clockRoot;
}
const backPlate=MeshBuilder.CreateCylinder("clock rear plate",{diameter:.43,height:.025,tessellation:48},scene);
backPlate.rotation.x=Math.PI/2;backPlate.position.z=-.125;backPlate.parent=clockRoot;backPlate.material=oak;
const rearCover=MeshBuilder.CreateCylinder("clock rear cover",{diameter:.35,height:.018,tessellation:48},scene);
rearCover.rotation.x=Math.PI/2;rearCover.position.z=-.15;rearCover.parent=clockRoot;rearCover.material=walnut;
const latch=cyl("rear latch",new Vector3(0,-.19,-.17),.045,.025,brass);latch.rotation.x=Math.PI/2;latch.parent=clockRoot;

// 四枚可獨立操作的齒輪；此階段只做連動沙盒，不預設正式解答
type Gear={node:TransformNode;meshes:Mesh[];angle:number};
const gears:Gear[]=[];
const gearPositions=[new Vector3(-.105,.105,-.18),new Vector3(.105,.105,-.18),new Vector3(-.105,-.105,-.18),new Vector3(.105,-.105,-.18)];
function createGear(index:number,pos:Vector3){
 const node=new TransformNode("gear "+(index+1),scene);node.parent=clockRoot;node.position=pos;
 const meshes:Mesh[]=[];
 const wheel=MeshBuilder.CreateCylinder("gear "+(index+1)+" wheel",{diameter:.19,height:.035,tessellation:24},scene);
 wheel.rotation.x=Math.PI/2;wheel.parent=node;wheel.material=gearSteel;meshes.push(wheel);
 const hub=MeshBuilder.CreateCylinder("gear "+(index+1)+" hub",{diameter:.055,height:.045,tessellation:24},scene);
 hub.rotation.x=Math.PI/2;hub.parent=node;hub.material=brass;meshes.push(hub);
 for(let t=0;t<10;t++){
  const a=t*Math.PI/5;
  const tooth=MeshBuilder.CreateBox("gear "+(index+1)+" tooth "+t,{width:.035,height:.028,depth:.035},scene);
  tooth.position=new Vector3(Math.sin(a)*.098,Math.cos(a)*.098,0);
  tooth.rotation.z=-a;tooth.parent=node;tooth.material=gearSteel;meshes.push(tooth);
 }
 for(let s=0;s<4;s++){
  const a=s*Math.PI/2;
  const spoke=MeshBuilder.CreateBox("gear "+(index+1)+" spoke "+s,{width:.012,height:.075,depth:.02},scene);
  spoke.position=new Vector3(Math.sin(a)*.035,Math.cos(a)*.035,0);
  spoke.rotation.z=-a;spoke.parent=node;spoke.material=brass;meshes.push(spoke);
 }
 gears.push({node,meshes,angle:0});
}
gearPositions.forEach((p,i)=>createGear(i,p));
const rug=mat("woven rug",new Color3(.36,.29,.23));
block("rug",new Vector3(-.8,.015,-1.35),new Vector3(3.2,.035,2.1),rug);
block("dresser",new Vector3(-2.9,.85,-4.4),new Vector3(1.25,1.7,.72),walnut,true);
for(let i=0;i<3;i++)block("dresser drawer "+i,new Vector3(-2.9,.48+i*.43,-4.01),new Vector3(1.08,.32,.045),oak);

let started=false,lifted=false,opened=false,clockTurned=false,rearOpen=false,compartmentUnlocked=false;
const intro=document.querySelector<HTMLElement>("#intro")!;
const dialog=document.querySelector<HTMLElement>("#dialog")!;
const words=document.querySelector<HTMLElement>("#words")!;
const hint=document.querySelector<HTMLElement>("#hint")!;
const gearPanel=document.querySelector<HTMLElement>("#gearPanel")!;
function say(s:string){words.textContent=s;dialog.classList.remove("off")}
document.querySelector("#close")!.addEventListener("click",()=>dialog.classList.add("off"));
function updateGearPanel(){gearPanel.classList.toggle("off",!rearOpen)}
function rotateGear(i:number){
 const g=gears[i]; if(!g)return;
 const delta=Math.PI/6;g.angle+=delta;g.node.rotation.z=g.angle;
 // 方形排列中，僅帶動實際相鄰的兩枚齒輪反向旋轉；不設定正式解謎答案
 const neighbors=[[1,2],[0,3],[0,3],[1,2]][i];
 for(const n of neighbors){gears[n].angle-=delta;gears[n].node.rotation.z=gears[n].angle;}
}
document.querySelectorAll<HTMLButtonElement>("[data-gear]").forEach(b=>{
 b.addEventListener("click",()=>{rotateGear(Number(b.dataset.gear));});
});
document.querySelector("#gearClose")!.addEventListener("click",()=>{rearOpen=false;clockRoot.rotation.y=0;rearCover.setEnabled(true);updateGearPanel();say("你把鐘重新放回床頭櫃。四枚齒輪的排列仍留在腦海裡。")});

const targets:{mesh:any;label:string;run:()=>void}[]=[
{mesh:pillow,label:"檢查枕頭",run:()=>{if(!lifted){pillow.position.y+=.42;pillow.rotation.z=-.16;lifted=true;say("你伸手掀起枕頭。床墊上只有一道被壓出的痕跡。\n\n槍不在這裡。\n\n……不可能。你明明一直把它放在這裡。")}else say("枕頭底下空空如也。那把槍不在這裡。")}},
{mesh:clockBody,label:"檢查／翻轉木製機械鐘",run:()=>{
 if(!clockTurned){clockTurned=true;clockRoot.rotation.y=Math.PI;rearOpen=false;say("你把木製機械鐘拿起來，翻到背面。\n\n後蓋上有一道細縫，中央的金屬扣環似乎可以扳開。");}
 else if(!rearOpen){rearOpen=true;rearCover.setEnabled(false);updateGearPanel();say("你扳開後蓋。四枚大小相近的齒輪露了出來，齒尖彼此咬合。\n\n它們不是固定的裝飾，可以逐一轉動。");}
 else {updateGearPanel();}
}},
{mesh:drawer,label:"打開床頭櫃抽屜",run:()=>{if(!opened){drawer.position.z-=.36;knob.position.z-=.36;drawerTray.forEach(m=>m.position.z-=.36);hiddenCompartment.forEach(m=>m.position.z-=.36);opened=true;say("你拉開床頭櫃抽屜。\n\n抽屜底部似乎比外觀看起來厚，裡面可能還藏著一層夾層。")}else say("抽屜已經拉開。底部的暗層仍然沒有打開。")}}
];
for(const g of gears){for(const m of g.meshes)targets.push({mesh:m,label:"操作齒輪",run:()=>{if(!rearOpen){say("先打開機械鐘後蓋。");return;}const i=gears.indexOf(g);rotateGear(i);}})}
let action:(()=>void)|null=null;
function scan(){
 
 const hit=scene.pickWithRay(camera.getForwardRay(2.8),m=>targets.some(t=>t.mesh===m&&(rearOpen?t.label==="操作齒輪":t.label!=="操作齒輪")));
 const t=hit?.hit?targets.find(x=>x.mesh===hit.pickedMesh&&(rearOpen?x.label==="操作齒輪":x.label!=="操作齒輪")):undefined;
 action=t?.run??null;hint.textContent=t?"E　"+t.label:"";hint.classList.toggle("show",!!t);
}
function interact(){
 if(!started)return;
 if(!dialog.classList.contains("off")){dialog.classList.add("off");return;}
 action?.();
}
scene.onBeforeRenderObservable.add(()=>{if(started&&dialog.classList.contains("off"))scan();else hint.classList.remove("show")});
window.addEventListener("keydown",e=>{
 if(e.code==="KeyE")interact();
 if(e.code==="Escape"&&started){if(rearOpen){rearOpen=false;clockRoot.rotation.y=0;rearCover.setEnabled(true);updateGearPanel();}else say("已暫停。按「知道了」繼續探索。")}
});
document.querySelector("#begin")!.addEventListener("click",()=>{
 started=true;intro.classList.add("off");if(matchMedia("(pointer:fine)").matches)canvas.requestPointerLock?.();
});
document.querySelector("#inspect")!.addEventListener("click",interact);
const keycodes:Record<string,number>={w:87,a:65,s:83,d:68};
document.querySelectorAll<HTMLButtonElement>("[data-k]").forEach(b=>{
 const key=b.dataset.k!;
 const code=keycodes[key]!;
 const list=key==="w"?camera.keysUp:key==="s"?camera.keysDown:key==="a"?camera.keysLeft:camera.keysRight;
 const down=()=>{if(!list.includes(code))list.push(code)};
 const up=()=>{const i=list.indexOf(code);if(i>=0)list.splice(i,1)};
 b.addEventListener("pointerdown",down);b.addEventListener("pointerup",up);b.addEventListener("pointerleave",up);b.addEventListener("pointercancel",up);
});
let tx=0,ty=0;
canvas.addEventListener("touchstart",e=>{if(e.touches.length){tx=e.touches[0].clientX;ty=e.touches[0].clientY}},{passive:true});
canvas.addEventListener("touchmove",e=>{
 if(e.touches.length&&started){const t=e.touches[0];camera.rotation.y+=(t.clientX-tx)*.004;camera.rotation.x=Math.max(-1.25,Math.min(1.25,camera.rotation.x+(t.clientY-ty)*.003));tx=t.clientX;ty=t.clientY;}
},{passive:true});
engine.runRenderLoop(()=>scene.render());
window.addEventListener("resize",()=>engine.resize());
