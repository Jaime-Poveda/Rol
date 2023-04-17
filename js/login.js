const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function (event) {
  $("#logInForm").submit(logIn);
});

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
        console.log(response.data.user);
        window.location.href = "index.html";
      }
    })
    .catch((err) => {
      alert(err);
    });
}
