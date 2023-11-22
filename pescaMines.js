let minesSiNo = [];
let files;
let columnes;
let caselles;
let mines;
let totObertes = 0
let totalGuanyades = parseInt(localStorage.getItem('Guanyades')) || 0;
let totalPerdudes = parseInt(localStorage.getItem('Perdudes')) || 0;

function iniciarPartida() {
    minesSiNo = [];
    caselles;
    mines;
    totObertes = 0
    files = parseInt(prompt("Diguem el numero de files les quals vols jugar (min 10 i max 30): "));
    columnes = parseInt(prompt("Diguem el numero de columnes les quals vols jugar (min 10 i max 30): "));

    if (files < 10) {
        files = 10;
    } else if (files > 30) {
        files = 30;
    }
    if (columnes < 10) {
        columnes = 10;
    } else if (columnes > 30) {
        columnes = 30;
    }
    caselles = files * columnes;
    console.log(files);
    console.log(columnes);
    console.log(caselles);
    crearTaulell();
}

// Funció que ens mostra les estadistiques de les partides 
function estadistiques() {
    let partidesTotal = totalGuanyades + totalPerdudes;
    let estats = window.open("", "_blank");
    estats.document.write('<p>Total de partides: ' + partidesTotal +
        '</p><br><p>Partides guayades(' + ((totalGuanyades * 100) / partidesTotal).toFixed(2) + "%): " + totalGuanyades +
        '</p><br><p>Partides perdudes(' + ((totalPerdudes * 100) / partidesTotal).toFixed(2) + "%): " + totalPerdudes + '</p>');
}

window.addEventListener('contextmenu', (event) => { banderes() });

function crearTaulell() {
    let taula = "<table>";
    let cont = 0;
    mines = (caselles * 17) / 100;
    setMines(caselles, mines);
    for (let n = 0; n < files; n++) {
        taula += "<tr>";
        for (let i = 0; i < columnes; i++) {
            if (minesSiNo[cont] == 0) {
                taula += `<td id="${n}-${i}" data-mina='false' data-obert='false'><img src='imatges/fons20px.jpg' onclick='obreCasella(${n},${i}))></td>`;
            } else {
                taula += `<td id="${n}-${i}" data-mina='true' data-obert='false'><img src='imatges/fons20px.jpg' onclick='obreCasella(${n},${i})></td>`;
            }
            cont++;
        }
        taula += "</tr>";
    }
    taula += "</table>"
    //console.log(taula);
    document.getElementById("taulell").innerHTML = taula;
}

function obreCasella(fila, columna) {
    let td1 = document.getElementById(`${fila}-${columna}`);
    let mAdj = calculaAdjacents(fila, columna);
    if (td1.dataset.obert === "true") {
        return;
    }

    td1.dataset.obert = "true";

    if (mAdj == 0) {
        for (let n = 0; n < 3; n++) {
            for (let i = 0; i < 3; i++) {
                try {
                    obreCasella(fila - 1 + n, columna - 1 + i);
                } catch (e) { // non-standard

                }
            }
        }
    }

    if (td1.dataset.mina == "false") {
        setMinesAdjacents(fila, columna, mAdj);
    } else {
        esMina(fila, columna);
    }
}

function banderes() {
    console.log("banderes");
}

function setMines() {
    for (let n = 0; n < caselles; n++) {
        minesSiNo.push(0);
    }
    for (let i = 0; i < mines; i++) {
        minesSiNo.shift();
        minesSiNo.push(1);
    }
    shuffle(minesSiNo);
    //console.log(minesSiNo)
}
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function calculaAdjacents(fila, columna) {
    let mAdj = 0;
    for (let n = 0; n < 3; n++) {
        for (let i = 0; i < 3; i++) {
            try {
                tdI = document.getElementById(`${fila - 1 + n}-${columna - 1 + i}`);
                //console.log(tdI);
                if (tdI.dataset.mina == "true") {
                    mAdj++;
                }
            } catch (e) { // non-standard

            }
        }
    }
    return mAdj;


    //console.log(mAdj);
}

function esMina(fila, columna) {
    document.getElementById(`${fila}-${columna}`).innerHTML = `<td><img src='imatges/mina20px.jpg'></td>`;

    for (let n = 0; n < files; n++) {
        for (let i = 0; i < columnes; i++) {
            let td1 = document.getElementById(`${n}-${i}`);
            if (td1.dataset.mina == "true") {
                document.getElementById(`${n}-${i}`).innerHTML = `<td><img src='imatges/mina20px.jpg'></td>`;
            } else if (td1.dataset.obert == "false") {
                document.getElementById(`${n}-${i}`).innerHTML = `<td><img src='imatges/fons20px.jpg'></td>`
            }
        }
    }
    setTimeout(function () { alert("Has perdut"); }, 50);
    totalPerdudes++;
    localStorage.setItem('Perdudes', totalPerdudes);
    document.getElementById(`${fila}-${columna}`).innerHTML = `<td><img src='imatges/mina20px.jpg'></td>`;
}

function setMinesAdjacents(fila, columna, mAdj) {
    document.getElementById(`${fila}-${columna}`).innerHTML = `<td>${mAdj}</td>`;
    totObertes++;
    console.log(totObertes);
    if (totObertes == minesSiNo.length - mines) {
        setTimeout(function () { alert("Has guanyat"); }, 50);
        totalGuanyades++;
        localStorage.setItem('Guanyades', totalGuanyades);
        for (let n = 0; n < files; n++) {
            for (let i = 0; i < columnes; i++) {
                let td1 = document.getElementById(`${n}-${i}`);
                if (td1.dataset.mina == "true") {
                    document.getElementById(`${n}-${i}`).innerHTML = `<td><img src='imatges/fons20px.jpg'></td>`;
                }
            }
        }
    }
}



