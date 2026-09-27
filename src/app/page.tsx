"use client";
import {AnimatePresence,motion} from "framer-motion";
import {useEffect,useRef,useState} from "react";
import {welcomeScene} from "./assets/welcome";
import {shuffleScene} from "./assets/shuffle";
type Phase="intro"|"focus"|"shuffle"|"cut"|"deal"|"choose"|"pickup"|"flip"|"reveal";
const meanings=["Claridad · vitalidad · nuevos comienzos.","Intuición · misterio · mirar más allá de lo evidente.","Equilibrio · responsabilidad · observar los hechos.","Pausa · introspección · escuchar tu propia respuesta.","Esperanza · apertura · recuperar perspectiva."];
export default function Home(){
 const [phase,setPhase]=useState<Phase>("intro"); const [picked,setPicked]=useState(0); const [question,setQuestion]=useState(""); const timers=useRef<number[]>([]);
 const buzz=(p:number|number[]=12)=>{if(typeof navigator!=="undefined"&&"vibrate" in navigator) navigator.vibrate(p)};
 const later=(fn:()=>void,ms:number)=>{const id=window.setTimeout(fn,ms);timers.current.push(id)};
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 const goShuffle=()=>{buzz(18);setPhase("shuffle");later(()=>setPhase("cut"),2600);later(()=>setPhase("deal"),3900);later(()=>setPhase("choose"),5400)};
 const choose=(i:number)=>{setPicked(i);buzz([15,30,15]);setPhase("pickup");later(()=>setPhase("flip"),1200);later(()=>setPhase("reveal"),2400)};
 const bg=phase==="intro"||phase==="focus"?welcomeScene:shuffleScene;
 return <main className={"cinema phase-"+phase}>
  <motion.div className="photo" key={bg} style={{backgroundImage:`url("${bg}")`}} initial={{scale:1.035,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:.8}}/>
  <div className="shade"/>
  <header className="topbar"><button onClick={()=>setPhase("intro")}>‹</button><span>{phase==="intro"?"LUSORA":"TAROT EGIPCIO"}</span><b>☰</b></header>
  <AnimatePresence mode="wait">
   {phase==="intro"&&<motion.section className="heroOverlay" key="i" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
    <div><h1>Bienvenido a<br/>Lusora</h1><p>Tarot, oráculos, astrología y más.<br/>Una guía para tu camino.</p><button className="goldBtn" onClick={()=>setPhase("focus")}>Comenzar mi lectura →</button></div>
   </motion.section>}
   {phase==="focus"&&<motion.section className="questionOverlay" key="f" initial={{opacity:0}} animate={{opacity:1}}>
    <div className="progress"><i/><i/><i/></div><h2>Una pregunta.<br/>Una guía.</h2><p>Tomate un momento para conectar con tu energía. Pensá en tu pregunta y cuando estés listo, continuá.</p>
    <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Escribe tu pregunta (opcional)"/><button className="goldBtn" onClick={goShuffle}>Continuar →</button>
   </motion.section>}
   {(phase==="shuffle"||phase==="cut"||phase==="deal")&&<motion.section className="shuffleOverlay" key="s" initial={{opacity:0}} animate={{opacity:1}}>
    <div className="progress"><i className="on"/><i/><i/></div><h2>{phase==="shuffle"?"Barajando las cartas":phase==="cut"?"Cortando el mazo":"Extendiendo el mazo"}</h2><p>{phase==="shuffle"?"Dejá que el mazo encuentre su ritmo.":phase==="cut"?"Un último corte antes de elegir.":"Las cartas toman su lugar sobre la mesa."}</p><div className={"ritualDeck "+phase}>{Array.from({length:7}).map((_,i)=><motion.i key={i} custom={i} animate={phase==="shuffle"?{x:[0,(i%2?1:-1)*(34+i*4),0],y:[0,-i*5,0],rotate:[0,(i-3)*2,0]}:phase==="cut"?{x:i<3?-46:28,y:i<3?-12:10,rotate:i<3?-4:3}:{x:(i-3)*31,y:Math.abs(i-3)*5,rotate:(i-3)*7}} transition={{duration:.65,repeat:phase==="shuffle"?2:0}}/> )}</div><div className="loading"><span>☼</span> {phase==="shuffle"?"Barajando…":phase==="cut"?"Cortando…":"Preparando elección…"}<b/></div>
   </motion.section>}
   {phase==="choose"&&<motion.section className="chooseOverlay" key="c" initial={{opacity:0}} animate={{opacity:1}}>
    <div className="progress"><i className="on"/><i className="on"/><i/></div><h2>Elegí una carta</h2><p>Confiá en tu intuición. Tocá la carta que te llame la atención.</p>
    <div className="cardGrid">{Array.from({length:9}).map((_,i)=><motion.button key={i} whileTap={{scale:.94}} onClick={()=>choose(i)}><span>𓂀</span></motion.button>)}</div>
   </motion.section>}
   {(phase==="pickup"||phase==="flip"||phase==="reveal")&&<motion.section className="revealOverlay" key="r" initial={{opacity:0}} animate={{opacity:1}}>
    <div className="progress"><i className="on"/><i className="on"/><i className="on"/></div><div className={"pickupHand "+phase}/><motion.div className={"sunCard "+phase} initial={{y:phase==="pickup"?120:0,scale:.72,rotateY:180}} animate={{y:0,scale:1,rotateY:phase==="pickup"?180:0}} transition={{duration:phase==="flip"?1.05:.8,type:"spring",bounce:.18}}><small>XIX</small><strong>☀</strong><b>EL SOL</b></motion.div>
    {phase==="reveal"&&<><h2>El Sol</h2><h3>Éxito · Claridad · Nuevos comienzos</h3>{question&&<small className="asked">Tu pregunta: “{question}”</small>}<p>{meanings[picked%meanings.length]}</p><button className="goldBtn" onClick={()=>{setQuestion("");setPhase("intro")}}>Hacer otra lectura ↻</button></>}
   </motion.section>}
  </AnimatePresence>
 </main>
}