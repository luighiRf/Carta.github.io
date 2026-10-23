// ==========================================
// CONFIGURACIÓN DE FECHA DE INICIO / ANIVERSARIO
// En JavaScript los meses van de 0 a 11:
// 0 = Enero, 1 = Feb, 2 = Mar, ..., 11 = Dic
// ==========================================
const startDate = new Date(
    2025, // Año
    9,    // Mes (0 = Enero, 1 = Febrero, ..., 9 = Octubre)
    31,   // Día
    0,
    0,
    0
).getTime();


console.log(
    "Fecha inicial:",
    new Date(startDate)
);


// ==========================================
// CONTADOR
// ==========================================

function updateTime() {

    const now = new Date().getTime();

    let difference = now - startDate;


    // Evitar números negativos
    if (difference < 0) {
        difference = 0;
    }


    // ======================================
    // CALCULAR DIAS TOTALES
    // ======================================

    const days = Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    );


    // ======================================
    // HORAS
    // ======================================

    const hours = Math.floor(

        (
            difference %
            (1000 * 60 * 60 * 24)
        )

        /

        (1000 * 60 * 60)

    );


    // ======================================
    // MINUTOS
    // ======================================

    const minutes = Math.floor(

        (
            difference %
            (1000 * 60 * 60)
        )

        /

        (1000 * 60)

    );


    // ======================================
    // SEGUNDOS
    // ======================================

    const seconds = Math.floor(

        (
            difference %
            (1000 * 60)
        )

        /

        1000

    );


    // ======================================
    // MOSTRAR RESULTADOS
    // ======================================

    const daysElement =
        document.getElementById('days');

    const hoursElement =
        document.getElementById('hours');

    const minutesElement =
        document.getElementById('minutes');

    const secondsElement =
        document.getElementById('seconds');


    if (daysElement) {

        daysElement.innerText =
            days.toString().padStart(2, '0');

    }


    if (hoursElement) {

        hoursElement.innerText =
            hours.toString().padStart(2, '0');

    }


    if (minutesElement) {

        minutesElement.innerText =
            minutes.toString().padStart(2, '0');

    }


    if (secondsElement) {

        secondsElement.innerText =
            seconds.toString().padStart(2, '0');

    }

}


// Ejecutar inmediatamente

updateTime();


// Actualizar cada segundo

setInterval(
    updateTime,
    1000
);


// ==========================================
// CORAZON 3D
// ==========================================

function initThreeHeart() {

    const container =
        document.getElementById('heartCanvas');


    if (!container) {

        console.log(
            "No se encontro heartCanvas"
        );

        return;

    }


    // ======================================
    // ESCENA
    // ======================================

    const scene =
        new THREE.Scene();


    // ======================================
    // CAMARA
    // ======================================

    const camera =
        new THREE.PerspectiveCamera(

            75,

            container.clientWidth /
            container.clientHeight,

            0.1,

            1000

        );


    camera.position.z = 30;


    // ======================================
    // RENDERER
    // ======================================

    const renderer =
        new THREE.WebGLRenderer({

            alpha: true,

            antialias: true

        });


    renderer.setSize(

        container.clientWidth,

        container.clientHeight

    );


    renderer.setPixelRatio(

        Math.min(
            window.devicePixelRatio,
            2
        )

    );


    container.appendChild(

        renderer.domElement

    );


    // ======================================
    // FORMA DEL CORAZON
    // ======================================

    const heartShape =
        new THREE.Shape();


    heartShape.moveTo(
        0,
        -5
    );


    heartShape.bezierCurveTo(

        -5,
        -10,

        -15,
        -5,

        -15,
        5

    );


    heartShape.bezierCurveTo(

        -15,
        12,

        -5,
        18,

        0,
        22

    );


    heartShape.bezierCurveTo(

        5,
        18,

        15,
        12,

        15,
        5

    );


    heartShape.bezierCurveTo(

        15,
        -5,

        5,
        -10,

        0,
        -5

    );


    // ======================================
    // OBTENER PUNTOS
    // ======================================

    const points =
        heartShape.getPoints(100);


    // ======================================
    // PARTICULAS
    // ======================================

    const particlesGeometry =
        new THREE.BufferGeometry();


    const particlesCount =
        800;


    const posArray =
        new Float32Array(

            particlesCount * 3

        );


    for (
        let i = 0;
        i < particlesCount;
        i++
    ) {

        const randIndex =
            Math.floor(

                Math.random() *
                points.length

            );


        const point =
            points[randIndex];


        posArray[i * 3] =

            point.x +

            (Math.random() - 0.5) * 4;


        posArray[i * 3 + 1] =

            -point.y +

            10 +

            (Math.random() - 0.5) * 4;


        posArray[i * 3 + 2] =

            (Math.random() - 0.5) * 10;

    }


    particlesGeometry.setAttribute(

        'position',

        new THREE.BufferAttribute(

            posArray,

            3

        )

    );


    // ======================================
    // MATERIAL
    // ======================================

    const material =
        new THREE.PointsMaterial({

            size: 0.15,

            color: 0xff85a2,

            transparent: true,

            opacity: 0.8,

            blending:
                THREE.AdditiveBlending

        });


    // ======================================
    // CREAR PARTICULAS
    // ======================================

    const particlesMesh =
        new THREE.Points(

            particlesGeometry,

            material

        );


    scene.add(

        particlesMesh

    );


    // ======================================
    // RELOJ
    // ======================================

    const clock =
        new THREE.Clock();


    // ======================================
    // ANIMACION
    // ======================================

    function animate() {

        requestAnimationFrame(
            animate
        );


        const elapsedTime =
            clock.getElapsedTime();


        // Giro lateral

        particlesMesh.rotation.y =

            Math.sin(
                elapsedTime * 0.3
            )

            * 0.5;


        // Giro vertical

        particlesMesh.rotation.x =

            Math.sin(
                elapsedTime * 0.2
            )

            * 0.2;


        // Efecto de latido

        const scale =

            1 +

            Math.sin(
                elapsedTime * 2
            )

            * 0.05;


        particlesMesh.scale.set(

            scale,

            scale,

            scale

        );


        renderer.render(

            scene,

            camera

        );

    }


    animate();


    // ======================================
    // RESPONSIVE
    // ======================================

    window.addEventListener(
        'resize',
        function () {

            const width =
                container.clientWidth;


            const height =
                container.clientHeight;


            if (
                width === 0 ||
                height === 0
            ) {

                return;

            }


            camera.aspect =
                width / height;


            camera.updateProjectionMatrix();


            renderer.setSize(

                width,

                height

            );

        }
    );

}


// ==========================================
// INICIAR CORAZON
// ==========================================

initThreeHeart();