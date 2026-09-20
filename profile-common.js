const PAESNET_PROFILE_KEY = "paesnetStudentProfile";

const PAESNET_DEFAULT_PROFILE = {
  name: "Estudiante PAES",
  course: "4° Medio",
  school: "",
  career: "",
  admissionYear: "2027",
  generalGoal: 750,
  goals: {
    lectora: 750,
    m1: 800,
    m2: 700,
    ciencias: 700,
    historia: 700
  }
};

function getPaesnetProfile() {
  const raw = localStorage.getItem(PAESNET_PROFILE_KEY);
  if (!raw) return { ...PAESNET_DEFAULT_PROFILE, goals: { ...PAESNET_DEFAULT_PROFILE.goals } };
  try {
    const saved = JSON.parse(raw);
    return {
      ...PAESNET_DEFAULT_PROFILE,
      ...saved,
      goals: { ...PAESNET_DEFAULT_PROFILE.goals, ...(saved.goals || {}) }
    };
  } catch (error) {
    return { ...PAESNET_DEFAULT_PROFILE, goals: { ...PAESNET_DEFAULT_PROFILE.goals } };
  }
}

function savePaesnetProfile(profile) {
  localStorage.setItem(PAESNET_PROFILE_KEY, JSON.stringify(profile));
  applyPaesnetProfile(profile);
}

function applyPaesnetProfile(profile = getPaesnetProfile()) {
  document.querySelectorAll("[data-profile-name]").forEach(el => {
    el.textContent = profile.name || PAESNET_DEFAULT_PROFILE.name;
  });
  document.querySelectorAll("[data-profile-course]").forEach(el => {
    el.textContent = profile.course || PAESNET_DEFAULT_PROFILE.course;
  });
  document.querySelectorAll("[data-profile-school]").forEach(el => {
    el.textContent = profile.school || "Establecimiento no indicado";
  });
  document.querySelectorAll("[data-profile-career]").forEach(el => {
    el.textContent = profile.career || "Meta académica por definir";
  });
  document.querySelectorAll("[data-profile-general-goal]").forEach(el => {
    el.textContent = profile.generalGoal || PAESNET_DEFAULT_PROFILE.generalGoal;
  });
  document.querySelectorAll("[data-profile-m1-goal]").forEach(el => {
    el.textContent = profile.goals?.m1 || PAESNET_DEFAULT_PROFILE.goals.m1;
  });
}

document.addEventListener("DOMContentLoaded", () => applyPaesnetProfile());
