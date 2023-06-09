const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function (event) {
    loadLogin();
    $("#addRuleButton").click(emptyModal);
    $("#addRule").click(addRule);

    $("#createButton").click(createSystem);
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

function addRule(event) {
    $("#rulesZone").append(
        `
        <div class="card m-2 bg-warning" style="width: auto;">
          <div class="card-body ruleGroup">
            <input type="text" class="card-title text-center fw-bold ruleTitle" placeholder="Título" required value="`+ event.target.parentNode.parentNode.querySelector("#ruleTitle").value + `" >
            <textarea class="form-control text-center ruleDesc" placeholder="Descripción" required id="floatingTextarea">`+ event.target.parentNode.parentNode.querySelector("#ruleDesc").value + `</textarea>
            <button type="button" class="btn p-0 m-0 border-0 mt-2 deleteRule bg-transparent" style="width: 25px; height: 25px;"><img src="img/icons/remove.png"
            alt="DeleteButton" style="width: 100%;"></button>
          </div>
        </div>
    `
    )
    $(".deleteRule").click(deleteRule);
    $("#ruleModal").modal("hide");
}

function deleteRule(event) {
    event.target.parentNode.parentNode.remove();
}

async function createSystem(event) {
    event.preventDefault();

    let systemRow = await SUPABASE.from("systems")
        .upsert({
            name: $("#systemName")[0].value ? $("#systemName")[0].value : ""
        })
        .select();

    //console.log(systemRow);

    for (let i = 0; i < $(".ruleGroup").length; i++) {
        SUPABASE.from("systemRules")
            .insert({
                systemName: systemRow.data[0].name,
                title: $(".ruleGroup .ruleTitle")[i].value
                    ? $(".ruleGroup .ruleTitle")[i].value
                    : "",
                desc: $(".ruleGroup .ruleDesc")[i].value
                    ? $(".ruleGroup .ruleDesc")[i].value
                    : 0,
            })
            .then((_response) => {
                //alert("Create successful");
            })
            .catch((err) => {
                //alert(err.response.text);
            });
    }

    //alert("System created");
    window.location.href = "system.html?name=" + systemRow.data[0].name;
}