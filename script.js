
const MAX_LIFECOUNT = 3;
const MIN_LIFECOUNT = 0;

const numerito_input = document.getElementById('numero');
const vidas_div = document.getElementById('vidas');
const alert_div = document.getElementById('alerts');

let numerito_value = "";
let secret_number;
let current_lifecount = 0;
let game_done = false;


window.onload = () => {
    // numerito_input = document.getElementById('numero');
    // vidas_div = document.getElementById('vidas');
    // alert_div = document.getElementById('alerts');

    restartGame();

    numerito_input.addEventListener('keyup', function (e) {
        this.value = this.value.trim();
        let val = this.value;
        let is_number = !isNaN(val);
        let is_valid = (is_number && val >= 1 && val <= 10);

        // Limpieza de valores incorrectos
        if (is_valid || val == "") numerito_value = val;
        else this.value = numerito_value;

        // Enter (Comprobar resultado)
        if (e.code == "Enter" && is_valid) {
            // Deshabilitamos el input
            numerito_input.disabled = true;

            // Comprobamos el resultado
            checkResult(val);

            if (!game_done) { // Rehabilitamos
                numerito_input.disabled = false;
                numerito_input.value = numerito_value = "";
                numerito_input.focus();
            }
        }

        // Ponemos las vidas
        vidas_div.setAttribute('lifecount', current_lifecount);
    });
}

function checkResult(value) {
    // Ocultar todos los mensajes
    alert_div.querySelectorAll(':scope > div').forEach((child) => child.style.display = "none");
    alert_div.querySelectorAll(':scope > div > span.curr_number').forEach((span) => span.innerHTML = value); // Mostrar valor actual

    // Actualizar valor del "lifecount" y el mensaje
    if (value == secret_number || --current_lifecount == 0) {
        game_done = true;
        alert_div.querySelector(current_lifecount > 0 ? '.congrats' : '.lost').style.display = "block";
    }
    else alert_div.querySelector(value > secret_number ? '.smaller' : '.bigger').style.display = "block";

    // Actualizar elemento visual
    vidas_div.setAttribute('lifecount', current_lifecount);
}

function restartGame() {
    secret_number = Math.floor((Math.random() * 10) + 1);
    numerito_input.value = "";
    game_done = false;
    current_lifecount = 3;
    vidas_div.setAttribute('lifecount', current_lifecount);

    alert_div.querySelectorAll(':scope > div').forEach((child) => child.style.display = "none");
    alert_div.querySelectorAll(':scope > div > span.s_number').forEach((span) => span.innerHTML = secret_number);
}

