// ==========================================
// UNIVERSO CÓSMICO 3D (INTERACTIVO Y FLUIDO)
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
                angle: baseAngle,
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
                spawnShootingStar();
                if (Math.random() < 0.35) {
                    setTimeout(() => {
                        spawnShootingStar(null, Math.random() > 0.5);
                    }, 260);
                }
            }, 1700);
        }
    };
}
