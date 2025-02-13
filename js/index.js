
const MAX_LIFECOUNT = 3;
const MIN_LIFECOUNT = 0;

const numerito_input = document.getElementById('numero');
const vidas_div = document.getElementById('life-counter');
const alert_div = document.getElementById('alerts');
const restart_btn = document.getElementById('restart-game-btn');

const lang_elements = document.querySelectorAll('[data-lang-key]');
const lang_buttons = document.querySelectorAll('button[data-lang]');

let numerito_value = "";
let secret_number;
let current_lifecount = 0;
let game_done = false;


window.onload = () => {

    // Inicializamos el juego
    restartGame();

    // Botones de idioma
    lang_buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang; // Idioma

            // Recogemos el diccionario correspondiente al idioma seleccionado
            fetch('./lang/' + lang + '.json').then((response) => response.json()).then((lang_data) => {
                applyLanguage(lang_data);
            });

        });
    })

    // Input del juego
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

    // Botón de reiniciar
    restart_btn.addEventListener('click', function (e) {
        restartGame();
    })
}

function checkResult(value) {
    // Ocultar todos los mensajes
    alert_div.querySelectorAll(':scope > div').forEach((child) => child.style.display = "none");
    alert_div.querySelectorAll(':scope > div > span.curr_number').forEach((span) => span.innerHTML = value); // Mostrar valor actual

    // Actualizar valor del "lifecount" y el mensaje
    if (value == secret_number || --current_lifecount == 0) {
        game_done = true;
        alert_div.querySelectorAll(current_lifecount > 0 ? '.congrats' : '.lost').forEach((elem) => elem.style.display = "block");
    }
    else alert_div.querySelector(value > secret_number ? '.smaller' : '.bigger').style.display = "block";

    // Actualizar elemento visual
    vidas_div.setAttribute('lifecount', current_lifecount);
}

function restartGame() {
    // Recalculamos el número secreto
    secret_number = Math.floor((Math.random() * 10) + 1);

    // Reinicamos los valores
    numerito_input.value = "";
    game_done = false;
    current_lifecount = 3;
    vidas_div.setAttribute('lifecount', current_lifecount);

    // Ocultamos todos los mensajes de "alerta"
    alert_div.querySelectorAll(':scope > div').forEach((child) => child.style.display = "none");
    alert_div.querySelectorAll(':scope > div > span.s_number').forEach((span) => span.innerHTML = secret_number);

    // Rehabilitamos el input
    numerito_input.disabled = false;
    numerito_input.value = numerito_value = "";
    numerito_input.focus();
}

function applyLanguage(lang_data) {
    // Comprobamos que el diccionario sea válido
    if (typeof lang_data !== 'object' || lang_data === null) {
        console.error('Invalid language data');
        return;
    }

    // Recorremos todos los elementos con "data-lang-key"
    lang_elements.forEach((elem) => {
        const key = elem.dataset.langKey;
        const keys = key.split('.');
        let value = lang_data;

        // Accedemos a los valores anidados
        keys.forEach((k) => {
            value = value[k];
        });

        if (elem.tagName == "INPUT") elem.placeholder = value;
        else elem.innerHTML = value;
    });

    restartGame();
}