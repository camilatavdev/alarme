const tempoAtual = document.querySelector(".tempo-atual");
const horaInput = document.getElementById("hora-input");
const minutoInput = document.getElementById("minuto-input");
const alarmesAtivos = document.querySelector(".lista-alarmes");
const configurarAlarme = document.getElementById("set");
const limparTudo = document.querySelector(".clear");
const somAlarme = new Audio("./alarm.mp3");

let indexAlarme = 0;
let listaAlarmes = [];
let initialHour = 0;
let initialMinute = 0;
let tempoSoneca = 10;

const appendZero = (value) => (value < 10 ? "0" + value : value);

const displayTimer = () => {
    const date = new Date();
    const currentTime = date.toLocaleTimeString("pt-BR", { hour12: false });
    tempoAtual.textContent = currentTime;

    listaAlarmes.forEach((alarme) => {
        if (alarme.isActive && alarme.time === currentTime.slice(0, 5)) {
            somAlarme.play();
            addBotaoSoneca(alarme);

        }
    });
};

const addBotaoSoneca = (alarme) => {
    const botaoSonecaExistente = document.querySelector(`[data-id="${alarme.id}"] .botaoSoneca`);
    
    if (!botaoSonecaExistente) {
        const botaoSoneca = document.createElement("button");
        botaoSoneca.innerHTML = `<i class="fa-solid fa-clock"></i> Soneca (${alarme.tempoSoneca}min)`;
        botaoSoneca.className = "botaoSoneca";
        botaoSoneca.addEventListener("click", () => alarmeSoneca(alarme));
        document.querySelector(`[data-id="${alarme.id}"]`).appendChild(botaoSoneca);
    }
};

const alarmeSoneca = (alarme) => {
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + alarme.tempoSoneca);

    alarme.time = `${appendZero(currentDate.getHours())}:${appendZero(currentDate.getMinutes())}`;
    atualizarAlarme(alarme);

    alarme.tempoSoneca += 10;

    alert(`Alarme adiado para ${alarme.time}`);
};


const atualizarAlarme = (alarme) => {
    const alarmeDiv = document.querySelector(`[data-id="${alarme.id}"]`);
    alarmeDiv.querySelector("span").textContent = alarme.time;
};


const criarAlarme = (hora, minuto) => {
    indexAlarme += 1;

    const alarmeObj = {
        id: `${indexAlarme}_${hora}_${minuto}`,
        time: `${appendZero(hora)}:${appendZero(minuto)}`,
        isActive: false,
        tempoSoneca: 10 
    };

    listaAlarmes.push(alarmeObj);
    const alarmeDiv = document.createElement("div");
    alarmeDiv.className = "alarme";
    alarmeDiv.dataset.id = alarmeObj.id;
    alarmeDiv.innerHTML = `<span>${alarmeObj.time}</span>`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => alternarAlarme(alarmeObj));
    alarmeDiv.appendChild(checkbox);

    const deletarBotao = document.createElement("button");
    deletarBotao.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deletarBotao.className = "deletarBotao";
    deletarBotao.addEventListener("click", () => deletarAlarme(alarmeObj));
    alarmeDiv.appendChild(deletarBotao);

    alarmesAtivos.appendChild(alarmeDiv);
};

const alternarAlarme = (alarme) => {
    alarme.isActive = !alarme.isActive;
    if (alarme.isActive) {
        const currentTime = new Date().toLocaleTimeString("pt-BR", { hour12: false }).slice(0, 5);
        if (alarme.time === currentTime) {
            somAlarme.play();
        }
    } else {
        somAlarme.pause();
    }
};

const deletarAlarme = (alarme) => {
    const index = listaAlarmes.indexOf(alarme);
    if (index > -1) {
        listaAlarmes.splice(index, 1);
        document.querySelector(`[data-id="${alarme.id}"]`).remove();
    }
};

limparTudo.addEventListener("click", () => {
    listaAlarmes = [];
    alarmesAtivos.innerHTML = "";
});

configurarAlarme.addEventListener("click", () => {
    let hora = parseInt(horaInput.value) || 0;
    let minuto = parseInt(minutoInput.value) || 0;

    if (hora < 0 || hora > 23 || minuto < 0 || minuto > 59) {
        alert("Hora ou minuto inválido!");
        return;
    }

    if (!listaAlarmes.some(alarme => alarme.time === `${appendZero(hora)}:${appendZero(minuto)}`)) {
        criarAlarme(hora, minuto);
    }

    [horaInput.value, minutoInput.value] = ["", ""];
});

window.onload = () => {
    setInterval(displayTimer, 1000);
    [horaInput.value, minutoInput.value] = ["", ""];
};