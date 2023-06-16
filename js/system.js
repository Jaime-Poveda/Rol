const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";
const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

document.addEventListener("DOMContentLoaded", async function (event) {
    loadLogin();
    //console.log(params.id);
    loadSystem(params.name);
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
            `)

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

async function loadSystem(name) {
    let systemRow = await SUPABASE.from("systems").select().eq("name", name);
    //console.log(systemacterRow);

    let rules = await SUPABASE.from("systemRules")
        .select()
        .eq("systemName", systemRow.data[0].name);

    //console.log(rules);

    $("#systemZone").append(
        `
        <div class="card text-center bg-dark text-light">
            <div class="card-body">
                <h1 class="card-title systemName">` +
        systemRow.data[0].name +
        ` </h1>
                <h4 class="card-title">Reglas 
                    <button id="addRuleButton" type="button" class="btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#createRuleModal" style="width: 25px; height: 25px;"><img src="img/icons/more.png" alt="AddButton" style="width: 100%;"></button>
                </h4>
                <div id="rulesZone" class="row justify-content-center">
                </div>
                
                <br>
                <button id="removeSystem" type="button" data-bs-toggle="modal" data-bs-target="#removeSystemModal" class="btn btn-danger">Eliminar sistema</button>

                <div class="modal fade" id="systemInfo" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="systemInfoLabel">Actualizar sistema</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              <input id="systemName" type="hidden" class="form-control" value="` +
        systemRow.data[0].name +
        `">
                              <div class="input-group mb-1">
                                <span class="input-group-text" id="basic-addon1">Nombre</span>
                                <input id="systemName" type="text" class="form-control" value="` +
        systemRow.data[0].name +
        `">
                              </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button id="updateSystemButton" type="button" class="btn btn-success">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                <div class="modal fade text-dark" id="createRuleModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5">Crear regla</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" id="RuleModalBody">
                                <div class="input-group mb-1">
                                    <span class="input-group-text" id="basic-addon1">Nombre</span>
                                    <input type="text" class="form-control ruleName">
                                </div>
                                <div class="input-group mb-1">
                                    <span class="input-group-text" id="basic-addon1">Descripción</span>
                                    <textarea class="form-control ruleDesc" placeholder="Descripción" required id="floatingTextarea"></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button id="createRuleButton" type="button" class="btn btn-success">Crear</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade text-dark" id="editRuleModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5">Actualizar regla</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" id="editRuleModalBody">
                              ...
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button id="updateRuleButton" type="button" class="btn btn-success">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade text-dark" id="removeRuleModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5">Eliminar habilidad</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" id="removeRuleModalBody">
                                ...
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button id="removeRuleButton" type="button" class="btn btn-danger">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        
        <div class="modal fade" id="removeSystemModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Eliminar sistema</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="removeSystemModalBody">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="removeSystemButton" type="button" class="btn btn-danger">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        `
    );
    $("#removeSystem").click(removeSystemModal);

    $("#addRuleButton").click(emptyModal);
    /* $("#updateSystemButton").click(updateSystem); */

    $("#createRuleButton").click(createRule);
    $("#updateRuleButton").click(updateRule);
    $("#removeRuleButton").click(removeRule);
    $("#removeSystemButton").click(removeSystem);


    for (let i = 0; i < rules.data.length; i++) {
        $("#rulesZone").append(
            `
            <div class="card w-auto p-0 m-1 bg-warning ">
                <div class="card-body">
                    <div class="card-text">
                        <div class="ruleId" hidden>` +
            rules.data[i].id +
            `</div>
            <h5 class="card-title ruleName">` +
            rules.data[i].title +
            `</h5>
            <h6 class="card-subtitle mb-2 ruleDesc">` +
            rules.data[i].desc +
            `</h6>

                        <button type="button" class="editRule btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#editRuleModal" style="width: 25px; height: 25px;"><img src="img/icons/edit.png" alt="EditButton" style="width: 100%;"></button>

                        <button type="button" class="removeRule btn btn-light p-0 m-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#removeRuleModal" style="width: 25px; height: 25px;"><img src="img/icons/remove.png" alt="RemoveButton" style="width: 100%;"></button>
                    </div>
                </div>
            </div>`
        );
    }
    $(".editRule").click(editRule);
    $(".removeRule").click(removeRuleModal);
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

function editRule(event) {
    $("#editRuleModalBody").empty();

    $("#editRuleModalBody").append(
        `
      <input type="hidden" class="form-control ruleId" value="` +
        event.target.parentNode.parentNode.querySelector(".ruleId").innerText +
        `">
    <div class="input-group mb-1">
      <span class="input-group-text" id="basic-addon1">Nombre</span>
      <input type="text" class="form-control ruleName" value="` +
        event.target.parentNode.parentNode.querySelector(".ruleName").innerText +
        `">
    </div>
    <div class="input-group mb-1">
      <span class="input-group-text" id="basic-addon1">Descripción</span>
      <input type="text" class="form-control ruleDesc" value="` +
        event.target.parentNode.parentNode.querySelector(".ruleDesc").innerText +
        `">
    </div>
    `
    );
}
function removeRuleModal(event) {
    $("#removeRuleModalBody").empty();

    $("#removeRuleModalBody").append(
        `
      <p> ¿Quieres eliminar esta regla?</p>
      
      <div class="">
            <div class="ruleId" hidden>`+ event.target.parentNode.parentNode.querySelector(".ruleId").innerText + `</div>
            <h5 class="card-title ruleName">` +
        event.target.parentNode.parentNode.querySelector(".ruleName").innerText +
        `</h5>
            <h6 class="card-subtitle mb-2 text-muted ruleDesc">` +
        event.target.parentNode.parentNode.querySelector(".ruleDesc").innerText +
        `   </h6>
      </div>
    `
    );
}

function updateSystem(event) {
    SUPABASE.from("systems")
        .update({
            name: $("#systemName").val(),
        })
        .eq("name", $("#systemName").val())
        .then((_response) => {
            //console.log(_response)
            //alert("Update successful");
            window.location.href = "system.html?name=" + $("#systemName").val();
        })
        .catch((err) => {
            //alert(err.response.text);
        });
}

function createRule(event) {
    //console.log($("#systemName").val());

    SUPABASE.from("systemRules")
        .insert({
            systemName: $("#systemName").val(),
            title: event.target.parentNode.parentNode.querySelector(".ruleName").value,
            desc: event.target.parentNode.parentNode.querySelector(".ruleDesc").value,
        })
        .then((_response) => {
            //alert("Create successful");
            window.location.href = "system.html?name=" + $("#systemName").val();
        })
        .catch((err) => {
            //alert(err.response.text);
        });
}
function updateRule(event) {
    SUPABASE.from("systemRules")
        .update({
            title: event.target.parentNode.parentNode.querySelector(".ruleName").value,
            desc: event.target.parentNode.parentNode.querySelector(".ruleDesc").value,
        })
        .eq(
            "id", event.target.parentNode.parentNode.querySelector(".ruleId").value
        )
        .then((_response) => {
            //alert("Update successful");
            window.location.href = "system.html?name=" + $("#systemName").val();
        })
        .catch((err) => {
            //alert(err.response.text);
        });
}
function removeRule(event) {
    SUPABASE.from("systemRules")
        .delete()
        .eq(
            "id",
            event.target.parentNode.parentNode.querySelector(".ruleId").innerText
        )
        .then((_response) => {
            //alert("Remove successful");
            window.location.href = "system.html?name=" + $("#systemName").val();
        })
        .catch((err) => {
            //alert(err.response.text);
        });
}

function removeSystemModal(event) {
    $("#removeSystemModalBody").empty();

    $("#removeSystemModalBody").append(
        `
      <p> ¿Quieres eliminar este sistema? <b> ` +
        $(".systemName")[0].innerText +
        `</b> </p>
    `
    );
}

function removeSystem(event) {
    SUPABASE.from("systems")
        .delete()
        .eq(
            "name",
            $(".systemName")[0].innerText
        )
        .then((_response) => {
            //alert("Remove successful");
            window.location.href = "index.html";
        })
        .catch((err) => {
            //alert(err.response.text);
        });
}