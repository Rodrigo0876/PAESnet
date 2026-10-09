const SESSION_KEY="paesnetSession",ACCOUNT_KEY="superpaesAccounts",CURRENT="superpaesCurrentEmail";
const $=id=>document.getElementById(id);
const getAccounts=()=>{try{return JSON.parse(localStorage.getItem(ACCOUNT_KEY)||"{}")}catch{return {}}};
let registerMode=false;
if(localStorage.getItem(SESSION_KEY)==="active")location.replace("inicio.html");
function mode(register){registerMode=register;$("registerFields").hidden=!register;$("loginHelp").hidden=register;$("demoAccess").hidden=true;$("forgotPassword").setAttribute("aria-expanded","false");$("authHeading").textContent=register?"Crear cuenta":"Iniciar sesión";$("authSubmit").textContent=register?"Crear cuenta":"Iniciar sesión";$("showLogin").classList.toggle("active",!register);$("showRegister").classList.toggle("active",register);$("loginMessage").textContent="";$("loginPassword").autocomplete=register?"new-password":"current-password";}
$("showLogin").onclick=()=>mode(false);$("showRegister").onclick=()=>mode(true);
$("togglePassword").onclick=()=>{let el=$("loginPassword");el.type=el.type==="password"?"text":"password";$("togglePassword").textContent=el.type==="password"?"Ver":"Ocultar"};
$("forgotPassword").onclick=()=>{const panel=$("demoAccess");panel.hidden=!panel.hidden;$("forgotPassword").setAttribute("aria-expanded",String(!panel.hidden));$("loginMessage").textContent="La recuperación de contraseñas reales no está disponible en esta versión local."};
$("useDemoAccount").onclick=()=>{mode(false);$("demoAccess").hidden=false;$("forgotPassword").setAttribute("aria-expanded","true");$("loginEmail").value="demo@superpaes.cl";$("loginPassword").value="superpaesdemo";$("loginMessage").textContent="Cuenta de prueba cargada. Presiona Iniciar sesión.";$("loginMessage").className="login-message success";};
$("loginForm").onsubmit=async e=>{e.preventDefault();const email=$("loginEmail").value.trim().toLowerCase(),pass=$("loginPassword").value,msg=$("loginMessage"),accounts=getAccounts();msg.className="login-message error";
if(registerMode){const name=$("regName").value.trim(),school=$("regSchool").value.trim(),course=$("regCourse").value;if(!name||!school||!email||pass.length<6){msg.textContent="Completa los datos y usa una contraseña de al menos 6 caracteres.";return}if(accounts[email]){msg.textContent="Este correo ya está registrado en este navegador.";return}accounts[email]={name,school,course,email,password:pass};localStorage.setItem(ACCOUNT_KEY,JSON.stringify(accounts));localStorage.setItem("superpaesProfile:"+email,JSON.stringify({name,school,course,email}));}
else if(!(accounts[email]&&accounts[email].password===pass) && !(email==="cristobalcontreras@paesnet.cl"&&pass==="paes2026") && !(email==="demo@superpaes.cl"&&pass==="superpaesdemo")){msg.textContent="Correo o contraseña incorrectos.";return}
if(email==="demo@superpaes.cl"&&!localStorage.getItem("superpaesProfile:"+email)){localStorage.setItem("superpaesProfile:"+email,JSON.stringify({name:"Estudiante de prueba",school:"Colegio de demostración",course:"4° Medio",email}));}
localStorage.setItem(CURRENT,email);localStorage.setItem(SESSION_KEY,"active");location.href="inicio.html";
};
