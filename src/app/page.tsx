"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

type Phase="intro"|"focus"|"shuffle"|"choose"|"reveal";
const cards=[
 {name:"EL SOL",symbol:"☀",meaning:"Claridad · vitalidad · una verdad que empieza a mostrarse."},
 {name:"LA LUNA",symbol:"☾",meaning:"Intuición · incertidumbre · aquello que todavía no se ve completo."},
 {name:"LA JUSTICIA",symbol:"⚖",meaning:"Equilibrio · responsabilidad · observar los hechos antes de decidir."},
 {name:"EL ERMITAÑO",symbol:"✦",meaning:"Pausa · introspección · encontrar una respuesta propia."},
 {name:"LA ESTRELLA",symbol:"✧",meaning:"Esperanza · apertura · recuperar perspectiva."},
];
export default function Home(){
 const [phase,setPhase]=useState<Phase>("intro");
 const [picked,setPicked]=useState<number|null>(null);
 const chosen=useMemo(()=>picked===null?null:cards[picked%cards.length],[picked]);
 const start=()=>setPhase("focus");
 const shuffle=()=>{setPhase("shuffle");setTimeout(()=>setPhase("choose"),2200)};
 const reset=()=>{setPicked(null);setPhase("intro")};
 return <main className="shell">
  <header className="header"><span className="mark">✦</span><strong>LUSORA</strong><span className="lab">EXPERIENCE LAB</span></header>
  <div className="ambient a1"/><div className="ambient a2"/>
  <AnimatePresence mode="wait">
   {phase==="intro"&&<motion.section key="intro" className="screen introScreen" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,y:-20}}>
    <p className="eyebrow">TAROT EGIPCIO · PROTOTIPO 01</p><h1>Una pregunta.<br/><em>Una carta.</em></h1>
    <p className="copy">Esta primera prueba valida ritmo, profundidad, selección y revelación. Las imágenes finales y las manos reales se incorporan después.</p>
    <div className="altar"><div className="candle c1"><i/></div><motion.div className="deckHero" animate={{y:[0,-7,0]}} transition={{duration:4,repeat:Infinity}}><b>☥</b><small>LUSORA</small></motion.div><div className="candle c2"><i/></div></div>
    <button className="primary" onClick={start}>Comenzar la lectura <span>→</span></button>
   </motion.section>}
   {phase==="focus"&&<motion.section key="focus" className="screen ritual" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <p className="step">01 · PREPARACIÓN</p><h2>Concentrate en<br/><em>tu pregunta.</em></h2><p className="copy">No hace falta escribirla todavía. Tomate unos segundos y, cuando estés listo, tocá el mazo.</p>
    <button className="deckButton" onClick={shuffle} aria-label="Barajar cartas"><motion.div whileTap={{scale:.94}} className="deckStack"><span>☥</span></motion.div><small>TOCÁ PARA BARAJAR</small></button>
   </motion.section>}
   {phase==="shuffle"&&<motion.section key="shuffle" className="screen ritual" initial={{opacity:0}} animate={{opacity:1}}>
    <p className="step">02 · BARAJANDO</p><h2>Dejá que el mazo<br/><em>encuentre su ritmo.</em></h2>
    <div className="shuffleStage">{[0,1,2,3,4,5].map(i=><motion.div key={i} className="miniCard" initial={{x:0,rotate:0}} animate={{x:[0,(i%2?1:-1)*(48+i*4),0],y:[0,-8*i,0],rotate:[0,(i%2?1:-1)*(5+i),0]}} transition={{duration:.7,repeat:2,delay:i*.04}}><span>☥</span></motion.div>)}</div>
    <p className="whisper">Respirá. No hay una elección correcta.</p>
   </motion.section>}
   {phase==="choose"&&<motion.section key="choose" className="screen chooseScreen" initial={{opacity:0}} animate={{opacity:1}}>
    <p className="step">03 · ELECCIÓN</p><h2>Elegí la carta que<br/><em>te llame.</em></h2><p className="copy">Tocá una. La posición es tu elección; el contenido ya está determinado.</p>
    <div className="fan">{Array.from({length:9}).map((_,i)=>{const rot=(i-4)*7;return <motion.button aria-label={"Carta "+(i+1)} key={i} className="fanCard" initial={{y:120,opacity:0}} animate={{y:Math.abs(i-4)*5,opacity:1,rotate:rot,x:(i-4)*-5}} transition={{delay:i*.055}} whileHover={{y:-14}} whileTap={{y:-22,scale:1.04}} onClick={()=>{setPicked(i);setPhase("reveal")}}><span>☥</span></motion.button>})}</div>
    <p className="whisper">Elegí sin apurarte.</p>
   </motion.section>}
   {phase==="reveal"&&chosen&&<motion.section key="reveal" className="screen revealScreen" initial={{opacity:0}} animate={{opacity:1}}>
    <p className="step">04 · REVELACIÓN</p><div className="revealStage"><motion.div className="revealedCard" initial={{y:120,rotateY:180,scale:.7}} animate={{y:0,rotateY:0,scale:1}} transition={{duration:1.15,type:"spring",bounce:.2}}><div className="cardFrame"><small>ARCANO</small><b>{chosen.symbol}</b><strong>{chosen.name}</strong><i>☥</i></div></motion.div></div>
    <motion.div className="reading" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:.8}}><p className="eyebrow">PRIMERA IMPRESIÓN</p><p>{chosen.meaning}</p><small>En la experiencia final, la interpretación se construirá con tu pregunta, la posición de la carta y la conversación.</small></motion.div>
    <button className="secondary" onClick={reset}>Repetir experiencia</button>
   </motion.section>}
  </AnimatePresence>
 </main>
}