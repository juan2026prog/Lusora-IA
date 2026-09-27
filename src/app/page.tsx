"use client";
import {AnimatePresence,motion} from "framer-motion";
import {useState} from "react";
import {welcomeScene} from "./assets/welcome";
import {shuffleScene} from "./assets/shuffle";
type Phase="intro"|"focus"|"shuffle"|"choose"|"reveal";
const meanings=["Claridad · vitalidad · nuevos comienzos.","Intuición · misterio · mirar más allá de lo evidente.","Equilibrio · responsabilidad · observar los hechos.","Pausa · introspección · escuchar tu propia respuesta.","Esperanza · apertura · recuperar perspectiva."];
export default function Home(){
 const [phase,setPhase]=useState<Phase>("intro"); const [picked,setPicked]=useState(0);
 const goShuffle=()=>{setPhase("shuffle");setTimeout(()=>setPhase("choose"),2600)};
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
    <textarea placeholder="Escribe tu pregunta (opcional)"/><button className="goldBtn" onClick={goShuffle}>Continuar →</button>
   </motion.section>}
   {phase==="shuffle"&&<motion.section className="shuffleOverlay" key="s" initial={{opacity:0}} animate={{opacity:1}}>
    <div className="progress"><i className="on"/><i/><i/></div><h2>Conectando con tu energía</h2><p>Las cartas se están preparando...</p><div className="loading"><span>☼</span> Barajando las cartas…<b/></div>
   </motion.section>}
   {phase==="choose"&&<motion.section className="chooseOverlay" key="c" initial={{opacity:0}} animate={{opacity:1}}>
    <div className="progress"><i className="on"/><i className="on"/><i/></div><h2>Elegí una carta</h2><p>Confiá en tu intuición. Tocá la carta que te llame la atención.</p>
    <div className="cardGrid">{Array.from({length:9}).map((_,i)=><motion.button key={i} whileTap={{scale:.94}} onClick={()=>{setPicked(i);setPhase("reveal")}}><span>𓂀</span></motion.button>)}</div>
   </motion.section>}
   {phase==="reveal"&&<motion.section className="revealOverlay" key="r" initial={{opacity:0}} animate={{opacity:1}}>
    <div className="progress"><i className="on"/><i className="on"/><i className="on"/></div><motion.div className="sunCard" initial={{rotateY:180,y:80,scale:.7}} animate={{rotateY:0,y:0,scale:1}} transition={{duration:1}}><small>XIX</small><strong>☀</strong><b>EL SOL</b></motion.div>
    <h2>El Sol</h2><h3>Éxito · Claridad · Nuevos comienzos</h3><p>{meanings[picked%meanings.length]}</p><button className="goldBtn" onClick={()=>setPhase("intro")}>Hacer otra lectura ↻</button>
   </motion.section>}
  </AnimatePresence>
 </main>
}