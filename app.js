console.log("app.js geladen ✅");

const API_BASE = "https://api.sewasuraa.com";

/* ============ DEVICE ID ============ */
function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
    localStorage.setItem("device_id", id);
  }
  return id;
}

document.addEventListener("DOMContentLoaded", () => {
  /* ============ AUDIO (SAFE: läuft auch ohne Dateien) ============ */
  let currentAudio = null;

  function stopAudio() {
    if (!currentAudio) return;
    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch {}
    currentAudio = null;
  }

  async function existsIfPossible(url) {
    try {
      if (!url) return false;
      const proto = window.location.protocol;
      const canHead = proto === "http:" || proto === "https:";
      if (!canHead) return true; // file:// -> versuch einfach abzuspielen
      const res = await fetch(url, { method: "HEAD", cache: "no-store" });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function playSequence(paths) {
    if (!paths || !paths.length) return;

    const playable = [];
    for (const p of paths) {
      if (await existsIfPossible(p)) playable.push(p);
    }
    if (!playable.length) return;

    stopAudio();

    let i = 0;
    const playNext = () => {
      if (i >= playable.length) return;

      const a = new Audio(playable[i]);
      currentAudio = a;

      a.onended = () => { i++; playNext(); };
      a.onerror = () => { i++; playNext(); };

      a.play().catch(() => {});
    };

    playNext();
  }

  function playAudio(path) {
    return playSequence([path]);
  }

  /* ============ ELEMENTE ============ */
  const welcome = document.getElementById("welcome");
  const codeGate = document.getElementById("codeGate");
  const menu = document.getElementById("menu");
  const game = document.getElementById("game");
  const feelings = document.getElementById("feelings");
  const numbers = document.getElementById("numbers");
  const colors = document.getElementById("colors");
  const letters = document.getElementById("letters");
  const BodyParts = document.getElementById("BodyParts");

  const fruits = document.getElementById("fruits");
  const vegetables = document.getElementById("vegetables");
  const food = document.getElementById("food");
  const animals = document.getElementById("animals");
  const clothes = document.getElementById("clothes");
  const kitchen = document.getElementById("kitchen");
  const weather = document.getElementById("weather");
  const livingRoom = document.getElementById("livingRoom");

  const shop = document.getElementById("shop");

  const startBtn = document.getElementById("startBtn");
  const goGame = document.getElementById("goGame");
  const goFeelings = document.getElementById("goFeelings");
  const goNumbers = document.getElementById("goNumbers");
  const goColors = document.getElementById("goColors");
  const goLetters = document.getElementById("goLetters");
  const goBodyParts = document.getElementById("goBodyParts");

  const goFruits = document.getElementById("goFruits");
  const goVegetables = document.getElementById("goVegetables");
  const goFood = document.getElementById("goFood");
  const goAnimals = document.getElementById("goAnimals");
  const goClothes = document.getElementById("goClothes");
  const goKitchen = document.getElementById("goKitchen");
  const goWeather = document.getElementById("goWeather");
  const goLivingRoom = document.getElementById("goLivingRoom");

  const goShop = document.getElementById("goShop");

  const backWelcome = document.getElementById("backWelcome");
  const backMenu = document.getElementById("backMenu");
  const backMenuFromFeelings = document.getElementById("backMenuFromFeelings");
  const backMenuFromNumbers = document.getElementById("backMenuFromNumbers");
  const backMenuFromColors = document.getElementById("backMenuFromColors");
  const backMenuFromLetters = document.getElementById("backMenuFromLetters");
  const backMenuFromBodyParts = document.getElementById("backMenuFromBodyParts");

  const backMenuFromFruits = document.getElementById("backMenuFromFruits");
  const backMenuFromVegetables = document.getElementById("backMenuFromVegetables");
  const backMenuFromFood = document.getElementById("backMenuFromFood");
  const backMenuFromAnimals = document.getElementById("backMenuFromAnimals");
  const backMenuFromClothes = document.getElementById("backMenuFromClothes");
  const backMenuFromKitchen = document.getElementById("backMenuFromKitchen");
  const backMenuFromWeather = document.getElementById("backMenuFromWeather");
  const backMenuFromLivingRoom = document.getElementById("backMenuFromLivingRoom");

  const backMenuFromShop = document.getElementById("backMenuFromShop");

  /* ============ CODE GATE ELEMENTE ============ */
  const codeInput = document.getElementById("codeInput");
  const codeSubmit = document.getElementById("codeSubmit");
  const codeError = document.getElementById("codeError");

  /* ============ HILFSFUNKTION: SHOW ============ */
  function show(screen) {
    [
      welcome, codeGate, menu, game, feelings, numbers, colors, letters, BodyParts,
      fruits, vegetables, food, animals, clothes, kitchen, weather, livingRoom,
      shop
    ].forEach(s => s && s.classList.add("hidden"));
    screen && screen.classList.remove("hidden");
  }

  /* ============ UI FX ============ */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function starBurst() {
    const layer = document.createElement("div");
    layer.className = "starburst";
    document.body.appendChild(layer);

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < 10; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.textContent = "⭐";
      s.style.left = (cx + (Math.random() * 120 - 60)) + "px";
      s.style.top = (cy + (Math.random() * 80 - 40)) + "px";
      layer.appendChild(s);
    }
    setTimeout(() => layer.remove(), 900);
  }

  function shake(el) {
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }

  /* ============ CODE CHECK (wie Muster) ============ */
  async function checkCode() {
    const userCode = (codeInput?.value || "").trim();

    if (!userCode) {
      if (codeError) {
        codeError.style.display = "block";
        codeError.textContent = "کۆد بنوسە 🙂";
      }
      return;
    }

    if (codeError) {
      codeError.style.display = "none";
      codeError.textContent = "";
    }
    if (codeSubmit) codeSubmit.disabled = true;

    try {
      const device_id = getDeviceId();

      const r = await fetch(`${API_BASE}/codes/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: userCode, device_id })
      });

      let data = null;
      try { data = await r.json(); } catch { data = null; }

      if (r.ok && data && data.valid) {
        show(menu);
      } else {
        if (codeError) {
          codeError.style.display = "block";
          codeError.textContent = "کۆد هەڵەیە ❌";
        }
      }
    } catch (err) {
      console.error("API Fehler", err);
      if (codeError) {
        codeError.style.display = "block";
        codeError.textContent = "⚠️ API کار ناکات / هەڵەی ئینتەرنێت";
      }
    } finally {
      if (codeSubmit) codeSubmit.disabled = false;
    }
  }

  /* ============ START BUTTON ============ */
  if (startBtn) {
    startBtn.onclick = () => {
      show(codeGate);
      if (codeError) {
        codeError.style.display = "none";
        codeError.textContent = "";
      }
      if (codeInput) {
        codeInput.value = "";
        codeInput.focus();
      }
    };
  }

  if (codeSubmit) codeSubmit.onclick = checkCode;
  if (codeInput) {
    codeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkCode();
    });
  }

  /* ============ NAVIGATION ============ */
  if (backWelcome) backWelcome.onclick = () => show(welcome);
  if (backMenu) backMenu.onclick = () => show(menu);
  if (backMenuFromFeelings) backMenuFromFeelings.onclick = () => show(menu);
  if (backMenuFromNumbers) backMenuFromNumbers.onclick = () => show(menu);
  if (backMenuFromColors) backMenuFromColors.onclick = () => show(menu);
  if (backMenuFromLetters) backMenuFromLetters.onclick = () => show(menu);
  if (backMenuFromBodyParts) backMenuFromBodyParts.onclick = () => show(menu);

  if (backMenuFromFruits) backMenuFromFruits.onclick = () => show(menu);
  if (backMenuFromVegetables) backMenuFromVegetables.onclick = () => show(menu);
  if (backMenuFromFood) backMenuFromFood.onclick = () => show(menu);
  if (backMenuFromAnimals) backMenuFromAnimals.onclick = () => show(menu);
  if (backMenuFromClothes) backMenuFromClothes.onclick = () => show(menu);
  if (backMenuFromKitchen) backMenuFromKitchen.onclick = () => show(menu);
  if (backMenuFromWeather) backMenuFromWeather.onclick = () => show(menu);
  if (backMenuFromLivingRoom) backMenuFromLivingRoom.onclick = () => show(menu);
  if (backMenuFromShop) backMenuFromShop.onclick = () => show(menu);

  /* Start Screen */
  show(welcome);

  /* =========================================================
     ===================== SPIEL 1 (ACTIONS) ==================
     ========================================================= */
  const img = document.getElementById("img");
  const q = document.getElementById("q");
  const fb = document.getElementById("fb");
  const starsEl = document.getElementById("stars");
  const b0 = document.getElementById("b0");
  const b1 = document.getElementById("b1");
  const b2 = document.getElementById("b2");

  let stars = 0;
  let current = 0;
  let locked = false;

  const tasks = [
    { image:"images/essen.png", question:"ئەو منداڵە چی دەکات؟", options:["نان دەخوات","ئاو دەخواتەوە","یاری دەکات"], correct:0 },
    { image:"images/trinken.png", question:"ئەو منداڵە چی دەکات؟", options:["یاری دەکات","ئاو دەخواتەوە","نان دەخوات"], correct:1 },
    { image:"images/spielen.png", question:"ئەو منداڵە چی دەکات؟", options:["خەوتووە","نان دەخوات","یاری دەکات"], correct:2 },
    { image:"images/zahnputzen.png", question:"ئەو منداڵە چی دەکات؟", options:["ددان دەشوات","نان دەخوات","خەوتووە"], correct:0 },
    { image:"images/handwaschen.png", question:"ئەو منداڵە چی دەکات؟", options:["دەست دەشوات","یاری دەکات","خەوتووە"], correct:0 },
    { image:"images/weinen.png", question:"ئەو مندالە چی دەکات؟", options:["دەگریت","پێ دەکەنێت","یاری دەکات"], correct:0 },
    { image:"images/schwimmen.png", question:"ئەو مندالە چی دەکات؟", options:["مەلەوانی دەکات","دەگریت","دانیشتووە"], correct:0 },
    { image:"images/schreien.png", question:"ئەو مندالە چی دەکات؟", options:["خەوتووە","ھاوار دەکات","دانیشتووە"], correct:1 },
    { image:"images/sitzen.png", question:"ئەو مندالە چی دەکات؟", options:["دانیشتووە","مەلەوانی دەکات","دەگریت"], correct:0 }
  ];

  function updateStars(){ if (starsEl) starsEl.textContent = "⭐ " + stars; }

  function loadTask(){
    locked = false;
    if (fb) fb.textContent = "";
    const t = tasks[current];
    if (img) img.src = t.image;
    if (q) q.textContent = t.question;
    [b0,b1,b2].forEach((btn,i)=>{
      if(!btn) return;
      btn.textContent = t.options[i];
      btn.disabled = false;
    });
  }

  function startGame1(){
    stars = 0;
    current = 0;
    shuffle(tasks);
    updateStars();
    loadTask();
  }

  [b0,b1,b2].forEach((btn,i)=>{
    if(!btn) return;
    btn.addEventListener("click", () => {
      if(locked) return;

      if(i === tasks[current].correct){
        locked = true;
        stars++;
        updateStars();
        if (fb) fb.textContent = "👏 ئافەرین ✅";
        playAudio("audio/afarin.mp3");
        starBurst();
        [b0,b1,b2].forEach(b=>b && (b.disabled=true));

        setTimeout(()=>{
          current++;
          if(current >= tasks.length){
            alert("🎉 کۆتایی!\nتۆ کۆی گشتی " + stars + " ئەستێرەت هەیە ⭐");
            show(menu);
            return;
          }
          loadTask();
        }, 800);

      } else {
        playAudio("audio/rastnia.mp3");
        if (fb) fb.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
        shake(game);
      }
    });
  });

  updateStars();
  if (goGame) goGame.onclick = () => { show(game); startGame1(); };

/* ============ MENU NAV (ALLE FELDER ÖFFNEN) ============ */
if (goFeelings) goFeelings.onclick = () => show(feelings);
if (goNumbers) goNumbers.onclick = () => show(numbers);
if (goColors) goColors.onclick = () => show(colors);
if (goLetters) goLetters.onclick = () => show(letters);
if (goBodyParts) goBodyParts.onclick = () => show(BodyParts);

if (goFruits) goFruits.onclick = () => { show(fruits); fruitsGame.start(); };
if (goVegetables) goVegetables.onclick = () => show(vegetables);
if (goFood) goFood.onclick = () => show(food);
if (goAnimals) goAnimals.onclick = () => show(animals);
if (goClothes) goClothes.onclick = () => show(clothes);
if (goKitchen) goKitchen.onclick = () => show(kitchen);
if (goWeather) goWeather.onclick = () => show(weather);
if (goLivingRoom) goLivingRoom.onclick = () => show(livingRoom);

/* Shop hast du schon, aber ok: */
if (goShop) goShop.onclick = () => show(shop);
  

  /* =================== REST DEINER DATEI BLEIBT UNVERÄNDERT =================== */
  /* (Gefühle, Zahlen, Farben, Buchstaben, BodyParts, Fruits, Vegetables, Food,
     Animals, Clothes, Kitchen, Weather, LivingRoom, Shop ...) */

  /* =========================================================
     ===================== SHOP ===============================
     ========================================================= */
  if (goShop) goShop.onclick = () => show(shop);

  /* ... (ab hier läuft dein vorhandener Code unverändert weiter) ... */
});
