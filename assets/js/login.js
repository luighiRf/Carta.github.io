const canvasMatrix = document.getElementById('matrixCanvas');
const ctxMatrix = canvasMatrix.getContext('2d');
canvasMatrix.width = window.innerWidth;
canvasMatrix.height = window.innerHeight;

const charsMatrix = 'PERSONA1PERSONA2AMOR♥♡✧*'.split('');
const fontMatrix = 16;
const columnsMatrix = canvasMatrix.width / fontMatrix;
const dropsMatrix = [];

for (let x = 0; x < columnsMatrix; x++) {
    dropsMatrix[x] = 1;
}

function drawMatrix() {
    ctxMatrix.fillStyle = 'rgba(25, 15, 35, 0.2)'; // Trail mas suave
    ctxMatrix.fillRect(0, 0, canvasMatrix.width, canvasMatrix.height);

    ctxMatrix.fillStyle = '#ff85a2'; // Lluvia rosa suave
    ctxMatrix.font = fontMatrix + 'px Outfit';
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
setInterval(drawMatrix, 50);

document.getElementById('unlock-btn').addEventListener('click', () => {
    document.getElementById('unlock-screen').style.transform = 'translate(-50%, -60%) scale(0.9)';
    document.getElementById('unlock-screen').style.opacity = '0';
    
    gsap.to('#matrixCanvas', { opacity: 0, duration: 1 });
    
    setTimeout(() => {
        window.location.href = 'inicio.html';
    }, 1000);
});

window.addEventListener('resize', () => {
    canvasMatrix.width = window.innerWidth;
    canvasMatrix.height = window.innerHeight;
});
