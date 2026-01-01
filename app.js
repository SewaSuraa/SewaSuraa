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

  /* ============ AUDIO (NICHT BLOCKIEREND) ============ */
  let currentAudio = null;

  function stopAudio() {
    if (!currentAudio) return;
    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch {}
    currentAudio = null;
  }

  function playSequence(paths) {
    if (!paths || !paths.length) return;

    stopAudio();

    let i = 0;
    const playNext = () => {
      if (i >= paths.length) return;

      const a = new Audio(paths[i]);
      currentAudio = a;

      a.onended = () => { i++; playNext(); };
      a.onerror = () => { i++; playNext(); };

      a.play().catch(() => {});
    };

    playNext();
  }

  function playAudio(path) {
    playSequence([path]);
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
      fruits, vegetables, food, animals, clothes, kitchen, weather, livingRoom, shop
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

  /* ============ CODE CHECK (API) ============ */
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
  // ✅ 3 Monate – am besten vom Server, sonst fallback
let until =
  data?.expires_at ? Date.parse(data.expires_at) :
  (data?.unlock_until ? Number(data.unlock_until) : NaN);

// ✅ wenn unlock_until in Sekunden kommt -> in ms umrechnen
if (Number.isFinite(until) && until < 1e12) until = until * 1000;

if (Number.isFinite(until) && until > Date.now()) {
  localStorage.setItem("unlock_until", String(until));
} else {
  // fallback 90 Tage (nur falls Server nix schickt)
  localStorage.setItem("unlock_until", String(Date.now() + 90*24*60*60*1000));
}


  localStorage.setItem("unlocked_device", getDeviceId());
  show(menu);
}
 else {
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

  /* ============ NAVIGATION BACK ============ */
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
const until = Number(localStorage.getItem("unlock_until") || 0);
const devOk = localStorage.getItem("unlocked_device") === getDeviceId();

if (devOk && until && Date.now() < until) {
  show(menu);
} else {
  localStorage.removeItem("unlock_until");
  localStorage.removeItem("unlocked_device");
  show(welcome);
}


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

  /* =========================================================
     ===================== GEFÜHLE ============================
     ========================================================= */
  const fq = document.getElementById("fq");
  const ffb = document.getElementById("ffb");
  const fstarsEl = document.getElementById("fstars");
  const f0 = document.getElementById("f0");
  const f1 = document.getElementById("f1");
  const f2 = document.getElementById("f2");

  const feelingsPool = [
    ["krank","من نەخۆشم"],
    ["gluecklich","من دڵخۆشم"],
    ["traurig","من خەمگینم"],
    ["wuetend","من تووڕەم"],
    ["heiss","من گەرمامە"],
    ["kalt","من سەرمامە"],
    ["hungrig","من برسیمە"],
    ["duerstig","من تینوومە"],
    ["angst","من دەترسم"],
    ["muede","من ماندووم"],
    ["schmerzen","من ئازارم هەیە"]
  ];

  let fStars = 0;
  let fIndex = 0;
  let fLocked = false;

  function updateFStars(){ if (fstarsEl) fstarsEl.textContent = "⭐ " + fStars; }

  function setFeelingImage(imgEl, key){
    const base = "images/feelings/" + key;
    imgEl.onerror = () => { imgEl.src = base + ".jpg"; };
    imgEl.src = base + ".png";
  }

  function startFeelings(){
    fStars = 0;
    fIndex = 0;
    updateFStars();
    if (ffb) ffb.textContent = "";
    shuffle(feelingsPool);
    nextFeeling();
  }

  function nextFeeling(){
    fLocked = false;
    if (ffb) ffb.textContent = "";

    const [correctKey, text] = feelingsPool[fIndex];
    if (fq) fq.textContent = text;
    playAudio("audio/feelings/" + correctKey + ".mp3");

    const keys = [correctKey];
    const others = feelingsPool.map(x=>x[0]).filter(k=>k!==correctKey);
    shuffle(others);
    keys.push(others[0], others[1]);
    shuffle(keys);

    const btns = [f0,f1,f2];
    btns.forEach((btn,i)=>{
      if(!btn) return;
      const im = btn.querySelector("img");
      if (im) setFeelingImage(im, keys[i]);
      btn.disabled = false;

      btn.onclick = () => {
        if (fLocked) return;

        const isCorrect = (keys[i] === correctKey);
        playAudio(isCorrect ? "audio/afarin.mp3" : "audio/rastnia.mp3");

        if (isCorrect) {
          fLocked = true;
          fStars++;
          updateFStars();
          if (ffb) ffb.textContent = "ئافەرین ✅";
          starBurst();
          btns.forEach(b => b && (b.disabled = true));

          setTimeout(() => {
            fIndex++;
            if (fIndex >= feelingsPool.length) {
              alert("🎉 کۆتایی!\nتۆ کۆی گشتی " + fStars + " ئەستێرەت هەیە ⭐");
              show(menu);
              return;
            }
            nextFeeling();
          }, 800);

        } else {
          if (ffb) ffb.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
          shake(feelings);
        }
      };
    });
  }

  /* =========================================================
     ===================== ZAHLEN =============================
     ========================================================= */
  const nimg = document.getElementById("nimg");
  const nfb = document.getElementById("nfb");
  const nstarsEl = document.getElementById("nstars");
  const n0 = document.getElementById("n0");
  const n1 = document.getElementById("n1");
  const n2 = document.getElementById("n2");

  let nStars = 0;
  let nIndex = 0;
  const numberTasks = Array.from({length:11}, (_,i)=>i);
  const numLabel = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩","١٠"];

  function updateNStars(){ if (nstarsEl) nstarsEl.textContent = "⭐ " + nStars; }

  function startNumbers(){
    nStars = 0;
    nIndex = 0;
    updateNStars();
    if (nfb) nfb.textContent = "";
    shuffle(numberTasks);
    loadNumber();
  }

  function loadNumber(){
    if (nfb) nfb.textContent = "";
    const correct = numberTasks[nIndex];
    if (nimg) nimg.src = "images/numbers/" + correct + ".png";

    let opts = [correct];
    while(opts.length < 3){
      const r = Math.floor(Math.random()*11);
      if(!opts.includes(r)) opts.push(r);
    }
    shuffle(opts);

    const btns = [n0,n1,n2];
    btns.forEach((btn,i)=>{
      if(!btn) return;
      btn.textContent = numLabel[opts[i]];

      btn.onclick = () => {
        const clicked = opts[i];
        const isCorrect = (clicked === correct);

        playSequence([
          "audio/numbers/" + clicked + ".mp3",
          isCorrect ? "audio/afarin.mp3" : "audio/rastnia.mp3"
        ]);

        if(isCorrect){
          nStars++;
          updateNStars();
          starBurst();

          setTimeout(()=>{
            nIndex++;
            if(nIndex >= numberTasks.length){
              alert("🎉 کۆتایی!\nتۆ کۆی گشتی " + nStars + " ئەستێرەت هەیە ⭐");
              show(menu);
              return;
            }
            loadNumber();
          }, 900);

        } else {
          if (nfb) nfb.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
          shake(numbers);
        }
      };
    });
  }

  /* =========================================================
     ===================== FARBEN =============================
     ========================================================= */
  const cq = document.getElementById("cq");
  const cfb = document.getElementById("cfb");
  const cstarsEl = document.getElementById("cstars");

  const cBtns = [
    document.getElementById("c0"),
    document.getElementById("c1"),
    document.getElementById("c2")
  ];

  const colorPool = [
    { key:"red", sorani:"سوور", css:"#ff3b30" },
    { key:"blue", sorani:"شین", css:"#007aff" },
    { key:"green", sorani:"سەوز", css:"#34c759" },
    { key:"yellow",sorani:"زەرد", css:"#ffcc00" },
    { key:"orange",sorani:"پۆرتەقاڵی", css:"#ff9500" },
    { key:"purple",sorani:"مۆر", css:"#af52de" },
    { key:"pink", sorani:"پەمەیی", css:"#ff2d55" }
  ];

  let cStars = 0;
  let cIndex = 0;
  let cLocked = false;
  let colorTasks = [];

  function startColors(){
    cStars = 0;
    cIndex = 0;
    cLocked = false;
    if (cstarsEl) cstarsEl.textContent = "⭐ 0";
    if (cfb) cfb.textContent = "";

    colorTasks = [];
    for(let i=0;i<10;i++){
      const target = colorPool[Math.floor(Math.random()*colorPool.length)];
      colorTasks.push(target);
    }

    loadColorTask();
  }

  function loadColorTask(){
    cLocked = false;
    if (cfb) cfb.textContent = "";

    const target = colorTasks[cIndex];

    playAudio("audio/colors/" + target.key + ".mp3");
    if (cq) cq.textContent = "کام ڕەنگە " + target.sorani + "ە؟";

    const options = [target];
    while(options.length < 3){
      const r = colorPool[Math.floor(Math.random()*colorPool.length)];
      if(!options.some(x => x.key === r.key)) options.push(r);
    }
    shuffle(options);

    cBtns.forEach((btn,i)=>{
      if(!btn) return;
      const dot = btn.querySelector(".dot");
      if (dot) dot.style.background = options[i].css;

      btn.disabled = false;
      btn.onclick = () => {
        if (cLocked) return;

        const isCorrect = (options[i].key === target.key);

        if (isCorrect) {
          cLocked = true;
          cStars++;
          if (cstarsEl) cstarsEl.textContent = "⭐ " + cStars;
          playAudio("audio/afarin.mp3");
          starBurst();
          cBtns.forEach(b => b && (b.disabled = true));
          if (cfb) cfb.textContent = "ئافەرین ✅";

          setTimeout(() => {
            cIndex++;
            if (cIndex >= colorTasks.length) {
              alert("🎉 کۆتایی!\nتۆ کۆی گشتی " + cStars + " ئەستێرەت هەیە ⭐");
              show(menu);
              return;
            }
            loadColorTask();
          }, 900);

        } else {
          playAudio("audio/rastnia.mp3");
          if (cfb) cfb.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
          shake(colors);
        }
      };
    });
  }

  /* =========================================================
     ===================== BUCHSTABEN =========================
     ========================================================= */
  const limg = document.getElementById("limg");
  const lfb = document.getElementById("lfb");
  const lstarsEl = document.getElementById("lstars");
  const l0 = document.getElementById("l0");
  const l1 = document.getElementById("l1");
  const l2 = document.getElementById("l2");

  const SORANI_LETTERS = [
    "ئ","ا","ب","پ","ت","ج","چ","ح","خ","د","ر","ڕ","ز","ژ",
    "س","ش","ع","غ","ف","ڤ","ق","ک","گ","ل","ڵ","م","ن","ه",
    "و","ۆ","ی","ێ","ە"
  ];

  const letterTasks = [
    { image: "images/letters/1.png", correct: "ئ" },
    { image: "images/letters/2.png", correct: "ب" },
    { image: "images/letters/3.png", correct: "پ" },
    { image: "images/letters/4.png", correct: "ت" },
    { image: "images/letters/5.png", correct: "ج" },
    { image: "images/letters/6.png", correct: "چ" },
    { image: "images/letters/7.png", correct: "ح" },
    { image: "images/letters/8.png", correct: "خ" },
    { image: "images/letters/9.png", correct: "د" },
    { image: "images/letters/10.png", correct: "ڕ" },
    { image: "images/letters/11.png", correct: "ز" },
    { image: "images/letters/12.png", correct: "ژ" },
    { image: "images/letters/13.png", correct: "س" },
    { image: "images/letters/14.png", correct: "ش" },
    { image: "images/letters/15.png", correct: "ع" },
    { image: "images/letters/16.png", correct: "ف" },
    { image: "images/letters/17.png", correct: "ڤ" },
    { image: "images/letters/18.png", correct: "ق" },
    { image: "images/letters/19.png", correct: "ک" },
    { image: "images/letters/20.png", correct: "گ" },
    { image: "images/letters/21.png", correct: "ل" },
    { image: "images/letters/22.png", correct: "م" },
    { image: "images/letters/23.png", correct: "ن" },
    { image: "images/letters/24.png", correct: "ھ" },
    { image: "images/letters/25.png", correct: "و" },
    { image: "images/letters/26.png", correct: "ی" }
  ];

  let lStars = 0;
  let lIndex = 0;
  let lLocked = false;

  function startLetters(){
    lStars = 0;
    lIndex = 0;
    lLocked = false;
    if (lstarsEl) lstarsEl.textContent = "⭐ 0";
    if (lfb) lfb.textContent = "";
    shuffle(letterTasks);
    loadLetterTask();
  }

  function loadLetterTask(){
    lLocked = false;
    if (lfb) lfb.textContent = "";

    const t = letterTasks[lIndex];
    if (limg) limg.src = t.image;

    const correct = t.correct;
    const pool = SORANI_LETTERS.filter(x => x !== correct);
    shuffle(pool);

    const opts = [correct, pool[0], pool[1]];
    shuffle(opts);

    const btns = [l0, l1, l2];
    btns.forEach((btn, i) => {
      if(!btn) return;
      btn.textContent = opts[i];
      btn.disabled = false;

      btn.onclick = () => {
        if (lLocked) return;

        const isCorrect = (opts[i] === correct);
        playAudio(isCorrect ? "audio/afarin.mp3" : "audio/rastnia.mp3");

        if (isCorrect) {
          lLocked = true;
          lStars++;
          if (lstarsEl) lstarsEl.textContent = "⭐ " + lStars;
          if (lfb) lfb.textContent = "ئافەرین ✅";
          starBurst();
          btns.forEach(b => b && (b.disabled = true));

          setTimeout(() => {
            lIndex++;
            if (lIndex >= letterTasks.length) {
              alert("🎉 کۆتایی!\nتۆ کۆی گشتی " + lStars + " ئەستێرەت هەیە ⭐");
              show(menu);
              return;
            }
            loadLetterTask();
          }, 800);

        } else {
          if (lfb) lfb.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
          shake(letters);
        }
      };
    });
  }

  /* =========================================================
     ===================== KÖRPERTEILE ========================
     ========================================================= */
  const bpQ = document.getElementById("bpq");
  const bpFB = document.getElementById("bpfb");
  const bpStarsEl = document.getElementById("bpstars");
  const bp0 = document.getElementById("bp0");
  const bp1 = document.getElementById("bp1");
  const bp2 = document.getElementById("bp2");

  const BodyPartsPool = [
    ["auge","چاو"], ["bauch","زگ"], ["beine","قاچ"], ["finger","پەنجە"],
    ["fuss","پێ"], ["haare","قژ"], ["hals","مل"], ["hand","دەست"],
    ["knie","ئەژنۆ"], ["kopf","سەر"], ["mund","دەم"], ["lippen","لێو"],
    ["naegel","نینۆک"], ["nase","لووت"], ["ohr","گوێچکە"], ["schulter","شان"],
    ["wange","رومەت"], ["zahn","ددان"], ["zunge","زمان"]
  ];

  let bpStars = 0;
  let bpIndex = 0;
  let bpLocked = false;

  function updateBPStars(){ if (bpStarsEl) bpStarsEl.textContent = "⭐ " + bpStars; }

  function setBodyPartImage(imgEl, key){
    if (!imgEl) return;
    const base = "images/Koerper/" + key;
    imgEl.onerror = () => { imgEl.src = base + ".jpg"; };
    imgEl.src = base + ".png";
  }

  function startBodyParts(){
    bpStars = 0;
    bpIndex = 0;
    bpLocked = false;
    updateBPStars();
    if (bpFB) bpFB.textContent = "";
    shuffle(BodyPartsPool);
    nextBodyPart();
  }

  function nextBodyPart(){
    bpLocked = false;
    if (bpFB) bpFB.textContent = "";

    const [correctKey, soraniText] = BodyPartsPool[bpIndex];
    if (bpQ) bpQ.textContent = soraniText;

    playAudio("audio/hamwi/" + correctKey + ".mp3");

    const keys = [correctKey];
    const others = BodyPartsPool.map(x=>x[0]).filter(k=>k!==correctKey);
    shuffle(others);
    keys.push(others[0], others[1]);
    shuffle(keys);

    const btns = [bp0,bp1,bp2];
    btns.forEach((btn,i)=>{
      if(!btn) return;
      const im = btn.querySelector("img");
      setBodyPartImage(im, keys[i]);
      btn.disabled = false;

      btn.onclick = () => {
        if (bpLocked) return;

        const ok = (keys[i] === correctKey);
        playAudio(ok ? "audio/afarin.mp3" : "audio/rastnia.mp3");

        if (ok) {
          bpLocked = true;
          bpStars++;
          updateBPStars();
          if (bpFB) bpFB.textContent = "ئافەرین ✅";
          starBurst();
          btns.forEach(b => b && (b.disabled = true));

          setTimeout(() => {
            bpIndex++;
            if (bpIndex >= BodyPartsPool.length) {
              alert("🎉 کۆتایی!\nتۆ کۆی گشتی " + bpStars + " ئەستێرەت هەیە ⭐");
              show(menu);
              return;
            }
            nextBodyPart();
          }, 800);

        } else {
          if (bpFB) bpFB.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
          shake(BodyParts);
        }
      };
    });
  }

  /* =========================================================
     ===================== GENERIC IMAGE GAME =================
     ========================================================= */
  function setImageWithFallback(imgEl, basePathNoExt) {
    if (!imgEl) return;
    imgEl.onerror = () => { imgEl.src = basePathNoExt + ".jpg"; };
    imgEl.src = basePathNoExt + ".png";
  }

  function make3ImageGame(cfg) {
    const { sectionEl, qEl, fbEl, starsEl, btnEls, pool, imgBaseDir, audioBaseDir } = cfg;

    let stars = 0;
    let idx = 0;
    let locked = false;

    const keyToText = new Map(pool.map(([k, t]) => [k, t]));
    const allKeys = pool.map(([k]) => k);

    function updateStars() { if (starsEl) starsEl.textContent = "⭐ " + stars; }

    function start() {
      stars = 0;
      idx = 0;
      locked = false;
      updateStars();
      if (fbEl) fbEl.textContent = "";
      const shuffled = [...allKeys];
      shuffle(shuffled);
      cfg._shuffled = shuffled;
      next();
    }

    function next() {
      locked = false;
      if (fbEl) fbEl.textContent = "";

      const correctKey = cfg._shuffled[idx];
      const soraniText = keyToText.get(correctKey) || correctKey;
      if (qEl) qEl.textContent = soraniText;

      playAudio(audioBaseDir + "/" + correctKey + ".mp3");

      const keys = [correctKey];
      const others = allKeys.filter(k => k !== correctKey);
      shuffle(others);
      keys.push(others[0], others[1]);
      shuffle(keys);

      btnEls.forEach((btn, i) => {
        if (!btn) return;
        const im = btn.querySelector("img");
        setImageWithFallback(im, imgBaseDir + "/" + keys[i]);
        btn.disabled = false;

        btn.onclick = () => {
          if (locked) return;

          const ok = (keys[i] === correctKey);
          playAudio(ok ? "audio/afarin.mp3" : "audio/rastnia.mp3");

          if (ok) {
            locked = true;
            stars++;
            updateStars();
            if (fbEl) fbEl.textContent = "ئافەرین ✅";
            starBurst();
            btnEls.forEach(b => b && (b.disabled = true));

            setTimeout(() => {
              idx++;
              if (idx >= cfg._shuffled.length) {
                alert("🎉 کۆتایی!\nتۆ کۆی گشتی " + stars + " ئەستێرەت هەیە ⭐");
                show(menu);
                return;
              }
              next();
            }, 800);

          } else {
            if (fbEl) fbEl.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
            shake(sectionEl);
          }
        };
      });
    }

    return { start };
  }

  /* ===================== FRUITS ===================== */
  const fruitsGame = make3ImageGame({
    sectionEl: fruits,
    qEl: document.getElementById("frq"),
    fbEl: document.getElementById("frfb"),
    starsEl: document.getElementById("frstars"),
    btnEls: [document.getElementById("fr0"), document.getElementById("fr1"), document.getElementById("fr2")],
    pool: [
      ["ananas","ئەنەناس"],
      ["apfel","سێو"],
      ["banane","مۆز"],
      ["birne","هەرمێ"],
      ["erdbeere","شلیک"],
      ["feige","هەنجیر"],
      ["kirsche","گێلاس"],
      ["kiwi","کیوی"],
      ["kokos","گوێزی هندی"],
      ["mango","مانگۆ"],
      ["melone","کاڵەک"],
      ["orange","پۆرتەقاڵ"],
      ["wassermelone","شوتی"]
    ],
    imgBaseDir: "images/fruits",
    audioBaseDir: "audio/hamwi"
  });

  /* ===================== VEGETABLES ===================== */
  const vegetablesGame = make3ImageGame({
    sectionEl: vegetables,
    qEl: document.getElementById("vgq"),
    fbEl: document.getElementById("vgfb"),
    starsEl: document.getElementById("vgstars"),
    btnEls: [document.getElementById("vg0"), document.getElementById("vg1"), document.getElementById("vg2")],
    pool: [
      ["avocado","ئەڤۆکادۆ"],
      ["blumenkohl","قەرنابیت"],
      ["brokolie","بڕۆکۆلی"],
      ["gruneerbsen","بەزالیا"],
      ["gurke","خەیار"],
      ["karotte","گێزەر"],
      ["kartoffel","پەتاتە"],
      ["knoblauch","سیر"],
      ["kuerbis","کولەکەی زەرد"],
      ["mais","گەنمەشامی"],
      ["obergine","باینجان"],
      ["paprika","بیبەر"],
      ["pilz","قارچک"],
      ["salat","کاهو"],
      ["tomate","تەماتە"],
      ["zitrone","لیمۆ"],
      ["zwiebel","پیاز"]
    ],
    imgBaseDir: "images/numbers/vegetables",
    audioBaseDir: "audio/hamwi"
  });

  /* ===================== FOOD ===================== */
  const foodGame = make3ImageGame({
    sectionEl: food,
    qEl: document.getElementById("fdq"),
    fbEl: document.getElementById("fdfb"),
    starsEl: document.getElementById("fdstars"),
    btnEls: [document.getElementById("fd0"), document.getElementById("fd1"), document.getElementById("fd2")],
    pool: [
      ["ei","هێلکە"],
      ["eis","ئایس کرێم"],
      ["fleisch","گۆشت"],
      ["huehnerfleisch","گۆشتی مریشک"],
      ["humburger","هەمبەرگەر"],
      ["kaese","پەنیر"],
      ["kekse","بیسکیت"],
      ["nudel","ماکارۆنی"],
      ["pizza","پیتزا"],
      ["popcorn","گەنمەشامی"],
      ["saft","شەربەت"],
      ["sandwich","ساندویچ"],
      ["schoko","نەستەلە"],
      ["milch","شیر"],
      ["tee","چا"],
      ["torte","کێکی بە کرێم"],
      ["wasser","ئاو"]
    ],
    imgBaseDir: "images/food",
    audioBaseDir: "audio/hamwi"
  });

  /* ===================== ANIMALS ===================== */
  const animalsGame = make3ImageGame({
    sectionEl: animals,
    qEl: document.getElementById("anq"),
    fbEl: document.getElementById("anfb"),
    starsEl: document.getElementById("anstars"),
    btnEls: [document.getElementById("an0"), document.getElementById("an1"), document.getElementById("an2")],
    pool: [
      ["affe","مەیمون"],
      ["ameise","مێروولە"],
      ["baer","ورچ"],
      ["biene","هەنگ"],
      ["delfin","دۆڵفین"],
      ["elefant","فیل"],
      ["ente","قاز"],
      ["esel","گوئدرئژ"],
      ["fisch","ماسی"],
      ["fledermaus","شەمشەمەکوێره"],
      ["frosch","بۆق"],
      ["giraffe","زرافە"],
      ["hahn","کەڵەشێر"],
      ["hamster","سمۆرە"],
      ["hase","کەروێشک"],
      ["hund","سەگ"],
      ["katze","پشیلە"],
      ["krokodil","تمساح"],
      ["kuh","مانگا"],
      ["marienkaefer","خاڵخاڵۆکە"],
      ["maus","مشک"],
      ["panda","پاندا"],
      ["pferd","ئەسپ"],
      ["schwein","بەراز"],
      ["spinne","جاڵجاڵۆکە"],
      ["vogel","چۆلەکە"],
      ["wal","نەهنگ"]
    ],
    imgBaseDir: "images/tiere",
    audioBaseDir: "audio/hamwi"
  });

  /* ===================== CLOTHES ===================== */
  const clothesGame = make3ImageGame({
    sectionEl: clothes,
    qEl: document.getElementById("clq"),
    fbEl: document.getElementById("clfb"),
    starsEl: document.getElementById("clstars"),
    btnEls: [document.getElementById("cl0"), document.getElementById("cl1"), document.getElementById("cl2")],
    pool: [
      ["anzug","بەدلە"],
      ["brille","عینک"],
      ["gurtel","قایش"],
      ["handschuhe","دەستکێش"],
      ["haube","کڵاو"],
      ["hemd","قەمیس"],
      ["hose","پانتۆڵ"],
      ["jacke","قەمسەڵە"],
      ["kleid","کراس"],
      ["laetzchen","بەروانکە"],
      ["mantel","قاپوت"],
      ["pyjama","پێجامە"],
      ["rock","تەنورە"],
      ["schall","ملپێچ"],
      ["schuhe","پێڵاو"],
      ["short","شۆرت"],
      ["socken","گۆرەوی"],
      ["tshirtkurzarm","بلوزی قۆڵ کورت"],
      ["tshirtlangarm","بلوزی قۆڵ درێژ"],
      ["weste","چاکەت"]
    ],
    imgBaseDir: "images/clothes",
    audioBaseDir: "audio/hamwi"
  });

  /* ===================== KITCHEN ===================== */
  const kitchenGame = make3ImageGame({
    sectionEl: kitchen,
    qEl: document.getElementById("kq"),
    fbEl: document.getElementById("kfb"),
    starsEl: document.getElementById("kstars"),
    btnEls: [document.getElementById("k0"), document.getElementById("k1"), document.getElementById("k2")],
    pool: [
      ["gabel","چەنگاڵ"],
      ["glas","پەرداخ"],
      ["heard","پەرداخ"],
      ["kochloeffel","چەمچە"],
      ["kuehlschrank","ساردکەرەوە"],
      ["loeffel","کەوچک"],
      ["messer","چەقۆ"],
      ["pfanne","تاوە"],
      ["putzmittel","پاککەرەوە"],
      ["schwam","ئیسفەنج"],
      ["spueler"," قاپشۆ"],
      ["tasse","فنجان"],
      ["teller","قاپ"],
      ["topf","مەنجەڵ"],
      ["waschmaschine"," جلشۆر"]
    ],
    imgBaseDir: "images/kitchen",
    audioBaseDir: "audio/hamwi"
  });

  /* ===================== WEATHER ===================== */
  const weatherGame = make3ImageGame({
    sectionEl: weather,
    qEl: document.getElementById("wq"),
    fbEl: document.getElementById("wfb"),
    starsEl: document.getElementById("wstars"),
    btnEls: [document.getElementById("w0"), document.getElementById("w1"), document.getElementById("w2")],
    pool: [
      ["blitz","هەورە تریشقە"],
      ["regen","باران"],
      ["schnee","بەفر"],
      ["sonne","رۆژ"],
      ["wind","با"],
      ["wolke","هەور"]
    ],
    imgBaseDir: "images/Koerper/weather",
    audioBaseDir: "audio/hamwi"
  });

  /* ===================== LIVING ROOM ===================== */
  const livingRoomGame = make3ImageGame({
    sectionEl: livingRoom,
    qEl: document.getElementById("lrq"),
    fbEl: document.getElementById("lrfb"),
    starsEl: document.getElementById("lrstars"),
    btnEls: [document.getElementById("lr0"), document.getElementById("lr1"), document.getElementById("lr2")],
    pool: [
      ["fenster","پەنجەرە"],
      ["fernseh","تەلەفزیۆن"],
      ["lampe","گلۆپ"],
      ["regal","دۆلاب"],
      ["sofa","قەنەفە"],
      ["stuhl","کورسی"],
      ["teppich","فەرش"],
      ["tisch","مێز"],
      ["tuere","دەرگا"],
      ["uhr","کاتژمێر"],
      ["vorhang","پەردە"]
    ],
    imgBaseDir: "images/livingroom",
    audioBaseDir: "audio/hamwi"
  });

  /* =========================================================
     ===================== MENU: ALLE STARTEN GLEICH ==========
     ========================================================= */
  if (goGame) goGame.onclick = () => { show(game); startGame1(); };

  if (goFeelings) goFeelings.onclick = () => { show(feelings); startFeelings(); };
  if (goNumbers) goNumbers.onclick = () => { show(numbers); playAudio("audio/numbers/numbers.mp3"); startNumbers(); };
  if (goColors) goColors.onclick = () => { show(colors); startColors(); };
  if (goLetters) goLetters.onclick = () => { show(letters); startLetters(); };
  if (goBodyParts) goBodyParts.onclick = () => { show(BodyParts); startBodyParts(); };

  if (goFruits) goFruits.onclick = () => { show(fruits); fruitsGame.start(); };
  if (goVegetables) goVegetables.onclick = () => { show(vegetables); vegetablesGame.start(); };
  if (goFood) goFood.onclick = () => { show(food); foodGame.start(); };
  if (goAnimals) goAnimals.onclick = () => { show(animals); animalsGame.start(); };
  if (goClothes) goClothes.onclick = () => { show(clothes); clothesGame.start(); };
  if (goKitchen) goKitchen.onclick = () => { show(kitchen); kitchenGame.start(); };
  if (goWeather) goWeather.onclick = () => { show(weather); weatherGame.start(); };
  if (goLivingRoom) goLivingRoom.onclick = () => { show(livingRoom); livingRoomGame.start(); };

  if (goShop) goShop.onclick = () => show(shop);

});
