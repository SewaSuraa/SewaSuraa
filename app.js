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
  /* ============ AUDIO ============ */
  let currentAudio = null;

  function playSequence(paths) {
    if (!paths || !paths.length) return;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    let i = 0;

    function playNext() {
      if (i >= paths.length) return;

      currentAudio = new Audio(paths[i]);
      currentAudio.onended = () => {
        i++;
        playNext();
      };
      currentAudio.play().catch(() => {});
    }

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
  const shop = document.getElementById("shop");
  const numbers = document.getElementById("numbers");
  const colors = document.getElementById("colors");
  const letters = document.getElementById("letters");

  const startBtn = document.getElementById("startBtn");
  const goGame = document.getElementById("goGame");
  const goFeelings = document.getElementById("goFeelings");
  const goShop = document.getElementById("goShop");
  const goNumbers = document.getElementById("goNumbers");
  const goColors = document.getElementById("goColors");
  const goLetters = document.getElementById("goLetters");

  const backWelcome = document.getElementById("backWelcome");
  const backMenu = document.getElementById("backMenu");
  const backMenuFromFeelings = document.getElementById("backMenuFromFeelings");
  const backMenuFromShop = document.getElementById("backMenuFromShop");
  const backMenuFromNumbers = document.getElementById("backMenuFromNumbers");
  const backMenuFromColors = document.getElementById("backMenuFromColors");
  const backMenuFromLetters = document.getElementById("backMenuFromLetters");

  /* ============ CODE GATE ELEMENTE ============ */
  const codeInput = document.getElementById("codeInput");
  const codeSubmit = document.getElementById("codeSubmit");
  const codeError = document.getElementById("codeError");

  /* ============ HILFSFUNKTION: SHOW ============ */
  function show(screen) {
    [
      welcome, codeGate, menu, game, feelings, shop,
      numbers, colors, letters
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

  /* ============ CODE CHECK (NUR 1x) ============ */
  async function checkCode() {
    const userCode = (codeInput.value || "").trim();

    if (!userCode) {
      codeError.style.display = "block";
      codeError.textContent = "کۆد بنوسە 🙂";
      return;
    }

    codeError.style.display = "none";
    codeSubmit.disabled = true;

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
        // ✅ Weiter zur App
        show(menu);
      } else {
        codeError.style.display = "block";
        codeError.textContent = "کۆد هەڵەیە ❌";
      }
    } catch (err) {
      console.error("API Fehler", err);
      codeError.style.display = "block";
      codeError.textContent = "⚠️ API کار ناکات / هەڵەی ئینتەرنێت";
    } finally {
      codeSubmit.disabled = false;
    }
  }

  /* ============ START BUTTON ============ */
  startBtn && (startBtn.onclick = () => {
    // ✅ zeigt Code Screen
    show(codeGate);
    codeError.style.display = "none";
    codeInput.value = "";
    codeInput.focus();
  });

  codeSubmit && (codeSubmit.onclick = checkCode);
  codeInput && codeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkCode();
  });

  /* ============ NAVIGATION ============ */
  show(welcome);

  backWelcome && (backWelcome.onclick = () => show(welcome));
  backMenu && (backMenu.onclick = () => show(menu));
  backMenuFromFeelings && (backMenuFromFeelings.onclick = () => show(menu));
  backMenuFromShop && (backMenuFromShop.onclick = () => show(menu));
  backMenuFromNumbers && (backMenuFromNumbers.onclick = () => show(menu));
  backMenuFromColors && (backMenuFromColors.onclick = () => show(menu));
  backMenuFromLetters && (backMenuFromLetters.onclick = () => show(menu));

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

  function updateStars(){ starsEl.textContent = "⭐ " + stars; }

  function loadTask(){
    locked = false;
    fb.textContent = "";
    const t = tasks[current];
    img.src = t.image;
    q.textContent = t.question;
    [b0,b1,b2].forEach((btn,i)=>{
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
    btn && btn.addEventListener("click", () => {
      if(locked) return;

      if(i === tasks[current].correct){
        locked = true;
        stars++;
        updateStars();
        fb.textContent = "👏 ئافەرین ✅";
        playAudio("audio/afarin.mp3");
        starBurst();
        [b0,b1,b2].forEach(b=>b.disabled=true);

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
        fb.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
        shake(game);
      }
    });
  });

  updateStars();

  goGame && (goGame.onclick = () => { show(game); startGame1(); });

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

  function updateFStars(){ fstarsEl.textContent = "⭐ " + fStars; }

  function setFeelingImage(imgEl, key){
    const base = "images/feelings/" + key;
    imgEl.onerror = () => { imgEl.src = base + ".jpg"; };
    imgEl.src = base + ".png";
  }

  function startFeelings(){
    fStars = 0;
    fIndex = 0;
    updateFStars();
    ffb.textContent = "";
    shuffle(feelingsPool);
    nextFeeling();
  }

  function nextFeeling(){
    fLocked = false;
    ffb.textContent = "";

    const [correctKey, text] = feelingsPool[fIndex];
    fq.textContent = text;
    playAudio("audio/feelings/" + correctKey + ".mp3");

    const keys = [correctKey];
    const others = feelingsPool.map(x=>x[0]).filter(k=>k!==correctKey);
    shuffle(others);
    keys.push(others[0], others[1]);
    shuffle(keys);

    const btns = [f0,f1,f2];
    btns.forEach((btn,i)=>{
      const im = btn.querySelector("img");
      setFeelingImage(im, keys[i]);
      btn.disabled = false;

      btn.onclick = () => {
        if (fLocked) return;

        const isCorrect = (keys[i] === correctKey);
        playAudio(isCorrect ? "audio/afarin.mp3" : "audio/rastnia.mp3");

        if (isCorrect) {
          fLocked = true;
          fStars++;
          updateFStars();
          ffb.textContent = "ئافەرین ✅";
          starBurst();
          btns.forEach(b => b.disabled = true);

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
          ffb.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
          shake(feelings);
        }
      };
    });
  }

  goFeelings && (goFeelings.onclick = () => { show(feelings); startFeelings(); });

  /* =========================================================
     ===================== SHOP ===============================
     ========================================================= */
  goShop && (goShop.onclick = () => show(shop));

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

  function updateNStars(){ nstarsEl.textContent = "⭐ " + nStars; }

  function startNumbers(){
    nStars = 0;
    nIndex = 0;
    updateNStars();
    nfb.textContent = "";
    shuffle(numberTasks);
    loadNumber();
  }

  function loadNumber(){
    nfb.textContent = "";
    const correct = numberTasks[nIndex];
    nimg.src = "images/numbers/" + correct + ".png";

    let opts = [correct];
    while(opts.length < 3){
      const r = Math.floor(Math.random()*11);
      if(!opts.includes(r)) opts.push(r);
    }
    shuffle(opts);

    const btns = [n0,n1,n2];
    btns.forEach((btn,i)=>{
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
          nfb.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
          shake(numbers);
        }
      };
    });
  }

  goNumbers && (goNumbers.onclick = () => {
    show(numbers);
    playAudio("audio/numbers/numbers.mp3");
    startNumbers();
  });

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
    cstarsEl.textContent = "⭐ 0";
    cfb.textContent = "";

    colorTasks = [];
    for(let i=0;i<10;i++){
      const target = colorPool[Math.floor(Math.random()*colorPool.length)];
      colorTasks.push(target);
    }

    loadColorTask();
  }

  function loadColorTask(){
    cLocked = false;
    cfb.textContent = "";

    const target = colorTasks[cIndex];

    playAudio("audio/colors/" + target.key + ".mp3");
    cq.textContent = "کام ڕەنگە " + target.sorani + "ە؟";

    const options = [target];
    while(options.length < 3){
      const r = colorPool[Math.floor(Math.random()*colorPool.length)];
      if(!options.some(x => x.key === r.key)) options.push(r);
    }
    shuffle(options);

    cBtns.forEach((btn,i)=>{
      const dot = btn.querySelector(".dot");
      dot.style.background = options[i].css;

      btn.disabled = false;
      btn.onclick = () => {
        if (cLocked) return;

        const isCorrect = (options[i].key === target.key);

        if (isCorrect) {
          cLocked = true;
          cStars++;
          cstarsEl.textContent = "⭐ " + cStars;
          playAudio("audio/afarin.mp3");
          starBurst();
          cBtns.forEach(b => b.disabled = true);
          cfb.textContent = "ئافەرین ✅";

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
          cfb.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
          shake(colors);
        }
      };
    });
  }

  goColors && (goColors.onclick = () => { show(colors); startColors(); });

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
    lstarsEl.textContent = "⭐ 0";
    lfb.textContent = "";
    shuffle(letterTasks);
    loadLetterTask();
  }

  function loadLetterTask(){
    lLocked = false;
    lfb.textContent = "";

    const t = letterTasks[lIndex];
    limg.src = t.image;

    const correct = t.correct;
    const pool = SORANI_LETTERS.filter(x => x !== correct);
    shuffle(pool);

    const opts = [correct, pool[0], pool[1]];
    shuffle(opts);

    const btns = [l0, l1, l2];
    btns.forEach((btn, i) => {
      btn.textContent = opts[i];
      btn.disabled = false;

      btn.onclick = () => {
        if (lLocked) return;

        const isCorrect = (opts[i] === correct);
        playAudio(isCorrect ? "audio/afarin.mp3" : "audio/rastnia.mp3");

        if (isCorrect) {
          lLocked = true;
          lStars++;
          lstarsEl.textContent = "⭐ " + lStars;
          lfb.textContent = "ئافەرین ✅";
          starBurst();
          btns.forEach(b => b.disabled = true);

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
          lfb.textContent = "بەداخەوە راست نیە، هەوڵ بدە دووبارە 🙂";
          shake(letters);
        }
      };
    });
  }

  goLetters && (goLetters.onclick = () => { show(letters); startLetters(); });
});
