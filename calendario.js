const CALENDAR_STORAGE_KEY = "paesnetCalendarEvents";
const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const typeNames = { study:"Estudio", exam:"Ensayo", reminder:"Recordatorio", other:"Otro" };
const typeIcons = { study:"📖", exam:"📝", reminder:"🔔", other:"📌" };

let viewDate = new Date();
viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
let selectedDate = new URLSearchParams(window.location.search).get("date") || toDateKey(new Date());
const selectedFromUrl = parseDateKey(selectedDate);
if (!Number.isNaN(selectedFromUrl.getTime())) viewDate = new Date(selectedFromUrl.getFullYear(), selectedFromUrl.getMonth(), 1);
ensurePaesDemoEvents();
let events = loadEvents();

function loadEvents(){ try { return JSON.parse(localStorage.getItem(CALENDAR_STORAGE_KEY)) || []; } catch { return []; } }
function saveEvents(){ localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events)); }
function toDateKey(date){ const y=date.getFullYear(); const m=String(date.getMonth()+1).padStart(2,"0"); const d=String(date.getDate()).padStart(2,"0"); return `${y}-${m}-${d}`; }
function parseDateKey(key){ const [y,m,d]=key.split("-").map(Number); return new Date(y,m-1,d); }
function escapeHtml(value=""){ return String(value).replace(/[&<>'"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
function formatLongDate(key){ return new Intl.DateTimeFormat("es-CL",{weekday:"long",day:"numeric",month:"long"}).format(parseDateKey(key)); }
function eventSort(a,b){ return `${a.date} ${a.time||"23:59"}`.localeCompare(`${b.date} ${b.time||"23:59"}`); }

function renderCalendar(){
  document.querySelector("#calendarMonthTitle").textContent = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
  const grid=document.querySelector("#calendarDays"); grid.innerHTML="";
  const first=viewDate; const mondayIndex=(first.getDay()+6)%7;
  const start=new Date(first); start.setDate(first.getDate()-mondayIndex);
  const today=toDateKey(new Date());
  for(let i=0;i<42;i++){
    const date=new Date(start); date.setDate(start.getDate()+i); const key=toDateKey(date);
    const dayEvents=events.filter(e=>e.date===key).sort(eventSort);
    const cell=document.createElement("button"); cell.type="button";
    cell.className="calendar-day"+(date.getMonth()!==viewDate.getMonth()?" muted":"")+(key===today?" today":"")+(key===selectedDate?" selected":"");
    cell.dataset.date=key;
    cell.innerHTML=`<strong>${date.getDate()}</strong><div class="calendar-day-events">${dayEvents.slice(0,2).map(e=>`<small class="calendar-event-chip ${e.type}">${typeIcons[e.type]||"📌"} ${escapeHtml(e.title)}</small>`).join("")}${dayEvents.length>2?`<small class="calendar-more">+${dayEvents.length-2} más</small>`:""}</div>`;
    cell.addEventListener("click",()=>{ selectedDate=key; renderCalendar(); renderAgenda(); }); grid.appendChild(cell);
  }
  renderUpcoming();
}

function renderAgenda(){
  const title=document.querySelector("#agendaTitle"); title.textContent=formatLongDate(selectedDate); title.style.textTransform="capitalize";
  const container=document.querySelector("#dayAgenda"); const list=events.filter(e=>e.date===selectedDate).sort(eventSort);
  if(!list.length){ container.innerHTML=`<div class="empty-template"><div>📅</div><strong>Sin eventos</strong><p>Selecciona “Nuevo evento” para organizar este día.</p></div>`; return; }
  container.innerHTML=list.map(e=>`<article class="agenda-event ${e.type}"><div class="agenda-event-icon">${typeIcons[e.type]||"📌"}</div><div class="agenda-event-copy"><strong>${escapeHtml(e.title)}</strong><span>${e.time?escapeHtml(e.time):"Sin hora"} · ${typeNames[e.type]||"Otro"}</span>${e.description?`<p>${escapeHtml(e.description)}</p>`:""}</div><div class="agenda-event-actions"><button data-edit="${e.id}" title="Editar">✎</button><button data-delete="${e.id}" title="Eliminar">×</button></div></article>`).join("");
  container.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openModal(events.find(e=>e.id===b.dataset.edit)));
  container.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>deleteEvent(b.dataset.delete));
}

function renderUpcoming(){
  const container=document.querySelector("#upcomingEvents"); const today=toDateKey(new Date());
  const next=events.filter(e=>e.date>=today).sort(eventSort).slice(0,5);
  container.innerHTML=next.length?next.map(e=>`<button class="upcoming-event" data-date="${e.date}"><span>${typeIcons[e.type]||"📌"}</span><div><strong>${escapeHtml(e.title)}</strong><small>${new Intl.DateTimeFormat("es-CL",{day:"numeric",month:"short"}).format(parseDateKey(e.date))}${e.time?` · ${escapeHtml(e.time)}`:""}</small></div></button>`).join(""):`<p class="calendar-empty-small">Aún no tienes próximos eventos.</p>`;
  container.querySelectorAll("[data-date]").forEach(b=>b.onclick=()=>{ selectedDate=b.dataset.date; const d=parseDateKey(selectedDate); viewDate=new Date(d.getFullYear(),d.getMonth(),1); renderCalendar(); renderAgenda(); });
}

function openModal(event=null){
  const modal=document.querySelector("#eventModal"); modal.classList.remove("hidden");
  document.querySelector("#eventId").value=event?.id||"";
  document.querySelector("#eventTitle").value=event?.title||"";
  document.querySelector("#eventDate").value=event?.date||selectedDate;
  document.querySelector("#eventTime").value=event?.time||"";
  document.querySelector("#eventType").value=event?.type||"study";
  document.querySelector("#eventDescription").value=event?.description||"";
  document.querySelector("#eventModalKicker").textContent=event?"Editar evento":"Nuevo evento";
  document.querySelector("#eventModalTitle").textContent=event?"Actualizar evento":"Agregar al calendario";
  setTimeout(()=>document.querySelector("#eventTitle").focus(),0);
}
function closeModal(){ document.querySelector("#eventModal").classList.add("hidden"); }
function deleteEvent(id){ if(!confirm("¿Eliminar este evento del calendario?")) return; events=events.filter(e=>e.id!==id); saveEvents(); renderCalendar(); renderAgenda(); }

document.querySelector("#prevMonth").onclick=()=>{ viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1); renderCalendar(); };
document.querySelector("#nextMonth").onclick=()=>{ viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1); renderCalendar(); };
document.querySelector("#newEventButton").onclick=()=>openModal();
document.querySelector("#closeEventModal").onclick=closeModal; document.querySelector("#cancelEvent").onclick=closeModal;
document.querySelector("#eventModal").addEventListener("click",e=>{ if(e.target.id==="eventModal") closeModal(); });
document.querySelector("#eventForm").addEventListener("submit",e=>{
  e.preventDefault(); const id=document.querySelector("#eventId").value; const date=document.querySelector("#eventDate").value;
  const data={ id:id||`event-${Date.now()}`, title:document.querySelector("#eventTitle").value.trim(), date, time:document.querySelector("#eventTime").value, type:document.querySelector("#eventType").value, description:document.querySelector("#eventDescription").value.trim() };
  if(!data.title||!data.date) return;
  if(id) events=events.map(item=>item.id===id?data:item); else events.push(data);
  saveEvents(); selectedDate=date; const d=parseDateKey(date); viewDate=new Date(d.getFullYear(),d.getMonth(),1); closeModal(); renderCalendar(); renderAgenda();
});

renderCalendar(); renderAgenda();
