function clampGoal(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(1000, Math.max(100, Math.round(number)));
}

function fillProfileForm() {
  const profile = getPaesnetProfile();
  document.querySelector("#profileName").value = profile.name || "";
  document.querySelector("#profileEmail").value = profile.email || "cristobalcontreras@paesnet.cl";
  document.querySelector("#profileCourse").value = profile.course || "";
  document.querySelector("#profileSchool").value = profile.school || "";
  document.querySelector("#profileCareer").value = profile.career || "";
  document.querySelector("#profileUniversity").value = profile.university || "";
  document.querySelector("#profileAdmissionYear").value = profile.admissionYear || "2027";
  document.querySelector("#profileGeneralGoal").value = profile.generalGoal || 750;
  document.querySelector("#goalLectora").value = profile.goals.lectora || 750;
  document.querySelector("#goalM1").value = profile.goals.m1 || 800;
  document.querySelector("#goalM2").value = profile.goals.m2 || 700;
  document.querySelector("#goalCiencias").value = profile.goals.ciencias || 700;
  document.querySelector("#goalHistoria").value = profile.goals.historia || 700;
}

function showSavedMessage(message) {
  const el = document.querySelector("#profileSavedMessage");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 2600);
}

function readResult(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function renderProfileStats() {
  const metas = [
    ["Competencia Lectora", "paesExamResult_1", "paesWinterExamResult_1"],
    ["Matemática M1", "paesExamResult_2", "paesWinterExamResult_2"],
    ["Ciencias", "paesExamResult_3", "paesWinterExamResult_3"],
    ["Matemática M2", "paesExamResult_4", "paesWinterExamResult_4"],
    ["Historia", "paesExamResult_5", "paesWinterExamResult_5"],
    ["Ensayo Mixto", "paesExamResult_6"]
  ];
  const allResults = [];
  const areaScores = [];
  metas.forEach(([area, ...keys]) => {
    const results = keys.map(readResult).filter(Boolean);
    results.forEach(result => allResults.push(result));
    if (area !== "Ensayo Mixto" && results.length) {
      areaScores.push({ area, value: Math.round(results.reduce((sum, r) => sum + Number(r.percentage || 0), 0) / results.length) });
    }
  });
  const average = allResults.length ? Math.round(allResults.reduce((sum, r) => sum + Number(r.percentage || 0), 0) / allResults.length) : null;
  const best = areaScores.sort((a,b) => b.value-a.value)[0];
  document.querySelector("#profileCompletedExams").textContent = allResults.length;
  document.querySelector("#profileAverage").textContent = average === null ? "--" : `${average}%`;
  document.querySelector("#profileBestArea").textContent = best ? `${best.area} · ${best.value}%` : "Sin datos";

  const today = paesDateKey(new Date());
  const sessions = getPaesStudySessions().filter(item => item.date >= today);
  let minutes = 0;
  sessions.forEach(item => {
    const match = `${item.title || ""} ${item.description || ""}`.match(/(\d+)\s*min/i);
    if (match) minutes += Number(match[1]);
  });
  const hoursText = minutes >= 60 ? ` · ${(minutes/60).toFixed(minutes % 60 ? 1 : 0)} h` : (minutes ? ` · ${minutes} min` : "");
  document.querySelector("#profileStudyPlan").textContent = `${sessions.length} ${sessions.length === 1 ? "sesión" : "sesiones"}${hoursText}`;
}

const profileForm = document.querySelector("#profileForm");
if (profileForm) {
  fillProfileForm();
  renderProfileStats();

  profileForm.addEventListener("submit", event => {
    event.preventDefault();
    const current = getPaesnetProfile();
    const profile = {
      name: document.querySelector("#profileName").value.trim(),
      email: "cristobalcontreras@paesnet.cl",
      course: document.querySelector("#profileCourse").value.trim() || "4° Medio",
      school: document.querySelector("#profileSchool").value.trim(),
      career: document.querySelector("#profileCareer").value.trim(),
      university: document.querySelector("#profileUniversity").value.trim(),
      admissionYear: document.querySelector("#profileAdmissionYear").value,
      generalGoal: clampGoal(document.querySelector("#profileGeneralGoal").value, current.generalGoal),
      goals: {
        lectora: clampGoal(document.querySelector("#goalLectora").value, current.goals.lectora),
        m1: clampGoal(document.querySelector("#goalM1").value, current.goals.m1),
        m2: clampGoal(document.querySelector("#goalM2").value, current.goals.m2),
        ciencias: clampGoal(document.querySelector("#goalCiencias").value, current.goals.ciencias),
        historia: clampGoal(document.querySelector("#goalHistoria").value, current.goals.historia)
      }
    };
    savePaesnetProfile(profile);
    fillProfileForm();
    renderProfileStats();
    showSavedMessage("✓ Perfil guardado correctamente");
  });

  document.querySelector("#resetProfile").addEventListener("click", () => {
    savePaesnetProfile({ ...PAESNET_DEFAULT_PROFILE, goals: { ...PAESNET_DEFAULT_PROFILE.goals } });
    fillProfileForm();
    renderProfileStats();
    showSavedMessage("Perfil restablecido");
  });
}

const logoutButton = document.querySelector("#logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("paesnetSession");
    window.location.href = "index.html";
  });
}
