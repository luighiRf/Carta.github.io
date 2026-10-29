// global.js - Efecto corazones flotantes globales
const canvasHearts = document.getElementById('heartsCanvas');
if (canvasHearts) {
    const ctxHearts = canvasHearts.getContext('2d');
    canvasHearts.width = window.innerWidth;
    canvasHearts.height = window.innerHeight;

    let heartsList = [];
    const heartEmojis = ['♥', '♡', '✧', '💕', '💖'];

    function initHearts() {
        heartsList = [];
        for(let i=0; i<60; i++) {
            heartsList.push({
                x: Math.random() * canvasHearts.width,
                y: Math.random() * canvasHearts.height,
                size: Math.random() * 15 + 10,
                speed: Math.random() * 1.5 + 0.5,
                drift: Math.random() * 2 - 1,
                char: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }
    initHearts();

    function drawFloatingHearts() {
        ctxHearts.clearRect(0, 0, canvasHearts.width, canvasHearts.height); 
        for (let i = 0; i < heartsList.length; i++) {
            let p = heartsList[i];
            ctxHearts.fillStyle = `rgba(255, 133, 162, ${p.alpha})`;
            ctxHearts.font = p.size + 'px Outfit';
            ctxHearts.shadowBlur = 10;
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
        canvasHearts.width = window.innerWidth;
        canvasHearts.height = window.innerHeight;
        initHearts();
    });
}

// ==========================================
// GLOBAL MUSIC PLAYER WITH FULL CONTROLS
// Persiste entre páginas con sessionStorage
// ==========================================
(function initMusicPlayer() {
    const playlist = [
        { src: 'assets/audio/milo_j_mai.mp3', title: 'MILO J — M.A.I' }
    ];
    
    // Leer estado guardado
    let currentTrackIndex = parseInt(sessionStorage.getItem('musicTrack') || '0');
    if (isNaN(currentTrackIndex) || currentTrackIndex >= playlist.length) currentTrackIndex = 0;
    
    const savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');
    const wasPlaying = sessionStorage.getItem('musicPlaying') === 'true';

    let isPlaying = false;

    // Elemento Audio nativo
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = playlist[currentTrackIndex].src;

    // Music wrapper UI
    const musicWrapper = document.createElement('div');
    musicWrapper.id = 'music-wrapper';
    musicWrapper.style.display = 'none';
    
    // Generate playlist HTML
    let playlistHTML = '';
    playlist.forEach((song, index) => {
        playlistHTML += `<div class="playlist-item ${index === currentTrackIndex ? 'active' : ''}" data-index="${index}">♪ ${song.title}</div>`;
    });

    musicWrapper.innerHTML = `
        <div class="music-vinyl" id="music-play-btn"><div class="music-vinyl-center"></div></div>
        
        <div class="music-player-panel">
            <div class="player-header">REPRODUCTOR</div>
            
            <div class="track-title" id="track-title-display">${playlist[currentTrackIndex].title}</div>
            
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
                ${playlistHTML}
            </div>
        </div>
    `;
    document.body.appendChild(musicWrapper);

    // CSS
    const style = document.createElement('style');
    style.textContent = `
        #music-wrapper {
            position: fixed;
            bottom: 90px;
            right: 22px;
            z-index: 9000;
            display: flex;
            align-items: center;
        }
        .music-vinyl {
            cursor: pointer;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: conic-gradient(#ff758c 0%, #ff85a2 25%, #ffc3a0 50%, #ffafbd 75%, #ff758c 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(255, 133, 162, 0.5);
            box-shadow: 0 0 18px rgba(255, 133, 162, 0.4);
            transition: all 0.3s ease;
            position: relative;
            z-index: 2;
        }
        .music-vinyl:hover {
            box-shadow: 0 0 30px rgba(255, 42, 117, 0.8);
            border-color: #ff2a75;
            transform: scale(1.1);
        }
        #music-wrapper.playing .music-vinyl {
            animation: spinVinyl 3s linear infinite;
            box-shadow: 0 0 25px rgba(255, 0, 60, 0.6);
            border-color: #ff2a75;
        }
        @keyframes spinVinyl {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
        }
        .music-vinyl-center {
            width: 11px;
            height: 11px;
            border-radius: 50%;
            background: #0a0010;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .music-player-panel {
            position: absolute;
            right: 25px; 
            bottom: 0;
            transform: scale(0.9);
            transform-origin: right bottom;
            background: rgba(32, 17, 44, 0.96);
            border: 1px solid rgba(255, 133, 162, 0.35);
            border-radius: 20px;
            width: 270px;
            padding: 15px;
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 15px 40px rgba(0,0,0,0.9);
            z-index: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            backdrop-filter: blur(15px);
        }
        .music-player-panel::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            right: -30px;
            width: 30px;
        }
        #music-wrapper:hover .music-player-panel {
            opacity: 1;
            pointer-events: auto;
            right: 65px; 
            transform: scale(1);
        }
        
        .player-header {
            font-family: 'Outfit', sans-serif;
            font-size: 0.65rem;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: center;
        }
        
        .track-title {
            font-family: 'Outfit', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #ff85a2;
            text-shadow: 0 0 10px rgba(255,133,162,0.4);
        }
        
        /* Progress Bar */
        .player-progress {
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: 'Outfit', sans-serif;
            font-size: 0.7rem;
            color: rgba(255,255,255,0.6);
        }
        #progress-bar {
            flex-grow: 1;
            -webkit-appearance: none;
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            outline: none;
            cursor: pointer;
        }
        #progress-bar::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ff2a75;
            box-shadow: 0 0 10px #ff2a75;
            cursor: pointer;
            transition: transform 0.2s;
        }
        #progress-bar::-webkit-slider-thumb:hover {
            transform: scale(1.4);
        }
        
        /* Controls */
        .player-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-bottom: 5px;
        }
        .ctrl-btn {
            background: transparent;
            border: none;
            color: #fff;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.2s;
            opacity: 0.7;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .ctrl-btn:hover {
            opacity: 1;
            color: #ff2a75;
            transform: scale(1.1);
        }
        .play-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #ff2a75;
            color: #fff;
            opacity: 1;
            box-shadow: 0 0 15px rgba(255,42,117,0.5);
        }
        .play-btn:hover {
            background: #fff;
            color: #ff2a75;
            box-shadow: 0 0 25px rgba(255,255,255,0.7);
        }
        
        /* Playlist container */
        .playlist-container {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 10px;
            max-height: 140px;
            overflow-y: auto;
        }
        
        /* Scrollbar for playlist */
        .playlist-container::-webkit-scrollbar { width: 4px; }
        .playlist-container::-webkit-scrollbar-track { background: transparent; }
        .playlist-container::-webkit-scrollbar-thumb { background: rgba(255,42,117,0.3); border-radius: 4px; }
        
        .playlist-item {
            font-family: 'Outfit', sans-serif;
            font-size: 0.75rem;
            color: rgba(255,255,255,0.7);
            padding: 8px 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 2px;
        }
        .playlist-item:hover {
            background: rgba(255,42,117,0.15);
            color: #fff;
        }
        .playlist-item.active {
            color: #ff2a75;
            background: rgba(255,42,117,0.1);
            font-weight: 600;
            border-left: 2px solid #ff2a75;
        }
    `;
    document.head.appendChild(style);

    // Logic
    const progressBar = document.getElementById('progress-bar');
    const timeCurrent = document.getElementById('time-current');
    const timeTotal = document.getElementById('time-total');
    const ctrlPlay = document.getElementById('ctrl-play');
    const titleDisplay = document.getElementById('track-title-display');

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ":" + (s < 10 ? "0" + s : s);
    }

    function updateProgressBarColor() {
        const val = progressBar.value;
        progressBar.style.background = `linear-gradient(to right, #ff2a75 ${val}%, rgba(255,255,255,0.1) ${val}%)`;
    }

    function updateProgress() {
        if (!audio.duration || isNaN(audio.duration)) return;
        const cur = audio.currentTime || 0;
        const dur = audio.duration || 0;
        if (dur > 0) {
            progressBar.value = (cur / dur) * 100;
            updateProgressBarColor();
            timeCurrent.textContent = formatTime(cur);
            timeTotal.textContent = formatTime(dur);
        }
    }

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
        if (savedTime > 0 && savedTime < audio.duration) {
            audio.currentTime = savedTime;
        }
        timeTotal.textContent = formatTime(audio.duration);
        updateProgress();
    });

    audio.addEventListener('ended', () => {
        if (playlist.length === 1) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        } else {
            playTrack((currentTrackIndex + 1) % playlist.length);
        }
    });

    progressBar.addEventListener('input', (e) => {
        updateProgressBarColor();
        if (audio.duration) {
            const seekTime = (e.target.value / 100) * audio.duration;
            timeCurrent.textContent = formatTime(seekTime);
        }
    });

    progressBar.addEventListener('change', (e) => {
        updateProgressBarColor();
        if (audio.duration) {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    });

    function saveState() {
        try {
            sessionStorage.setItem('musicTime', audio.currentTime || '0');
            sessionStorage.setItem('musicPlaying', isPlaying ? 'true' : 'false');
            sessionStorage.setItem('musicTrack', currentTrackIndex);
        } catch(e) {}
    }

    function hookNavButtons() {
        document.querySelectorAll('.nav-btn, a').forEach(btn => {
            btn.addEventListener('click', saveState);
        });
    }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', hookNavButtons); } 
    else { setTimeout(hookNavButtons, 300); }
    window.addEventListener('beforeunload', saveState);

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            musicWrapper.classList.remove('playing');
            ctrlPlay.innerHTML = '▶';
        } else {
            audio.play().then(() => {
                isPlaying = true;
                musicWrapper.classList.add('playing');
                ctrlPlay.innerHTML = '⏸';
            }).catch(err => {
                console.warn("Audio play prevented:", err);
            });
        }
        saveState();
    }

    document.getElementById('music-play-btn').addEventListener('click', togglePlay);
    ctrlPlay.addEventListener('click', togglePlay);

    document.getElementById('ctrl-prev').addEventListener('click', () => {
        if (playlist.length === 1) {
            audio.currentTime = 0;
            if (!isPlaying) togglePlay();
            return;
        }
        let prev = currentTrackIndex - 1;
        if (prev < 0) prev = playlist.length - 1;
        playTrack(prev);
    });

    document.getElementById('ctrl-next').addEventListener('click', () => {
        if (playlist.length === 1) {
            audio.currentTime = 0;
            if (!isPlaying) togglePlay();
            return;
        }
        let next = (currentTrackIndex + 1) % playlist.length;
        playTrack(next);
    });

    function playTrack(index) {
        currentTrackIndex = index;
        audio.src = playlist[currentTrackIndex].src;
        titleDisplay.textContent = playlist[currentTrackIndex].title;
        progressBar.value = 0;
        timeCurrent.textContent = "0:00";
        updateProgressBarColor();

        document.querySelectorAll('.playlist-item').forEach(item => {
            if (parseInt(item.dataset.index) === index) item.classList.add('active');
            else item.classList.remove('active');
        });

        audio.play().then(() => {
            isPlaying = true;
            musicWrapper.classList.add('playing');
            ctrlPlay.innerHTML = '⏸';
        }).catch(e => console.warn(e));

        saveState();
    }

    document.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.index);
            if (idx !== currentTrackIndex) playTrack(idx);
            else if (!isPlaying) togglePlay();
        });
    });

    // Auto-resume si estaba reproduciendo
    if (wasPlaying) {
        audio.play().then(() => {
            isPlaying = true;
            musicWrapper.classList.add('playing');
            ctrlPlay.innerHTML = '⏸';
        }).catch(() => {
            const resumeOnInteraction = () => {
                if (wasPlaying && !isPlaying) {
                    audio.play().then(() => {
                        isPlaying = true;
                        musicWrapper.classList.add('playing');
                        ctrlPlay.innerHTML = '⏸';
                    }).catch(() => {});
                }
                window.removeEventListener('click', resumeOnInteraction);
                window.removeEventListener('keydown', resumeOnInteraction);
                window.removeEventListener('touchstart', resumeOnInteraction);
            };
            window.addEventListener('click', resumeOnInteraction);
            window.addEventListener('keydown', resumeOnInteraction);
            window.addEventListener('touchstart', resumeOnInteraction);
        });
    }

    // Pausar música global si otro audio en la página empieza a sonar (ej. notas de voz)
    document.addEventListener('play', (e) => {
        if (e.target !== audio && isPlaying) {
            togglePlay();
        }
    }, true);
})();

