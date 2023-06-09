const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";
const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

document.addEventListener("DOMContentLoaded", async function (event) {
  //console.log(params.id);
  loadLogin();
  loadCharacter(params.id);
});

async function loadLogin() {
  let user = await SUPABASE.auth.getUser();

  if (user.data.user === null) {
    $("#logZone").append(`
      <a href="login.html" class="btn btn-success">Login</a>
      <a href="register.html" class="btn btn-success">Register</a>
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

async function loadCharacter(id) {
  let characterRow = await SUPABASE.from("characters").select().eq("id", id);
  //console.log(characterRow);

  let attributes = await SUPABASE.from("attributes")
    .select()
    .eq("characterId", characterRow.data[0].id)
    .order("id", { ascending: true });

  let items = await SUPABASE.from("items")
    .select()
    .eq("characterId", characterRow.data[0].id)
    .order("id", { ascending: true });

  let skills = await SUPABASE.from("skills")
    .select()
    .eq("characterId", characterRow.data[0].id)
    .order("id", { ascending: true });

  $("#characterZone").append(
    `
        <div class="card bg-dark text-light">
            <div class="card-body text-center grid justify-content-center align-items-center">
                <img src="https://afribcvcanlurbnjrioe.supabase.co/storage/v1/object/public/characters/`+characterRow.data[0].image+`" class="card-img-top rounded" alt="Character Image" style="max-width:250px"></img>
                <h1 class="card-title" id="charName">` +
    characterRow.data[0].name +
    `</h1>
                <h2 class="card-subtitle mb-2">` +
    new Date(characterRow.data[0].date).toLocaleDateString() +
    `</h2>
    
                <h3 class="card-title">Características 
                  <button id="editCharacterButton" type="button" class="btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#characerInfo" style="width: 25px; height: 25px;"><img src="img/icons/edit.png" alt="EditButton" style="width: 100%;"></button>
                </h3>
                <div class="row justify-content-center">
                    <div class="card p-0 w-auto text-dark">
                        <div class="card-body">
                            <div class="card-text d-flex flex-row justify-content-center"><b>Sistema:</b> &nbsp` +
    characterRow.data[0].system +
    `</div>
                            <div class="card-text d-flex flex-row justify-content-center"><b>Descripción:</b> &nbsp` +
    characterRow.data[0].description +
    `</div>
                            <div class="card-text d-flex flex-row justify-content-center"><b>Raza:</b> &nbsp` +
    characterRow.data[0].race +
    `</div>
                            <div class="card-text d-flex flex-row justify-content-center"><b>Clase:</b> &nbsp` +
    characterRow.data[0].class +
    `</div>
                            <div class="card-text d-flex flex-row justify-content-center"><b>Nivel:</b> &nbsp` +
    characterRow.data[0].level +
    `</div>
                            <div class="card-text d-flex flex-row justify-content-center"><b>HP:</b> &nbsp` +
    characterRow.data[0].hp +
    `</div>
                        </div>
                    </div>
                </div>

                <h3 class="card-title mt-3">Atributos 
                  <button id="addAttrButton" type="button" class="btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#createAttrModal" style="width: 25px; height: 25px;"><img src="img/icons/more.png" alt="AddButton" style="width: 100%;"></button>
                </h3>
                <div id="attrZone" class="row justify-content-center">
                </div>

                <h3>Equipo 
                  <button id="addItemButton" type="button" class="btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#createItemModal" style="width: 25px; height: 25px;"><img src="img/icons/more.png" alt="AddButton" style="width: 100%;"></button>
                </h3>
                <div id="itemsZone" class="row justify-content-center">
                </div>

                <h3>
                  Habilidades <button id="addSkillButton" type="button" class="btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#createSkillModal" style="width: 25px; height: 25px;"><img src="img/icons/more.png" alt="AddButton" style="width: 100%;"></button>
                </h3>
                <div id="skillsZone" class="row justify-content-center">
                </div>
                
                <br>
                <button id="removeChar" type="button" data-bs-toggle="modal" data-bs-target="#removeCharModal" class="btn btn-danger">Eliminar personaje</button>
            </div>
        </div>

        <div class="modal fade" id="characerInfo" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="characerInfoLabel">Actualizar personaje</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <input id="charId" type="hidden" class="form-control" value="` +
    characterRow.data[0].id +
    `">
                      <div class="input-group mb-1">
                        <span class="input-group-text" id="basic-addon1">Sisema</span>
                        <input id="charSystem" type="text" class="form-control" value="` +
    characterRow.data[0].system +
    `">
                      </div>
                      <div class="input-group mb-1">
                        <span class="input-group-text" id="basic-addon1">Nombre</span>
                        <input id="charNameModal" type="text" class="form-control" value="` +
    characterRow.data[0].name +
    `">
                      </div>
                      <div class="input-group mb-1">
                        <span class="input-group-text" id="basic-addon1">Descripción</span>
                        <textarea id="charDesc" class="form-control" aria-label="With textarea">` +
    characterRow.data[0].description +
    `</textarea>
                      </div>
                      <div class="input-group mb-1">
                        <span class="input-group-text" id="basic-addon1">Raza</span>
                        <input id="charRace" type="text" class="form-control" value="` +
    characterRow.data[0].race +
    `">
                      </div>
                      <div class="input-group mb-1">
                        <span class="input-group-text" id="basic-addon1">Clase</span>
                        <input id="charClass" type="text" class="form-control" value="` +
    characterRow.data[0].class +
    `">
                      </div>
                      <div class="input-group mb-1">
                        <span class="input-group-text" id="basic-addon1">Nivel</span>
                        <input id="charLevel" type="number" class="form-control" value="` +
    characterRow.data[0].level +
    `">
                      </div>
                      <div class="input-group mb-1">
                        <span class="input-group-text" id="basic-addon1">HP</span>
                        <input id="charHP" type="number" class="form-control" value="` +
    characterRow.data[0].hp +
    `">
                      </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="updateCharacterButton" type="button" class="btn btn-success">Guardar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="attrModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Actualizar atributo</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="attrModalBody">
                      ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="updateAttrButton" type="button" class="btn btn-success">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal fade" id="itemModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Actualizar item</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="itemModalBody">
                      ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="updateItemButton" type="button" class="btn btn-success">Guardar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="skillModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Actualizar habilidad</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="skillModalBody">
                      ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="updateSkillButton" type="button" class="btn btn-success">Guardar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="createAttrModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Añadir atributo</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="attrModalBody">
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">Nombre</span>
                          <input type="text" class="form-control attrName">
                        </div>
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">Valor Base</span>
                          <input type="text" class="form-control attrBase">
                        </div>
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">Suma</span>
                          <input type="text" class="form-control attrSum">
                        </div>
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">Total</span>
                          <input type="text" class="form-control attrTotal">
                        </div>
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">Modificador</span>
                          <input type="text" class="form-control attrMod">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="createAttrButton" type="button" class="btn btn-success">Crear</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="createItemModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Añadir item</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Nombre</span>
                            <input type="text" class="form-control itemName">
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Descripción</span>
                            <input type="text" class="form-control itemDesc">
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Cantidad</span>
                            <input type="text" class="form-control itemAmount">
                        </div>
                            <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Daño</span>
                            <input type="text" class="form-control itemDamage">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="createItemButton" type="button" class="btn btn-success">Crear</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="createSkillModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Crear skill</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="skillModalBody">
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Nombre</span>
                            <input type="text" class="form-control skillName">
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Descripción</span>
                            <input type="text" class="form-control skillDesc">
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Efecto</span>
                            <input type="text" class="form-control skillEffect">
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Daño</span>
                            <input type="text" class="form-control skillDamage">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="createSkillButton" type="button" class="btn btn-success">Crear</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="removeAttrModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Eliminar atributo</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="removeAttrModalBody">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="removeAttrButton" type="button" class="btn btn-danger">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="removeItemModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Eliminar objeto</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="removeItemModalBody">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="removeItemButton" type="button" class="btn btn-danger">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="removeSkillModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Eliminar habilidad</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="removeSkillModalBody">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="removeSkillButton" type="button" class="btn btn-danger">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="removeCharModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Eliminar personaje</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="removeCharModalBody">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="removeCharButton" type="button" class="btn btn-danger">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>

    `
  );

  $("#removeChar").click(removeCharModal);

  $("#updateCharacterButton").click(updateCharacter);
  $("#updateAttrButton").click(updateAttr);
  $("#updateItemButton").click(updateItem);
  $("#updateSkillButton").click(updateSkill);

  $("#addAttrButton").click(emptyModal);
  $("#addItemButton").click(emptyModal);
  $("#addSkillButton").click(emptyModal);

  $("#createAttrButton").click(createAttr);
  $("#createItemButton").click(createItem);
  $("#createSkillButton").click(createSkill);

  $("#removeAttrButton").click(removeAttr);
  $("#removeItemButton").click(removeItem);
  $("#removeSkillButton").click(removeSkill);
  $("#removeCharButton").click(removeChar);

  for (let i = 0; i < attributes.data.length; i++) {
    $("#attrZone").append(
      `
        <div class="card w-auto m-1 p-0 bg-info text-light">
            <div class="card-body">
                <div class="card-text text-center">
                    <div class="attrId" hidden>` +
      attributes.data[i].id +
      `</div><div class="attrName fw-bold">` +
      attributes.data[i].name +
      `</div><div class="d-flex flex-row justify-content-center"> <i>Base:</i> &nbsp<div class="attrBase">` +
      attributes.data[i].baseValue +
      `</div></div><div class="d-flex flex-row justify-content-center"> <i>Suma:</i> &nbsp<div class="attrSum">` +
      attributes.data[i].sum +
      `</div></div><div class="d-flex flex-row justify-content-center"> <i>Total:</i> &nbsp<div class="attrTotal">` +
      attributes.data[i].totalValue +
      `</div></div><div class="d-flex flex-row justify-content-center"> <i>Modificador:</i> &nbsp<div class="attrMod">` +
      attributes.data[i].modifier +
      `</div>
                    </div>
                    <div class="mt-1">
                      <button type="button" class="editAttr btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#attrModal" style="width: 25px; height: 25px;"><img src="img/icons/edit.png" alt="EditButton" style="width: 100%;"></button>
                      <button type="button" class="removeAttr btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#removeAttrModal" style="width: 25px; height: 25px;"><img src="img/icons/remove.png" alt="RemoveButton" style="width: 100%;"></button>
                    </div>
                </div>
            </div>
        </div>`
    );
  }
  $(".editAttr").click(editAttr);
  $(".removeAttr").click(removeAttrModal);

  for (let i = 0; i < items.data.length; i++) {
    $("#itemsZone").append(
      `
        <div class="card w-auto m-1 p-0 bg-success">
            <div class="card-body">
                <div class="card-text text-center">
                    <div class="itemId" hidden>` +
      items.data[i].id +
      `</div>
                    <h5 class="card-title d-flex flex-row justify-content-center itemName">` +
      items.data[i].name +
      `</h5>
                    <h6 class="card-subtitle itemDesc">` +
      items.data[i].description +
      `</h6>` +
      '<div class="d-flex flex-row justify-content-center"><i>Daño:</i>&nbsp<div class="card-text itemDamage">' +
      items.data[i].damage + '</div></div>'
      + `
                    
                    <div class="d-flex flex-row justify-content-center"><i>Cantidad:</i>&nbsp<div class="card-text itemAmount">` +
      items.data[i].amount +
      `</div></div>
                    <button type="button" class="editItem btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#itemModal" style="width: 25px; height: 25px;"><img src="img/icons/edit.png" alt="EditButton" style="width: 100%;"></button>
                    <button type="button" class="removeItem btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#removeItemModal" style="width: 25px; height: 25px;"><img src="img/icons/remove.png" alt="RemoveButton" style="width: 100%;"></button>
                </div>
            </div>
        </div>
        `
    );
  }
  $(".editItem").click(editItem);
  $(".removeItem").click(removeItemModal);

  for (let i = 0; i < skills.data.length; i++) {
    $("#skillsZone").append(
      `
        <div class="card w-auto m-1 p-0 bg-warning text-light">
            <div class="card-body">
                <div class="card-text text-center">
                    <div class="skillId" hidden>` +
      skills.data[i].id +
      `</div>
                    <h5 class="card-title skillName">` +
      skills.data[i].name +
      `</h5>
                    <h6 class="card-subtitle mb-2 skillDesc">` +
      skills.data[i].description +
      `</h6>
                    <div class="d-flex flex-row justify-content-center"><i>Daño:</i>&nbsp<div class="card-text skillDamage">` +
      skills.data[i].damage +
      `</div></div>
                
                    <div class="d-flex flex-row justify-content-center"><i>Efecto:</i>&nbsp<div class="card-text skillEffect">` +
      skills.data[i].effect +
      `</div></div>
                    <button type="button" class="editSkill btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#skillModal" style="width: 25px; height: 25px;"><img src="img/icons/edit.png" alt="EditButton" style="width: 100%;"></button>
                    <button type="button" class="removeSkill btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#removeSkillModal" style="width: 25px; height: 25px;"><img src="img/icons/remove.png" alt="RemoveButton" style="width: 100%;"></button>
                </div>
            </div>
        </div>
        `
    );
  }
  $(".editSkill").click(editSkill);
  $(".removeSkill").click(removeSkillModal);
}

function updateCharacter(event) {
  //console.log($("#charNameModal").val());
  SUPABASE.from("characters")
    .update({
      name: $("#charNameModal").val(),
      system: $("#charSystem").val(),
      description: $("#charDesc").val(),
      race: $("#charRace").val(),
      class: $("#charClass").val(),
      level: $("#charLevel").val(),
      hp: $("#charHP").val(),
    })
    .eq("id", $("#charId").val())
    .then((_response) => {
      //alert("Update successful");
      window.location.href = "character.html?id=" + $("#charId").val();
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}

function editAttr(event) {
  $("#attrModalBody").empty();

  $("#attrModalBody").append(
    `
    <input type="hidden" class="form-control attrId" value="` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrId").innerText +
    `">
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Nombre</span>
    <input type="text" class="form-control attrName" value="` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrName").innerText +
    `">
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Valor Base</span>
    <input type="text" class="form-control attrBase" value="` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrBase").innerText +
    `">
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Suma</span>
    <input type="text" class="form-control attrSum" value="` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrSum").innerText +
    `">
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Total</span>
    <input type="text" class="form-control attrTotal" value="` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrTotal").innerText +
    `">
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Modificador</span>
    <input type="text" class="form-control attrMod" value="` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrMod").innerText +
    `">
  </div>
  `
  );
}
function updateAttr(event) {
  SUPABASE.from("attributes")
    .update({
      name: event.target.parentNode.parentNode.querySelector(".attrName").value,
      baseValue:
        event.target.parentNode.parentNode.querySelector(".attrBase").value ? event.target.parentNode.parentNode.querySelector(".attrBase").value : 0,
      sum: event.target.parentNode.parentNode.querySelector(".attrSum").value ? event.target.parentNode.parentNode.querySelector(".attrSum").value : 0,
      totalValue:
        event.target.parentNode.parentNode.querySelector(".attrTotal").value ? event.target.parentNode.parentNode.querySelector(".attrTotal").value : 0,
      modifier:
        event.target.parentNode.parentNode.querySelector(".attrMod").value ? event.target.parentNode.parentNode.querySelector(".attrMod").value : 0,
    })
    .eq("id", event.target.parentNode.parentNode.querySelector(".attrId").value)
    .then((_response) => {
      //alert("Update successful");
      window.location.href = "character.html?id=" + $("#charId").val();
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}

function editItem(event) {
  //console.log(event.target.parentNode.parentNode);
  $("#itemModalBody").empty();

  $("#itemModalBody").append(
    `
    <input type="hidden" class="form-control itemId" value="` +
    event.target.parentNode.parentNode.querySelector(".itemId").innerText +
    `">
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Nombre</span>
    <input type="text" class="form-control itemName" value="` +
    event.target.parentNode.parentNode.querySelector(".itemName").innerText +
    `">
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Descripción</span>
    <input type="text" class="form-control itemDesc" value="` +
    event.target.parentNode.parentNode.querySelector(".itemDesc").innerText +
    `">
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Cantidad</span>
    <input type="text" class="form-control itemAmount" value="` +
    event.target.parentNode.parentNode.querySelector(".itemAmount")
      .innerText +
    `">
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Daño</span>
    <input type="text" class="form-control itemDamage" value="` +
    event.target.parentNode.parentNode.querySelector(".itemDamage")
      .innerText +
    `">
  </div>
  `
  );
}
function updateItem(event) {
  SUPABASE.from("items")
    .update({
      name: event.target.parentNode.parentNode.querySelector(".itemName").value,
      description:
        event.target.parentNode.parentNode.querySelector(".itemDesc").value,
      amount:
        event.target.parentNode.parentNode.querySelector(".itemAmount").value ? event.target.parentNode.parentNode.querySelector(".itemAmount").value : 1,
      damage:
        event.target.parentNode.parentNode.querySelector(".itemDamage").value,
    })
    .eq("id", event.target.parentNode.parentNode.querySelector(".itemId").value)
    .then((_response) => {
      //alert("Update successful");
      window.location.href = "character.html?id=" + $("#charId").val();
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}

function editSkill(event) {
  $("#skillModalBody").empty();

  $("#skillModalBody").append(
    `
    <input type="hidden" class="form-control skillId" value="` +
    event.target.parentNode.parentNode.querySelector(".skillId").innerText +
    `">
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Nombre</span>
    <input type="text" class="form-control skillName" value="` +
    event.target.parentNode.parentNode.querySelector(".skillName").innerText +
    `">
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Descripción</span>
    <input type="text" class="form-control skillDesc" value="` +
    event.target.parentNode.parentNode.querySelector(".skillDesc").innerText +
    `">
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Efecto</span>
    <input type="text" class="form-control skillEffect" value="` +
    event.target.parentNode.parentNode.querySelector(".skillEffect")
      .innerText +
    `">
  </div>
  <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Daño</span>
    <input type="text" class="form-control skillDamage" value="` +
    event.target.parentNode.parentNode.querySelector(".skillDamage")
      .innerText +
    `">
  </div>
  `
  );
}
function updateSkill(event) {
  SUPABASE.from("skills")
    .update({
      name: event.target.parentNode.parentNode.querySelector(".skillName")
        .value,
      description:
        event.target.parentNode.parentNode.querySelector(".skillDesc").value,
      effect:
        event.target.parentNode.parentNode.querySelector(".skillEffect").value,
      damage:
        event.target.parentNode.parentNode.querySelector(".skillDamage").value,
    })
    .eq(
      "id",
      event.target.parentNode.parentNode.querySelector(".skillId").value
    )
    .then((_response) => {
      //alert("Update successful");
      window.location.href = "character.html?id=" + $("#charId").val();
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}

function emptyModal(event) {
  /* console.log($(event.target.parentNode.getAttribute("data-bs-target"))[0]);
  console.log($(event.target.parentNode.getAttribute("data-bs-target") + " input")); */
  $(event.target.parentNode.getAttribute("data-bs-target") + " input").each(
    function () {
      this.value = "";
    }
  );
}

function createAttr(event) {
  SUPABASE.from("attributes")
    .insert({
      characterId: $("#charId").val(),
      name: event.target.parentNode.parentNode.querySelector(".attrName").value,
      baseValue:
        event.target.parentNode.parentNode.querySelector(".attrBase").value ? event.target.parentNode.parentNode.querySelector(".attrBase").value : 0,
      sum: event.target.parentNode.parentNode.querySelector(".attrSum").value ? event.target.parentNode.parentNode.querySelector(".attrSum").value : 0,
      totalValue:
        event.target.parentNode.parentNode.querySelector(".attrTotal").value ? event.target.parentNode.parentNode.querySelector(".attrTotal").value : 0,
      modifier:
        event.target.parentNode.parentNode.querySelector(".attrMod").value ? event.target.parentNode.parentNode.querySelector(".attrMod").value : 0,
    })
    .then((_response) => {
      //alert("Create successful");
      window.location.href = "character.html?id=" + $("#charId").val();
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}
function createItem(event) {
  SUPABASE.from("items")
    .insert({
      characterId: $("#charId").val(),
      name: event.target.parentNode.parentNode.querySelector(".itemName").value,
      description:
        event.target.parentNode.parentNode.querySelector(".itemDesc").value,
      amount:
        event.target.parentNode.parentNode.querySelector(".itemAmount").value ? event.target.parentNode.parentNode.querySelector(".itemAmount").value : 1,
      damage:
        event.target.parentNode.parentNode.querySelector(".itemDamage").value,
    })
    .then((_response) => {
      //alert("Create successful");
      window.location.href = "character.html?id=" + $("#charId").val();
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}
function createSkill(event) {
  SUPABASE.from("skills")
    .insert({
      characterId: $("#charId").val(),
      name: event.target.parentNode.parentNode.querySelector(".skillName")
        .value,
      description:
        event.target.parentNode.parentNode.querySelector(".skillDesc").value,
      effect:
        event.target.parentNode.parentNode.querySelector(".skillEffect").value,
      damage:
        event.target.parentNode.parentNode.querySelector(".skillDamage").value,
    })
    .then((_response) => {
      //alert("Create successful");
      window.location.href = "character.html?id=" + $("#charId").val();
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}

function removeAttrModal(event) {
  $("#removeAttrModalBody").empty();

  $("#removeAttrModalBody").append(
    `
    ¿Quieres eliminar este atributo?
    
    <div class="d-flex flex-row">
        <div class="attrId" hidden>` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrId").innerText +
    `</div><div class="attrName fw-bold">` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrName").innerText +
    `</div>&nbsp&nbsp  <i>Base:</i> &nbsp<div class="attrBase">` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrBase").innerText +
    `</div>&nbsp&nbsp <i>Suma:</i> &nbsp<div class="attrSum">` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrSum").innerText +
    `</div>&nbsp&nbsp <i>Total:</i> &nbsp<div class="attrTotal">` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrTotal").innerText +
    `</div>&nbsp&nbsp <i>Modificador:</i> &nbsp<div class="attrMod">` +
    event.target.parentNode.parentNode.parentNode.querySelector(".attrMod").innerText +
    `
        </div>
    </div>
  `
  );
}

function removeAttr(event) {
  SUPABASE.from("attributes")
    .delete()
    .eq(
      "id",
      event.target.parentNode.parentNode.querySelector(".attrId").innerText
    )
    .then((_response) => {
      //alert("Remove successful");
      window.location.href = "character.html?id=" + $("#charId").val();
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}

function removeItemModal(event) {
  $("#removeItemModalBody").empty();

  $("#removeItemModalBody").append(
    `
    ¿Quieres eliminar este objeto?
    
    <div class="">
        <div class="itemId" hidden="">` +
    event.target.parentNode.parentNode.querySelector(".itemId").innerText +
    `</div>
        <h5 class="card-title itemName">` +
    event.target.parentNode.parentNode.querySelector(".itemName").innerText +
    `</h5>
        <h6 class="card-subtitle mb-2 text-muted itemDesc">` +
    event.target.parentNode.parentNode.querySelector(".itemDesc").innerText +
    `</h6>
        <div class="d-flex flex-row">Cantidad:&nbsp;<div class="card-text itemAmount">` +
    event.target.parentNode.parentNode.querySelector(".itemAmount")
      .innerText +
    `</div></div>
        <div class="d-flex flex-row">Daño:&nbsp;<div class="card-text itemDamage">` +
    event.target.parentNode.parentNode.querySelector(".itemDamage")
      .innerText +
    `</div></div>
    </div>
  `
  );
}

function removeItem(event) {
  SUPABASE.from("items")
    .delete()
    .eq(
      "id",
      event.target.parentNode.parentNode.querySelector(".itemId").innerText
    )
    .then((_response) => {
      //alert("Remove successful");
      window.location.href = "character.html?id=" + $("#charId").val();
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}

function removeSkillModal(event) {
  $("#removeSkillModalBody").empty();

  $("#removeSkillModalBody").append(
    `
    <p> ¿Quieres eliminar esta habilidad?</p>
    
    <div class="">
        <div class="skillId" hidden>`+ event.target.parentNode.parentNode.querySelector(".skillId").innerText + `</div>
        <h5 class="card-title skillName">` +
    event.target.parentNode.parentNode.querySelector(".skillName").innerText +
    `</h5>
        <div class="d-flex flex-row">Daño:&nbsp;<div class="card-text skillDamage">` +
    event.target.parentNode.parentNode.querySelector(".skillDamage")
      .innerText +
    `</div></div>
        <h6 class="card-subtitle mb-2 text-muted skillDesc">` +
    event.target.parentNode.parentNode.querySelector(".skillDesc").innerText +
    `</h6>
        <div class="d-flex flex-row">Efecto:&nbsp;<div class="card-text skillEffect">` +
    event.target.parentNode.parentNode.querySelector(".skillEffect")
      .innerText +
    `</div></div>
    </div>
  `
  );
}

function removeSkill(event) {
  SUPABASE.from("skills")
    .delete()
    .eq(
      "id",
      event.target.parentNode.parentNode.querySelector(".skillId").innerText
    )
    .then((_response) => {
      //alert("Remove successful");
      window.location.href = "character.html?id=" + $("#charId").val();
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}

function removeCharModal(event) {
  $("#removeCharModalBody").empty();

  $("#removeCharModalBody").append(
    `
    <p> ¿Quieres eliminar este personaje? <b> ` +
    $("#charName")[0].innerText +
    `</b> </p>
  `
  );
}

function removeChar(event) {
  SUPABASE.from("characters")
    .delete()
    .eq(
      "id",
      $("#charId").val()
    )
    .then((_response) => {
      //alert("Remove successful");
      window.location.href = "index.html";
    })
    .catch((err) => {
      //alert(err.response.text);
    });
}