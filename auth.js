(function () {
  const SESSION_KEY = "paesnetSession";
  const LOGIN_PAGE = "index.html";
  const isLoggedIn = localStorage.getItem(SESSION_KEY) === "active";
  if (!isLoggedIn) {
    window.location.replace(LOGIN_PAGE);
  }
})();
