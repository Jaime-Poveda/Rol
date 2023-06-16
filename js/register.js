const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function (event) {
  $("#signUpForm").submit(signUp);
});

async function signUp(event) {
  event.preventDefault();
  let email = $("#registerEmail")[0].value;
  let name = $("#registerName")[0].value;
  let password = $("#registerPassword")[0].value;

  SUPABASE.auth
    .signUp({ email, password })
    .then((response) => {
      if (response.error) {
        alert(response.error.message);
      } else {
        //window.location.href = "index.html";
        /* console.log(response);
        console.log(response.data.user.id); */
        SUPABASE.from("users")
          .insert({
            id: response.data.user.id,
            name: name
          })
          .then((_response) => {
            //alert("Create successful");
            window.location.href = "index.html";
          })
          .catch((err) => {
            alert(err.response.text);
          });
      }
    })
    .catch((err) => {
      //alert(err);
    });

  /* let user = await SUPABASE.auth.getUser();

  SUPABASE.from("users")
    .insert({
      id: user.data.user.id,
      name: name
    })
    .then((_response) => {
      //alert("Create successful");
      window.location.href = "index.html";
    })
    .catch((err) => {
      //alert(err.response.text);
    }); */
}

