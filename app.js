console.log("ECHTE FINALE app.js geladen ✅");

document.addEventListener("DOMContentLoaded", () => {

  /* =================== ELEMENTE =================== */
  const $ = id => document.getElementById(id);

  const welcome = $("welcome");
  const codeGate = $("codeGate");
  const menu = $("menu");

  const game = $("game");
  const feelings = $("feelings");
  const numbers = $("numbers");
  const colors = $("colors");
  const letters = $("letters");
  const BodyParts = $("BodyParts");
  const fruits = $("fruits");
  const vegetables = $("vegetables");
  const food = $("food");
  const animals = $("animals");
  const clothes = $("clothes");
  const kitchen = $("kitchen");
  const weather = $("weather");
  const livingRoom = $("livingRoom");
  const shop = $("shop");

  const startBtn = $("startBtn");
  const codeInput = $("codeInput");
  const codeSubmit = $("codeSubmit");
  const codeError = $("codeError");

  /* =================== SHOW =================== */
  const ALL = [
    welcome, codeGate, menu,
    game, feelings, numbers, colors, letters, BodyParts,
    fruits, vegetables, food, animals, clothes,
    kitchen, weather, livingRoom, shop
  ];

  function show(section) {
    ALL.forEach(s => s && s.classList.add("hidden"));
    section && section.classList.remove("hidden");
  }

  /* =================== START + CODE =================== */
  startBtn.onclick = () => {
    show(codeGate);
    codeInput.value = "";
    codeError.style.display = "none";
    codeInput.focus();
  };

  function checkCode() {
    const val = codeInput.value.trim();
    if (val !== "1234") {   // ← DEIN CODE
      codeError.style.display = "block";
      return;
    }
    show(menu);
  }

  codeSubmit.onclick = checkCode;
  codeInput.addEventListener("keydown", e => {
    if (e.key === "Enter") checkCode();
  });

  /* =================== ZENTRALER BUTTON-BINDER =================== */
  function bind(btnId, section) {
    const btn = $(btnId);
    if (!btn || !section) return;
    btn.onclick = () => {
      console.log("Klick:", btnId);
      show(section);
    };
  }

  /* =================== MENÜ BUTTONS =================== */
  bind("goGame", game);
  bind("goFeelings", feelings);
  bind("goNumbers", numbers);
  bind("goColors", colors);
  bind("goLetters", letters);
  bind("goBodyParts", BodyParts);
  bind("goFruits", fruits);
  bind("goVegetables", vegetables);
  bind("goFood", food);
  bind("goAnimals", animals);
  bind("goClothes", clothes);
  bind("goKitchen", kitchen);
  bind("goWeather", weather);
  bind("goLivingRoom", livingRoom);
  bind("goShop", shop);

  /* =================== BACK BUTTONS =================== */
  document.querySelectorAll("[id^='backMenu']").forEach(b =>
    b.onclick = () => show(menu)
  );
  $("backWelcome") && ($("backWelcome").onclick = () => show(welcome));

  /* =================== STARTSCREEN =================== */
  show(welcome);

});
