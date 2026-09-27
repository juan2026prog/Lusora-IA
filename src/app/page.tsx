"use client";
import {motion,AnimatePresence} from "framer-motion";
import {useEffect,useMemo,useRef,useState} from "react";
import {welcomeScene} from "./assets/welcome";

type Phase="welcome"|"question"|"shuffle"|"cut"|"fan"|"selecting"|"lifting"|"placing"|"flipping"|"reading";
const N=17;
const cards=[
 {roman:"XIX",name:"EL SOL",glyph:"☀",keys:"Claridad · vitalidad · apertura",text:"Una energía de claridad empieza a ocupar el centro. Esta carta invita a mirar lo que ya puede verse sin forzar respuestas."},
 {roman:"XVIII",name:"LA LUNA",glyph:"☾",keys:"Intuición · misterio · percepción",text:"No todo está definido todavía. La Luna propone observar emociones, dudas y aquello que aún necesita tiempo para hacerse visible."},
 {roman:"XI",name:"LA JUSTICIA",glyph:"⚖",keys:"Equilibrio · hechos · responsabilidad",text:"La lectura pone el foco en evaluar con calma, separar hechos de suposiciones y reconocer qué parte de la decisión depende de vos."},
 {roman:"IX",name:"EL ERMITAÑO",glyph:"✦",keys:"Pausa · búsqueda · introspección",text:"Antes de avanzar, esta carta sugiere hacer espacio para una respuesta propia, sin presión externa."},
 {roman:"XVII",name:"LA ESTRELLA",glyph:"✧",keys:"Esperanza · perspectiva · renovación",text:"La Estrella abre una lectura más serena: recuperar perspectiva puede ayudarte a distinguir deseo, posibilidad y próximo paso."}
];
export default function Home(){
 const [phase,setPhase]=useState<Phase>("welcome"),[picked,setPicked]=useState<number|null>(null),[question,setQuestion]=useState("");
 const timers=useRef<number[]>([]); const chosen=cards[(picked??0)%cards.length];
 const later=(fn:()=>void,ms:number)=>{const id=window.setTimeout(fn,ms);timers.current.push(id)};
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 const vibrate=(x:number|number[])=>{if(typeof navigator!=="undefined"&&"vibrate" in navigator) navigator.vibrate(x)};
 const begin=()=>{setPhase("shuffle");vibrate(18);later(()=>setPhase("cut"),2500);later(()=>setPhase("fan"),3900);later(()=>setPhase("selecting"),5100)};
 const choose=(i:number)=>{if(phase!=="selecting")return;setPicked(i);vibrate([12,25,12]);setPhase("lifting");later(()=>setPhase("placing"),900);later(()=>setPhase("flipping"),1750);later(()=>setPhase("reading"),2850)};
 const reset=()=>{timers.current.forEach(clearTimeout);timers.current=[];setPicked(null);setQuestion("");setPhase("question")};
 const fan=useMemo(()=>Array.from({length:N},(_,i)=>{const d=i-(N-1)/2;return{x:d*13,y:Math.abs(d)*2.1,r:d*4.15,z:i}}),[]);
 return <main className={"ritual "+phase}>
  <div className="scene" style={{backgroundImage:`url("${welcomeScene}")`}}/><div className="sceneVignette"/><div className="smoke s1"/><div className="smoke s2"/>
  <header><button onClick={()=>setPhase("welcome")}>‹</button><span>LUSORA · TAROT EGIPCIO</span><b>☰</b></header>
  <div className="altar">
   <div className="candle left"><i/><b/></div><div className="candle right"><i/><b/></div>
   <div className="deck">
    {fan.map((pos,i)=>{
      const selected=picked===i, spread=["fan","selecting","lifting","placing","flipping","reading"].includes(phase);
      const moveSelected=selected&&["lifting","placing","flipping","reading"].includes(phase);
      let x=spread?pos.x:0,y=spread?pos.y:0,r=spread?pos.r:0,scale=1,z=pos.z;
      if(moveSelected){x=0;y=-142;r=0;scale=1.38;z=100}
      if(selected&&phase==="lifting"){y=-70;scale=1.08}
      return <motion.button aria-label={"Carta "+(i+1)} className={"tarotCard "+(selected?"selected ":"")+((selected&&["flipping","reading"].includes(phase))?"face ":"")} key={i}
       onClick={()=>choose(i)} animate={{x,y,rotate:r,scale,zIndex:z}} transition={{duration:phase==="fan"?1.05:.7,type:"spring",bounce:.12}}>
        <div className="back"><span>𓂀</span></div>
        <div className="front"><small>{chosen.roman}</small><strong>{chosen.glyph}</strong><em>{chosen.name}</em></div>
      </motion.button>})}
   </div>
   <motion.div className="hand leftHand" animate={phase==="shuffle"?{x:[-125,-25,-105,-15,-125],y:[15,-5,8,-8,15],rotate:[8,-5,6,-4,8]}:phase==="cut"?{x:-45,y:-10,rotate:-5}:phase==="lifting"?{x:-5,y:-65,rotate:-8}:phase==="placing"?{x:50,y:-135,rotate:-14}:{x:-150,y:45,rotate:8}} transition={{duration:phase==="shuffle"?1.15:.75,repeat:phase==="shuffle"?1:0}}><i/><b/><span/><em/></motion.div>
   <motion.div className="hand rightHand" animate={phase==="shuffle"?{x:[125,28,110,18,125],y:[10,4,-8,5,10],rotate:[-8,5,-5,4,-8]}:phase==="cut"?{x:48,y:18,rotate:6}:phase==="lifting"?{x:18,y:-55,rotate:8}:phase==="placing"?{x:-38,y:-135,rotate:13}:{x:150,y:45,rotate:-8}} transition={{duration:phase==="shuffle"?1.15:.75,repeat:phase==="shuffle"?1:0}}><i/><b/><span/><em/></motion.div>
  </div>
  <AnimatePresence mode="wait">
   {phase==="welcome"&&<motion.div className="panel welcomePanel" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}><small>UNA EXPERIENCIA LUSORA</small><h1>El ritual comienza<br/>cuando vos decidís.</h1><p>Una mesa. Un mazo. Tu pregunta.</p><button onClick={()=>setPhase("question")}>Comenzar lectura →</button></motion.div>}
   {phase==="question"&&<motion.div className="panel questionPanel" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0}}><small>ANTES DE LAS CARTAS</small><h2>¿Qué querés explorar?</h2><p>Podés escribirlo o simplemente mantenerlo en mente.</p><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Escribí tu pregunta…"/><button onClick={begin}>Estoy listo →</button></motion.div>}
  </AnimatePresence>
  {["shuffle","cut","fan"].includes(phase)&&<div className="ritualCaption"><small>{phase==="shuffle"?"BARAJANDO":phase==="cut"?"CORTE":"ABRIENDO EL MAZO"}</small><h2>{phase==="shuffle"?"Concentrate en tu pregunta":phase==="cut"?"Un último corte":"Las cartas toman su lugar"}</h2><div className="pulse"/></div>}
  {phase==="selecting"&&<div className="ritualCaption chooseText"><small>ELEGÍ UNA CARTA</small><h2>No hay una elección correcta.</h2><p>Tocá la que te atraiga.</p></div>}
  {["lifting","placing","flipping"].includes(phase)&&<div className="ritualCaption"><small>{phase==="lifting"?"TU CARTA":phase==="placing"?"COLOCANDO":"REVELANDO"}</small><h2>{phase==="flipping"?"Descubrí su símbolo":"Seguí el movimiento"}</h2></div>}
  {phase==="reading"&&<motion.div className="readingPanel" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}><small>{chosen.roman} · ARCANO</small><h1>{chosen.name}</h1><h3>{chosen.keys}</h3>{question&&<blockquote>“{question}”</blockquote>}<p>{chosen.text}</p><button onClick={reset}>Nueva lectura ↻</button></motion.div>}
  <div className="steps"><i className={phase!=="welcome"?"on":""}/><i className={["shuffle","cut","fan","selecting","lifting","placing","flipping","reading"].includes(phase)?"on":""}/><i className={["selecting","lifting","placing","flipping","reading"].includes(phase)?"on":""}/><i className={phase==="reading"?"on":""}/></div>
 </main>
}