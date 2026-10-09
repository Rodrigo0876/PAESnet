const PAESNET_CALENDAR_KEY = "paesnetCalendarEvents";
const PAESNET_DEMO_SEEDED_KEY = "paesnetDemoEventsSeededV1";

function paesDateKey(date){
  const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,"0"), d=String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
}
function paesAddDays(base, days){ const d=new Date(base); d.setDate(d.getDate()+days); return d; }
function paesLoadCalendarEvents(){ try{return JSON.parse(localStorage.getItem(PAESNET_CALENDAR_KEY))||[];}catch{return [];} }
function paesSaveCalendarEvents(items){ localStorage.setItem(PAESNET_CALENDAR_KEY,JSON.stringify(items)); }

function ensurePaesDemoEvents(){
  if(localStorage.getItem(PAESNET_DEMO_SEEDED_KEY)) return;
  const now=new Date();
  const samples=[
    {id:"demo-study-m1",title:"Repaso M1 · Álgebra",date:paesDateKey(paesAddDays(now,2)),time:"18:00",type:"study",description:"Modelamiento, ecuaciones y funciones · 60 min",source:"demo-study"},
    {id:"demo-study-reading",title:"Competencia Lectora",date:paesDateKey(paesAddDays(now,4)),time:"17:30",type:"study",description:"Interpretar y evaluar textos · 45 min",source:"demo-study"},
    {id:"demo-exam",title:"Ensayo PAES semanal",date:paesDateKey(paesAddDays(now,7)),time:"10:00",type:"exam",description:"Simulación de práctica programada en SuperPaes.",source:"demo"},
    {id:"demo-study-science",title:"Ciencias · Datos experimentales",date:paesDateKey(paesAddDays(now,9)),time:"18:30",type:"study",description:"Análisis de gráficos y evidencia · 60 min",source:"demo-study"},
    {id:"demo-reminder",title:"Revisar resultados del ensayo",date:paesDateKey(paesAddDays(now,8)),time:"19:00",type:"reminder",description:"Revisar respuestas incorrectas y explicaciones.",source:"demo"}
  ];
  const existing=paesLoadCalendarEvents();
  const ids=new Set(existing.map(e=>e.id));
  paesSaveCalendarEvents(existing.concat(samples.filter(e=>!ids.has(e.id))));
  localStorage.setItem(PAESNET_DEMO_SEEDED_KEY,"1");
}

// Ejemplos de bienvenida para instalaciones antiguas donde los eventos iniciales
// ya se sembraron (o quedaron en el pasado). Se ejecuta una sola vez por navegador.
const PAESNET_WELCOME_EVENTS_KEY = "superpaesWelcomeEventsV2";
function ensureSuperPaesWelcomeEvents(){
  if (localStorage.getItem(PAESNET_WELCOME_EVENTS_KEY)) return;
  const today = paesDateKey(new Date());
  const current = paesLoadCalendarEvents();
  const upcoming = current.filter(e => e && typeof e.date === "string" && e.date >= today);
  // No desplazar la planificación de quien ya tiene próximos eventos.
  if (!upcoming.length) {
    const base = new Date();
    const samples = [
      {id:"superpaes-welcome-reading",title:"Práctica de Competencia Lectora",date:paesDateKey(paesAddDays(base,3)),time:"17:00",type:"study",description:"Actividad de ejemplo: practicar comprensión y análisis de textos.",source:"demo-welcome"},
      {id:"superpaes-welcome-m1",title:"Ensayo de Matemática M1",date:paesDateKey(paesAddDays(base,6)),time:"11:00",type:"exam",description:"Actividad de ejemplo: realizar un ensayo y revisar tus respuestas.",source:"demo-welcome"},
      {id:"superpaes-welcome-review",title:"Revisión de resultados PAES",date:paesDateKey(paesAddDays(base,9)),time:"18:00",type:"reminder",description:"Actividad de ejemplo: identificar errores y planificar mejoras.",source:"demo-welcome"}
    ];
    paesSaveCalendarEvents(current.concat(samples));
  }
  localStorage.setItem(PAESNET_WELCOME_EVENTS_KEY,"1");
}

function getPaesStudySessions(){
  ensurePaesDemoEvents();
  return paesLoadCalendarEvents().filter(e=>e.type==="study").sort((a,b)=>`${a.date} ${a.time||"23:59"}`.localeCompare(`${b.date} ${b.time||"23:59"}`));
}
