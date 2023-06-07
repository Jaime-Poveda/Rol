const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function (event) {
  loadLogin();
});

async function loadLogin() {
  let user = await SUPABASE.auth.getUser();

  if (user.data.user === null) {
    $("#logZone").append(`
      <a href="login.html" class="btn btn-primary">Login</a>
      <a href="register.html" class="btn btn-primary">Register</a>
    `);
  } else {
    let userRow = await SUPABASE.from("users").select().eq("id", user.data.user.id);

    $(".navbar-nav").append(`
      <li class="nav-item" >
        <a class="nav-link active" href="createCharacter.html">Crear personaje</a>
      </li >
      `
    )

    $("#logZone").append(
      `
      Hola ` +
      userRow.data[0].name +
      `
      <button id="logOutButton" class="btn btn-danger">Logout</button>
    `
    );
    $("#logOutButton").click(logOut);

    if (userRow.data[0].admin) {
      $(".navbar-nav").append(`
        <a href="createSystem.html" class="nav-link active">Añadir sistema</a>
      `)
      $("#adminZone").append(`
        <h1>Zona de admin</h1>
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

async function loadCharacters() {
  let user = await SUPABASE.auth.getUser();

  //console.log(user.data);

  let characterRow = await SUPABASE.from("characters")
    .select()
    .eq("userId", user.data.user.id)
    .order("date", { ascending: false });

  //console.log(characterRow);
  for (let i = 0; i < characterRow.data.length; i++) {
    //console.log(characterRow.data[i]);
    $("#charactersZone").append(
      `
      <div class="card m-2 p-1 text-center" style="width: 200px;">
            <a class="text-decoration-none" href="character.html?id=` +
      characterRow.data[i].id +
      `">
            `+/* <img src="../img/placeholder.jpg" class="card-img-top" alt="Character Image"></img> */`
            <img src="../img/placeholder.jpg" class="card-img-top" alt="Character Image">
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
      <div class="card m-2" style="width: 200px;">
        <a class="text-decoration-none" href="system.html?name=` +
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