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

    if (currentActiveTabId === 'tab-universo' && window.pauseGalaxyAnimation) {
        window.pauseGalaxyAnimation();
    }

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
            galaxyInitialized = true;
        } else if (window.resumeGalaxyAnimation) {
            window.resumeGalaxyAnimation();
        }
        gsap.from('.galaxy-titles', { y: 25, opacity: 0, duration: 0.8, ease: "power2.out" });
        gsap.from('#btn-pedir-deseo', { scale: 0.8, opacity: 0, duration: 0.8, delay: 0.25, ease: "back.out(1.7)" });
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
// 8. UNIVERSO (GALAXIA CÓSMICA 3D Y CORAZÓN DE PARTÍCULAS)
// ==========================================
function showGalaxyModal(text) {
    const modal = document.getElementById('galaxyModal');
    const modalText = document.getElementById('modal-text');
    if (!modal || !modalText) return;
    modalText.innerText = text;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeGalaxyModal() {
    const modal = document.getElementById('galaxyModal');
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}
window.closeGalaxyModal = closeGalaxyModal;

function initGalaxy() {
    const container = document.getElementById('galaxy-container');
    const canvas = document.getElementById('galaxyThreeCanvas');
    const nodesLayer = document.getElementById('galaxy-nodes-layer');
    if (!container || !canvas || !nodesLayer) return;

    // Evitar reinicialización duplicada si ya está corriendo
    if (window._galaxyAnimRunning) return;

    nodesLayer.innerHTML = '';

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. ESCENA, CÁMARA Y RENDERIZADOR THREE.JS
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2500);

    function updateCameraDistance() {
        const isMobile = window.innerWidth < 768;
        camera.position.set(0, isMobile ? 180 : 140, isMobile ? 580 : 430);
        camera.lookAt(0, -10, 0);
    }
    updateCameraDistance();

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Grupo Cósmico Principal
    const galaxyGroup = new THREE.Group();
    galaxyGroup.rotation.x = 0.32;
    scene.add(galaxyGroup);

    // Textura de partículas con brillo radial suave (anti-pixelación)
    function createGlowTexture() {
        const c = document.createElement('canvas');
        c.width = 64;
        c.height = 64;
        const ctx = c.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, 'rgba(255, 215, 235, 0.9)');
        grad.addColorStop(0.5, 'rgba(255, 105, 180, 0.45)');
        grad.addColorStop(1, 'rgba(255, 42, 117, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    }
    const particleTexture = createGlowTexture();

    // 2. NÉBULA CENTRAL ETÉREA (RESPLANDOR SUAVE SIN BORDES)
    function createNebulaTexture() {
        const c = document.createElement('canvas');
        c.width = 128;
        c.height = 128;
        const ctx = c.getContext('2d');
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(255, 133, 162, 0.85)');
        grad.addColorStop(0.25, 'rgba(255, 42, 117, 0.55)');
        grad.addColorStop(0.65, 'rgba(168, 85, 247, 0.22)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
    }
    const nebulaMaterial = new THREE.SpriteMaterial({
        map: createNebulaTexture(),
        color: 0xffffff,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const nebulaSprite = new THREE.Sprite(nebulaMaterial);
    nebulaSprite.scale.set(260, 260, 1);
    galaxyGroup.add(nebulaSprite);

    // 3. CORAZÓN 3D DE PARTÍCULAS (CENTRO RADIANTE)
    const heartParticlesCount = 3800;
    const heartGeometry = new THREE.BufferGeometry();
    const heartPositions = new Float32Array(heartParticlesCount * 3);
    const heartColors = new Float32Array(heartParticlesCount * 3);

    for (let i = 0; i < heartParticlesCount; i++) {
        const t = Math.random() * Math.PI * 2;
        // Fórmula matemática clásica de corazón en 3D
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        const r = Math.pow(Math.random(), 0.55);
        const maxZ = 7.5 * Math.sqrt(Math.max(0, 1 - (hx / 16) * (hx / 16))) * (1 - Math.abs(hy / 16) * 0.25);
        const z = (Math.random() * 2 - 1) * maxZ * r;

        const scale = 4.2;
        const x = hx * r * scale;
        const y = hy * r * scale + 12;
        const zCoord = z * scale;

        heartPositions[i * 3] = x;
        heartPositions[i * 3 + 1] = y;
        heartPositions[i * 3 + 2] = zCoord;

        // Degradado de color: Núcleo blanco diamante -> Rosa brillante -> Magenta neón
        const edgeRatio = r;
        const color = new THREE.Color();
        if (edgeRatio < 0.35) {
            color.lerpColors(new THREE.Color(0xffffff), new THREE.Color(0xffd1dc), edgeRatio / 0.35);
        } else if (edgeRatio < 0.75) {
            color.lerpColors(new THREE.Color(0xffd1dc), new THREE.Color(0xff6584), (edgeRatio - 0.35) / 0.4);
        } else {
            color.lerpColors(new THREE.Color(0xff6584), new THREE.Color(0xff1493), (edgeRatio - 0.75) / 0.25);
        }

        heartColors[i * 3] = color.r;
        heartColors[i * 3 + 1] = color.g;
        heartColors[i * 3 + 2] = color.b;
    }

    heartGeometry.setAttribute('position', new THREE.BufferAttribute(heartPositions, 3));
    heartGeometry.setAttribute('color', new THREE.BufferAttribute(heartColors, 3));

    const heartMaterial = new THREE.PointsMaterial({
        size: 3.2,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const heartMesh = new THREE.Points(heartGeometry, heartMaterial);
    galaxyGroup.add(heartMesh);

    // 4. BRAZOS DE LA GALAXIA ESPIRAL
    const spiralParticlesCount = 3400;
    const spiralGeometry = new THREE.BufferGeometry();
    const spiralPositions = new Float32Array(spiralParticlesCount * 3);
    const spiralColors = new Float32Array(spiralParticlesCount * 3);
    const arms = 2;

    for (let i = 0; i < spiralParticlesCount; i++) {
        const radius = 95 + Math.pow(Math.random(), 1.35) * 380;
        const spinAngle = radius * 0.013;
        const armAngle = ((i % arms) * (2 * Math.PI / arms));
        const dispersion = (Math.random() - 0.5) * (0.65 + radius / 320);
        const angle = spinAngle + armAngle + dispersion;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 24 * (1 - radius / 550);

        spiralPositions[i * 3] = x;
        spiralPositions[i * 3 + 1] = y;
        spiralPositions[i * 3 + 2] = z;

        const normR = (radius - 95) / 380;
        const color = new THREE.Color();
        if (normR < 0.35) {
            color.lerpColors(new THREE.Color(0xffc2d1), new THREE.Color(0xff758c), normR / 0.35);
        } else if (normR < 0.75) {
            color.lerpColors(new THREE.Color(0xff758c), new THREE.Color(0xa5b4fc), (normR - 0.35) / 0.4);
        } else {
            color.lerpColors(new THREE.Color(0xa5b4fc), new THREE.Color(0xffffff), (normR - 0.75) / 0.25);
        }

        spiralColors[i * 3] = color.r;
        spiralColors[i * 3 + 1] = color.g;
        spiralColors[i * 3 + 2] = color.b;
    }

    spiralGeometry.setAttribute('position', new THREE.BufferAttribute(spiralPositions, 3));
    spiralGeometry.setAttribute('color', new THREE.BufferAttribute(spiralColors, 3));

    const spiralMaterial = new THREE.PointsMaterial({
        size: 2.2,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const spiralMesh = new THREE.Points(spiralGeometry, spiralMaterial);
    galaxyGroup.add(spiralMesh);

    // 5. ANILLOS CÓSMICOS FINOS (TIPO SATURNO)
    const ringParticlesCount = 1200;
    const ringGeometry = new THREE.BufferGeometry();
    const ringPositions = new Float32Array(ringParticlesCount * 3);
    const ringColors = new Float32Array(ringParticlesCount * 3);

    for (let i = 0; i < ringParticlesCount; i++) {
        const isInner = Math.random() < 0.5;
        const baseRadius = isInner ? 190 : 315;
        const r = baseRadius + (Math.random() - 0.5) * 14;
        const angle = Math.random() * Math.PI * 2;

        ringPositions[i * 3] = Math.cos(angle) * r;
        ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
        ringPositions[i * 3 + 2] = Math.sin(angle) * r;

        const col = isInner ? new THREE.Color(0xffa5ba) : new THREE.Color(0xfbcfe8);
        ringColors[i * 3] = col.r;
        ringColors[i * 3 + 1] = col.g;
        ringColors[i * 3 + 2] = col.b;
    }

    ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
    ringGeometry.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));

    const ringMaterial = new THREE.PointsMaterial({
        size: 1.8,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const ringMesh = new THREE.Points(ringGeometry, ringMaterial);
    galaxyGroup.add(ringMesh);

    // 6. ESTRELLAS DE FONDO EN EL ESPACIO PROFUNDO
    const bgStarsCount = 500;
    const bgStarsGeometry = new THREE.BufferGeometry();
    const bgStarsPositions = new Float32Array(bgStarsCount * 3);

    for (let i = 0; i < bgStarsCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const dist = 900 + Math.random() * 500;

        bgStarsPositions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
        bgStarsPositions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
        bgStarsPositions[i * 3 + 2] = dist * Math.cos(phi);
    }
    bgStarsGeometry.setAttribute('position', new THREE.BufferAttribute(bgStarsPositions, 3));
    const bgStarsMaterial = new THREE.PointsMaterial({
        size: 1.6,
        color: 0xffffff,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    });
    const bgStarsMesh = new THREE.Points(bgStarsGeometry, bgStarsMaterial);
    scene.add(bgStarsMesh);

    // 7. ESTRELLAS FUGACES (LUCES CÓSMICAS MÁS FRECUENTES Y VARIADAS)
    const shootingStars = [];
    function spawnShootingStar(customColor = null, startDir = null) {
        const isFromLeft = startDir !== null ? startDir : (Math.random() > 0.4);
        const startX = isFromLeft ? (-400 - Math.random() * 300) : (400 + Math.random() * 300);
        const startY = 160 + Math.random() * 260;
        const startZ = (Math.random() - 0.5) * 450;
        const geom = new THREE.BufferGeometry();
        const trailLen = 8;
        const positions = new Float32Array(trailLen * 3);
        for (let i = 0; i < trailLen * 3; i++) positions[i] = 0;
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const colors = [0xffffff, 0xffa5ba, 0xff758c, 0xa5b4fc, 0xfbcfe8, 0xffd1dc];
        const starColor = customColor || colors[Math.floor(Math.random() * colors.length)];

        const mat = new THREE.LineBasicMaterial({
            color: starColor,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        const line = new THREE.Line(geom, mat);
        scene.add(line);

        const vx = isFromLeft ? (15 + Math.random() * 8) : (-15 - Math.random() * 8);
        const vy = -9 - Math.random() * 6;

        shootingStars.push({
            line,
            geom,
            x: startX,
            y: startY,
            z: startZ,
            vx,
            vy,
            history: [],
            life: 1.0,
            decay: 0.018 + Math.random() * 0.014
        });
    }

    // Luces pasando más seguido (cada 1.7s) con posibilidad de luces gemelas
    let meteorTimer = setInterval(() => {
        spawnShootingStar();
        if (Math.random() < 0.35) {
            setTimeout(() => {
                spawnShootingStar(null, Math.random() > 0.5);
            }, 260);
        }
    }, 1700);

    // Botón interactivo "Pedir un deseo"
    const wishBtn = document.getElementById('btn-pedir-deseo');
    if (wishBtn) {
        wishBtn.onclick = (e) => {
            e.stopPropagation();
            spawnShootingStar(0xffffff, true);
            setTimeout(() => spawnShootingStar(0xff758c, false), 160);
            setTimeout(() => spawnShootingStar(0xa5b4fc, true), 380);

            const wishQuotes = [
                "¡Tu deseo ha sido grabado en las estrellas! ✨ Que nuestro amor siga creciendo cada día más fuerte y hermoso.",
                "Un deseo para nosotros: que nunca nos falten las risas, los abrazos eternos y este amor tan puro. 💖",
                "Las estrellas han escuchado tu deseo: Daniela y Mayckol, un amor sin final. 💫",
                "¡Deseo concedido por el cosmos! Prometo amarte, cuidarte y hacerte sonreír cada día de mi vida. 🌹",
                "Si pudiera pedir un deseo a cada estrella del universo, en todas pediría volver a elegirte a ti. 💍"
            ];
            const randomWish = wishQuotes[Math.floor(Math.random() * wishQuotes.length)];
            setTimeout(() => {
                showGalaxyModal(randomWish);
            }, 550);
        };
    }

    // 8. MENSAJES Y PALABRAS ORBITALES (20 NODOS NO COLISIONANTES)
    const orbitItems = [
        { text: "TE AMO",                  icon: "💖", message: "Te amo hoy más que ayer, pero no más de lo que te amaré mañana. Eres mi vida entera." },
        { text: "INFINITO ∞",              icon: "✨", message: "Nuestro amor no tiene fin, como el universo que nos rodea. Siempre, para siempre." },
        { text: "AMOR ETERNO",             icon: "💫", message: "Desde el primer día supe que lo nuestro era para toda la vida. Un amor que no termina." },
        { text: "MI PRINCESA",             icon: "👑", message: "Eres la princesa de mi corazón y la reina de mi mundo. Nadie te iguala." },
        { text: "SIEMPRE JUNTOS",          icon: "💍", message: "De tu mano quiero enfrentar cada amanecer, cada tormenta y cada momento de esta vida." },
        { text: "MI TODO",                 icon: "🌟", message: "No sé si existe la felicidad completa, pero yo soy completamente feliz desde que te tengo a mi lado." },
        { text: "PARA SIEMPRE",            icon: "🌌", message: "Si me dieran tres deseos, tres veces pediría volver a encontrarte en esta vida y en las siguientes." },
        { text: "Empanadita",              icon: "🥟", message: "El apodo que te puse y el que te diré hasta el último de nuestros días." },
        { text: "Tú y Yo 👩‍❤️‍👨",             icon: "👩‍❤️‍👨", message: "Tú y yo. Mi frase favorita para el resto de mi vida." },
        { text: "Mi Mayor Tesoro ✨",       icon: "✨", message: "Cada vez que sonríes, siento que el mundo entero brilla un poco más." },
        { text: "Reina de mi Mundo 👑",    icon: "👑", message: "Eres la reina de mi corazón. Mereces todo el amor del universo y más." },
        { text: "Flor Única 🌹",           icon: "🌹", message: "Como una rosa, eres hermosa, única e inigualable. Gracias por existir en mi vida." },
        { text: "Flechazo Eterno 💘",      icon: "💘", message: "Desde el momento en que te conocí, mi corazón supo que eras tú. Solo tú." },
        { text: "MI UNIVERSO",             icon: "🪐", message: "Eres el centro de mi universo, la estrella más brillante de mi cielo. Todo gira a tu alrededor." },
        { text: "MI ESTRELLA",             icon: "⭐", message: "Cuando miro las estrellas, pienso en ti. Pero ninguna de ellas se compara con tu luz." },
        { text: "LUZ DE MI VIDA",          icon: "☀️", message: "Eres la razón por la que mi mundo brilla cada día. Mi luz y mi esperanza." },
        { text: "MI DESTINO",              icon: "🧭", message: "Contigo descubrí que el amor no es solo un sentimiento, es un refugio y un lugar seguro." },
        { text: "ALMAS GEMELAS",           icon: "🔮", message: "A veces pienso que la vida es un conjunto de coincidencias mágicas, y la más hermosa fue encontrarte." },
        { text: "ME ENCANTA ESTAR CONTIGO", icon: "🥰", message: "Contigo los días son más brillantes y los problemas se sienten más pequeños. Gracias por todo." },
        { text: "TE ADORO",               icon: "❤️", message: "Contigo aprendí lo que es el amor real. Eres mi calma en medio del caos y mi lugar seguro." }
    ];

    // 4 niveles orbitales bien espaciados
    const orbitTiers = [
        { count: 4, radius: 165, speed: 0.18, offset: 0 },
        { count: 5, radius: 235, speed: 0.13, offset: 0.35 },
        { count: 5, radius: 310, speed: 0.09, offset: 0.7 },
        { count: 6, radius: 385, speed: 0.065, offset: 0.2 }
    ];

    const activeNodes = [];
    let itemIdx = 0;

    orbitTiers.forEach((tier) => {
        for (let i = 0; i < tier.count && itemIdx < orbitItems.length; i++) {
            const data = orbitItems[itemIdx++];
            const baseAngle = (i / tier.count) * Math.PI * 2 + tier.offset;

            const el = document.createElement('div');
            el.className = 'galaxy-node';
            if (data.text.includes('AMOR') || data.text.includes('AMO') || data.text.includes('💘') || data.text.includes('❤️')) {
                el.classList.add('highlight-love');
            }

            el.innerHTML = `<span class="node-icon">${data.icon}</span><span class="node-label">${data.text}</span>`;

            const nodeObj = {
                el,
                radius: tier.radius,
                angle: baseAngle, // Posición angular continua acumulada (sin saltos ni parpadeos)
                speed: tier.speed,
                phase: Math.random() * Math.PI * 2,
                isHovered: false
            };

            el.addEventListener('mouseenter', () => { nodeObj.isHovered = true; });
            el.addEventListener('mouseleave', () => { nodeObj.isHovered = false; });
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                showGalaxyModal(data.message);
            });

            nodesLayer.appendChild(el);
            activeNodes.push(nodeObj);
        }
    });

    // 9. FUNCIÓN PARA GENERAR CORAZONES FLOTANTES AL DAR CLIC EN ESTE APARTADO
    function createClickHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'cosmic-click-heart';
        const emojis = ['💖', '💕', '❤️', '✨', '💗', '💘', '💓'];
        heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        const dx = (Math.random() - 0.5) * 45;
        const rot = (Math.random() - 0.5) * 35;
        heart.style.setProperty('--dx', dx + 'px');
        heart.style.setProperty('--rot', rot + 'deg');
        document.body.appendChild(heart);
        setTimeout(() => {
            if (heart && heart.parentNode) heart.parentNode.removeChild(heart);
        }, 950);
    }

    // 10. INTERACCIÓN DE ARRASTRE Y ROTACIÓN 3D FLUIDA
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let rotVelX = 0;
    let rotVelY = 0;
    let targetRotX = 0.32;
    let targetRotY = 0;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let extraHeartBeat = 0;

    container.addEventListener('pointerdown', (e) => {
        // Lanzar un pequeño corazón romántico donde dé clic en este apartado
        if (!e.target.closest('#galaxyModal') && !e.target.closest('.wish-button')) {
            createClickHeart(e.clientX, e.clientY);
        }

        if (e.target.closest('.galaxy-node') || e.target.closest('.wish-button')) return;
        isDragging = true;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
        rotVelX = 0;
        rotVelY = 0;

        // Comprobar si tocó cerca del centro (el corazón de partículas)
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left - rect.width / 2;
        const clickY = e.clientY - rect.top - rect.height / 2;
        const distToCenter = Math.sqrt(clickX * clickX + clickY * clickY);
        if (distToCenter < 70) {
            extraHeartBeat = 1.0;
            setTimeout(() => {
                showGalaxyModal("Daniela, eres el centro de todo mi universo. No importa cuántos millones de estrellas existan en el cosmos, ninguna brilla con la luz, la ternura y la magia con la que brillas tú para mí. Cada latido de mi corazón te pertenece. ❤️✨");
            }, 300);
        }
    });

    window.addEventListener('pointermove', (e) => {
        if (!isDragging) {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            targetParallaxX = nx * 0.08;
            targetParallaxY = ny * 0.05;
            return;
        }
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;

        rotVelY = deltaX * 0.0055;
        rotVelX = deltaY * 0.004;

        targetRotY += rotVelY;
        targetRotX += rotVelX;
        targetRotX = Math.max(-0.45, Math.min(0.85, targetRotX));
    });

    const stopDragging = () => { isDragging = false; };
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    // Redimensionamiento responsive
    function onResize() {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        updateCameraDistance();
    }
    window.addEventListener('resize', onResize);

    // 11. BUCLE DE ANIMACIÓN PRINCIPAL (60 FPS BUTTER SMOOTH)
    const clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();
    let animId = null;
    let isRunning = true;
    window._galaxyAnimRunning = true;

    function animate() {
        if (!isRunning) return;
        animId = requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.1);
        const elapsedTime = clock.getElapsedTime();

        // Rotación inercial y auto-giro constante
        if (!isDragging) {
            targetRotY += 0.0016;
            rotVelX *= 0.94;
            rotVelY *= 0.94;
            targetRotX += rotVelX;
            targetRotY += rotVelY;
        }

        // Amortiguación suave del paralaje del mouse para evitar temblores
        mouseParallaxX += (targetParallaxX - mouseParallaxX) * 0.05;
        mouseParallaxY += (targetParallaxY - mouseParallaxY) * 0.05;

        // Amortiguación suave con Lerp
        galaxyGroup.rotation.y += (targetRotY + mouseParallaxX - galaxyGroup.rotation.y) * 0.06;
        galaxyGroup.rotation.x += (targetRotX + mouseParallaxY - galaxyGroup.rotation.x) * 0.06;

        // Giro interno de la espiral y los anillos
        spiralMesh.rotation.y += 0.0022;
        ringMesh.rotation.y += 0.0015;

        // Latido orgánico 3D del corazón (doble sístole)
        const beatCycle = (elapsedTime * 2.2) % (Math.PI * 2);
        const naturalBeat = Math.pow(Math.sin(beatCycle), 12) * 0.13 + Math.pow(Math.sin(beatCycle - 0.35), 12) * 0.07;
        extraHeartBeat *= 0.94;
        const heartBeat = naturalBeat + extraHeartBeat * 0.25;

        const currentScale = 1 + heartBeat;
        heartMesh.scale.set(currentScale, currentScale, currentScale);

        // Resplandor de nebulosa pulsante
        const nebScale = 250 * (1 + heartBeat * 0.5);
        nebulaSprite.scale.set(nebScale, nebScale, 1);
        nebulaMaterial.opacity = 0.65 + heartBeat * 0.35;

        // Actualizar meteoros activos
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life -= s.decay;
            s.history.unshift({ x: s.x, y: s.y, z: s.z });
            if (s.history.length > 7) s.history.pop();

            const pos = s.geom.attributes.position.array;
            for (let j = 0; j < s.history.length; j++) {
                pos[j * 3] = s.history[j].x;
                pos[j * 3 + 1] = s.history[j].y;
                pos[j * 3 + 2] = s.history[j].z;
            }
            s.geom.attributes.position.needsUpdate = true;
            s.line.material.opacity = Math.max(0, s.life);

            if (s.life <= 0) {
                scene.remove(s.line);
                s.geom.dispose();
                s.line.material.dispose();
                shootingStars.splice(i, 1);
            }
        }

        // Proyección matemática a pantalla de las 20 palabras (Sin saltos de ángulo ni parpadeo)
        const cWidth = container.clientWidth || window.innerWidth;
        const cHeight = container.clientHeight || window.innerHeight;

        for (let i = 0; i < activeNodes.length; i++) {
            const node = activeNodes[i];
            
            // Avanzar el ángulo solo si NO está siendo hovered
            if (!node.isHovered) {
                node.angle += node.speed * delta * 0.7;
            }
            const currentAngle = node.angle;

            tempVec.set(
                Math.cos(currentAngle) * node.radius,
                Math.sin(currentAngle * 2 + node.phase) * 16,
                Math.sin(currentAngle) * node.radius
            );

            tempVec.applyMatrix4(galaxyGroup.matrixWorld);
            tempVec.project(camera);

            if (tempVec.z > 1) {
                node.el.style.display = 'none';
                continue;
            }
            node.el.style.display = 'flex';

            const screenX = (tempVec.x * 0.5 + 0.5) * cWidth;
            const screenY = (-tempVec.y * 0.5 + 0.5) * cHeight;

            const normDepth = (tempVec.z + 1) * 0.5;
            const scale = Math.max(0.72, Math.min(1.15, 1.15 - normDepth * 0.42));
            const opacity = Math.max(0.45, Math.min(1.0, 1.05 - normDepth * 0.55));
            const zIdx = Math.round((1 - normDepth) * 200) + 15;

            node.el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) scale(${node.isHovered ? 1.15 : scale})`;
            node.el.style.opacity = node.isHovered ? '1' : opacity.toFixed(2);
            node.el.style.zIndex = node.isHovered ? '999' : zIdx;
        }

        renderer.render(scene, camera);
    }
    animate();

    window.pauseGalaxyAnimation = function () {
        isRunning = false;
        if (animId) cancelAnimationFrame(animId);
        clearInterval(meteorTimer);
    };

    window.resumeGalaxyAnimation = function () {
        if (!isRunning) {
            isRunning = true;
            clock.start();
            animate();
            meteorTimer = setInterval(() => {
                if (Math.random() > 0.3) spawnShootingStar();
            }, 4500);
        }
    };
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
