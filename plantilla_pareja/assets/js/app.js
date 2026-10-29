// ==========================================
// APLICACIÓN UNIFICADA DE ANIVERSARIO (VIP 2.0)
// Mayckol & Daniela • Amor Infinito
// ==========================================

// ==========================================
// 0. HELPER DE EMOJIS (FLUENT 3D + TWEMOJI)
// ==========================================
const FLUENT_CDN = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji/assets/';

const EMOJI_MAP = {
    sparkle: FLUENT_CDN + 'Sparkles/3D/sparkles_3d.png',
    planet: FLUENT_CDN + 'Ringed%20planet/3D/ringed_planet_3d.png',
    sparklingHeart: FLUENT_CDN + 'Sparkling%20heart/3D/sparkling_heart_3d.png',
    redHeart: FLUENT_CDN + 'Red%20heart/3D/red_heart_3d.png',
    growingHeart: FLUENT_CDN + 'Growing%20heart/3D/growing_heart_3d.png',
    twoHearts: FLUENT_CDN + 'Two%20hearts/3D/two_hearts_3d.png',
    loveLetter: FLUENT_CDN + 'Love%20letter/3D/love_letter_3d.png',
    crown: FLUENT_CDN + 'Crown/3D/crown_3d.png',
    ring: FLUENT_CDN + 'Ring/3D/ring_3d.png',
    star: FLUENT_CDN + 'Star/3D/star_3d.png',
    glowingStar: FLUENT_CDN + 'Glowing%20star/3D/glowing_star_3d.png',
    rose: FLUENT_CDN + 'Rose/3D/rose_3d.png',
    arrowHeart: FLUENT_CDN + 'Heart%20with%20arrow/3D/heart_with_arrow_3d.png',
    sun: FLUENT_CDN + 'Sun/3D/sun_3d.png',
    compass: FLUENT_CDN + 'Compass/3D/compass_3d.png',
    crystalBall: FLUENT_CDN + 'Crystal%20ball/3D/crystal_ball_3d.png',
    dumpling: FLUENT_CDN + 'Dumpling/3D/dumpling_3d.png',
    smileHearts: FLUENT_CDN + 'Smiling%20face%20with%20hearts/3D/smiling_face_with_hearts_3d.png',
    milkyWay: FLUENT_CDN + 'Milky%20way/3D/milky_way_3d.png',
    microphone: FLUENT_CDN + 'Studio%20microphone/3D/studio_microphone_3d.png',
    eyes: FLUENT_CDN + 'Eyes/3D/eyes_3d.png',
    bolt: FLUENT_CDN + 'High%20voltage/3D/high_voltage_3d.png',
    smile: FLUENT_CDN + 'Grinning%20face%20with%20smiling%20eyes/3D/grinning_face_with_smiling_eyes_3d.png'
};

function parseEmojis(el) {
    if (window.twemoji && el) {
        window.twemoji.parse(el, {
            folder: 'svg',
            ext: '.svg',
            base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
        });
    }
}

// Sonido sintético celestial (Web Audio API nativo)
let audioCtx = null;
function playCelestialChime(frequency = 587.33, type = 'sine') {
    try {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioCtx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.75);
    } catch (e) {
        // Silencioso en caso de bloqueo de audio
    }
}

// Toast flotante
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.innerHTML = message;
    parseEmojis(toast);
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ==========================================
// 1. MATRIX RAIN EFFECT (PANTALLA DE ENTRADA)
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
    ctxMatrix.fillStyle = 'rgba(18, 8, 28, 0.22)';
    ctxMatrix.fillRect(0, 0, canvasMatrix.width, canvasMatrix.height);

    ctxMatrix.fillStyle = '#ff85a2';
    ctxMatrix.font = fontMatrix + 'px Outfit, sans-serif';
    ctxMatrix.shadowBlur = 6;
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
// 2. CORAZONES FLOTANTES GLOBALES (BACKGROUND)
// ==========================================
const canvasHearts = document.getElementById('heartsCanvas');
const ctxHearts = canvasHearts.getContext('2d');
canvasHearts.width = window.innerWidth;
canvasHearts.height = window.innerHeight;

let heartsList = [];
const heartSymbols = ['♥', '♡', '✧', '✦', '❤'];

function initHearts() {
    heartsList = [];
    const count = window.innerWidth < 768 ? 30 : 55;
    for (let i = 0; i < count; i++) {
        heartsList.push({
            x: Math.random() * canvasHearts.width,
            y: Math.random() * canvasHearts.height,
            size: Math.random() * 14 + 10,
            speed: Math.random() * 1.2 + 0.5,
            drift: Math.random() * 2 - 1,
            char: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
            alpha: Math.random() * 0.4 + 0.15
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
// 3. REPRODUCTOR DE MÚSICA FLOTANTE (DYNAMIC ISLAND)
// ==========================================
const playlist = [
    { src: 'assets/audio/enamorado_tuyo.mp3', title: 'Cuarteto de Nos — Enamorado Tuyo' }
];
let isAudioPlaying = false;
let isAudioMuted = false;

const globalAudio = new Audio();
globalAudio.preload = 'auto';
globalAudio.src = playlist[0].src;

const floatingMusicBar = document.getElementById('floating-music-bar');
const musicPillToggle = document.getElementById('music-pill-toggle');
const floatingPlayBtn = document.getElementById('floating-play-btn');
const floatingPlayIcon = document.getElementById('floating-play-icon');
const musicExpandPanel = document.getElementById('music-expand-panel');
const expandCloseBtn = document.getElementById('expand-close-btn');

const expandPlayBtn = document.getElementById('expand-play-btn');
const expandPrevBtn = document.getElementById('expand-prev-btn');
const expandSoundBtn = document.getElementById('expand-sound-btn');
const expandProgressBar = document.getElementById('expand-progress-bar');
const expandTimeCur = document.getElementById('expand-time-cur');
const expandTimeTotal = document.getElementById('expand-time-total');

function formatSeconds(sec) {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" + s : s);
}

function updateAudioUI(playing) {
    isAudioPlaying = playing;
    if (playing) {
        floatingMusicBar.classList.add('playing');
        floatingPlayIcon.innerHTML = '⏸';
        if (expandPlayBtn) expandPlayBtn.innerHTML = '⏸';
    } else {
        floatingMusicBar.classList.remove('playing');
        floatingPlayIcon.innerHTML = '▶';
        if (expandPlayBtn) expandPlayBtn.innerHTML = '▶';
    }
}

function toggleGlobalMusic() {
    if (isAudioPlaying) {
        globalAudio.pause();
        updateAudioUI(false);
    } else {
        globalAudio.play().then(() => {
            updateAudioUI(true);
        }).catch(err => console.warn("Audio autoplay blocked:", err));
    }
}

if (floatingPlayBtn) {
    floatingPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleGlobalMusic();
    });
}

if (expandPlayBtn) {
    expandPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleGlobalMusic();
    });
}

if (musicPillToggle) {
    musicPillToggle.addEventListener('click', () => {
        if (musicExpandPanel) {
            musicExpandPanel.classList.toggle('open');
        }
    });
}

if (expandCloseBtn) {
    expandCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (musicExpandPanel) musicExpandPanel.classList.remove('open');
    });
}

if (expandPrevBtn) {
    expandPrevBtn.addEventListener('click', () => {
        globalAudio.currentTime = 0;
        if (!isAudioPlaying) toggleGlobalMusic();
    });
}

if (expandSoundBtn) {
    expandSoundBtn.addEventListener('click', () => {
        isAudioMuted = !isAudioMuted;
        globalAudio.muted = isAudioMuted;
        expandSoundBtn.innerHTML = isAudioMuted ? '🔇' : '🔊';
    });
}

globalAudio.addEventListener('timeupdate', () => {
    if (!globalAudio.duration || isNaN(globalAudio.duration)) return;
    const cur = globalAudio.currentTime || 0;
    const dur = globalAudio.duration || 0;
    if (dur > 0 && expandProgressBar) {
        expandProgressBar.value = (cur / dur) * 100;
        if (expandTimeCur) expandTimeCur.textContent = formatSeconds(cur);
        if (expandTimeTotal) expandTimeTotal.textContent = formatSeconds(dur);
    }
});

globalAudio.addEventListener('loadedmetadata', () => {
    if (expandTimeTotal) expandTimeTotal.textContent = formatSeconds(globalAudio.duration);
});

globalAudio.addEventListener('ended', () => {
    globalAudio.currentTime = 0;
    globalAudio.play().catch(() => {});
});

if (expandProgressBar) {
    expandProgressBar.addEventListener('input', (e) => {
        if (globalAudio.duration) {
            const seek = (e.target.value / 100) * globalAudio.duration;
            if (expandTimeCur) expandTimeCur.textContent = formatSeconds(seek);
        }
    });
    expandProgressBar.addEventListener('change', (e) => {
        if (globalAudio.duration) {
            globalAudio.currentTime = (e.target.value / 100) * globalAudio.duration;
        }
    });
}

// Pausar y reanudar música de fondo automáticamente cuando suena la nota de voz
let wasMusicPlayingBeforeVoice = false;

document.addEventListener('play', (e) => {
    if (e.target !== globalAudio) {
        if (isAudioPlaying) {
            globalAudio.pause();
            updateAudioUI(false);
            wasMusicPlayingBeforeVoice = true;
        }
    }
}, true);

document.addEventListener('ended', (e) => {
    if (e.target !== globalAudio && wasMusicPlayingBeforeVoice) {
        globalAudio.play().then(() => {
            updateAudioUI(true);
            wasMusicPlayingBeforeVoice = false;
        }).catch(err => console.warn("Error reanudando música:", err));
    }
}, true);

document.addEventListener('pause', (e) => {
    if (e.target !== globalAudio && wasMusicPlayingBeforeVoice) {
        setTimeout(() => {
            if (e.target.paused && !e.target.seeking && wasMusicPlayingBeforeVoice) {
                globalAudio.play().then(() => {
                    updateAudioUI(true);
                    wasMusicPlayingBeforeVoice = false;
                }).catch(err => console.warn("Error reanudando música:", err));
            }
        }, 300);
    }
}, true);

// ==========================================
// 4. PANTALLA DE ENTRADA / DESBLOQUEO
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

hintTimeout = setTimeout(() => {
    showUnlockHint(false);
}, 3500);

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

    // Explosión de confeti festivo
    if (window.confetti) {
        window.confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.55 },
            colors: ['#ff85a2', '#ffc3a0', '#ffffff', '#a5b4fc', '#ff2a75']
        });
    }

    // Chime celestial
    playCelestialChime(659.25, 'triangle');

    // Reproducir música
    globalAudio.play().then(() => {
        updateAudioUI(true);
    }).catch(err => {
        console.warn("Autoplay err:", err);
    });

    // Revelar isla de música
    floatingMusicBar.classList.remove('hidden');
    gsap.fromTo(floatingMusicBar, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" });

    // Desvanecer pantalla de bloqueo
    gsap.to(unlockScreen, {
        scale: 0.88,
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

    // Revelar contenido principal
    mainContent.classList.remove('hidden');
    gsap.fromTo('#main-content', { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" });

    // Iniciar Three.js corazón y animaciones
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

    playCelestialChime(523.25, 'sine');

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
        gsap.to(currentTabEl, {
            opacity: 0,
            y: -14,
            duration: 0.22,
            ease: "power2.in",
            onComplete: () => {
                currentTabEl.classList.remove('active');
                currentTabEl.style.display = 'none';

                targetTabEl.classList.add('active');
                targetTabEl.style.display = 'flex';
                window.scrollTo(0, 0);

                gsap.fromTo(targetTabEl,
                    { opacity: 0, y: 16 },
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
        gsap.from('#tab-inicio .hero-names', { y: 30, opacity: 0, duration: 0.8 });
        gsap.from('#tab-inicio .vip-subtitle-wrapper', { y: 20, opacity: 0, duration: 0.8, delay: 0.1 });
        gsap.from('#tab-inicio .countdown-container', { scale: 0.92, opacity: 0, duration: 0.8, delay: 0.2 });
        gsap.from('#tab-inicio .love-metrics-row', { y: 15, opacity: 0, duration: 0.7, delay: 0.25 });
        gsap.from('#tab-inicio .infinity-wrapper', { y: 20, opacity: 0, duration: 0.8, delay: 0.35 });
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
        gsap.from('.paper-envelope-card', { y: 40, opacity: 0, duration: 1, delay: 0.2, ease: "power2.out" });
        if (!typewriterStarted) {
            typeCartaText();
            typewriterStarted = true;
        }
    }
}

// ==========================================
// 6. CONTADOR (INICIO) - 30 DE OCTUBRE 2025
// ==========================================
const startDate = new Date(2025, 9, 30, 0, 0, 0).getTime();

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
    const particlesCount = 900;
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
        size: 0.18,
        color: 0xff85a2,
        transparent: true,
        opacity: 0.85,
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
        const scale = 1 + Math.sin(elapsedTime * 2.2) * 0.06;
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
function showGalaxyModal(text, category = "MENSAJE CELESTIAL", title = "Para Daniela", iconKey = "sparklingHeart") {
    const modal = document.getElementById('galaxyModal');
    const modalText = document.getElementById('modal-text');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalIcon = document.getElementById('modal-icon-img');

    if (!modal || !modalText) return;

    modalText.innerText = text;
    if (modalCategory) modalCategory.innerText = category;
    if (modalTitle) modalTitle.innerText = title;
    if (modalIcon && EMOJI_MAP[iconKey]) modalIcon.src = EMOJI_MAP[iconKey];

    parseEmojis(modalText);

    playCelestialChime(784, 'sine');

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

function handleSaveMessage() {
    if (window.confetti) {
        window.confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 },
            colors: ['#ff85a2', '#ffffff', '#ff2a75']
        });
    }
    showToast("¡Guardado en tu corazón para siempre! 💕");
    closeGalaxyModal();
}
window.handleSaveMessage = handleSaveMessage;

function initGalaxy() {
    const container = document.getElementById('galaxy-container');
    const canvas = document.getElementById('galaxyThreeCanvas');
    const nodesLayer = document.getElementById('galaxy-nodes-layer');
    if (!container || !canvas || !nodesLayer) return;

    if (window._galaxyAnimRunning) return;

    nodesLayer.innerHTML = '';

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

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

    const galaxyGroup = new THREE.Group();
    galaxyGroup.rotation.x = 0.32;
    scene.add(galaxyGroup);

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

    // Nebulosa central
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

    // Corazón 3D central de partículas
    const heartParticlesCount = 3800;
    const heartGeometry = new THREE.BufferGeometry();
    const heartPositions = new Float32Array(heartParticlesCount * 3);
    const heartColors = new Float32Array(heartParticlesCount * 3);

    for (let i = 0; i < heartParticlesCount; i++) {
        const t = Math.random() * Math.PI * 2;
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

    // Brazos de la espiral
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

    // Anillos cósmicos
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

    // Estrellas de fondo
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

    // Meteoros / Estrellas fugaces
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

    let meteorTimer = setInterval(() => {
        spawnShootingStar();
        if (Math.random() < 0.35) {
            setTimeout(() => {
                spawnShootingStar(null, Math.random() > 0.5);
            }, 260);
        }
    }, 1700);

    // Botón "Pedir un deseo"
    const wishBtn = document.getElementById('btn-pedir-deseo');
    if (wishBtn) {
        wishBtn.onclick = (e) => {
            e.stopPropagation();
            spawnShootingStar(0xffffff, true);
            setTimeout(() => spawnShootingStar(0xff758c, false), 160);
            setTimeout(() => spawnShootingStar(0xa5b4fc, true), 380);

            playCelestialChime(880, 'triangle');

            if (window.confetti) {
                window.confetti({
                    particleCount: 60,
                    spread: 70,
                    origin: { y: 0.8 },
                    colors: ['#ffd700', '#ff85a2', '#a5b4fc', '#ffffff']
                });
            }

            const wishQuotes = [
                "¡Tu deseo ha sido grabado en las estrellas! ✨ Que nuestro amor siga creciendo cada día más fuerte y hermoso.",
                "Un deseo para nosotros: que nunca nos falten las risas, los abrazos eternos y este amor tan puro. 💖",
                "Las estrellas han escuchado tu deseo: Daniela y Mayckol, un amor sin final. 💫",
                "¡Deseo concedido por el cosmos! Prometo amarte, cuidarte y hacerte sonreír cada día de mi vida. 🌹",
                "Si pudiera pedir un deseo a cada estrella del universo, en todas pediría volver a elegirte a ti. 💍"
            ];
            const randomWish = wishQuotes[Math.floor(Math.random() * wishQuotes.length)];
            setTimeout(() => {
                showGalaxyModal(randomWish, "DESEO CONCEDIDO", "Para mi amor", "glowingStar");
            }, 550);
        };
    }

    // 20 NODOS ORBITALES CON EMOJIS 3D FLUENT
    const orbitItems = [
        { text: "TE AMO",                  icon: EMOJI_MAP.sparklingHeart, key: "sparklingHeart", message: "Te amo hoy más que ayer, pero no más de lo que te amaré mañana. Eres mi vida entera." },
        { text: "INFINITO ∞",              icon: EMOJI_MAP.sparkle,       key: "sparkle",        message: "Nuestro amor no tiene fin, como el universo que nos rodea. Siempre, para siempre." },
        { text: "AMOR ETERNO",             icon: EMOJI_MAP.milkyWay,      key: "milkyWay",       message: "Desde el primer día supe que lo nuestro era para toda la vida. Un amor que no termina." },
        { text: "MI PRINCESA",             icon: EMOJI_MAP.crown,         key: "crown",          message: "Eres la princesa de mi corazón y la reina de mi mundo. Nadie te iguala." },
        { text: "SIEMPRE JUNTOS",          icon: EMOJI_MAP.ring,          key: "ring",           message: "De tu mano quiero enfrentar cada amanecer, cada tormenta y cada momento de esta vida." },
        { text: "MI TODO",                 icon: EMOJI_MAP.glowingStar,   key: "glowingStar",    message: "No sé si existe la felicidad completa, pero yo soy completamente feliz desde que te tengo a mi lado." },
        { text: "PARA SIEMPRE",            icon: EMOJI_MAP.planet,        key: "planet",         message: "Si me dieran tres deseos, tres veces pediría volver a encontrarte en esta vida y en las siguientes." },
        { text: "Empanadita",              icon: EMOJI_MAP.dumpling,      key: "dumpling",       message: "El apodo que te puse y el que te diré con todo mi cariño hasta el último de nuestros días." },
        { text: "Tú y Yo",                 icon: EMOJI_MAP.twoHearts,     key: "twoHearts",      message: "Tú y yo. Mi frase favorita para el resto de mi vida." },
        { text: "Mi Mayor Tesoro",         icon: EMOJI_MAP.sparkle,       key: "sparkle",        message: "Cada vez que sonríes, siento que el mundo entero brilla un poco más." },
        { text: "Reina de mi Mundo",       icon: EMOJI_MAP.crown,         key: "crown",          message: "Eres la reina de mi corazón. Mereces todo el amor del universo y más." },
        { text: "Flor Única",              icon: EMOJI_MAP.rose,          key: "rose",           message: "Como una rosa, eres hermosa, única e inigualable. Gracias por existir en mi vida." },
        { text: "Flechazo Eterno",         icon: EMOJI_MAP.arrowHeart,    key: "arrowHeart",     message: "Desde el momento en que te conocí, mi corazón supo que eras tú. Solo tú." },
        { text: "MI UNIVERSO",             icon: EMOJI_MAP.planet,        key: "planet",         message: "Eres el centro de mi universo, la estrella más brillante de mi cielo. Todo gira a tu alrededor." },
        { text: "MI ESTRELLA",             icon: EMOJI_MAP.star,          key: "star",           message: "Cuando miro las estrellas, pienso en ti. Pero ninguna de ellas se compara con tu luz." },
        { text: "LUZ DE MI VIDA",          icon: EMOJI_MAP.sun,           key: "sun",            message: "Eres la razón por la que mi mundo brilla cada día. Mi luz y mi esperanza." },
        { text: "MI DESTINO",              icon: EMOJI_MAP.compass,       key: "compass",        message: "Contigo descubrí que el amor no es solo un sentimiento, es un refugio y un lugar seguro." },
        { text: "ALMAS GEMELAS",           icon: EMOJI_MAP.crystalBall,   key: "crystalBall",    message: "A veces pienso que la vida es un conjunto de coincidencias mágicas, y la más hermosa fue encontrarte." },
        { text: "ME ENCANTA ESTAR CONTIGO", icon: EMOJI_MAP.smileHearts,   key: "smileHearts",    message: "Contigo los días son más brillantes y los problemas se sienten más pequeños. Gracias por todo." },
        { text: "TE ADORO",                icon: EMOJI_MAP.redHeart,      key: "redHeart",       message: "Contigo aprendí lo que es el amor real. Eres mi calma en medio del caos y mi lugar seguro." }
    ];

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
            if (data.text.includes('AMOR') || data.text.includes('AMO') || data.text.includes('ADORO')) {
                el.classList.add('highlight-love');
            }

            el.innerHTML = `
                <img src="${data.icon}" alt="${data.text}" class="node-icon-3d">
                <span class="node-label">${data.text}</span>
            `;

            const nodeObj = {
                el,
                radius: tier.radius,
                angle: baseAngle,
                speed: tier.speed,
                phase: Math.random() * Math.PI * 2,
                isHovered: false
            };

            el.addEventListener('mouseenter', () => { nodeObj.isHovered = true; });
            el.addEventListener('mouseleave', () => { nodeObj.isHovered = false; });
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                showGalaxyModal(data.message, "MENSAJE CELESTIAL", data.text, data.key);
            });

            nodesLayer.appendChild(el);
            activeNodes.push(nodeObj);
        }
    });

    // Partículas al dar clic
    function createClickHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'cosmic-click-heart';
        const emojis = ['💖', '💕', '❤️', '✨', '💗', '💘', '💓'];
        heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        const dx = (Math.random() - 0.5) * 50;
        const rot = (Math.random() - 0.5) * 40;
        heart.style.setProperty('--dx', dx + 'px');
        heart.style.setProperty('--rot', rot + 'deg');
        document.body.appendChild(heart);
        setTimeout(() => {
            if (heart && heart.parentNode) heart.parentNode.removeChild(heart);
        }, 980);
    }

    // Interacción de arrastre
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
        if (!e.target.closest('#galaxyModal') && !e.target.closest('.wish-button')) {
            createClickHeart(e.clientX, e.clientY);
        }

        if (e.target.closest('.galaxy-node') || e.target.closest('.wish-button')) return;
        isDragging = true;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
        rotVelX = 0;
        rotVelY = 0;

        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left - rect.width / 2;
        const clickY = e.clientY - rect.top - rect.height / 2;
        const distToCenter = Math.sqrt(clickX * clickX + clickY * clickY);
        if (distToCenter < 70) {
            extraHeartBeat = 1.0;
            setTimeout(() => {
                showGalaxyModal(
                    "Daniela, eres el centro de todo mi universo. No importa cuántos millones de estrellas existan en el cosmos, ninguna brilla con la luz, la ternura y la magia con la que brillas tú para mí. Cada latido de mi corazón te pertenece. ❤️✨",
                    "EL CORAZÓN DEL COSMOS",
                    "Para Daniela",
                    "sparklingHeart"
                );
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

        if (!isDragging) {
            targetRotY += 0.0016;
            rotVelX *= 0.94;
            rotVelY *= 0.94;
            targetRotX += rotVelX;
            targetRotY += rotVelY;
        }

        mouseParallaxX += (targetParallaxX - mouseParallaxX) * 0.05;
        mouseParallaxY += (targetParallaxY - mouseParallaxY) * 0.05;

        galaxyGroup.rotation.y += (targetRotY + mouseParallaxX - galaxyGroup.rotation.y) * 0.06;
        galaxyGroup.rotation.x += (targetRotX + mouseParallaxY - galaxyGroup.rotation.x) * 0.06;

        spiralMesh.rotation.y += 0.0022;
        ringMesh.rotation.y += 0.0015;

        const beatCycle = (elapsedTime * 2.2) % (Math.PI * 2);
        const naturalBeat = Math.pow(Math.sin(beatCycle), 12) * 0.13 + Math.pow(Math.sin(beatCycle - 0.35), 12) * 0.07;
        extraHeartBeat *= 0.94;
        const heartBeat = naturalBeat + extraHeartBeat * 0.25;

        const currentScale = 1 + heartBeat;
        heartMesh.scale.set(currentScale, currentScale, currentScale);

        const nebScale = 250 * (1 + heartBeat * 0.5);
        nebulaSprite.scale.set(nebScale, nebScale, 1);
        nebulaMaterial.opacity = 0.65 + heartBeat * 0.35;

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

        const cWidth = container.clientWidth || window.innerWidth;
        const cHeight = container.clientHeight || window.innerHeight;

        for (let i = 0; i < activeNodes.length; i++) {
            const node = activeNodes[i];
            
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
// 9. RAZONES (SWIPER COVERFLOW 3D Y AUDIO BESPOKE)
// ==========================================
function initReasons() {
    const rCanvas = document.getElementById('bg-canvas-razones');
    if (rCanvas) {
        const rCtx = rCanvas.getContext('2d');
        rCanvas.width = window.innerWidth;
        rCanvas.height = window.innerHeight;
        const words = ["My Love", "Te Amo", "Para Daniela", "Mi Vida", "Para Ti", "Siempre", "Amor Eterno"];
        const fontSize = 13;
        const columnSpacing = 32;
        const columns = Math.floor(rCanvas.width / columnSpacing) + 1;
        const drops = [];
        for (let x = 0; x < columns; x++) { drops[x] = Math.random() * -100; }

        function drawRazonesRain() {
            rCtx.fillStyle = 'rgba(21, 9, 32, 0.22)';
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
                drops[i] += 0.55;
            }
        }
        setInterval(drawRazonesRain, 50);

        window.addEventListener('resize', () => {
            rCanvas.width = window.innerWidth;
            rCanvas.height = window.innerHeight;
        });
    }

    const reasonsData = [
        {
            num: "01",
            icon: EMOJI_MAP.smile,
            title: 'Tu Sonrisa',
            desc: 'Ilumina hasta mis días más oscuros sin siquiera proponérselo.',
            img: 'https://drive.google.com/thumbnail?id=15vTLDD3PDTEorSbTJguHkzeXF0ltqNdf&sz=w1000'
        },
        {
            num: "02",
            icon: EMOJI_MAP.eyes,
            title: 'Tu Mirada',
            desc: 'Donde me pierdo y me encuentro al mismo tiempo.',
            img: 'https://drive.google.com/thumbnail?id=198bsT2VWE4KZJiM-IgnKbzXYwfRWSP9j&sz=w1000'
        },
        {
            num: "03",
            icon: EMOJI_MAP.microphone,
            title: 'Tu Voz',
            desc: 'El sonido favorito de mi vida, siempre.',
            audio: 'assets/audio/voz.ogg'
        },
        {
            num: "04",
            icon: EMOJI_MAP.bolt,
            title: 'Tu Fuerza',
            desc: 'Eres más valiente de lo que crees, y eso me inspira cada día.',
            img: 'https://drive.google.com/thumbnail?id=1w-g7i7xeeavmWe3eYkesbh7q9HPk_hFC&sz=w1000'
        },
        {
            num: "05",
            icon: EMOJI_MAP.ring,
            title: 'Nosotros',
            desc: 'Tú y yo. Lo más bonito que tengo en este mundo.',
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
                <div class="love-tile-photo-wrap">
                    <img src="${r.img}" alt="${r.title}">
                    <div class="love-tile-caption-overlay">
                        ${r.desc}
                    </div>
                </div>`;
        } else if (r.audio) {
            backContent = `
                <div class="custom-voice-player" id="voice-player-container">
                    <div class="voice-mic-badge">
                        <img src="${EMOJI_MAP.microphone}" alt="mic" class="voice-mic-3d">
                    </div>
                    <div class="voice-desc-text">${r.desc}</div>
                    
                    <div class="voice-waveform-wrap">
                        <span class="voice-wave-bar"></span>
                        <span class="voice-wave-bar"></span>
                        <span class="voice-wave-bar"></span>
                        <span class="voice-wave-bar"></span>
                        <span class="voice-wave-bar"></span>
                        <span class="voice-wave-bar"></span>
                        <span class="voice-wave-bar"></span>
                    </div>

                    <button class="voice-play-trigger-btn" id="voice-play-btn" type="button" title="Escuchar tu voz">
                        ▶
                    </button>
                    
                    <span class="voice-time-display" id="voice-time">0:00</span>
                    <audio id="dedicated-voice-audio" src="${r.audio}" preload="auto"></audio>
                </div>`;
        }

        card.innerHTML = `
            <div class="love-tile-inner">
                <div class="love-tile-face love-tile-front">
                    <span class="love-tile-num-badge">#${r.num}</span>
                    <div class="love-tile-icon-wrap">
                        <img src="${r.icon}" alt="${r.title}" class="love-tile-3d-img">
                    </div>
                    <div>
                        <div class="love-tile-title">${r.title}</div>
                        <div class="love-tile-tap-hint">
                            <span>Toca para ver</span>
                            <img src="${EMOJI_MAP.sparkle}" alt="sparkle" style="width:14px;height:14px;vertical-align:middle;">
                        </div>
                    </div>
                </div>
                <div class="love-tile-face love-tile-back">
                    ${backContent}
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('#voice-play-btn') || e.target.closest('audio')) return;
            allCards.forEach(c => {
                if (c !== card) c.classList.remove('flipped');
            });
            card.classList.toggle('flipped');
        });

        allCards.push(card);
        slide.appendChild(card);
        swiperWrapper.appendChild(slide);
    });

    // Configurar reproductor de voz bespoke
    setTimeout(() => {
        const vBtn = document.getElementById('voice-play-btn');
        const vAudio = document.getElementById('dedicated-voice-audio');
        const vTime = document.getElementById('voice-time');
        const vContainer = document.getElementById('voice-player-container');

        if (vBtn && vAudio) {
            vBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (vAudio.paused) {
                    vAudio.play();
                    vBtn.innerHTML = '⏸';
                    if (vContainer) vContainer.classList.add('playing');
                } else {
                    vAudio.pause();
                    vBtn.innerHTML = '▶';
                    if (vContainer) vContainer.classList.remove('playing');
                }
            });

            vAudio.addEventListener('timeupdate', () => {
                if (vTime) vTime.textContent = formatSeconds(vAudio.currentTime);
            });

            vAudio.addEventListener('ended', () => {
                vBtn.innerHTML = '▶';
                if (vContainer) vContainer.classList.remove('playing');
                if (vTime) vTime.textContent = "0:00";
            });
        }
    }, 200);

    new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 22,
            stretch: 0,
            depth: 170,
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
// 10. CARTA (PERGAMINO Y MÁQUINA DE ESCRIBIR)
// ==========================================
const cartaMessage = "Para el amor de mi vida, mi empanadita ❤️\n\nMi amor, hoy cumplimos un año juntos: un año desde que comenzó esta historia tan bonita que hemos ido construyendo los dos. Y aunque un año pueda parecer poco para algunas personas, para mí significa muchísimo, porque en este tiempo he tenido la oportunidad de conocerte más, de compartir momentos inolvidables contigo y de darme cuenta de lo verdaderamente especial que eres para mí.\n\nGracias por cada sonrisa, cada abrazo, cada beso, cada conversación y cada instante que hemos vivido juntos. Gracias también por quedarte a mi lado, incluso cuando las cosas no han sido fáciles. Sé que una relación no siempre es perfecta, que existen días bonitos y otros complicados, pero creo que lo verdaderamente importante es lo que sentimos y las ganas que tenemos de seguir construyendo algo hermoso juntos.\n\nNo sé qué nos tenga preparado el futuro, pero sí sé que hoy estoy completamente feliz de tenerte conmigo y de poder celebrar este primer añito a tu lado.\n\nFeliz primer aniversario, mi niña hermosa. Te amo con todo mi corazón. ❤️";

let activeTypewriterId = 0;
let cartaTimeout = null;

function typeCartaText() {
    activeTypewriterId++;
    const currentRunId = activeTypewriterId;

    if (cartaTimeout) {
        clearTimeout(cartaTimeout);
        cartaTimeout = null;
    }

    const el = document.getElementById('carta-text');
    if (!el) return;
    el.innerHTML = '';

    let i = 0;

    function step() {
        if (currentRunId !== activeTypewriterId) return;

        if (i < cartaMessage.length) {
            const char = cartaMessage.charAt(i);
            if (char === '\n') {
                el.appendChild(document.createElement('br'));
            } else {
                el.appendChild(document.createTextNode(char));
            }
            i++;
            cartaTimeout = setTimeout(step, 24);
        } else {
            cartaTimeout = null;
            parseEmojis(el);
        }
    }

    cartaTimeout = setTimeout(step, 200);
}

// Sello de cera interactivo
const waxSealBtn = document.getElementById('wax-seal-btn');
if (waxSealBtn) {
    waxSealBtn.addEventListener('click', () => {
        playCelestialChime(659.25, 'triangle');
        if (window.confetti) {
            window.confetti({
                particleCount: 50,
                spread: 65,
                origin: { y: 0.35 },
                colors: ['#e11d48', '#ff85a2', '#ffffff']
            });
        }
        showToast("¡Carta abierta con todo mi amor! 💌");
        typeCartaText();
    });
}

// Botones de acción de la carta
const btnReplayCarta = document.getElementById('btn-replay-carta');
if (btnReplayCarta) {
    btnReplayCarta.addEventListener('click', () => {
        playCelestialChime(587.33, 'sine');
        typeCartaText();
    });
}

const btnCopyCarta = document.getElementById('btn-copy-carta');
if (btnCopyCarta) {
    btnCopyCarta.addEventListener('click', () => {
        navigator.clipboard.writeText(cartaMessage).then(() => {
            showToast("¡Carta copiada con todo mi amor! 📋💕");
            if (window.confetti) {
                window.confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { y: 0.7 },
                    colors: ['#ff85a2', '#ffffff']
                });
            }
        }).catch(() => {
            showToast("No se pudo copiar automáticamente.");
        });
    });
}

// Efecto de corazones al dar clic en cualquier parte de la pantalla
document.addEventListener('click', (e) => {
    if (!isUnlocked) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('#galaxyThreeCanvas')) return;

    const heart = document.createElement('div');
    heart.className = 'cosmic-click-heart';
    const emojis = ['💖', '💕', '❤️', '✨', '💗', '💘'];
    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    const dx = (Math.random() - 0.5) * 45;
    const rot = (Math.random() - 0.5) * 35;
    heart.style.setProperty('--dx', dx + 'px');
    heart.style.setProperty('--rot', rot + 'deg');
    document.body.appendChild(heart);
    setTimeout(() => {
        if (heart && heart.parentNode) heart.parentNode.removeChild(heart);
    }, 980);
});

// Parsear emojis en el documento inicial
document.addEventListener('DOMContentLoaded', () => {
    parseEmojis(document.body);
});
