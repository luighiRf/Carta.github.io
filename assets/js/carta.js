// ==========================================
// CARTA - MENSAJE TIPO ESCRITURA
// Personaliza este mensaje con tus propias palabras
// ==========================================
const messageToType = "Mi amor,\n\n(Escribe aquí tu carta de amor para esa persona especial. Puedes contarle cómo cambió tu vida desde que la conociste, expresar tus mejores deseos y recordarle lo mucho que significa para ti).\n\nCada día a tu lado es una nueva oportunidad para sonreír y agradecer por tener a alguien tan increíble en mi vida. Gracias por iluminar mis días con tu ternura, tu alegría y tu forma de ser.\n\nGracias por existir y por ser tú.";
let iType = 0;
const speed = 35;
let typewriterTimeout;

function typeWriterEffect() {
    const el = document.getElementById("typewriter-text") || document.getElementById("carta-text");
    if (!el) return;
    
    if (iType < messageToType.length) {
        const char = messageToType.charAt(iType);
        if (char === '\n') {
            el.innerHTML += '<br>';
        } else {
            el.innerHTML += char;
        }
        iType++;
        typewriterTimeout = setTimeout(typeWriterEffect, speed);
    } else {
        el.style.borderRight = "none";
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeWriterEffect, 500);
});
