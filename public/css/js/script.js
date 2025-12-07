/* --- 1. SÖZ HAVUZU VE BAŞLANGIÇ --- */
const quotes = [
    "Başlamak için mükemmel olmak zorunda değilsin, ama mükemmel olmak için başlamak zorundasın.",
    "Gelecek, bugünden hazırlananlara aittir.",
    "Büyük işler, küçük adımların birleşimidir.",
    "Odaklanmak, hayır diyebilme sanatıdır.",
    "Yorgun olduğunda durma, işin bittiğinde dur.",
    "Disiplin, istediklerin ile şu an yaptıkların arasındaki köprüdür.",
    "Sakin denizler usta denizciler yaratmaz.",
    "Zamanını yönetemeyen, hiçbir şeyi yönetemez."
];

document.addEventListener("DOMContentLoaded", () => {
    // Rastgele Söz Seç
    const quoteEl = document.getElementById('daily-quote');
    if(quoteEl) quoteEl.innerText = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;

    // Giriş Videosu
    if (document.getElementById('bg-video')) {
        fetch('/api/settings').then(r=>r.json()).then(s => {
            if (s.loginVideo && (location.pathname.includes('login') || location.pathname.includes('register'))) {
                const v = document.getElementById('bg-video'); v.src = s.loginVideo + '?v=' + new Date().getTime();
                v.load(); v.play().catch(e=>console.log(e));
            }
        });
    }
    // Ana Sayfa
    if (document.getElementById('sound-mixer-container')) { loadSounds(); loadScenes(); }
});

// Oturum Kontrolü
if (!location.pathname.includes('login') && !location.pathname.includes('register')) {
    fetch('/check-session').then(r=>r.json()).then(d => { if (!d.loggedIn) location.href = '/login.html'; });
}

/* --- 2. KLAVYE KISAYOLLARI (PRO UX) --- */
document.addEventListener('keydown', (e) => {
    // Eğer input içindeysek kısayollar çalışmasın
    if(e.target.tagName === 'INPUT') return;

    if (e.code === 'Space') { e.preventDefault(); toggleTimer(); } // Space: Başlat/Durdur
    if (e.code === 'KeyF') { toggleFullScreen(); } // F: Tam Ekran
    if (e.code === 'KeyR') { resetTimer(); } // R: Reset
});

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
}

/* --- 3. AUTH (Giriş/Kayıt) --- */
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const res = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: document.getElementById('username').value, password: document.getElementById('password').value })
        });
        const data = await res.json();
        if(data.success) location.href = '/'; else alert(data.error);
    });
}
const regForm = document.getElementById('register-form');
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const res = await fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: document.getElementById('reg-username').value, password: document.getElementById('reg-password').value })
        });
        const data = await res.json();
        if(data.success) { alert('Kayıt başarılı!'); location.href='login.html'; } else alert(data.error);
    });
}

/* --- 4. SAYAÇ & ODAK MODU --- */
let timer;
let defaultTime = 25 * 60;
let timeLeft = defaultTime;
let isRunning = false;

function updateDisplay() {
    const d = document.getElementById('timer-display');
    if(d) d.innerText = `${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}`;
}

function toggleTimer() {
    const btn = document.getElementById('main-btn');
    if(!btn) return;
    if (isRunning) {
        clearInterval(timer); isRunning=false; btn.innerText="Devam Et";
        document.body.classList.remove('focus-mode');
    } else {
        isRunning=true; btn.innerText="Duraklat";
        document.body.classList.add('focus-mode');
        timer = setInterval(()=>{
            if(timeLeft>0){ timeLeft--; updateDisplay(); }
            else { resetTimer(); alert("Süre Doldu!"); }
        }, 1000);
    }
}
function resetTimer() {
    clearInterval(timer); isRunning=false; timeLeft=defaultTime; updateDisplay();
    const btn = document.getElementById('main-btn');
    if(btn) btn.innerText="Başlat";
    document.body.classList.remove('focus-mode');
}

/* --- 5. MANUEL SÜRE AYARI --- */
function toggleEditMode() {
    if(isRunning) return alert("Sayacı durdurun.");
    const box = document.getElementById('custom-timer-box');
    const display = document.getElementById('timer-display');
    const controls = document.querySelector('.controls');
    const input = document.getElementById('custom-min');

    if(box.style.display === 'none') {
        box.style.display = 'block'; display.style.display = 'none';
        controls.style.opacity = '0'; controls.style.pointerEvents = 'none';
        input.value = ""; input.focus();
    } else {
        box.style.display = 'none'; display.style.display = 'block';
        controls.style.opacity = '1'; controls.style.pointerEvents = 'all';
    }
}
function saveCustomTime() {
    const val = parseInt(document.getElementById('custom-min').value);
    if(val > 0) { defaultTime = val * 60; timeLeft = defaultTime; updateDisplay(); toggleEditMode(); }
}
function handleEnter(e) { if(e.key==='Enter') saveCustomTime(); }

/* --- 6. MİKSER & SAHNELER --- */
function loadSounds() {
    fetch('/api/sounds').then(r=>r.json()).then(sounds=>{
        const c = document.getElementById('sound-mixer-container');
        c.innerHTML = '';
        if(sounds.length===0) c.innerHTML='<p style="text-align:center;color:#666;font-size:0.8rem">Ses Yok</p>';
        sounds.forEach(s => {
            const div = document.createElement('div'); div.className='mixer-item';
            div.innerHTML = `<button class="sound-btn" onclick="toggleSound('${s.id}',this)">🔊 ${s.name}</button><input type="range" min="0" max="1" step="0.01" value="0.5" oninput="setVolume('${s.id}',this.value)"><audio id="audio-${s.id}" loop src="${s.path}"></audio>`;
            c.appendChild(div);
        });
    });
}
function toggleSound(id, btn) { const a=document.getElementById('audio-'+id); if(a.paused){a.play();btn.classList.add('active')}else{a.pause();btn.classList.remove('active')} }
function setVolume(id, v) { document.getElementById('audio-'+id).volume = v; }

function loadScenes() {
    fetch('/api/scenes').then(r=>r.json()).then(scenes=>{
        const l = document.getElementById('scene-list');
        l.innerHTML='';
        scenes.forEach(s => {
            const b = document.createElement('button'); b.className='scene-btn';
            b.innerHTML=`🎬 ${s.name}`;
            b.onclick=()=>{ document.getElementById('bg-video').src=s.videoPath; document.documentElement.style.setProperty('--primary-color', s.themeColor); };
            l.appendChild(b);
        });
    });
}

/* --- 7. DRAG & DROP (Zıplamasız) --- */
const dragElement = document.getElementById("draggable-timer");
if (dragElement) {
    let isDragging = false, startX, startY;
    dragElement.onmousedown = (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
        e.preventDefault(); isDragging = true; startX = e.clientX; startY = e.clientY;
        document.onmousemove = elementDrag; document.onmouseup = closeDragElement;
    };
    function elementDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const dx = e.clientX - startX, dy = e.clientY - startY;
        dragElement.style.transform = "none";
        dragElement.style.left = (dragElement.offsetLeft + dx) + "px";
        dragElement.style.top = (dragElement.offsetTop + dy) + "px";
        startX = e.clientX; startY = e.clientY;
    }
    function closeDragElement() { isDragging = false; document.onmouseup = null; document.onmousemove = null; }
}

/* --- 8. TO-DO --- */
const todo = document.getElementById('todo-input');
if(todo) {
    todo.addEventListener('keypress', (e)=>{
        if(e.key==='Enter' && e.target.value.trim()!==""){
            const d=document.createElement('div');
            d.innerHTML=`<span>${e.target.value}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:#e74c3c;cursor:pointer">✖</button>`;
            document.getElementById('todo-list').appendChild(d); e.target.value='';
        }
    });
}