const galaxyContainer = document.getElementById('galaxy-container');

function showGalaxyModal(text) {
    const modal = document.getElementById('galaxyModal');
    const modalText = document.getElementById('modal-text');
    modalText.innerText = text;
    modal.style.display = 'flex';
    // Small delay to allow display: flex to apply before adding opacity class
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeGalaxyModal() {
    const modal = document.getElementById('galaxyModal');
    modal.classList.remove('show');
    // Wait for transition to finish before hiding
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // 300ms matches css transition
}

// The user can add as many messages as they want here!
const loveMessages = [
    "A veces pienso que la vida es un conjunto de coincidencias mágicas, y la más hermosa de todas fue encontrarte.",
    "Contigo descubrí que el amor no es sólo un sentimiento, sino un refugio y un lugar seguro donde todo tiene sentido.",
    "Me haces sentir en paz, como si el mundo entero se detuviera cuando estoy a tu lado.",
    "Eres mi constante, mi refugio y mi mayor alegría. Cada instante contigo es un tesoro en mi corazón.",
    "Desde que llegaste a mi vida, todo tomó un nuevo sentido. Contigo los días son más brillantes.",
    "Contigo he aprendido a amar de verdad. No quiero arrepentirme de nada, quiero vivir cada momento a tu lado.",
    "Amar no es mirarnos el uno al otro, es mirar juntos en la misma dirección. Y yo quiero mirar el futuro contigo.",
    "Te amo hoy más que ayer, pero no más de lo que te amaré mañana. Eres mi vida entera.",
    "No sé si existe la felicidad completa, pero yo soy completamente feliz desde que te tengo a mi lado.",
    "Eres la razón por la que mi mundo brilla cada día. Eres mi luz y mi universo entero.",
    "Contigo aprendí lo que es el amor real; eres mi calma en medio del caos y mi lugar seguro.",
    "Tú y yo. No necesito otra frase favorita para el resto de mi vida.",
    "Si me dieran tres deseos, tres veces pediría volver a encontrarte en esta vida y en las siguientes.",
    "Eres el sueño que nunca supe que tenía, y ahora que desperté a tu lado, no quiero dormir nunca más sin ti."
];

function initGalaxy() {
    if(!galaxyContainer) return;
    galaxyContainer.innerHTML = '';
    
    // Agujero negro central brillante
    const blackHole = document.createElement('div');
    blackHole.className = 'black-hole';
    galaxyContainer.appendChild(blackHole);
    
    // Corazón 3D de partículas en el centro
    const centerHeart = document.createElement('div');
    centerHeart.className = 'center-galaxy-heart';
    centerHeart.id = 'galaxyHeartCanvas';
    galaxyContainer.appendChild(centerHeart);

    // Textos y emojis que orbitan — cada uno con su propio mensaje al hacer clic
    const orbitItems = [
        { text: "TE AMO",                  message: "Te amo hoy más que ayer, pero no más de lo que te amaré mañana. Eres mi vida entera." },
        { text: "INFINITO ∞",              message: "Nuestro amor no tiene fin, como el universo que nos rodea. Siempre, para siempre." },
        { text: "AMOR ETERNO",             message: "Desde el primer día supe que lo nuestro era para toda la vida. Un amor que no termina." },
        { text: "MI PRINCESA",             message: "Eres la princesa de mi corazón y la reina de mi mundo. Nadie te iguala." },
        { text: "SIEMPRE JUNTOS",          message: "De tu mano quiero enfrentar cada amanecer, cada tormenta y cada momento de esta vida." },
        { text: "MI TODO",                 message: "No sé si existe la felicidad completa, pero yo soy completamente feliz desde que te tengo a mi lado." },
        { text: "PARA SIEMPRE",            message: "Si me dieran tres deseos, tres veces pediría volver a encontrarte en esta vida y en las siguientes." },
        { text: "Empanadita",               message: "El apodo que te puse y el que te diré hasta el último de nuestros días." },
        { text: "👩‍❤️‍👨",               message: "Tú y yo. Mi frase favorita para el resto de mi vida." },
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

    // Crear anillos de texto
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
        
        // Palabras de amor en rojo pasión
        if(item.text.includes('AMOR') || item.text.includes('AMO') || item.text.includes('💘')) {
            label.style.color = '#ff85a2';
            label.style.textShadow = '0 0 15px rgba(255, 133, 162, 0.8), 0 0 30px rgba(255, 175, 189, 0.6)';
            label.style.borderColor = 'rgba(255, 0, 60, 0.3)';
        }

        // Al tocar, muestra el mensaje específico de esa palabra
        label.addEventListener('click', (e) => {
            e.stopPropagation();
            showGalaxyModal(item.message);
        });

        orbitRing.appendChild(label);
        galaxyContainer.appendChild(orbitRing);
    });

    // Crear polvo estelar (cientos de partículas) para formar la galaxia
    for(let i=0; i<350; i++) {
        // Concentrar más partículas en el centro (espiral)
        const radius = 50 + Math.pow(Math.random(), 2) * 450;
        const speed = 10 + (radius / 20) + Math.random() * 10;
        const delay = -Math.random() * 100;
        
        const orbitRing = document.createElement('div');
        orbitRing.className = 'orbit-ring';
        orbitRing.style.width = (radius * 2) + 'px';
        orbitRing.style.height = (radius * 2) + 'px';
        orbitRing.style.border = 'none'; // Polvo no necesita el borde del anillo
        orbitRing.style.animation = `spinRing ${speed}s linear ${delay}s infinite`;

        const dust = document.createElement('div');
        dust.className = 'orbiting-dust';
        const size = Math.random() * 3 + 1;
        dust.style.width = size + 'px';
        dust.style.height = size + 'px';
        dust.style.top = `-${size/2}px`;
        
        // Colores de galaxia TikTok
        const colors = ['#ff85a2', '#ffc3a0', '#ffffff', '#ffafbd', '#e0c3fc'];
        dust.style.background = colors[Math.floor(Math.random() * colors.length)];
        dust.style.boxShadow = `0 0 ${size*2}px ${dust.style.background}`;

        orbitRing.appendChild(dust);
        galaxyContainer.appendChild(orbitRing);
    }
}

initGalaxy();
gsap.from('.galaxy-container', { scale: 0.2, opacity: 0, rotateX: 0, duration: 2.5, ease: "power3.out" });


// ==========================================
// 3D PARTICLE HEART FOR THE GALAXY CENTER
// ==========================================
function initGalaxyThreeHeart() {
    const container = document.getElementById('galaxyHeartCanvas');
    if(!container) return;
    container.innerHTML = ''; 
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 22; 
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Forma perfecta de corazón (Usando la curva estándar de ThreeJS examples)
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

    const particlesCount = 7000; // Muchos pedacitos para rellenar todo
    const particlesGeometry = new THREE.BufferGeometry();
    
    const targetPositions = new Float32Array(particlesCount * 3);
    const currentPositions = new Float32Array(particlesCount * 3);
    const speeds = new Float32Array(particlesCount);
    
    // Obtener geometría de la forma para rellenarla
    const shapeGeometry = new THREE.ShapeGeometry(heartShape);
    const posAttribute = shapeGeometry.attributes.position;
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    
    // Calcular el área de los triángulos para distribuir las partículas uniformemente
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
    
    for(let i = 0; i < particlesCount; i++) {
        // Elegir un triángulo ponderado por su área
        let rArea = Math.random() * totalArea;
        let selectedTri = triangles[0];
        for (let j = 0; j < triangles.length; j++) {
            rArea -= triangles[j].area;
            if (rArea <= 0) {
                selectedTri = triangles[j];
                break;
            }
        }
        
        // Generar un punto aleatorio dentro del triángulo elegido (Esto rellena el corazón)
        let r1 = Math.random();
        let r2 = Math.random();
        if (r1 + r2 > 1) {
            r1 = 1 - r1;
            r2 = 1 - r2;
        }
        const a = 1 - r1 - r2;
        const ptX = a * selectedTri.a.x + r1 * selectedTri.b.x + r2 * selectedTri.c.x;
        const ptY = a * selectedTri.a.y + r1 * selectedTri.b.y + r2 * selectedTri.c.y;
        
        // Generar volumen 3D (Grosor en el eje Z). Usamos distribución normal simple para que sea más gordito en el centro.
        const zThickness = (Math.random() + Math.random() + Math.random() - 1.5) * 2;
        
        const scale = 0.8; 
        const targetX = (ptX - 5) * scale;
        const targetY = -(ptY - 10) * scale; 
        const targetZ = zThickness;
        
        targetPositions[i*3] = targetX;
        targetPositions[i*3+1] = targetY;
        targetPositions[i*3+2] = targetZ;
        
        // Posición Inicial: Formación desde una gran nube alrededor
        const scatterRadius = 80 + Math.random() * 100;
        const scatterAngle = Math.random() * Math.PI * 2;
        currentPositions[i*3] = Math.cos(scatterAngle) * scatterRadius;
        currentPositions[i*3+1] = (Math.random() - 0.5) * 150;
        currentPositions[i*3+2] = Math.sin(scatterAngle) * scatterRadius;
        
        speeds[i] = 0.015 + Math.random() * 0.03;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    
    const material = new THREE.PointsMaterial({ 
        size: 0.15, // Puntos definidos para que se vean los pedacitos separados
        color: 0xffffff, // Pedacitos blancos
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
        
        for(let i=0; i < particlesCount; i++) {
            const speed = speeds[i];
            const dx = targetPositions[i*3] - positions[i*3];
            const dy = targetPositions[i*3+1] - positions[i*3+1];
            const dz = targetPositions[i*3+2] - positions[i*3+2];
            
            positions[i*3] += dx * speed;
            positions[i*3+1] += dy * speed;
            positions[i*3+2] += dz * speed;
            
            if(Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
                pointsReached++;
            }
        }
        particlesGeometry.attributes.position.needsUpdate = true;
        
        if (pointsReached > particlesCount * 0.9) {
            isFormed = true;
        }
        
        const targetRotationX = -mouseY * 0.4;
        const targetRotationY = mouseX * 0.4 + Math.sin(elapsedTime * 0.5) * 0.3;
        
        particlesMesh.rotation.x += (targetRotationX - particlesMesh.rotation.x) * 0.05;
        particlesMesh.rotation.y += (targetRotationY - particlesMesh.rotation.y) * 0.05;
        
        if (isFormed) {
            const beat = Math.pow(Math.sin(elapsedTime * 3), 40); 
            const scale = 1 + beat * 0.15;
            // Destello en rosa pálido/fucsia durante el latido
            material.color.setHex(beat > 0.5 ? 0xff2a75 : 0xffffff);
            particlesMesh.scale.set(scale, scale, scale);
        }
        
        renderer.render(scene, camera);
    }
    animate();
}

setTimeout(initGalaxyThreeHeart, 100);
