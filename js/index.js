const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function (event) {
  loadLogin();
  //testZone();
});

async function loadLogin() {
  let user = await SUPABASE.auth.getUser();

  if (user.data.user === null) {
    $("#logZone").append(`
      <a href="login.html" class="btn btn-primary">Login</a>
    `);
  } else {
    let userRow = await SUPABASE.from("users").select().eq("id", user.data.user.id);
    $("#logZone").append(
      `
      Hola ` +
      userRow.data[0].name +
      `
      <button id="logOutButton" class="btn btn-danger">Logout</button>
    `
    );
    $("#characters").append(`
      <a href="createCharacter.html" class="btn btn-success">Crear personaje</a>
    `);
    $("#logOutButton").click(logOut);

    if (userRow.data[0].admin) {
      $("#adminZone").append(`
        <h1>Zona de admin</h1>
        <a href="createSystem.html" class="btn btn-success">Añadir sistema</a>
      `)
      loadSystems();
    }

    loadCharacters();
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
  for (let i = 0; i < characterRow.data.length; i++) {
    //console.log(characterRow.data[i]);
    $("#charactersZone").append(
      `
      <div class="card" style="width: 200px;">
        <a href="character.html?id=` +
      characterRow.data[i].id +
      `">
            <div class="card-body">
                <h5 class="card-title">` +
      characterRow.data[i].name +
      `</h5>
                <h6 class="card-subtitle mb-2 text-muted">` +
      new Date(characterRow.data[i].date).toLocaleDateString() +
      `</h6>
                <p class="card-text">` +
      characterRow.data[i].description +
      `</p>
            </div>
        </a>
      </div>
    `
    );
  }
}

async function loadSystems() {
  let systems = await SUPABASE.from("systems")
    .select();

  //console.log(characterRow);
  for (let i = 0; i < systems.data.length; i++) {
    //console.log(characterRow.data[i]);
    $("#adminZone").append(
      `
      <div class="card" style="width: 200px;">
        <a href="system.html?name=` +
      systems.data[i].name +
      `">
            <div class="card-body">
                <h5 class="card-title">` +
      systems.data[i].name +
      `</h5>
            </div>
        </a>
      </div>
    `
    );
  }
}