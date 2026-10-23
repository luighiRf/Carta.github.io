// ==========================================
// APLICACIÓN UNIFICADA DE ANIVERSARIO
// Mayckol & Daniela
// ==========================================

// ==========================================
// 1. MATRIX RAIN EFFECT (PANTALLA DE BLOQUEO)
// ==========================================
const canvasMatrix = document.getElementById('matrixCanvas');
const ctxMatrix = canvasMatrix.getContext('2d');
canvasMatrix.width = window.innerWidth;
canvasMatrix.height = window.innerHeight;

const charsMatrix = 'MAYCKOLDANIELAAMOR♥♡✧*'.split('');
const fontMatrix = 16;
let columnsMatrix = Math.floor(canvasMatrix.width / fontMatrix);
let dropsMatrix = [];

for (let x = 0; x < columnsMatrix; x++) {
    dropsMatrix[x] = 1;
}

let matrixInterval = null;
let isUnlocked = false;

function drawMatrix() {
    if (isUnlocked) return;
    ctxMatrix.fillStyle = 'rgba(25, 15, 35, 0.2)';
    ctxMatrix.fillRect(0, 0, canvasMatrix.width, canvasMatrix.height);

    ctxMatrix.fillStyle = '#ff85a2';
    ctxMatrix.font = fontMatrix + 'px Outfit, sans-serif';
    ctxMatrix.shadowBlur = 5;
    ctxMatrix.shadowColor = '#ffa5ba';

    for (let i = 0; i < dropsMatrix.length; i++) {
        const text = charsMatrix[Math.floor(Math.random() * charsMatrix.length)];
        ctxMatrix.fillText(text, i * fontMatrix, dropsMatrix[i] * fontMatrix);

        if (dropsMatrix[i] * fontMatrix > canvasMatrix.height && Math.random() > 0.985) {
            dropsMatrix[i] = 0;
        }
        dropsMatrix[i]++;
    }
}
matrixInterval = setInterval(drawMatrix, 50);

// ==========================================
// 2. FLOATING HEARTS EFFECT (FONDO GLOBAL)
// ==========================================
const canvasHearts = document.getElementById('heartsCanvas');
const ctxHearts = canvasHearts.getContext('2d');
canvasHearts.width = window.innerWidth;
canvasHearts.height = window.innerHeight;

let heartsList = [];
const heartEmojis = ['♥', '♡', '✧', '💕', '💖'];

function initHearts() {
    heartsList = [];
    const count = window.innerWidth < 768 ? 35 : 60;
    for (let i = 0; i < count; i++) {
        heartsList.push({
            x: Math.random() * canvasHearts.width,
            y: Math.random() * canvasHearts.height,
            size: Math.random() * 14 + 10,
            speed: Math.random() * 1.4 + 0.6,
            drift: Math.random() * 2 - 1,
            char: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
            alpha: Math.random() * 0.45 + 0.2
        });
    }
}
initHearts();

function drawFloatingHearts() {
    ctxHearts.clearRect(0, 0, canvasHearts.width, canvasHearts.height);

    for (let i = 0; i < heartsList.length; i++) {
        const p = heartsList[i];
        ctxHearts.fillStyle = `rgba(255, 133, 162, ${p.alpha})`;
        ctxHearts.font = p.size + 'px Outfit, sans-serif';
        ctxHearts.shadowBlur = 8;
        ctxHearts.shadowColor = '#ffa5ba';
        ctxHearts.fillText(p.char, p.x, p.y);

        p.y -= p.speed;
        p.x += Math.sin(p.y / 50) * p.drift;

        if (p.y < -20) {
            p.y = canvasHearts.height + 20;
            p.x = Math.random() * canvasHearts.width;
        }
    }
}
setInterval(drawFloatingHearts, 30);

window.addEventListener('resize', () => {
    canvasMatrix.width = window.innerWidth;
    canvasMatrix.height = window.innerHeight;
    columnsMatrix = Math.floor(canvasMatrix.width / fontMatrix);
    dropsMatrix = [];
    for (let x = 0; x < columnsMatrix; x++) dropsMatrix[x] = 1;

    canvasHearts.width = window.innerWidth;
    canvasHearts.height = window.innerHeight;
    initHearts();
});

// ==========================================
// 3. REPRODUCTOR DE MÚSICA GLOBAL (HTML5 NATIVO)
// ==========================================
const playlist = [
    { src: 'assets/audio/milo_j_mai.mp3', title: 'MILO J — M.A.I' }
];
let currentTrackIndex = 0;
let isAudioPlaying = false;
const globalAudio = new Audio();
globalAudio.preload = 'auto';
globalAudio.src = playlist[0].src;

const musicWrapper = document.createElement('div');
musicWrapper.id = 'music-wrapper';
musicWrapper.style.display = 'none';
musicWrapper.innerHTML = `
    <div class="music-vinyl" id="music-play-btn"><div class="music-vinyl-center"></div></div>
    
    <div class="music-player-panel">
        <div class="player-header">REPRODUCTOR</div>
        
        <div class="track-title" id="track-title-display">${playlist[0].title}</div>
        
        <div class="player-progress">
            <span id="time-current">0:00</span>
            <input type="range" id="progress-bar" min="0" max="100" value="0">
            <span id="time-total">0:00</span>
        </div>

        <div class="player-controls">
            <button class="ctrl-btn" id="ctrl-prev">⏮</button>
            <button class="ctrl-btn play-btn" id="ctrl-play">▶</button>
            <button class="ctrl-btn" id="ctrl-next">⏭</button>
        </div>

        <div class="playlist-container">
            <div class="playlist-item active" data-index="0">♪ ${playlist[0].title}</div>
        </div>
    </div>
`;
document.body.appendChild(musicWrapper);

const progressBar = document.getElementById('progress-bar');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');
const ctrlPlay = document.getElementById('ctrl-play');
const titleDisplay = document.getElementById('track-title-display');

function formatSeconds(sec) {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" + s : s);
}

function updateMusicProgressBar() {
    const val = progressBar.value;
    progressBar.style.background = `linear-gradient(to right, #ff2a75 ${val}%, rgba(255,255,255,0.1) ${val}%)`;
}

globalAudio.addEventListener('timeupdate', () => {
    if (!globalAudio.duration || isNaN(globalAudio.duration)) return;
    const cur = globalAudio.currentTime || 0;
    const dur = globalAudio.duration || 0;
    if (dur > 0) {
        progressBar.value = (cur / dur) * 100;
        updateMusicProgressBar();
        timeCurrent.textContent = formatSeconds(cur);
        timeTotal.textContent = formatSeconds(dur);
    }
});

globalAudio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = formatSeconds(globalAudio.duration);
});

globalAudio.addEventListener('ended', () => {
    globalAudio.currentTime = 0;
    globalAudio.play().catch(() => {});
});

progressBar.addEventListener('input', (e) => {
    updateMusicProgressBar();
    if (globalAudio.duration) {
        const seek = (e.target.value / 100) * globalAudio.duration;
        timeCurrent.textContent = formatSeconds(seek);
    }
});

progressBar.addEventListener('change', (e) => {
    updateMusicProgressBar();
    if (globalAudio.duration) {
        globalAudio.currentTime = (e.target.value / 100) * globalAudio.duration;
    }
});

function toggleMusicPlay() {
    if (isAudioPlaying) {
        globalAudio.pause();
        isAudioPlaying = false;
        musicWrapper.classList.remove('playing');
        ctrlPlay.innerHTML = '▶';
    } else {
        globalAudio.play().then(() => {
            isAudioPlaying = true;
            musicWrapper.classList.add('playing');
            ctrlPlay.innerHTML = '⏸';
        }).catch(err => console.warn("Audio play prevented:", err));
    }
}

document.getElementById('music-play-btn').addEventListener('click', toggleMusicPlay);
ctrlPlay.addEventListener('click', toggleMusicPlay);

document.getElementById('ctrl-prev').addEventListener('click', () => {
    globalAudio.currentTime = 0;
    if (!isAudioPlaying) toggleMusicPlay();
});

document.getElementById('ctrl-next').addEventListener('click', () => {
    globalAudio.currentTime = 0;
    if (!isAudioPlaying) toggleMusicPlay();
});

// Pausar y reanudar música global automáticamente con la nota de voz de Razones
let wasMusicPlayingBeforeVoice = false;

document.addEventListener('play', (e) => {
    if (e.target !== globalAudio) {
        if (isAudioPlaying) {
            globalAudio.pause();
            isAudioPlaying = false;
            wasMusicPlayingBeforeVoice = true;
        }
    }
}, true);

document.addEventListener('ended', (e) => {
    if (e.target !== globalAudio && wasMusicPlayingBeforeVoice) {
        globalAudio.play().then(() => {
            isAudioPlaying = true;
            wasMusicPlayingBeforeVoice = false;
        }).catch(err => console.warn("Error reanudando música:", err));
    }
}, true);

document.addEventListener('pause', (e) => {
    if (e.target !== globalAudio && wasMusicPlayingBeforeVoice) {
        setTimeout(() => {
            if (e.target.paused && !e.target.seeking && wasMusicPlayingBeforeVoice) {
                globalAudio.play().then(() => {
                    isAudioPlaying = true;
                    wasMusicPlayingBeforeVoice = false;
                }).catch(err => console.warn("Error reanudando música:", err));
            }
        }, 300);
    }
}, true);

// ==========================================
// 4. PANTALLA DE ENTRADA / DESBLOQUEO CON HINT
// ==========================================
const unlockScreen = document.getElementById('unlock-screen');
const unlockBtn = document.getElementById('unlock-btn');
const unlockHint = document.getElementById('unlock-hint');
const mainContent = document.getElementById('main-content');

let hintTimeout = null;

function showUnlockHint(shake = false) {
    if (isUnlocked) return;
    if (unlockHint) {
        unlockHint.classList.add('visible');
    }
    if (shake && unlockBtn) {
        gsap.killTweensOf(unlockBtn);
        gsap.fromTo(unlockBtn, 
            { scale: 0.92, rotate: -6 }, 
            { scale: 1.15, rotate: 6, duration: 0.12, yoyo: true, repeat: 5, ease: "power1.inOut", onComplete: () => {
                gsap.to(unlockBtn, { scale: 1, rotate: 0, duration: 0.2 });
            }}
        );
    }
}

// Mostrar hint automáticamente después de 3.5 segundos si no ha hecho clic
hintTimeout = setTimeout(() => {
    showUnlockHint(false);
}, 3500);

// Si hace clic en cualquier lugar que no sea el botón de desbloqueo, mostrar mensaje y hacer vibrar el corazón
document.addEventListener('click', (e) => {
    if (!isUnlocked && !e.target.closest('#unlock-btn')) {
        showUnlockHint(true);
    }
});

unlockBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isUnlocked) return;
    isUnlocked = true;
    if (hintTimeout) clearTimeout(hintTimeout);

    // INICIAR MÚSICA SÍ O SÍ AL DAR CLIC
    globalAudio.play().then(() => {
        isAudioPlaying = true;
        musicWrapper.classList.add('playing');
        ctrlPlay.innerHTML = '⏸';
    }).catch(err => {
        console.warn("Audio autoplay err:", err);
    });

    // Desvanecer pantalla de bloqueo
    gsap.to(unlockScreen, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
            unlockScreen.style.display = 'none';
        }
    });

    gsap.to('#matrixCanvas', {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            if (matrixInterval) clearInterval(matrixInterval);
            document.getElementById('matrixCanvas').style.display = 'none';
        }
    });

    // Revelar la aplicación principal
    mainContent.classList.remove('hidden');
    gsap.to('#main-content', { opacity: 1, duration: 1, ease: "power2.out" });

    // Iniciar 3D Heart de Inicio
    initThreeHeart();
    animateTab('tab-inicio');
});

// ==========================================
// 5. NAVEGACIÓN ENTRE TABS (SINGLE PAGE APP)
// ==========================================
const navBtns = document.querySelectorAll('.nav-btn');
const tabs = document.querySelectorAll('.tab-content');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        switchTab(targetId);
    });
});

let galaxyInitialized = false;
let reasonsInitialized = false;
let typewriterStarted = false;

let currentActiveTabId = 'tab-inicio';
let isTabTransitioning = false;

function switchTab(targetId) {
    if (targetId === currentActiveTabId || isTabTransitioning) return;
    isTabTransitioning = true;

    // Actualizar botones de navegación
    navBtns.forEach(b => {
        if (b.getAttribute('data-target') === targetId) b.classList.add('active');
        else b.classList.remove('active');
    });

    const currentTabEl = document.getElementById(currentActiveTabId);
    const targetTabEl = document.getElementById(targetId);

    if (currentTabEl && targetTabEl) {
        // Transición de salida suave para la pestaña actual
        gsap.to(currentTabEl, {
            opacity: 0,
            y: -12,
            duration: 0.22,
            ease: "power2.in",
            onComplete: () => {
                currentTabEl.classList.remove('active');
                currentTabEl.style.display = 'none';

                // Mostrar nueva pestaña
                targetTabEl.classList.add('active');
                targetTabEl.style.display = 'flex';
                window.scrollTo(0, 0);

                // Transición de entrada suave para la nueva pestaña
                gsap.fromTo(targetTabEl,
                    { opacity: 0, y: 15 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.35, 
                        ease: "power2.out", 
                        onComplete: () => {
                            isTabTransitioning = false;
                        }
                    }
                );

                currentActiveTabId = targetId;
                animateTab(targetId);
            }
        });
    } else {
        window.scrollTo(0, 0);
        isTabTransitioning = false;
        animateTab(targetId);
    }
}

function animateTab(tabId) {
    if (tabId === 'tab-inicio') {
        gsap.from('#tab-inicio h1', { y: 30, opacity: 0, duration: 0.8 });
        gsap.from('#tab-inicio .vip-subtitle-wrapper', { y: 20, opacity: 0, duration: 0.8, delay: 0.1 });
        gsap.from('#tab-inicio .countdown-container', { scale: 0.9, opacity: 0, duration: 0.8, delay: 0.2 });
        gsap.from('#tab-inicio .vip-svg-decoration', { y: 20, opacity: 0, duration: 0.8, delay: 0.3 });
    } else if (tabId === 'tab-universo') {
        if (!galaxyInitialized) {
            initGalaxy();
            setTimeout(initGalaxyThreeHeart, 150);
            galaxyInitialized = true;
        }
        gsap.from('.galaxy-titles', { y: 30, opacity: 0, duration: 0.8 });
        gsap.from('.galaxy-container', { scale: 0.4, opacity: 0, duration: 1.2, ease: "power3.out" });
    } else if (tabId === 'tab-razones') {
        if (!reasonsInitialized) {
            initReasons();
            reasonsInitialized = true;
        }
        gsap.from('.love-reasons-header', { y: 30, opacity: 0, duration: 0.8 });
        gsap.from('.mySwiper', { scale: 0.92, opacity: 0, duration: 0.8, delay: 0.15 });
    } else if (tabId === 'tab-carta') {
        gsap.from('.carta-header', { y: 30, opacity: 0, duration: 0.8 });
        gsap.from('.paper-sheet', { y: 40, opacity: 0, duration: 1, delay: 0.2, ease: "power2.out" });
        typeCartaText();
    }
}

// ==========================================
// 6. CONTADOR (INICIO) - 31 DE OCTUBRE 2025
// ==========================================
const startDate = new Date(2025, 9, 31, 0, 0, 0).getTime();

function updateCounter() {
    const now = new Date().getTime();
    let diff = now - startDate;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (dEl) dEl.innerText = days.toString().padStart(2, '0');
    if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
    if (mEl) mEl.innerText = minutes.toString().padStart(2, '0');
    if (sEl) sEl.innerText = seconds.toString().padStart(2, '0');
}
setInterval(updateCounter, 1000);
updateCounter();

// ==========================================
// 7. CORAZÓN 3D DE INICIO (THREE.JS)
// ==========================================
function initThreeHeart() {
    const container = document.getElementById('heartCanvas');
    if (!container || container.children.length > 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, -5);
    heartShape.bezierCurveTo(-5, -10, -15, -5, -15, 5);
    heartShape.bezierCurveTo(-15, 12, -5, 18, 0, 22);
    heartShape.bezierCurveTo(5, 18, 15, 12, 15, 5);
    heartShape.bezierCurveTo(15, -5, 5, -10, 0, -5);

    const points = heartShape.getPoints(100);
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        const randIndex = Math.floor(Math.random() * points.length);
        const point = points[randIndex];
        posArray[i * 3] = point.x + (Math.random() - 0.5) * 4;
        posArray[i * 3 + 1] = -point.y + 10 + (Math.random() - 0.5) * 4;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xff85a2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        particlesMesh.rotation.y = Math.sin(elapsedTime * 0.3) * 0.5;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2;
        const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
        particlesMesh.scale.set(scale, scale, scale);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (container.clientWidth && container.clientHeight) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

// ==========================================
// 8. UNIVERSO (GALAXIA INTERACTIVA Y CORAZÓN 3D)
// ==========================================
function showGalaxyModal(text) {
    const modal = document.getElementById('galaxyModal');
    const modalText = document.getElementById('modal-text');
    modalText.innerText = text;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeGalaxyModal() {
    const modal = document.getElementById('galaxyModal');
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}
window.closeGalaxyModal = closeGalaxyModal;

function initGalaxy() {
    const galaxyContainer = document.getElementById('galaxy-container');
    if (!galaxyContainer) return;
    galaxyContainer.innerHTML = '';

    const blackHole = document.createElement('div');
    blackHole.className = 'black-hole';
    galaxyContainer.appendChild(blackHole);

    const centerHeart = document.createElement('div');
    centerHeart.className = 'center-galaxy-heart';
    centerHeart.id = 'galaxyHeartCanvas';
    galaxyContainer.appendChild(centerHeart);

    const orbitItems = [
        { text: "TE AMO",                  message: "Te amo hoy más que ayer, pero no más de lo que te amaré mañana. Eres mi vida entera." },
        { text: "INFINITO ∞",              message: "Nuestro amor no tiene fin, como el universo que nos rodea. Siempre, para siempre." },
        { text: "AMOR ETERNO",             message: "Desde el primer día supe que lo nuestro era para toda la vida. Un amor que no termina." },
        { text: "MI PRINCESA",             message: "Eres la princesa de mi corazón y la reina de mi mundo. Nadie te iguala." },
        { text: "SIEMPRE JUNTOS",          message: "De tu mano quiero enfrentar cada amanecer, cada tormenta y cada momento de esta vida." },
        { text: "MI TODO",                 message: "No sé si existe la felicidad completa, pero yo soy completamente feliz desde que te tengo a mi lado." },
        { text: "PARA SIEMPRE",            message: "Si me dieran tres deseos, tres veces pediría volver a encontrarte en esta vida y en las siguientes." },
        { text: "Empanadita",              message: "El apodo que te puse y el que te diré hasta el último de nuestros días." },
        { text: "👩‍❤️‍👨",              message: "Tú y yo. Mi frase favorita para el resto de mi vida." },
        { text: "✨",                      message: "Cada vez que sonríes, siento que el mundo entero brilla un poco más." },
        { text: "👑",                      message: "Eres la reina de mi corazón. Mereces todo el amor del universo y más." },
        { text: "🌹",                      message: "Como una rosa, eres hermosa, única e inigualable. Gracias por existir en mi vida." },
        { text: "💘",                      message: "Desde el momento en que te conocí, mi corazón supo que eras tú. Solo tú." },
        { text: "MI UNIVERSO",             message: "Eres el centro de mi universo, la estrella más brillante de mi cielo. Todo gira a tu alrededor." },
        { text: "MI ESTRELLA",             message: "Cuando miro las estrellas, pienso en ti. Pero ninguna de ellas se compara con tu luz." },
        { text: "LUZ DE MI VIDA",          message: "Eres la razón por la que mi mundo brilla cada día. Mi luz y mi esperanza." },
        { text: "MI DESTINO",              message: "Contigo descubrí que el amor no es solo un sentimiento, es un refugio y un lugar seguro." },
        { text: "ALMAS GEMELAS",           message: "A veces pienso que la vida es un conjunto de coincidencias mágicas, y la más hermosa fue encontrarte." },
        { text: "ME ENCANTA ESTAR CONTIGO", message: "Contigo los días son más brillantes y los problemas se sienten más pequeños. Gracias por todo." },
        { text: "TE ADORO",               message: "Contigo aprendí lo que es el amor real. Eres mi calma en medio del caos y mi lugar seguro." }
    ];

    orbitItems.forEach((item, i) => {
        const radius = 120 + (i * 20) + Math.random() * 20; 
        const speed = 15 + Math.random() * 30;
        const delay = -Math.random() * 50;
        
        const orbitRing = document.createElement('div');
        orbitRing.className = 'orbit-ring';
        orbitRing.style.width = (radius * 2) + 'px';
        orbitRing.style.height = (radius * 2) + 'px';
        orbitRing.style.animation = `spinRing ${speed}s linear ${delay}s infinite`;

        const label = document.createElement('div');
        label.className = 'orbiting-text';
        label.innerText = item.text;
        label.style.animation = `counterSpin ${speed}s linear ${delay}s infinite`;
        
        if (item.text.includes('AMOR') || item.text.includes('AMO') || item.text.includes('💘')) {
            label.style.color = '#ff85a2';
            label.style.textShadow = '0 0 15px rgba(255, 133, 162, 0.8), 0 0 30px rgba(255, 175, 189, 0.6)';
            label.style.borderColor = 'rgba(255, 0, 60, 0.3)';
        }

        label.addEventListener('click', (e) => {
            e.stopPropagation();
            showGalaxyModal(item.message);
        });

        orbitRing.appendChild(label);
        galaxyContainer.appendChild(orbitRing);
    });

    for (let i = 0; i < 300; i++) {
        const radius = 50 + Math.pow(Math.random(), 2) * 450;
        const speed = 10 + (radius / 20) + Math.random() * 10;
        const delay = -Math.random() * 100;
        
        const orbitRing = document.createElement('div');
        orbitRing.className = 'orbit-ring';
        orbitRing.style.width = (radius * 2) + 'px';
        orbitRing.style.height = (radius * 2) + 'px';
        orbitRing.style.border = 'none';
        orbitRing.style.animation = `spinRing ${speed}s linear ${delay}s infinite`;

        const dust = document.createElement('div');
        dust.className = 'orbiting-dust';
        const size = Math.random() * 3 + 1;
        dust.style.width = size + 'px';
        dust.style.height = size + 'px';
        dust.style.top = `-${size/2}px`;
        
        const colors = ['#ff85a2', '#ffc3a0', '#ffffff', '#ffafbd', '#e0c3fc'];
        dust.style.background = colors[Math.floor(Math.random() * colors.length)];
        dust.style.boxShadow = `0 0 ${size*2}px ${dust.style.background}`;

        orbitRing.appendChild(dust);
        galaxyContainer.appendChild(orbitRing);
    }
}

function initGalaxyThreeHeart() {
    const container = document.getElementById('galaxyHeartCanvas');
    if (!container || container.children.length > 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 22; 

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

    const particlesCount = 7000;
    const particlesGeometry = new THREE.BufferGeometry();
    
    const targetPositions = new Float32Array(particlesCount * 3);
    const currentPositions = new Float32Array(particlesCount * 3);
    const speeds = new Float32Array(particlesCount);
    
    const shapeGeometry = new THREE.ShapeGeometry(heartShape);
    const posAttribute = shapeGeometry.attributes.position;
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    
    let totalArea = 0;
    const triangles = [];
    for (let i = 0; i < posAttribute.count; i += 3) {
        vA.fromBufferAttribute(posAttribute, i);
        vB.fromBufferAttribute(posAttribute, i + 1);
        vC.fromBufferAttribute(posAttribute, i + 2);
        
        const ab = vB.clone().sub(vA);
        const ac = vC.clone().sub(vA);
        const area = ab.cross(ac).length() / 2;
        totalArea += area;
        triangles.push({ a: vA.clone(), b: vB.clone(), c: vC.clone(), area: area });
    }
    
    for (let i = 0; i < particlesCount; i++) {
        let rArea = Math.random() * totalArea;
        let selectedTri = triangles[0];
        for (let j = 0; j < triangles.length; j++) {
            rArea -= triangles[j].area;
            if (rArea <= 0) {
                selectedTri = triangles[j];
                break;
            }
        }
        
        let r1 = Math.random();
        let r2 = Math.random();
        if (r1 + r2 > 1) {
            r1 = 1 - r1;
            r2 = 1 - r2;
        }
        const a = 1 - r1 - r2;
        const ptX = a * selectedTri.a.x + r1 * selectedTri.b.x + r2 * selectedTri.c.x;
        const ptY = a * selectedTri.a.y + r1 * selectedTri.b.y + r2 * selectedTri.c.y;
        
        const zThickness = (Math.random() + Math.random() + Math.random() - 1.5) * 2;
        const scale = 0.8; 
        targetPositions[i*3] = (ptX - 5) * scale;
        targetPositions[i*3+1] = -(ptY - 10) * scale; 
        targetPositions[i*3+2] = zThickness;
        
        const scatterRadius = 80 + Math.random() * 100;
        const scatterAngle = Math.random() * Math.PI * 2;
        currentPositions[i*3] = Math.cos(scatterAngle) * scatterRadius;
        currentPositions[i*3+1] = (Math.random() - 0.5) * 150;
        currentPositions[i*3+2] = Math.sin(scatterAngle) * scatterRadius;
        
        speeds[i] = 0.015 + Math.random() * 0.03;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    
    const material = new THREE.PointsMaterial({ 
        size: 0.15,
        color: 0xffffff,
        transparent: true, 
        opacity: 0.9, 
        blending: THREE.AdditiveBlending 
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);
    
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    const clock = new THREE.Clock();
    let isFormed = false;
    
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        const positions = particlesGeometry.attributes.position.array;
        let pointsReached = 0;
        
        for (let i = 0; i < particlesCount; i++) {
            const speed = speeds[i];
            const dx = targetPositions[i*3] - positions[i*3];
            const dy = targetPositions[i*3+1] - positions[i*3+1];
            const dz = targetPositions[i*3+2] - positions[i*3+2];
            
            positions[i*3] += dx * speed;
            positions[i*3+1] += dy * speed;
            positions[i*3+2] += dz * speed;
            
            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) pointsReached++;
        }
        particlesGeometry.attributes.position.needsUpdate = true;
        
        if (pointsReached > particlesCount * 0.9) isFormed = true;
        
        const targetRotationX = -mouseY * 0.4;
        const targetRotationY = mouseX * 0.4 + Math.sin(elapsedTime * 0.5) * 0.3;
        
        particlesMesh.rotation.x += (targetRotationX - particlesMesh.rotation.x) * 0.05;
        particlesMesh.rotation.y += (targetRotationY - particlesMesh.rotation.y) * 0.05;
        
        if (isFormed) {
            const beat = Math.pow(Math.sin(elapsedTime * 3), 40); 
            const scale = 1 + beat * 0.15;
            material.color.setHex(beat > 0.5 ? 0xff2a75 : 0xffffff);
            particlesMesh.scale.set(scale, scale, scale);
        }
        
        renderer.render(scene, camera);
    }
    animate();
}

// ==========================================
// 9. RAZONES (SWIPER COVERFLOW 3D Y AUDIO)
// ==========================================
function initReasons() {
    // 1. Text rain background canvas
    const rCanvas = document.getElementById('bg-canvas-razones');
    if (rCanvas) {
        const rCtx = rCanvas.getContext('2d');
        rCanvas.width = window.innerWidth;
        rCanvas.height = window.innerHeight;
        const words = ["My Love", "Te Amo", "My Love", "Mi Vida", "Para Ti", "My Love", "Siempre", "My Love"];
        const fontSize = 12;
        const columnSpacing = 28;
        const columns = Math.floor(rCanvas.width / columnSpacing) + 1;
        const drops = [];
        for (let x = 0; x < columns; x++) { drops[x] = Math.random() * -100; }

        function drawRazonesRain() {
            rCtx.fillStyle = 'rgba(30, 19, 41, 0.2)';
            rCtx.fillRect(0, 0, rCanvas.width, rCanvas.height);
            rCtx.fillStyle = '#ff85a2';
            rCtx.font = fontSize + 'px Outfit, sans-serif';

            for (let i = 0; i < drops.length; i++) {
                const text = words[i % words.length];
                const x = i * columnSpacing;
                const y = drops[i] * fontSize;
                rCtx.fillText(text, x, y);
                if (y > rCanvas.height && Math.random() > 0.985) {
                    drops[i] = 0;
                }
                drops[i] += 0.5;
            }
        }
        setInterval(drawRazonesRain, 50);

        window.addEventListener('resize', () => {
            rCanvas.width = window.innerWidth;
            rCanvas.height = window.innerHeight;
        });
    }

    // 2. Swiper cards data
    const reasonsIcons = {
        smile: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
        eye: `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
        music: `<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
        bolt: `<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        heart: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
    };

    const reasonsData = [
        {
            icon: 'smile',
            title: 'Tu Sonrisa',
            desc: 'Ilumina hasta mis días más oscuros sin siquiera proponérselo.',
            img: 'https://drive.google.com/thumbnail?id=15vTLDD3PDTEorSbTJguHkzeXF0ltqNdf&sz=w1000'
        },
        {
            icon: 'eye',
            title: 'Tu Mirada',
            desc: 'Donde me pierdo y me encuentro al mismo tiempo.',
            img: 'https://drive.google.com/thumbnail?id=198bsT2VWE4KZJiM-IgnKbzXYwfRWSP9j&sz=w1000'
        },
        {
            icon: 'music',
            title: 'Tu Voz',
            desc: 'El sonido favorito de mi vida, siempre.',
            audio: 'assets/audio/voz.ogg'
        },
        {
            icon: 'bolt',
            title: 'Tu Fuerza',
            desc: 'Eres más valiente de lo que crees, y eso me inspira cada día.',
            img: 'https://drive.google.com/thumbnail?id=1w-g7i7xeeavmWe3eYkesbh7q9HPk_hFC&sz=w1000'
        },
        {
            icon: 'heart',
            title: 'Simplemente nosotros',
            desc: 'Tú y yo. Lo más bonito que tengo.',
            img: 'https://drive.google.com/thumbnail?id=1eOdzPqElKVKUvLOsfAMdJqujwBARS8DX&sz=w1000'
        }
    ];

    const swiperWrapper = document.getElementById('reasons-swiper-wrapper');
    if (!swiperWrapper) return;
    swiperWrapper.innerHTML = '';
    const allCards = [];

    reasonsData.forEach(r => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        const card = document.createElement('div');
        card.className = 'love-reason-tile';

        let backContent = '';
        if (r.img) {
            backContent = `
                <img src="${r.img}" alt="${r.title}"
                    style="width:100%;height:100%;object-fit:cover;border-radius:22px;position:absolute;inset:0;">
                <div style="position:absolute;bottom:0;left:0;right:0;padding:1rem;
                    background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);
                    border-radius:0 0 22px 22px;color:#fff;font-family:'Outfit',sans-serif;
                    font-size:0.9rem;line-height:1.4;">
                    ${r.desc}
                </div>`;
        } else if (r.audio) {
            backContent = `
                <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;padding:1.5rem;">
                    <div style="font-size:2.5rem;">🎙️</div>
                    <div class="love-tile-back-text">${r.desc}</div>
                    <audio controls style="width:100%;margin-top:0.5rem;border-radius:30px;"
                        src="${r.audio}"></audio>
                </div>`;
        }

        card.innerHTML = `
            <div class="love-tile-inner">
                <div class="love-tile-face love-tile-front">
                    <div class="love-tile-icon-wrap">
                        ${reasonsIcons[r.icon] || reasonsIcons.heart}
                    </div>
                    <div>
                        <div class="love-tile-title">${r.title}</div>
                        <div class="love-tile-tap-hint">Toca para ver</div>
                    </div>
                </div>
                <div class="love-tile-face love-tile-back">
                    ${backContent}
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'audio' || e.target.closest('audio')) return;
            allCards.forEach(c => {
                if (c !== card) c.classList.remove('flipped');
            });
            card.classList.toggle('flipped');
        });

        allCards.push(card);
        slide.appendChild(card);
        swiperWrapper.appendChild(slide);
    });

    new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 25,
            stretch: 0,
            depth: 180,
            modifier: 1,
            slideShadows: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        on: {
            slideChange: function () {
                allCards.forEach(c => c.classList.remove('flipped'));
            }
        }
    });
}

// ==========================================
// 10. CARTA (MÁQUINA DE ESCRIBIR)
// ==========================================
const cartaMessage = "Para el amor de mi vida, Mi empanadita❤️\n\nMi amor, hoy cumplimos un año juntos, un año desde que comenzó esta historia tan bonita que hemos ido construyendo los dos. Y aunque un año pueda parecer poco para algunas personas, para mí significa muchísimo, porque en este tiempo he tenido la oportunidad de conocerte más, de compartir momentos contigo y de darme cuenta de lo especial que eres para mí.\n\nGracias por cada sonrisa, cada abrazo, cada beso, cada conversación y cada momento que hemos vivido juntos. Gracias también por quedarte a mi lado incluso cuando las cosas no han sido fáciles. Sé que una relación no siempre es perfecta, que existen días bonitos y otros complicados, pero creo que lo importante es lo que sentimos y las ganas que tenemos de seguir construyendo algo bonito juntos.\n\nNo sé qué nos tenga preparado el futuro, pero sí sé que hoy estoy feliz de tenerte conmigo y de poder celebrar este primer añito a tu lado.\n\nFeliz primer aniversario, mi niña hermosa. ❤️";

let cartaTimeout = null;

function typeCartaText() {
    const el = document.getElementById('carta-text');
    if (!el) return;
    if (cartaTimeout) clearTimeout(cartaTimeout);
    let i = 0;
    el.innerHTML = '';

    function type() {
        if (i < cartaMessage.length) {
            const char = cartaMessage.charAt(i);
            if (char === '\n') {
                el.innerHTML += '<br>';
            } else {
                el.innerHTML += char;
            }
            i++;
            cartaTimeout = setTimeout(type, 28);
        }
    }
    setTimeout(type, 300);
}
