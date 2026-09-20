ensurePaesDemoEvents();
const dayNames=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const monthShort=["ene","feb","mar","abr","may","jun","jul","ago","sept","oct","nov","dic"];
function esc(v=""){return String(v).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));}
function localDate(key){const [y,m,d]=key.split("-").map(Number);return new Date(y,m-1,d);}
function renderStudySessions(){
  const box=document.querySelector("#studySessions"); if(!box)return;
  const today=paesDateKey(new Date());
  const sessions=getPaesStudySessions().filter(e=>e.date>=today).slice(0,6);
  if(!sessions.length){box.innerHTML='<div class="empty-template"><div>📖</div><strong>Sin sesiones programadas</strong><p>Crea un evento de tipo Estudio en Calendario y aparecerá aquí automáticamente.</p></div>';return;}
  box.innerHTML=sessions.map(e=>{const d=localDate(e.date);return `<a class="study-session study-session-link" href="calendario.html?date=${e.date}"><div class="study-session-date"><strong>${dayNames[d.getDay()]}</strong><span>${String(d.getDate()).padStart(2,"0")}</span></div><div><strong>${esc(e.title)}</strong><p>${esc(e.description||"Sesión de estudio")}${e.time?` · ${esc(e.time)}`:""}</p></div><span class="template-badge">Planificado</span></a>`}).join("");
}
renderStudySessions();
