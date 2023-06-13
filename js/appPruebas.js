//import { createClient } from "@supabase/supabase-js";
const { createClient } = supabase;

const supabaseUrl = "https://afribcvcanlurbnjrioe.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

//const supabase = createClient(supabaseUrl, supabaseKey);
const _supabase = createClient(supabaseUrl, supabaseKey);
//console.log("Supabase Instance: ", _supabase);

if (localStorage.getItem("User") === "") {
  $("#logZone").append(`
    <a href="login.html" class="btn btn-primary">Login</a>
  `)
} else {
  $("#logZone").append(`
    Hola `+ localStorage.getItem("User") + `
    <a href="index.html" id="logOutButton" class="btn btn-danger">Logout</a>
  `)
}


document.addEventListener('DOMContentLoaded', function (event) {
  var signUpForm = document.querySelector('#sign-up')
  signUpForm.onsubmit = signUpSubmitted.bind(signUpForm)
});

const signUpSubmitted = (event) => {
  event.preventDefault()
  //console.log("hola");
  const email = event.target[0].value
  const password = event.target[1].value

  _supabase.auth
    .signUp({ email, password })
    .then((response) => {
      //response.error ? alert(response.error.message) : console.log(response)
    })
    .catch((err) => {
      alert(err)
    })
}

/* $(document).ready(async function () {
  $("#registerButton").click(async function () {

    //signInWithEmail($("#registerEmail")[0].value, $("#registerPassword")[0].value);

    console.log("hola");

    let email = $("#registerEmail")[0].value;
    let password = $("#registerPassword")[0].value;
    _supabase.auth
      .signUp({ email, password })
      .then((response) => {
        response.error ? alert(response.error.message) : console.log(response)
      })
      .catch((err) => {
        alert(err)
      })

    localStorage.setItem("User", email);
  })
  $("#loginButton").click(function () {
    localStorage.setItem("User", "Jaime");
  })
  $("#logOutButton").click(function () {
    localStorage.setItem("User", "");
  })
});

async function signInWithEmail(email, password) {
  console.log("hola");
  console.log(await _supabase.auth.signInWithPassword({
    email: email,
    password: password,
  }))
  localStorage.setItem("User", email);
} */

//Registro
/* console.log(
  await _supabase.auth.signUp({
    email: "example@email.com",
    password: "example-password",
  })
); */


//Login
/* console.log("Login:");
console.log(
  await _supabase.auth.signInWithPassword({
    email: "example@email.com",
    password: "example-password",
  })
);

console.log("Session:");
console.log(await _supabase.auth.getSession());
console.log("User:");
console.log(await _supabase.auth.getUser()); */


/* const { data, error } = await _supabase.auth.getSession()
console.log(data); */
