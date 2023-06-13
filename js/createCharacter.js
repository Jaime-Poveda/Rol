const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function (event) {
  loadLogin();
  loadSystems();
  $("#charSystem").change(systemRules);

  $("#addAttrButton").click(emptyModal);
  $("#addAttr").click(addAttribute);

  $("#addSkillButton").click(emptyModal);
  $("#addSkill").click(addSkill);

  $("#addItemButton").click(emptyModal);
  $("#addItem").click(addItem);

  $("#createCharacterForm").submit(createCharacter);
  //$("#addBasicAttr").click(addBasicAttributes);
  //$("#addAttr").click(addAttribute);
  //$("#addItem").click(addItem);
  //$("#addSkill").click(addSkill);
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
    }

    loadPoints(userRow);
  }
}
function logOut(event) {
  event.preventDefault();

  SUPABASE.auth
    .signOut()
    .then((_response) => {
      //alert("Logout successful");
      window.location.href = "index.html";
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}

async function loadSystems() {
  let systems = await SUPABASE.from("systems")
    .select();

  //console.log(characterRow);
  for (let i = 0; i < systems.data.length; i++) {
    //console.log(characterRow.data[i]);
    $("#systems").append(
      `
      <option>`+
      systems.data[i].name +
      `
      </option>
    `
    );
  }
}

async function loadPoints(user) {
  $("#createCharacterZone").append(`
    <p class="p-0 m-0">Tienes `+ user.data[0].points + ` puntos</p>
    <p>Crear un personaje cuesta 100 puntos</p>
  `)
}

async function systemRules() {
  let rules = await SUPABASE.from("systemRules")
    .select()
    .eq("systemName", $("#charSystem").val());

  if (rules.data.length > 0) {
    $("#systemRuleModalButton").attr("disabled", false);
    writeSystemModal(rules);
  } else {
    $("#systemRuleModalButton").attr("disabled", true);
  }
}

function writeSystemModal(rules) {
  $("#systemRuleModalLabel").text(rules.data[0].systemName);
  $("#systemRuleModalBody").empty();

  for (let i = 0; i < rules.data.length; i++) {
    $("#systemRuleModalBody").append(`
      <div class="card p-0 m-1 w-auto bg-dark text-light">
        <div class="card-body">
          <h5 class="card-title">`+ rules.data[i].title + `</h5>
          <h6 class="card-subtitle mb-2">`+ rules.data[i].desc + `</h6>
        </div>
      </div>
    `)
  }
}

function emptyModal(event) {
  $(event.target.parentNode.getAttribute("data-bs-target") + " input").each(
    function () {
      this.value = "";
    }
  );
  $(event.target.parentNode.getAttribute("data-bs-target") + " textarea").each(
    function () {
      this.value = "";
    }
  );
}

function addAttribute(event) {
  $("#attrZone").append(
    `
      <div class="card" style="width: 18rem;">
        <div class="card-body attrGroup">
          <div class="input-group mb-3">
            <span class="input-group-text">Nombre</span>
            <input type="text" class="form-control attrName" placeholder="Nombre" value="`+ event.target.parentNode.parentNode.querySelector("#attrName").value + `">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Valor Base</span>
            <input type="number" class="form-control attrBase" placeholder="Valor Base" value="`+ event.target.parentNode.parentNode.querySelector("#attrBase").value + `">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Suma</span>
            <input type="number" class="form-control attrSum" placeholder="Suma" value="`+ event.target.parentNode.parentNode.querySelector("#attrSum").value + `">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Total</span>
            <input type="number" class="form-control attrTotal" placeholder="Total" value="`+ event.target.parentNode.parentNode.querySelector("#attrTotal").value + `">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Modificador</span>
            <input type="number" class="form-control attrModifier" placeholder="Modificador" value="`+ event.target.parentNode.parentNode.querySelector("#attrModifier").value + `">
          </div>
          <button type="button" class="btn p-0 m-0 border-0 mt-2 delete" style="width: 25px; height: 25px;"><img src="img/icons/remove.png"
          alt="DeleteButton" style="width: 100%;"></button>
        </div>
      </div>
  `
  )
  $(".delete").click(deleteCard);
  $("#attrModal").modal("hide");
}

function deleteCard(event) {
  event.target.parentNode.parentNode.parentNode.remove();
}

function addSkill(event) {
  $("#skillZone").append(
    `
      <div class="card" style="width: 18rem;">
        <div class="card-body skillGroup">
          <div class="input-group mb-3">
            <span class="input-group-text">Nombre</span>
            <input type="text" class="form-control skillName" placeholder="Nombre" value="`+ event.target.parentNode.parentNode.querySelector("#skillName").value + `">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Descripción</span>
            <input type="text" class="form-control skillDesc" placeholder="Descripción" value="`+ event.target.parentNode.parentNode.querySelector("#skillDesc").value + `">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Daño</span>
            <input type="text" class="form-control skillDamage" placeholder="Daño" value="`+ event.target.parentNode.parentNode.querySelector("#skillDamage").value + `">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Efecto</span>
            <input type="text" class="form-control skillEffect" placeholder="Efecto" value="`+ event.target.parentNode.parentNode.querySelector("#skillEffect").value + `">
          </div>
          <button type="button" class="btn p-0 m-0 border-0 mt-2 delete" style="width: 25px; height: 25px;"><img src="img/icons/remove.png"
          alt="DeleteButton" style="width: 100%;"></button>
        </div>
      </div>
  `
  )
  $(".delete").click(deleteCard);
  $("#skillModal").modal("hide");
}

function addItem(event) {
  $("#itemZone").append(
    `
      <div class="card" style="width: 18rem;">
        <div class="card-body itemGroup">
          <div class="input-group mb-3">
            <span class="input-group-text">Nombre</span>
            <input type="text" class="form-control itemName" placeholder="Nombre" value="`+ event.target.parentNode.parentNode.querySelector("#itemName").value + `">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Descripción</span>
            <input type="text" class="form-control itemDesc" placeholder="Descripción" value="`+ event.target.parentNode.parentNode.querySelector("#itemDesc").value + `">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Daño</span>
            <input type="text" class="form-control itemDamage" placeholder="Daño" value="`+ event.target.parentNode.parentNode.querySelector("#itemDamage").value + `">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Cantidad</span>
            <input type="text" class="form-control itemAmount" placeholder="Cantidad" value="`+ event.target.parentNode.parentNode.querySelector("#itemAmount").value + `">
          </div>
          <button type="button" class="btn p-0 m-0 border-0 mt-2 delete" style="width: 25px; height: 25px;"><img src="img/icons/remove.png"
          alt="DeleteButton" style="width: 100%;"></button>
        </div>
      </div>
  `
  )
  $(".delete").click(deleteCard);
  $("#itemModal").modal("hide");
}

/* function addBasicAttributes(event) {
  event.target.remove();
  $("#attrZone").append(`
      <div class="input-group attrGroup">
        <input type="text" class="form-control input-group-text text-center attrName"
            placeholder="Atr" value="FUE">
        <input type="number" class="form-control text-center attrBase" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrSum" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrTotal" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrModifier" placeholder="0"
            value="0">
  
        <span class="input-group-text text-center p-0">
            <button type="button" class="btn btn-light btnDelete">
                -
            </button>
        </span>
      </div>
      <div class="input-group attrGroup">
        <input type="text" class="form-control input-group-text text-center attrName"
            placeholder="Atr" value="DES">
        <input type="number" class="form-control text-center attrBase" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrSum" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrTotal" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrModifier" placeholder="0"
            value="0">
  
        <span class="input-group-text text-center p-0">
            <button type="button" class="btn btn-light btnDelete">
                -
            </button>
        </span>
      </div>
      <div class="input-group attrGroup">
        <input type="text" class="form-control input-group-text text-center attrName"
            placeholder="Atr" value="CON">
        <input type="number" class="form-control text-center attrBase" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrSum" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrTotal" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrModifier" placeholder="0"
            value="0">
  
        <span class="input-group-text text-center p-0">
            <button type="button" class="btn btn-light btnDelete">
                -
            </button>
        </span>
      </div>
      <div class="input-group attrGroup">
        <input type="text" class="form-control input-group-text text-center attrName"
            placeholder="Atr" value="CAR">
        <input type="number" class="form-control text-center attrBase" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrSum" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrTotal" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrModifier" placeholder="0"
            value="0">
  
        <span class="input-group-text text-center p-0">
            <button type="button" class="btn btn-light btnDelete">
                -
            </button>
        </span>
      </div>
      <div class="input-group attrGroup">
        <input type="text" class="form-control input-group-text text-center attrName"
            placeholder="Atr" value="INT">
        <input type="number" class="form-control text-center attrBase" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrSum" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrTotal" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrModifier" placeholder="0"
            value="0">
  
        <span class="input-group-text text-center p-0">
            <button type="button" class="btn btn-light btnDelete">
                -
            </button>
        </span>
      </div>
      <div class="input-group attrGroup">
        <input type="text" class="form-control input-group-text text-center attrName"
            placeholder="Atr" value="SAB">
        <input type="number" class="form-control text-center attrBase" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrSum" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrTotal" placeholder="0" value="0">
        <input type="number" class="form-control text-center attrModifier" placeholder="0"
            value="0">
  
        <span class="input-group-text text-center p-0">
            <button type="button" class="btn btn-light btnDelete">
                -
            </button>
        </span>
      </div>
    `);

  $(".btnDelete").click(deleteElement);
}

function addAttribute2(event) {
  $("#attrZone").append(
    `
    <div class="input-group mt-2 attrGroup">
      <input type="text" class="form-control input-group-text text-center attrName" placeholder="Atr" value="` +
    $("#attributeName")[0].value +
    `">
      <input type="number" class="form-control text-center attrBase" placeholder="0" value="` +
    $("#attributeBase")[0].value +
    `">
      <input type="number" class="form-control text-center attrSum" placeholder="0" value="` +
    $("#attributeSum")[0].value +
    `">
      <input type="number" class="form-control text-center attrTotal" placeholder="0" value="` +
    $("#attributeTotal")[0].value +
    `">
      <input type="number" class="form-control text-center attrModifier" placeholder="0" value="` +
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
} */
/* 
function addSkill(event) {
  $("#skillZone").append(
    `
      <div class="input-group mt-3">
          <div class="skillGroup" style="width: 90%;">
              <div class="input-group">
                  <span class="input-group-text" style="width: 100px;">Nombre</span>
                  <input type="text" class="form-control rounded-0 text-center skillName" placeholder="Habilidad" value="` +
    $("#skillName")[0].value +
    `">
              </div>
              <div class="input-group">
                  <span class="input-group-text" style="width: 100px;">Descripción</span>
                  <textarea class="form-control rounded-0 text-center skillDesc" placeholder="Descripción">` +
    $("#skillDesc")[0].value +
    `</textarea>
              </div>
              <div class="input-group">
                  <span class="input-group-text" style="width: 100px;">Daño</span>
                  <input type="text" class="form-control rounded-0 text-center skillDamage" placeholder="0" value="` +
    $("#skillDamage")[0].value +
    `">
              </div>
              <div class="input-group">
                  <span class="input-group-text" style="width: 100px;">Efecto</span>
                  <input type="text" class="form-control rounded-0 text-center skillEffect" placeholder="Efecto" value="` +
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

function addItem(event) {
  $("#itemZone").append(
    `
      <div class="input-group mt-3">
          <div class="itemGroup" style="width: 90%;">
              <div class="input-group">
                  <span class="input-group-text" style="width: 100px;">Nombre</span>
                  <input type="text" class="form-control rounded-0 text-center itemName" placeholder="Item" value="` +
    $("#itemName")[0].value +
    `">
        <div class="input-group">
            <span class="input-group-text" style="width: 100px;">Cantidad</span>
            <input type="number" class="form-control rounded-0 text-center itemAmount" placeholder="0"  value="` +
    $("#itemAmount")[0].value +
    `">
              </div>
              <div class="input-group">
                  <span class="input-group-text" style="width: 100px;">Descripción</span>
                  <textarea class="form-control rounded-0 text-center itemDesc" placeholder="Descripción">` +
    $("#itemDesc")[0].value +
    `</textarea>
              </div>
              </div>
              <div class="input-group">
                  <span class="input-group-text" style="width: 100px;">Daño</span>
                  <input type="text" class="form-control rounded-0 text-center itemDamage" placeholder="0"  value="` +
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
} */

function deleteElement(event) {
  event.target.parentElement.parentElement.remove();
}

async function createCharacter(event) {
  event.preventDefault();

  let user = await SUPABASE.auth.getUser();

  let userRow = await SUPABASE.from("users")
    .select()
    .eq("id", user.data.user.id);

  if (userRow.data[0].points > 0) {

    /* console.log($("#charImage")[0].value);
    console.log($("#charImage")[0].value.split(/(\\|\/)/g).pop());
    console.log(Date.now() + "_" + $("#charImage")[0].value.split(/(\\|\/)/g).pop()); */
    let imageFullName;
    $("#charImage")[0].value ? imageFullName = Date.now() + "_" + $("#charImage").prop("files")[0].name : imageFullName = "";

    /* console.log(imageFullName);
    console.log($("#charImage").prop("files")[0]);
    console.log($("#charImage").prop("files")[0].name); */

    //const charFile = $("#charImage").prop("files")[0]

    if (imageFullName != "") {
      SUPABASE
        .storage
        .from('characters')
        .upload(imageFullName, $("#charImage").prop("files")[0], {
          cacheControl: '3600',
          upsert: false
        })
    }

    let characterRow = await SUPABASE.from("characters")
      .upsert({
        userId: user.data.user.id,
        /* image: $("#charImage")[0].value ? $("#charImage")[0].value : "", */
        image: $("#charImage")[0].value ? imageFullName : "placeholder.jpg",
        system: $("#charSystem")[0].value ? $("#charSystem")[0].value : "",
        name: $("#charName")[0].value,
        description: $("#charDesc")[0].value ? $("#charDesc")[0].value : "",
        race: $("#charRace")[0].value ? $("#charRace")[0].value : "",
        class: $("#charClass")[0].value ? $("#charClass")[0].value : "",
        level: $("#charLevel")[0].value ? $("#charLevel")[0].value : 1,
        hp: $("#charHP")[0].value ? $("#charHP")[0].value : 1,
      })
      .select();

    for (let i = 0; i < $(".attrGroup").length; i++) {
      SUPABASE.from("attributes")
        .insert({
          characterId: characterRow.data[0].id,
          name: $(".attrGroup .attrName")[i].value
            ? $(".attrGroup .attrName")[i].value
            : "",
          baseValue: $(".attrGroup .attrBase")[i].value
            ? $(".attrGroup .attrBase")[i].value
            : 0,
          sum: $(".attrGroup .attrSum")[i].value
            ? $(".attrGroup .attrSum")[i].value
            : 0,
          totalValue: $(".attrGroup .attrTotal")[i].value
            ? $(".attrGroup .attrTotal")[i].value
            : 0,
          modifier: $(".attrGroup .attrModifier")[i].value
            ? $(".attrGroup .attrModifier")[i].value
            : 0,
        })
        .then((_response) => {
          //alert("Create successful");
        })
        .catch((err) => {
          //alert(err.response.text);
        });
    }

    for (let i = 0; i < $(".skillGroup").length; i++) {
      SUPABASE.from("skills")
        .insert({
          characterId: characterRow.data[0].id,
          name: $(".skillGroup .skillName")[i].value
            ? $(".skillGroup .skillName")[i].value
            : "",
          damage: $(".skillGroup .skillDamage")[i].value
            ? $(".skillGroup .skillDamage")[i].value
            : "",
          description: $(".skillGroup .skillDesc")[i].value
            ? $(".skillGroup .skillDesc")[i].value
            : "",
          effect: $(".skillGroup .skillEffect")[i].value
            ? $(".skillGroup .skillEffect")[i].value
            : "",
        })
        .then((_response) => {
          //alert("Create successful");
        })
        .catch((err) => {
          //alert(err.response.text);
        });
    }

    for (let i = 0; i < $(".itemGroup").length; i++) {
      SUPABASE.from("items")
        .insert({
          characterId: characterRow.data[0].id,
          name: $(".itemGroup .itemName")[i].value
            ? $(".itemGroup .itemName")[i].value
            : "",
          amount: $(".itemGroup .itemAmount")[i].value
            ? $(".itemGroup .itemAmount")[i].value
            : 1,
          description: $(".itemGroup .itemDesc")[i].value
            ? $(".itemGroup .itemDesc")[i].value
            : "",
          damage: $(".itemGroup .itemDamage")[i].value
            ? $(".itemGroup .itemDamage")[i].value
            : "",
        })
        .then((_response) => {
          //alert("Create successful");
        })
        .catch((err) => {
          //alert(err.response.text);
        });
    }

    //console.log(userRow.data[0].points);

    SUPABASE.from("users")
      .update({
        points: userRow.data[0].points - 100
      })
      .eq("id", user.data.user.id)
      .then((_response) => {
        //console.log(_response);
        //alert("Create successful");
      })
      .catch((err) => {
        //alert(err.response.text);
      });

    //alert("Create successful");
    window.location.href = "character.html?id=" + characterRow.data[0].id;
  } else {
    //alert("No hay puntos suficientes para crear un personaje");
  }
}