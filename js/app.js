const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

if (localStorage.getItem("User") === "") {
  $("#logZone").append(`
    <a href="login.html" class="btn btn-primary">Login</a>
  `);
} else {
  $("#logZone").append(
    `
    Hola ` +
      localStorage.getItem("User") +
      `
    <button id="logOutButton" class="btn btn-danger">Logout</button>
  `
  );
}

document.addEventListener("DOMContentLoaded", function (event) {
  $("#signUpForm").submit(signUp);
  $("#logInForm").submit(logIn);
  $("#logOutButton").click(logOut);
});

function signUp(event) {
  event.preventDefault();
  let email = event.target[0].value;
  let password = event.target[1].value;

  SUPABASE.auth
    .signUp({ email, password })
    .then((response) => {
      if (response.error) {
        alert(response.error.message);
      } else {
        localStorage.setItem("User", response.data.user.email);
        window.location.href = "index.html";
      }
    })
    .catch((err) => {
      alert(err);
    });
}

function logIn(event) {
  event.preventDefault();
  let email = event.target[0].value;
  let password = event.target[1].value;

  SUPABASE.auth
    .signInWithPassword({ email, password })
    .then((response) => {
      if (response.error) {
        alert(response.error.message);
      } else {
        localStorage.setItem("User", response.data.user.email);
        window.location.href = "index.html";
      }
    })
    .catch((err) => {
      alert(err);
    });
}

function logOut(event) {
  event.preventDefault();

  SUPABASE.auth
    .signOut()
    .then((_response) => {
      console.log(_response);
      localStorage.setItem("User", "");
      alert("Logout successful");
      window.location.href = "index.html";
    })
    .catch((err) => {
      alert(err.response.text);
    });
}
