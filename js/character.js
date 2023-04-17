const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";
const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

document.addEventListener("DOMContentLoaded", async function (event) {
  //console.log(params.id);
  loadCharacter(params.id);
});

async function loadCharacter(id) {
  let characterRow = await SUPABASE.from("characters").select().eq("id", id);
  //console.log(characterRow);

  let attributes = await SUPABASE.from("attributes")
    .select()
    .eq("characterId", characterRow.data[0].id);

  let items = await SUPABASE.from("items")
    .select()
    .eq("characterId", characterRow.data[0].id);

  let skills = await SUPABASE.from("skills")
    .select()
    .eq("characterId", characterRow.data[0].id);

  $("#characterZone").append(
    `
        <div class="card">
            <div class="card-body">
                <h1 class="card-title text-center">` +
      characterRow.data[0].name +
      `</h1>
                <h2 class="card-subtitle mb-2 text-muted text-center">` +
      new Date(characterRow.data[0].date).toLocaleDateString() +
      `</h2>
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Características</h5>
                        <p class="card-text">Descripción: ` +
      characterRow.data[0].description +
      `</p>
                        <p class="card-text">Raza: ` +
      characterRow.data[0].race +
      `</p>
                        <p class="card-text">Clase: ` +
      characterRow.data[0].class +
      `</p>
                        <p class="card-text">Nivel: ` +
      characterRow.data[0].level +
      `</p>
                        <p class="card-text">HP: ` +
      characterRow.data[0].hp +
      `</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body" id="attrZone">
                        <h5 class="card-title">Atributos</h5>
                    </div>
                </div>

                <div id="itemsZone">
                    <h4>Equipo</h4>
                </div>

                <div id="skillsZone">
                    <h4>Habilidades</h4>
                </div>
            </div>
        </div>
    `
  );

  for (let i = 0; i < attributes.data.length; i++) {
    $("#attrZone").append(
      `<p class="card-text">` +
        attributes.data[i].name +
        ` | Base: ` +
        attributes.data[i].baseValue +
        ` | Suma: ` +
        attributes.data[i].sum +
        ` | Total: ` +
        attributes.data[i].totalValue +
        ` | Modificador: ` +
        attributes.data[i].modifier
    );
  }

  for (let i = 0; i < items.data.length; i++) {
    $("#itemsZone").append(
      `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">` +
        items.data[i].name +
        `</h5>
                <h6 class="card-subtitle mb-2 text-muted">` +
        items.data[i].description +
        `</h6>
                <p class="card-text">Cantidad: ` +
        items.data[i].amount +
        `</p>
                <p class="card-text">Daño: ` +
        items.data[i].damage +
        `</p>
            </div>
        </div>
        `
    );
  }

  for (let i = 0; i < skills.data.length; i++) {
    $("#skillsZone").append(
      `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">` +
        skills.data[i].name +
        `</h5>
                <p class="card-text">Daño: ` +
        skills.data[i].damage +
        `</p>
                <h6 class="card-subtitle mb-2 text-muted">` +
        skills.data[i].description +
        `</h6>
                
                <p class="card-text">Efecto: ` +
        skills.data[i].effect +
        `</p>
            </div>
        </div>
        `
    );
  }
}
