const resultGroups = {
  regular: [
    { id: 1, name: "Ensayo 1", subject: "Competencia Lectora", color: "#246bfd" },
    { id: 2, name: "Ensayo 2", subject: "Matemática 1 (M1)", color: "#16a34a" },
    { id: 3, name: "Ensayo 3", subject: "Ciencias", color: "#7c3aed" },
    { id: 4, name: "Ensayo 4", subject: "Matemática 2 (M2)", color: "#f59e0b" },
    { id: 5, name: "Ensayo 5", subject: "Historia y Ciencias Sociales", color: "#dc8a00" },
    { id: 6, name: "Ensayo 6", subject: "Ensayo Mixto", color: "#0ea5e9" }
  ],
  invierno: [
    { id: 1, name: "Invierno 1", subject: "Competencia Lectora", color: "#246bfd" },
    { id: 2, name: "Invierno 2", subject: "Matemática 1 (M1)", color: "#16a34a" },
    { id: 3, name: "Invierno 3", subject: "Ciencias", color: "#7c3aed" },
    { id: 4, name: "Invierno 4", subject: "Matemática 2 (M2)", color: "#f59e0b" },
    { id: 5, name: "Invierno 5", subject: "Historia y Ciencias Sociales", color: "#dc8a00" }
  ]
};

const resultParams = new URLSearchParams(window.location.search);
let currentResultsType = resultParams.get("tipo") === "invierno" ? "invierno" : "regular";

function resultStorageKey(id, type = currentResultsType) {
  return type === "invierno" ? `paesWinterExamResult_${id}` : `paesExamResult_${id}`;
}

function resultsAttendanceUrl(type = currentResultsType) {
  return type === "invierno" ? "asistencia.html?tipo=invierno" : "asistencia.html";
}

function resultsExamUrl(id, type = currentResultsType) {
  return type === "invierno" ? `ensayo.html?tipo=invierno&id=${id}` : `ensayo.html?id=${id}`;
}

function getStoredResults(type = currentResultsType) {
  return resultGroups[type].map(meta => {
    const raw = localStorage.getItem(resultStorageKey(meta.id, type));
    if (!raw) return { ...meta, result: null };
    try {
      return { ...meta, result: JSON.parse(raw) };
    } catch (error) {
      return { ...meta, result: null };
    }
  });
}

function configureResultsTabs() {
  const tabs = document.querySelectorAll("[data-results-type]");
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.resultsType === currentResultsType);
    tab.addEventListener("click", () => {
      currentResultsType = tab.dataset.resultsType;
      tabs.forEach(item => item.classList.toggle("active", item === tab));
      history.replaceState(null, "", currentResultsType === "invierno" ? "resultados.html?tipo=invierno" : "resultados.html");
      renderResultsPage();
    });
  });
}

function renderResultsPage() {
  const list = document.querySelector("#resultsExamList");
  if (!list) return;

  const items = getStoredResults();
  const completed = items.filter(item => item.result);
  const totalCorrect = completed.reduce((sum, item) => sum + (item.result.correctAnswers || 0), 0);
  const totalQuestions = completed.reduce((sum, item) => sum + (item.result.totalQuestions || 0), 0);
  const average = completed.length
    ? Math.round(completed.reduce((sum, item) => sum + (item.result.percentage || 0), 0) / completed.length)
    : null;
  const best = completed.length
    ? [...completed].sort((a, b) => b.result.percentage - a.result.percentage)[0]
    : null;

  const totalAvailable = items.length;
  document.querySelector("#completedExams").textContent = `${completed.length} de ${totalAvailable}`;
  document.querySelector("#averageResult").textContent = average === null ? "--" : `${average}%`;
  document.querySelector("#bestResult").textContent = best ? `${best.result.percentage}%` : "--";
  document.querySelector("#bestExamLabel").textContent = best ? `${best.name} · ${best.subject}` : "Sin datos todavía";
  document.querySelector("#totalCorrect").textContent = totalCorrect;
  document.querySelector("#totalQuestionsLabel").textContent = `de ${totalQuestions} preguntas respondidas`;

  const completedNote = document.querySelector("#completedExamsNote");
  if (completedNote) completedNote.textContent = currentResultsType === "invierno"
    ? "Ensayos PAES de Invierno"
    : "El Ensayo 7 figura como ausente";

  const evolutionTitle = document.querySelector("#resultsEvolutionTitle");
  if (evolutionTitle) evolutionTitle.textContent = currentResultsType === "invierno"
    ? "Evolución · PAES de Invierno"
    : "Evolución · PAES Regular";

  list.innerHTML = items.map(item => {
    const value = item.result ? item.result.percentage : 0;
    const status = item.result ? `${item.result.correctAnswers}/${item.result.totalQuestions} correctas` : "Pendiente";
    const href = item.result ? resultsAttendanceUrl() : resultsExamUrl(item.id);
    return `
      <a class="result-exam-row" href="${href}" data-result-exam="${item.id}">
        <div class="result-exam-number">${item.id}</div>
        <div class="result-exam-main">
          <strong>${item.name}</strong>
          <span>${item.subject}</span>
          <div class="result-bar"><div style="width:${value}%;background:${item.color}"></div></div>
        </div>
        <div class="result-exam-state"><strong>${item.result ? `${value}%` : "--"}</strong><small>${status}</small></div>
      </a>`;
  }).join("");

  renderAreaResults(completed);
  renderInsight(completed, average);
  updateRecommendationLinks();
}

function renderAreaResults(completed) {
  const container = document.querySelector("#areaResults");
  const directAreas = [
    "Competencia Lectora",
    "Matemática 1 (M1)",
    "Ciencias",
    "Matemática 2 (M2)",
    "Historia y Ciencias Sociales"
  ];

  container.innerHTML = directAreas.map(area => {
    const matches = completed.filter(item => item.subject === area);
    const pct = matches.length
      ? Math.round(matches.reduce((sum, item) => sum + item.result.percentage, 0) / matches.length)
      : null;
    const width = pct ?? 0;
    return `
      <div class="area-result-row">
        <div class="area-result-label"><span>${area}</span><strong>${pct === null ? "--" : `${pct}%`}</strong></div>
        <div class="area-result-track"><div style="width:${width}%"></div></div>
      </div>`;
  }).join("");
}

function renderInsight(completed, average) {
  const box = document.querySelector("#performanceInsight");
  if (!completed.length) {
    box.innerHTML = `<div class="empty-result-state"><span>📊</span><strong>Aún no hay resultados</strong><p>Rinde uno de los ensayos de esta categoría para que PAESnet analice tu desempeño.</p><a class="exam-button primary" href="${resultsAttendanceUrl()}">Ir a ensayos</a></div>`;
    return;
  }

  const ordered = [...completed].sort((a, b) => b.result.percentage - a.result.percentage);
  const strongest = ordered[0];
  const weakest = ordered[ordered.length - 1];
  const level = average >= 70 ? "Buen avance" : average >= 50 ? "Avance intermedio" : "Necesita refuerzo";

  box.innerHTML = `
    <div class="insight-badge">${level}</div>
    <div class="insight-grid">
      <div class="insight-card"><span>⭐ Mejor desempeño</span><strong>${strongest.subject}</strong><small>${strongest.result.percentage}% en ${strongest.name}</small></div>
      <div class="insight-card"><span>🎯 Prioridad de estudio</span><strong>${weakest.subject}</strong><small>${weakest.result.percentage}% en ${weakest.name}</small></div>
    </div>
    <p class="insight-note">Estos datos consideran únicamente el último intento guardado de cada ensayo de esta categoría.</p>`;
}

function updateRecommendationLinks() {
  document.querySelectorAll("[data-results-attendance-link]").forEach(link => {
    link.href = resultsAttendanceUrl();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configureResultsTabs();
  renderResultsPage();
});
