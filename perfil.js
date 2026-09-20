function clampGoal(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(1000, Math.max(100, Math.round(number)));
}

function fillProfileForm() {
  const profile = getPaesnetProfile();
  document.querySelector("#profileName").value = profile.name || "";
  document.querySelector("#profileCourse").value = profile.course || "";
  document.querySelector("#profileSchool").value = profile.school || "";
  document.querySelector("#profileCareer").value = profile.career || "";
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

const profileForm = document.querySelector("#profileForm");
if (profileForm) {
  fillProfileForm();

  profileForm.addEventListener("submit", event => {
    event.preventDefault();
    const current = getPaesnetProfile();
    const profile = {
      name: document.querySelector("#profileName").value.trim() || "Estudiante PAES",
      course: document.querySelector("#profileCourse").value.trim() || "4° Medio",
      school: document.querySelector("#profileSchool").value.trim(),
      career: document.querySelector("#profileCareer").value.trim(),
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
    showSavedMessage("✓ Perfil guardado correctamente");
  });

  document.querySelector("#resetProfile").addEventListener("click", () => {
    savePaesnetProfile({ ...PAESNET_DEFAULT_PROFILE, goals: { ...PAESNET_DEFAULT_PROFILE.goals } });
    fillProfileForm();
    showSavedMessage("Perfil restablecido");
  });
}
