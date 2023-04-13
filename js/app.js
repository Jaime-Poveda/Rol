const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function (event) {
  loadLogin();
  //testZone();

  $("#signUpForm").submit(signUp);
  $("#logInForm").submit(logIn);
  $("#createCharacterForm").submit(createCharacter);
  $("#logOutButton").click(logOut);
  $("#addAttr").click(addAttribute);
  $(".btnDelete").click(deleteElement);
  $("#addItem").click(addItem);
  $("#addSkill").click(addSkill);
});

async function loadLogin() {
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
}

async function testZone() {
  let user = await SUPABASE.auth.getUser();
  user = user.data.user;

  let testRows = await SUPABASE.from("test").select();
  let userRow = testRows.data.find((element) => element.userId == user.id);

  localStorage.setItem("UserId", userRow.userId);

  $("#testZone").append(
    `
      Id: ` +
      userRow.id +
      `<br>
      User Id: ` +
      userRow.userId +
      `<br>
      Date: ` +
      userRow.created_at +
      `
    `
  );
}

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
      localStorage.setItem("User", "");
      alert("Logout successful");
      window.location.href = "index.html";
    })
    .catch((err) => {
      alert(err.response.text);
    });
}

function createCharacter(event) {
  event.preventDefault();

  /* console.log(
    $("#charSystem")
  ); */

  /* console.log(
    $("#charSystem")[0].value,
    $("#charName")[0].value,
    $("#charDesc")[0].value,
    $("#charRace")[0].value,
    $("#charClass")[0].value,
    $("#charLevel")[0].value,
    $("#charHP")[0].value
  ); */

  SUPABASE.from("personajes")
    .insert({
      userId: localStorage.getItem("UserId"),
      system: $("#charSystem")[0].value,
      name: $("#charName")[0].value,
      description: $("#charDesc")[0].value,
      race: $("#charRace")[0].value,
      class: $("#charClass")[0].value,
      level: $("#charLevel")[0].value,
      hp: $("#charHP")[0].value,
    })
    .then((_response) => {
      alert("Create successful");
    })
    .catch((err) => {
      alert(err.response.text);
    });
}

function addAttribute(event) {
  /* console.log($("#attributeName")); */

  $("#attrZone").append(
    `
  <div class="input-group mt-2 attrGroup">
    <input type="text" class="form-control input-group-text text-center" placeholder="Atr" value="` +
      $("#attributeName")[0].value +
      `">
    <input type="number" class="form-control  text-center" placeholder="0" value="` +
      $("#attributeBase")[0].value +
      `">
    <input type="number" class="form-control  text-center" placeholder="0" value="` +
      $("#attributeSum")[0].value +
      `">
    <input type="number" class="form-control  text-center" placeholder="0" value="` +
      $("#attributeTotal")[0].value +
      `">
    <input type="number" class="form-control  text-center" placeholder="0" value="` +
      $("#attributeModifier")[0].value +
      `">

    <span class="input-group-text text-center p-0">
        <button type="button" class="btn btn-light btnDelete">
            -
        </button>
    </span>
  </div>
  `
  );

  $(".btnDelete").click(deleteElement);
}

function deleteElement(event) {
  event.target.parentElement.parentElement.remove();
}

function addItem(event) {
  $("#itemZone").append(
    `
    <div class="input-group mt-3">
        <div class="" style="width: 90%;">
            <div class="input-group">
                <span class="input-group-text" style="width: 100px;">Nombre</span>
                <input type="text" class="form-control rounded-0 text-center" placeholder="Item" value="` +
      $("#itemName")[0].value +
      `">
            </div>
            <div class="input-group">
                <span class="input-group-text" style="width: 100px;">Descripción</span>
                <textarea class="form-control rounded-0 text-center" placeholder="Descripción">` +
      $("#itemDesc")[0].value +
      `</textarea>
            </div>
            <div class="input-group">
                <span class="input-group-text" style="width: 100px;">Cantidad</span>
                <input type="number" class="form-control rounded-0 text-center" placeholder="0"  value="` +
      $("#itemAmount")[0].value +
      `">
            </div>
            <div class="input-group">
                <span class="input-group-text" style="width: 100px;">Daño</span>
                <input type="text" class="form-control rounded-0 text-center" placeholder="0"  value="` +
      $("#itemDamage")[0].value +
      `">
            </div>
        </div>
        <span class="input-group-text text-center p-0" style="width: 10%;">
            <button type="button" class="btn btn-light btnDelete" style="height: 100%; width: 100%;">
                -
            </button>
        </span>
    </div>
  `
  );

  $(".btnDelete").click(deleteElement);
}

function addSkill(event) {
  $("#skillZone").append(
    `
    <div class="input-group mt-3">
        <div class="" style="width: 90%;">
            <div class="input-group">
                <span class="input-group-text" style="width: 100px;">Nombre</span>
                <input type="text" class="form-control rounded-0 text-center" placeholder="Habilidad" value="` +
      $("#skillName")[0].value +
      `">
            </div>
            <div class="input-group">
                <span class="input-group-text" style="width: 100px;">Descripción</span>
                <textarea class="form-control rounded-0 text-center" placeholder="Descripción">` +
      $("#skillDesc")[0].value +
      `</textarea>
            </div>
            <div class="input-group">
                <span class="input-group-text" style="width: 100px;">Daño</span>
                <input type="text" class="form-control rounded-0 text-center" placeholder="0" value="` +
      $("#skillDamage")[0].value +
      `">
            </div>
            <div class="input-group">
                <span class="input-group-text" style="width: 100px;">Efecto</span>
                <input type="text" class="form-control rounded-0 text-center" placeholder="Efecto" value="` +
      $("#skillEffect")[0].value +
      `">
            </div>
        </div>
        <span class="input-group-text text-center p-0" style="width: 10%;">
            <button type="button" class="btn btn-light btnDelete" style="height: 100%; width: 100%;">
                -
            </button>
        </span>
    </div>
  `
  );

  $(".btnDelete").click(deleteElement);
}
