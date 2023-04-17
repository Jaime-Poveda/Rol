const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function (event) {
  loadLogin();
  testZone();
  loadCharacters();
});

async function loadLogin() {
  let user = await SUPABASE.auth.getUser();

  if (user.data.user === null) {
    $("#logZone").append(`
      <a href="login.html" class="btn btn-primary">Login</a>
    `);
  } else {
    $("#logZone").append(
      `
      Hola ` +
        user.data.user.email +
        `
      <button id="logOutButton" class="btn btn-danger">Logout</button>
    `
    );
    $("#logOutButton").click(logOut);
  }
}

function logOut(event) {
  event.preventDefault();

  SUPABASE.auth
    .signOut()
    .then((_response) => {
      alert("Logout successful");
      window.location.href = "index.html";
    })
    .catch((err) => {
      alert(err.response.text);
    });
}

async function testZone() {
  let user = await SUPABASE.auth.getUser();

  if (user.data.user !== null) {
    $("#testZone").append(
      `
      User Id: ` +
        user.data.user.id +
        `<br>
      Date: ` +
        user.data.user.created_at +
        `
    `
    );
  }
}

async function loadCharacters() {
  let user = await SUPABASE.auth.getUser();

  //console.log(user.data);

  let characterRow = await SUPABASE.from("characters")
    .select()
    .eq("userId", user.data.user.id);

  //console.log(characterRow);
}

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let value = params.id;
console.log(params.id);
