const loginScreen = document.getElementById("login");
const appScreen = document.getElementById("app");

const codeInput = document.getElementById("codeInput");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

const who = document.getElementById("who");
const logoutBtn = document.getElementById("logoutBtn");

function showLogin(){
  appScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

function showApp(){
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
}

function setToken(token){
  localStorage.setItem("token", token);
}
function getToken(){
  return localStorage.getItem("token");
}
function clearToken(){
  localStorage.removeItem("token");
}

async function apiMe(){
  const token = getToken();
  if(!token) return null;

  const res = await fetch("/api/me", {
    headers: { "Authorization": "Bearer " + token }
  });
  if(!res.ok) return null;
  return res.json();
}

loginBtn.addEventListener("click", async () => {
  loginMsg.textContent = "";
  const code = codeInput.value.trim();

  try{
    const res = await fetch("/api/login", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ code })
    });

    const data = await res.json();
    if(!data.ok){
      loginMsg.textContent = "کۆد هەڵەیە ❌";
      return;
    }
    setToken(data.token);

    const me = await apiMe();
    who.textContent = me ? ("کۆدی تۆ: " + me.code) : "";
    showApp();
  }catch(e){
    loginMsg.textContent = "کێشەی ئینتەرنێت/سێرڤەر ❌";
  }
});

logoutBtn.addEventListener("click", () => {
  clearToken();
  showLogin();
});

// Auto-Login
(async () => {
  const me = await apiMe();
  if(me && me.ok){
    who.textContent = "کۆدی تۆ: " + me.code;
    showApp();
  }else{
    showLogin();
  }
})();
