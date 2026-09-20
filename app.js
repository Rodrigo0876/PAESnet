const events = [
  { type: "Evento", days: "en 12 días", title: "Ensayo PAES completo", date: "Sábado 24 de mayo", description: "Ensayo general de todas las competencias.", icon: "📋" },
  { type: "Evento", days: "en 28 días", title: "Prueba PAES Invierno", date: "Martes 10 y miércoles 11 de junio", description: "Fechas oficiales de rendición PAES Invierno.", icon: "🗓️" },
  { type: "Evento", days: "en 45 días", title: "Resultados PAES Invierno", date: "Miércoles 2 de julio", description: "Conoce tus resultados y próximos pasos.", icon: "📈" }
];

const studyItems = [
  { category: "Estudio", time: "09:00 - 10:30", subject: "Competencia Lectora", description: "Comprensión de textos no literarios", progress: 75, status: "En progreso", icon: "📘", bg: "#f2edff", color: "#6b35d4" },
  { category: "Estudio", time: "11:00 - 12:30", subject: "Matemática 1 (M1)", description: "Ejercicios de álgebra y funciones", progress: 66, status: "En progreso", icon: "🧮", bg: "#eefaf5", color: "#15945a" },
  { category: "Estudio", time: "14:00 - 15:30", subject: "Matemática 2 (M2)", description: "Geometría y trigonometría", progress: 32, status: "Pendiente", icon: "⚛️", bg: "#fff4e8", color: "#f28c1b" },
  { category: "Estudio", time: "16:00 - 17:30", subject: "Ciencias", description: "Química: reacciones y estequiometría", progress: 41, status: "Pendiente", icon: "🧪", bg: "#edf6ff", color: "#2972d1" }
];

const services = [
  { icon: "📝", title: "Ensayos PAES", description: "Realiza ensayos completos y por competencia.", href: "asistencia.html" },
  { icon: "📊", title: "Resultados", description: "Revisa tus puntajes y evolución en el tiempo.", href: "resultados.html" },
  { icon: "📚", title: "Material de estudio", description: "Guías, ejercicios y contenidos por materia.", href: "estudio.html" },
  { icon: "🎯", title: "Metas", description: "Define y sigue tus metas de puntaje.", href: "resultados.html" },
  { icon: "💡", title: "Tips y consejos", description: "Estrategias y recomendaciones para la PAES.", href: "estudio.html" },
  { icon: "✅", title: "Material oficial DEMRE", description: "Consulta pruebas y preguntas oficiales liberadas por DEMRE.", href: "https://portaldemre.demre.cl/publicaciones/2025/pruebas-oficiales-y-seleccion-preguntas-paes-p2025" }
];

const regularExams = [
  { id: 1, name: "Ensayo 1", date: "15 de marzo 2026", subject: "Competencia Lectora", attended: true },
  { id: 2, name: "Ensayo 2", date: "12 de abril 2026", subject: "Matemática 1 (M1)", attended: true },
  { id: 3, name: "Ensayo 3", date: "10 de mayo 2026", subject: "Ciencias", attended: true },
  { id: 4, name: "Ensayo 4", date: "14 de junio 2026", subject: "Matemática 2 (M2)", attended: true },
  { id: 5, name: "Ensayo 5", date: "12 de julio 2026", subject: "Historia y Ciencias Sociales", attended: true },
  { id: 6, name: "Ensayo 6", date: "9 de agosto 2026", subject: "Ensayo Mixto", attended: true },
  { id: 7, name: "Ensayo 7", date: "13 de septiembre 2026", subject: "Ensayo General", attended: false }
];

const winterExams = [
  { id: 1, name: "Invierno 1", date: "3 de mayo 2026", subject: "Competencia Lectora", attended: true },
  { id: 2, name: "Invierno 2", date: "10 de mayo 2026", subject: "Matemática 1 (M1)", attended: true },
  { id: 3, name: "Invierno 3", date: "17 de mayo 2026", subject: "Ciencias", attended: true },
  { id: 4, name: "Invierno 4", date: "24 de mayo 2026", subject: "Matemática 2 (M2)", attended: true },
  { id: 5, name: "Invierno 5", date: "31 de mayo 2026", subject: "Historia y Ciencias Sociales", attended: true }
];

const attendanceParams = new URLSearchParams(window.location.search);
let currentExamType = attendanceParams.get("tipo") === "invierno" ? "invierno" : "regular";
let exams = currentExamType === "invierno" ? winterExams : regularExams;

function getExamStorageKey(id, type = currentExamType) {
  return type === "invierno" ? `paesWinterExamResult_${id}` : `paesExamResult_${id}`;
}

function getExamUrl(id, type = currentExamType) {
  return type === "invierno" ? `ensayo.html?tipo=invierno&id=${id}` : `ensayo.html?id=${id}`;
}

function configureExamTypeTabs() {
  const tabs = document.querySelectorAll("[data-exam-type]");
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.examType === currentExamType);
    tab.addEventListener("click", () => {
      currentExamType = tab.dataset.examType;
      exams = currentExamType === "invierno" ? winterExams : regularExams;
      tabs.forEach(item => item.classList.toggle("active", item === tab));

      const title = document.querySelector("#examListHeading");
      if (title) title.textContent = currentExamType === "invierno" ? "Ensayos PAES de Invierno" : "Ensayos PAES Regular";

      renderAttendanceSummary();
      renderExamList();
      selectExam(1);
      history.replaceState(null, "", currentExamType === "invierno" ? "asistencia.html?tipo=invierno" : "asistencia.html");
    });
  });

  const title = document.querySelector("#examListHeading");
  if (title) title.textContent = currentExamType === "invierno" ? "Ensayos PAES de Invierno" : "Ensayos PAES Regular";
}


function renderEvents() {
  const container = document.querySelector("#eventContainer");
  if (!container) return;
  container.innerHTML = events.map(event => `
    <article class="event-card"><div class="event-top"><span class="pill">${event.type}</span><span>${event.days}</span></div><h3>${event.title}</h3><p><strong>${event.date}</strong></p><p>${event.description}</p><div class="event-illustration">${event.icon}</div></article>
  `).join("");
}

function renderStudyItems(items = studyItems) {
  const container = document.querySelector("#studyContainer");
  if (!container) return;
  container.innerHTML = items.map(item => `
    <article class="study-card" style="--card-bg:${item.bg};--progress:${item.color};"><div class="study-card-header"><div class="subject-icon">${item.icon}</div><div><span class="pill" style="background:${item.color}">${item.category}</span><div class="study-time">${item.time}</div></div></div><h3>${item.subject}</h3><p>${item.description}</p><div class="progress-track"><div class="progress-fill" style="width:${item.progress}%"></div></div><span class="progress-label">${item.status}</span></article>
  `).join("");
}

function renderServices() {
  const container = document.querySelector("#servicesContainer");
  if (!container) return;
  container.innerHTML = services.map(service => `<a class="service-card service-card-link" href="${service.href}"><div class="service-icon">${service.icon}</div><h3>${service.title}</h3><p>${service.description}</p></a>`).join("");
}

function configureFilters() {
  const buttons = document.querySelectorAll(".filter-button");
  if (!buttons.length) return;
  buttons.forEach(button => button.addEventListener("click", () => {
    buttons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderStudyItems(button.dataset.filter === "pendientes" ? studyItems.filter(item => item.status === "Pendiente") : studyItems);
  }));
}

function configureMenu() {
  const menu = document.querySelector("#sideMenu");
  const overlay = document.querySelector("#menuOverlay");
  const openButton = document.querySelector("#menuButton");
  const closeButton = document.querySelector("#closeMenu");
  if (!menu || !overlay || !openButton || !closeButton) return;
  const openMenu = () => { menu.classList.add("open"); overlay.classList.add("visible"); menu.setAttribute("aria-hidden", "false"); };
  const closeMenu = () => { menu.classList.remove("open"); overlay.classList.remove("visible"); menu.setAttribute("aria-hidden", "true"); };
  openButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
}

function configureBottomNavigation() {
  document.querySelectorAll(".bottom-nav-item").forEach(item => item.addEventListener("click", () => {
    document.querySelectorAll(".bottom-nav-item").forEach(link => link.classList.remove("active"));
    item.classList.add("active");
  }));
}

function renderAttendanceSummary() {
  const list = document.querySelector("#examList");

  if (!list) return;

  // =========================================
  // CALCULAR ASISTENCIA GENERAL
  // =========================================

  const attended = exams.filter(
    exam => exam.attended
  ).length;

  const totalExams = exams.length;

  const attendancePercentage = Math.round(
    (attended / totalExams) * 100
  );

  // =========================================
  // MOSTRAR RESUMEN
  // =========================================

  const scheduledCount =
    document.querySelector("#scheduledCount");

  const attendedCount =
    document.querySelector("#attendedCount");

  const attendancePercent =
    document.querySelector("#attendancePercent");

  const attendanceFraction =
    document.querySelector("#attendanceFraction");

  const attendanceDonut =
    document.querySelector("#attendanceDonut");


  if (scheduledCount) {
    scheduledCount.textContent = totalExams;
  }

  if (attendedCount) {
    attendedCount.textContent = attended;
  }

  if (attendancePercent) {
    attendancePercent.textContent =
      `${attendancePercentage}%`;
  }

  if (attendanceFraction) {
    attendanceFraction.textContent =
      `${attended} de ${totalExams} ensayos`;
  }

  if (attendanceDonut) {
    attendanceDonut.style.setProperty(
      "--value",
      attendancePercentage
    );
  }


  // =========================================
  // RESUMEN POR ÁREA
  // =========================================

  const competencyContainer =
    document.querySelector("#competencyContainer");

  if (competencyContainer) {

    const subjects = [
      ...new Set(
        exams.map(exam => exam.subject)
      )
    ];

    competencyContainer.innerHTML =
      subjects.map(subject => {

        const subjectExams =
          exams.filter(
            exam => exam.subject === subject
          );

        const subjectAttended =
          subjectExams.filter(
            exam => exam.attended
          ).length;

        const subjectPercentage =
          Math.round(
            (
              subjectAttended /
              subjectExams.length
            ) * 100
          );

        return `
          <div class="competency-row">

            <div class="competency-label">
              <span>${subject}</span>
              <strong>${subjectPercentage}%</strong>
            </div>

            <div class="competency-progress">
              <div
                class="competency-progress-fill"
                style="width: ${subjectPercentage}%"
              ></div>
            </div>

          </div>
        `;

      }).join("");
  }
}

function renderExamList() {
  const list = document.querySelector("#examList");

  if (!list) return;

  list.innerHTML = exams.map(exam => {

    const storedResult =
      localStorage.getItem(
        getExamStorageKey(exam.id)
      );

    let result = null;

    if (storedResult) {
      result = JSON.parse(storedResult);
    }

    let scoreText = "--";
    let scoreClass = "";

    if (result) {
      scoreText = `${result.percentage}%`;

      if (result.percentage >= 70) {
        scoreClass = "good";
      } else if (result.percentage >= 50) {
        scoreClass = "medium";
      } else {
        scoreClass = "low";
      }
    }

    const statusText =
      exam.attended
        ? "Asistido"
        : "Ausente";

    const statusClass =
      exam.attended
        ? "status-attended"
        : "status-absent";

    const rowClass =
      exam.attended
        ? "exam-row"
        : "exam-row absent";

    return `
      <div
        class="${rowClass}"
        data-exam-id="${exam.id}"
      >

        <div class="exam-number">
          ${exam.id}
        </div>

        <div class="exam-main">

          <strong>
            ${exam.name}
          </strong>

          <span>
            ${exam.date}
          </span>

          <small>
            ${exam.subject}
          </small>

        </div>

        <div class="${statusClass}">
          ${exam.attended ? "✓" : "✕"}
          ${statusText}
        </div>

        <div class="score-ring ${scoreClass}">
          <span>${scoreText}</span>
        </div>

      </div>
    `;

  }).join("");


  // =========================================
  // ABRIR ENSAYOS
  // =========================================

  list.querySelectorAll(".exam-row")
    .forEach(row => {

      row.addEventListener("click", () => {

        const examId =
          Number(row.dataset.examId);

        selectExam(examId);

      });

    });
}

let selectedExamId = null;
let currentQuestionFilter = "all";

function selectExam(id) {
  selectedExamId = id;
  currentQuestionFilter = "all";
  document.querySelectorAll(".exam-row").forEach(r => r.classList.toggle("active", Number(r.dataset.examId) === id));
  const exam = exams.find(e => e.id === id);
  renderExamDetail(exam);
  const qd = document.querySelector("#questionDetail");
  if (qd) qd.classList.add("hidden");
}

function renderExamDetail(exam) {

  const detail =
    document.querySelector("#examDetail");

  if (!detail) return;


  // =========================================
  // ENSAYO AUSENTE
  // =========================================

  if (!exam.attended) {

    detail.innerHTML = `
      <div class="exam-detail-head">

        <div>
          <h2>${exam.name}</h2>

          <p>
            ${exam.subject} · ${exam.date}
          </p>
        </div>

        <strong class="status-absent">
          ✕ Ausente
        </strong>

      </div>

      <p style="margin-top:25px;color:#667085;">
        No existen resultados porque el estudiante
        figura como ausente en este ensayo.
      </p>
    `;

    return;
  }


  // =========================================
  // BUSCAR RESULTADO GUARDADO
  // =========================================

  const storedResult =
    localStorage.getItem(
      getExamStorageKey(exam.id)
    );

  let result = null;

  if (storedResult) {
    result = JSON.parse(storedResult);
  }


  // =========================================
  // TODAVÍA NO HA RENDIDO EL ENSAYO
  // =========================================

  if (!result) {

    detail.innerHTML = `
      <div class="exam-detail-head">

        <div>
          <h2>${exam.name}</h2>

          <p>
            ${exam.subject} · ${exam.date}
          </p>
        </div>

        <strong class="status-attended">
          ✓ Asistido
        </strong>

      </div>

      <div class="exam-metrics">

        <div class="metric-box">
          <span>Resultado</span>
          <strong>--</strong>
        </div>

        <div class="metric-box">
          <span>Porcentaje</span>
          <strong>--</strong>
        </div>

        <div class="metric-box">
          <span>Estado</span>
          <strong class="status-attended">
            Pendiente
          </strong>
        </div>

      </div>

      <p style="margin-top:25px;color:#667085;">
        Este ensayo todavía no tiene un resultado guardado.
      </p>

      <button
        class="exam-button primary"
        onclick="window.location.href='${getExamUrl(exam.id)}'"
        style="margin-top:20px;"
      >
        Rendir ensayo
      </button>
    `;

    return;
  }


  // =========================================
  // RESULTADO EXISTENTE
  // =========================================

  const questions =
    result.questions || [];

  const correct =
    result.correctAnswers || 0;

  const wrong =
    result.incorrectAnswers || 0;

  const percentage =
    result.percentage || 0;


  detail.innerHTML = `

    <div class="exam-detail-head">

      <div>

        <h2>${exam.name}</h2>

        <p>
          ${exam.subject} · ${exam.date}
        </p>

      </div>

      <strong class="status-attended">
        ✓ Asistido
      </strong>

    </div>


    <div class="exam-metrics">

      <div class="metric-box">

        <span>
          Resultado
        </span>

        <strong>
          ${correct} de ${result.totalQuestions}
        </strong>

      </div>


      <div class="metric-box">

        <span>
          Porcentaje
        </span>

        <strong>
          ${percentage}%
        </strong>

      </div>


      <div class="metric-box">

        <span>
          Estado
        </span>

        <strong class="status-attended">
          Completado
        </strong>

      </div>

    </div>


    <div class="question-filters">

      <button
        class="question-filter active"
        data-filter="all"
      >
        Todas (${result.totalQuestions})
      </button>

      <button
        class="question-filter"
        data-filter="correct"
      >
        Correctas (${correct})
      </button>

      <button
        class="question-filter"
        data-filter="wrong"
      >
        Incorrectas (${wrong})
      </button>

    </div>


    <div
      class="question-list"
      id="questionList"
    ></div>

    <button
      class="exam-button primary"
      onclick="window.location.href='${getExamUrl(exam.id)}'"
      style="margin-top:20px;"
    >
      Volver a rendir ensayo
    </button>


  `;


  // =========================================
  // FILTROS
  // =========================================

  detail
    .querySelectorAll(".question-filter")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          currentQuestionFilter =
            button.dataset.filter;

          detail
            .querySelectorAll(
              ".question-filter"
            )
            .forEach(item =>
              item.classList.remove(
                "active"
              )
            );

          button.classList.add(
            "active"
          );

          renderQuestionList(
            exam,
            result
          );
        }
      );

    });


  renderQuestionList(
    exam,
    result
  );
}

function renderQuestionList(exam, result) {
  const container =
    document.querySelector("#questionList");

  if (!container) return;

  let questions =
    result.questions || [];

  // =========================================
  // FILTRAR PREGUNTAS
  // =========================================

  if (currentQuestionFilter === "correct") {
    questions =
      questions.filter(
        question => question.correct
      );
  }

  if (currentQuestionFilter === "wrong") {
    questions =
      questions.filter(
        question => !question.correct
      );
  }

  // =========================================
  // SI NO HAY PREGUNTAS
  // =========================================

  if (!questions.length) {
    container.innerHTML = `
      <p style="color:#667085;">
        No hay preguntas para mostrar en este filtro.
      </p>
    `;

    return;
  }

  // =========================================
  // MOSTRAR LISTA
  // =========================================

  container.innerHTML =
    questions.map(question => {

      const statusIcon =
        question.correct
          ? "✓"
          : "✕";

      const statusClass =
        question.correct
          ? "question-correct"
          : "question-wrong";

      const userAnswer =
        question.userAnswer || "--";

      return `
        <div
          class="question-row"
          data-question="${question.number}"
        >

          <div class="question-status ${statusClass}">
            ${statusIcon}
          </div>

          <div class="question-row-main">

            <strong>
              Pregunta ${question.number}
            </strong>

            <span>
              Eje: ${question.axis}
            </span>

          </div>

          <div class="question-answer-summary">

            <span>
              Correcta:
              <strong>
                ${question.correctAnswer}
              </strong>
            </span>

            <span>
              Tu respuesta:
              <strong class="${statusClass}">
                ${userAnswer}
              </strong>
            </span>

          </div>

          <div class="question-arrow">
            ›
          </div>

        </div>
      `;

    }).join("");

  // =========================================
  // ABRIR DETALLE
  // =========================================

  container
    .querySelectorAll(".question-row")
    .forEach(row => {

      row.addEventListener(
        "click",
        () => {

          container
            .querySelectorAll(".question-row")
            .forEach(item =>
              item.classList.remove("active")
            );

          row.classList.add("active");

          renderQuestionDetail(
            exam,
            result,
            Number(
              row.dataset.question
            )
          );
        }
      );

    });
}

function renderQuestionDetail(exam, result, number) {

  const card =
    document.querySelector("#questionDetail");

  if (!card) return;

  const question =
    result.questions.find(
      item => item.number === number
    );

  if (!question) return;

  const userOption =
    question.answers.find(
      option =>
        option.letter === question.userAnswer
    );

  const correctOption =
    question.answers.find(
      option =>
        option.letter === question.correctAnswer
    );

  const userText =
    userOption
      ? userOption.text
      : "Sin respuesta";

  const correctText =
    correctOption
      ? correctOption.text
      : "Sin información";

  const isCorrect =
    question.correct;

  card.classList.remove("hidden");

  card.innerHTML = `

    <div class="question-modal-overlay" id="questionModalOverlay">

      <div class="question-modal">

        <div class="question-modal-header">

          <div>
            <h3>Pregunta ${question.number}</h3>

            <span class="${
              isCorrect
                ? "question-correct"
                : "question-wrong"
            }">

              ${isCorrect ? "✓ Correcta" : "✕ Incorrecta"}

            </span>
          </div>

          <button
            id="closeQuestion"
            class="question-modal-close"
          >
            ×
          </button>

        </div>


        <div class="question-modal-axis">
          <strong>Eje:</strong>
          ${question.axis}
        </div>


        <div class="question-modal-section">

          <h4>Enunciado</h4>

          <div class="prompt-box">
            ${question.text}
          </div>

        </div>


        <div class="question-modal-section">

          <h4>Tu respuesta</h4>

          <div class="
            selected-answer-box
            ${
              isCorrect
                ? "selected-answer-correct"
                : "selected-answer-wrong"
            }
          ">

            <strong>
              ${question.userAnswer || "--"}
            </strong>

            <span>
              ${userText}
            </span>

          </div>

        </div>


        ${
          !isCorrect
            ? `
              <div class="question-modal-section">

                <h4>Respuesta correcta</h4>

                <div class="selected-answer-box selected-answer-correct">

                  <strong>
                    ${question.correctAnswer}
                  </strong>

                  <span>
                    ${correctText}
                  </span>

                </div>

              </div>
            `
            : ""
        }


        <div class="question-modal-section">

          <h4>Explicación</h4>

          <div class="explanation-box">

            ${
              question.explanation ||
              generateExplanation(question)
            }

          </div>

        </div>

      </div>

    </div>
  `;

  const closeButton =
    document.querySelector("#closeQuestion");

  const overlay =
    document.querySelector("#questionModalOverlay");

  function closeModal() {
    card.classList.add("hidden");
    card.innerHTML = "";
  }

  closeButton.addEventListener(
    "click",
    closeModal
  );

  overlay.addEventListener(
    "click",
    event => {

      if (event.target === overlay) {
        closeModal();
      }

    }
  );
}

const questionExplanations = {
  "¿Cuál es la idea principal del texto presentado?": "La idea principal es la afirmación que organiza el contenido completo. En este caso, el texto se orienta a presentar y sostener una opinión sobre un tema, por eso la alternativa B es la más adecuada.",
  "Según la información entregada, ¿qué se puede inferir?": "Inferir significa obtener una conclusión que no aparece escrita de forma literal. Las pistas entregadas permiten deducir que existe una dificultad pendiente de solución, lo que corresponde a la alternativa C.",
  "¿Cuál de las siguientes afirmaciones está mejor respaldada por el texto?": "Una afirmación está respaldada cuando puede justificarse con antecedentes del texto. La alternativa B es la correcta porque indica que se consideraron distintas opciones antes de decidir.",
  "¿Qué propósito cumple el segundo párrafo del texto?": "El segundo párrafo cumple una función de apoyo: entrega un ejemplo que ayuda a desarrollar y hacer más concreta la idea presentada anteriormente. Por eso corresponde la alternativa B.",
  "¿Qué relación existe entre las ideas principales del texto?": "Las ideas no se contradicen ni están aisladas; cada una aporta información que ayuda a desarrollar la otra. Por eso se dice que se complementan entre sí.",
  "¿Cuál de las siguientes opciones resume mejor la información presentada?": "Un buen resumen conserva la idea central y elimina detalles secundarios. La alternativa B sintetiza que el texto desarrolla una idea y la sustenta con antecedentes.",
  "¿Qué conclusión puede obtenerse a partir de la información entregada?": "La conclusión debe desprenderse de los antecedentes disponibles. En este caso, la información permite comprender mejor el tema tratado, por lo que la alternativa B es la más coherente.",
  "¿Cuál de las siguientes opciones corresponde a una opinión?": "Una opinión contiene una valoración subjetiva. La expresión «realmente sorprendentes» depende de una apreciación personal, a diferencia de fechas o cantidades que pueden verificarse objetivamente.",
  "¿Qué función cumple la información complementaria dentro del texto?": "La información complementaria aporta datos o antecedentes secundarios que ayudan a entender y respaldar la idea principal. Por eso la alternativa A es correcta.",
  "¿Cuál de las siguientes afirmaciones representa mejor la conclusión del texto?": "Una conclusión reúne lo desarrollado y formula una idea final coherente con los antecedentes. La alternativa A cumple esa función porque plantea una conclusión fundamentada en la información presentada.",

  "¿Cuál es el resultado de 3 + 5 × 2?": "Primero se resuelve la multiplicación: 5 × 2 = 10. Luego se suma 3: 3 + 10 = 13. Por eso la respuesta correcta es B.",
  "Si 2x + 6 = 14, ¿cuál es el valor de x?": "Se resta 6 en ambos lados: 2x = 8. Después se divide por 2: x = 4. Por eso la alternativa correcta es B.",
  "¿Cuál es el 25% de 200?": "El 25% equivale a 0,25. Entonces 200 × 0,25 = 50. Por eso la respuesta correcta es C.",
  "Si x = 3, ¿cuál es el valor de 2x² + 1?": "Se reemplaza x por 3: 2(3²) + 1 = 2(9) + 1 = 18 + 1 = 19. La alternativa correcta es C.",
  "Un rectángulo mide 8 cm de largo y 5 cm de ancho. ¿Cuál es su área?": "El área de un rectángulo se calcula multiplicando largo por ancho: 8 × 5 = 40 cm². Por eso la alternativa correcta es C.",
  "¿Cuál es el perímetro de un cuadrado cuyo lado mide 6 cm?": "Un cuadrado tiene cuatro lados iguales. Su perímetro es 4 × 6 = 24 cm, por lo tanto la respuesta correcta es B.",
  "¿Cuál es el promedio de los números 4, 6, 8 y 10?": "Se suman los cuatro valores: 4 + 6 + 8 + 10 = 28. Luego se divide por 4: 28 ÷ 4 = 7. La respuesta correcta es B.",
  "Al lanzar un dado de seis caras, ¿cuál es la probabilidad de obtener un número par?": "Los resultados pares posibles son 2, 4 y 6: hay 3 casos favorables de 6 posibles. Entonces 3/6 = 1/2. La alternativa correcta es C.",
  "¿Cuál es el resultado de (x + 2)(x + 3)?": "Aplicando la propiedad distributiva: x·x + 3x + 2x + 6 = x² + 5x + 6. Por eso la alternativa correcta es A.",
  "Una chaqueta cuesta $40.000 y tiene un descuento del 20%. ¿Cuál es su precio final?": "El 20% de $40.000 es $8.000. Al restar el descuento: $40.000 - $8.000 = $32.000. La alternativa correcta es C.",

  "¿Cuál es la principal función de la membrana plasmática en una célula?": "La membrana plasmática actúa como una barrera selectiva: controla qué sustancias entran y salen de la célula, ayudando a mantener condiciones internas adecuadas. Por eso la alternativa B es correcta.",
  "¿En qué organelo celular ocurre principalmente la respiración celular?": "La mayor parte de la respiración celular aeróbica y la producción de ATP ocurre en las mitocondrias. Por eso la alternativa correcta es C.",
  "¿Qué molécula contiene principalmente la información genética de los seres vivos?": "El ADN almacena la información genética mediante su secuencia de nucleótidos y permite transmitirla entre células y generaciones. La alternativa correcta es B.",
  "¿Cuál de las siguientes sustancias corresponde a un elemento químico?": "El oxígeno está formado por un solo tipo de átomo. Aunque normalmente se encuentre como O₂, sigue siendo un elemento químico. Por eso la alternativa correcta es C.",
  "Una disolución con pH menor que 7 se considera:": "En la escala de pH, los valores menores que 7 corresponden a soluciones ácidas, 7 es neutro y los valores mayores que 7 son básicos. Por eso la alternativa correcta es A.",
  "¿Cuál de los siguientes cambios corresponde a un cambio químico?": "La oxidación del hierro forma nuevas sustancias, como óxidos de hierro. Al cambiar la composición de la materia, se trata de un cambio químico. Por eso la alternativa D es correcta.",
  "Un automóvil recorre 120 km en 2 horas. ¿Cuál es su rapidez promedio?": "La rapidez promedio se calcula como distancia dividida por tiempo: 120 km ÷ 2 h = 60 km/h. Por eso la alternativa correcta es B.",
  "Según la segunda ley de Newton, ¿qué relación existe entre fuerza, masa y aceleración?": "La segunda ley de Newton establece que la fuerza neta es igual al producto de la masa por la aceleración: F = m × a. Por eso la alternativa correcta es A.",
  "¿Qué tipo de energía posee principalmente un objeto debido a su movimiento?": "La energía asociada al movimiento de un cuerpo se denomina energía cinética. Mientras mayor sea su masa o rapidez, mayor puede ser esta energía. Por eso la alternativa C es correcta.",
  "En un experimento científico, ¿qué variable modifica intencionalmente el investigador para observar su efecto?": "La variable independiente es la que el investigador cambia deliberadamente. Luego observa cómo ese cambio afecta a la variable dependiente. Por eso la alternativa B es correcta.",

  "Si f(x) = 2x + 3, ¿cuál es el valor de f(4)?": "Se reemplaza x por 4: f(4) = 2·4 + 3 = 8 + 3 = 11. Por eso la alternativa correcta es C.",
  "¿Cuáles son las soluciones de la ecuación x² - 5x + 6 = 0?": "Se factoriza como (x - 2)(x - 3) = 0. Cada factor puede ser cero, por lo que x = 2 o x = 3. La alternativa correcta es B.",
  "Una función exponencial está dada por f(x) = 2ˣ. ¿Cuál es el valor de f(3)?": "Se reemplaza x por 3: f(3) = 2³ = 2 × 2 × 2 = 8. La alternativa correcta es C.",
  "Un triángulo rectángulo tiene catetos de 6 cm y 8 cm. ¿Cuánto mide su hipotenusa?": "Aplicando Pitágoras: c² = 6² + 8² = 36 + 64 = 100. Entonces c = √100 = 10 cm. La alternativa correcta es A.",
  "¿Cuál es el área de un círculo de radio 5 cm? Considera π ≈ 3,14.": "El área de un círculo es A = πr². Con r = 5: A = 3,14 × 25 = 78,5 cm². Por eso la alternativa correcta es C.",
  "En un triángulo rectángulo, si el cateto opuesto a un ángulo mide 3 y la hipotenusa mide 5, ¿cuál es el seno del ángulo?": "En un triángulo rectángulo, sen(θ) = cateto opuesto / hipotenusa. Entonces sen(θ) = 3/5. La alternativa correcta es A.",
  "En una bolsa hay 4 bolitas rojas y 6 azules. Si se extrae una al azar, ¿cuál es la probabilidad de obtener una roja?": "Hay 10 bolitas en total y 4 son rojas. La probabilidad es 4/10, que se simplifica a 2/5. Por eso la alternativa correcta es B.",
  "Los valores de un conjunto de datos son 2, 4, 4, 6 y 9. ¿Cuál es la mediana?": "Los datos ya están ordenados. Como hay cinco valores, la mediana es el valor central, es decir, el tercero: 4. Por eso la alternativa correcta es B.",
  "Si log₁₀(1000) = x, ¿cuál es el valor de x?": "El logaritmo pregunta a qué potencia debe elevarse 10 para obtener 1000. Como 10³ = 1000, entonces x = 3. La alternativa correcta es B.",
  "En un curso, las notas de cinco estudiantes son 4, 5, 5, 6 y 7. ¿Cuál es la moda?": "La moda es el valor que aparece con mayor frecuencia. El 5 aparece dos veces y los demás solo una, por eso la moda es 5 y la alternativa correcta es B.",

  "¿Cuál fue una de las principales características del proceso de Independencia de Chile?": "La Independencia no fue un proceso uniforme: participaron distintos grupos sociales y políticos con intereses y proyectos diferentes. Por eso la alternativa B representa mejor una característica del proceso.",
  "¿Qué proceso político ocurrió en Chile a partir de 1990?": "A partir de 1990 Chile inició una etapa de transición democrática tras el régimen militar, con el retorno de autoridades civiles elegidas. Por eso la alternativa correcta es B.",
  "¿Cuál fue una consecuencia importante de la Revolución Industrial?": "La industrialización concentró fábricas y empleos en centros urbanos, impulsando la migración desde zonas rurales y el crecimiento de las ciudades. Por eso la alternativa C es correcta.",
  "¿Cuál fue uno de los principales objetivos de la Revolución Francesa?": "La Revolución Francesa cuestionó los privilegios del Antiguo Régimen y difundió principios como libertad e igualdad ante la ley. Por eso la alternativa correcta es C.",
  "En una democracia, ¿cuál es una función principal del voto?": "El voto es un mecanismo de participación ciudadana que permite elegir representantes y autoridades mediante elecciones. Por eso la alternativa B es correcta.",
  "¿Cuál de las siguientes instituciones tiene como función principal elaborar leyes en Chile?": "El Congreso Nacional ejerce la función legislativa junto con las atribuciones que establece la Constitución, por lo que participa en la elaboración y tramitación de leyes. La alternativa correcta es A.",
  "¿Qué fenómeno explica principalmente la existencia de diferentes zonas climáticas en Chile?": "Chile se extiende por muchos grados de latitud de norte a sur. Esa gran extensión modifica la radiación solar y las condiciones climáticas, contribuyendo a la diversidad de zonas climáticas. Por eso la alternativa A es correcta.",
  "¿Cuál es una característica importante de la zona central de Chile?": "La zona central concentra una parte importante de la población del país y numerosas actividades económicas y urbanas. Por eso la alternativa B es correcta.",
  "¿Qué significa que un recurso sea escaso en economía?": "En economía, la escasez significa que los recursos disponibles son limitados frente a necesidades y deseos que pueden ser mayores. Por eso la alternativa correcta es C.",
  "¿Cuál de las siguientes situaciones corresponde a una decisión económica?": "Una decisión económica implica elegir cómo utilizar recursos limitados entre diferentes alternativas. Distribuir un presupuesto limitado representa justamente ese problema, por eso la alternativa A es correcta.",

  "¿Qué función cumple una conclusión dentro de un texto argumentativo?": "La conclusión retoma la tesis o idea principal y cierra el razonamiento, reforzando lo argumentado previamente. Por eso la alternativa B es correcta.",
  "¿Cuál de las siguientes opciones corresponde a una inferencia?": "Una inferencia es una conclusión que el lector construye usando pistas del texto y conocimientos previos, aunque no esté escrita literalmente. Por eso la alternativa correcta es B.",
  "Si 3x - 5 = 16, ¿cuál es el valor de x?": "Se suma 5 en ambos lados: 3x = 21. Luego se divide por 3: x = 7. Por eso la alternativa correcta es C.",
  "Un producto cuesta $25.000 y aumenta su precio en un 20%. ¿Cuál es el nuevo precio?": "El 20% de $25.000 es $5.000. Al sumar el aumento: $25.000 + $5.000 = $30.000. Por eso la alternativa correcta es B.",
  "Si f(x) = x² + 2, ¿cuál es el valor de f(3)?": "Se reemplaza x por 3: f(3) = 3² + 2 = 9 + 2 = 11. Por eso la alternativa correcta es C.",
  "En un triángulo rectángulo, los catetos miden 5 cm y 12 cm. ¿Cuánto mide la hipotenusa?": "Aplicando Pitágoras: c² = 5² + 12² = 25 + 144 = 169. Entonces c = √169 = 13 cm. La alternativa correcta es A.",
  "¿Cuál es la función principal de los glóbulos rojos en el organismo?": "Los glóbulos rojos contienen hemoglobina, una proteína que transporta principalmente oxígeno desde los pulmones hacia los tejidos. Por eso la alternativa B es correcta.",
  "¿Qué ocurre con la rapidez de un objeto si recorre una mayor distancia en el mismo tiempo?": "La rapidez se calcula como distancia dividida por tiempo. Si el tiempo permanece igual y aumenta la distancia recorrida, la rapidez también aumenta. Por eso la alternativa C es correcta.",
  "¿Cuál es una característica fundamental de un Estado democrático?": "Un Estado democrático permite la participación ciudadana y la elección periódica de autoridades mediante procedimientos electorales. Por eso la alternativa B es correcta.",
  "¿Cuál fue una consecuencia importante de la industrialización?": "La industrialización generó concentración de fábricas y puestos de trabajo en áreas urbanas, provocando migración y crecimiento de las ciudades. Por eso la alternativa A es correcta."
};

function generateExplanation(question) {
  const specificExplanation = questionExplanations[question.text];
  if (specificExplanation) return specificExplanation;

  const correctOption = question.answers.find(
    option => option.letter === question.correctAnswer
  );

  if (!correctOption) {
    return "Revisa el procedimiento y los conceptos asociados a esta pregunta para identificar por qué la alternativa elegida no corresponde.";
  }

  return `La alternativa <strong>${question.correctAnswer}</strong> es correcta. ${correctOption.text} Revisa el concepto principal de <strong>${question.axis}</strong> y compáralo con las demás alternativas para reconocer por qué se descartan.`;
}


function renderHomeProgress() {
  const averageEl = document.querySelector("#homeAverageResult");
  const completedEl = document.querySelector("#homeCompletedProgress");
  const completedBar = document.querySelector("#homeCompletedProgressBar");
  if (!averageEl && !completedEl && !completedBar) return;

  const results = regularExams
    .filter(exam => exam.id <= 6)
    .map(exam => {
      const raw = localStorage.getItem(getExamStorageKey(exam.id, "regular"));
      if (!raw) return null;
      try { return JSON.parse(raw); } catch (error) { return null; }
    })
    .filter(Boolean);

  const average = results.length
    ? Math.round(results.reduce((sum, result) => sum + (result.percentage || 0), 0) / results.length)
    : null;
  const completedPct = Math.round((results.length / 6) * 100);

  if (averageEl) averageEl.innerHTML = average === null ? `-- <small>promedio</small>` : `${average}% <small>promedio</small>`;
  if (completedEl) completedEl.textContent = `${completedPct}%`;
  if (completedBar) completedBar.style.width = `${completedPct}%`;
}


renderEvents();
renderStudyItems();
renderServices();
configureFilters();
configureMenu();
configureBottomNavigation();
configureExamTypeTabs();
renderAttendanceSummary();
renderExamList();
renderHomeProgress();
if (document.querySelector("#examList")) selectExam(1);


// PAESNET_CALENDAR_LINK
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".calendar-button, .text-button").forEach(button => {
    if (button.textContent.includes("calendario") || button.textContent.includes("Ver todos")) {
      button.addEventListener("click", () => { window.location.href = "calendario.html"; });
    }
  });
});
