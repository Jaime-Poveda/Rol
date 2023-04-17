const SUPABASE_URL = "https://afribcvcanlurbnjrioe.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcmliY3ZjYW5sdXJibmpyaW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMjUzMTgsImV4cCI6MTk5NjcwMTMxOH0.YaVIKtzBY5bwnzvtvwebTUkM1GoSG86aNbgdgijGhbE";

const SUPABASE = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function (event) {
  $("#createCharacterForm").submit(createCharacter);
  $("#addBasicAttr").click(addBasicAttributes);
  $("#addAttr").click(addAttribute);
  $("#addItem").click(addItem);
  $("#addSkill").click(addSkill);
});

function addBasicAttributes(event) {
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

function addAttribute(event) {
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
}

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
}

function deleteElement(event) {
  event.target.parentElement.parentElement.remove();
}

async function createCharacter(event) {
  event.preventDefault();

  let user = await SUPABASE.auth.getUser();

  let characterRow = await SUPABASE.from("characters")
    .upsert({
      userId: user.data.user.id,
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
        alert(err.response.text);
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
        alert(err.response.text);
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
        alert(err.response.text);
      });
  }

  alert("Create successful");
}
