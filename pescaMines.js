//Variables
let minesSiNo = []
let files
let columnes
let caselles
let mines
let bandera
let totObertes = 0
let myInterval
let segons = 0
let minuts = 0
let hores = 0
let tRecord
let tempsInici
let tempsFinal
let totalGuanyades = parseInt(localStorage.getItem('Guanyades')) || 0
let totalPerdudes = parseInt(localStorage.getItem('Perdudes')) || 0
let tempsMax = localStorage.getItem('tMax') || 0
let tempsRecord = localStorage.getItem('record') || 0

// Iniciem la partida
function iniciarPartida() {
  //Reiniciem varaibles al iniciar un nou lloc
  minesSiNo = []
  caselles
  mines
  bandera
  totObertes = 0
  segons = 0
  minuts = 0
  hores = 0
  tempsInici = new Date()
  const dificultat =
    '<button id="facil" onclick="dificultat(10, 10)">Facil</button> <button id="medio" onclick="dificultat(20, 20)">Medio</button> <button id="dificil" onclick="dificultat(30, 30)">Dificil</button>'

  document.getElementById('botons').innerHTML = dificultat
}

function dificultat(nfiles, ncolumnas) {
  files = nfiles
  columnes = ncolumnas
  caselles = files * columnes
  document.getElementById('botons').innerHTML = ''
  crearTaulell()
  myInterval = setInterval(function () {
    temps()
  }, 1000)
}

//Funció que crea el taulell de joc
function crearTaulell() {
  let taula = '<table>'
  let cont = 0
  mines = (caselles * 17) / 100
  bandera = mines

  //Afegim a taulell les mines
  setMines(caselles, mines)
  for (let n = 0; n < files; n++) {
    taula += '<tr>'
    for (let i = 0; i < columnes; i++) {
      if (minesSiNo[cont] == 0) {
        taula += `<td id="${n}-${i}" data-mina='false' data-obert='false' data-bandera='false'><img src='imatges/fons20px.jpg' onclick='obreCasella(${n},${i})'></td>`
      } else {
        taula += `<td id="${n}-${i}" data-mina='true' data-obert='false' data-bandera='false'><img src='imatges/fons20px.jpg' onclick='obreCasella(${n},${i})'></td>`
      }
      cont++
    }
    taula += '</tr>'
  }
  taula += '</table>'
  document.getElementById('taulell').innerHTML = taula
  document.getElementById('nBanderes').innerHTML =
    `<img src='imatges/badera20px.jpg'> =` + bandera
  //Event que permet afegir banderes
  for (let n = 0; n < files; n++) {
    for (let i = 0; i < columnes; i++) {
      let td1 = document.getElementById(`${n}-${i}`)
      td1.addEventListener(
        'contextmenu',
        function () {
          banderes(n, i)
        },
        true
      )
    }
  }
}

//Funció que obre la casella i la processa
function obreCasella(fila, columna) {
  let td1 = document.getElementById(`${fila}-${columna}`)
  let mAdj = calculaAdjacents(fila, columna)
  //Comprovem si esta la casella ya s'ha obert abans
  if (td1.dataset.obert === 'true') {
    return
  }

  //Recursivitat
  td1.dataset.obert = 'true'
  if (mAdj == 0) {
    for (let n = 0; n < 3; n++) {
      for (let i = 0; i < 3; i++) {
        try {
          obreCasella(fila - 1 + n, columna - 1 + i)
        } catch (e) {
          // non-standard
        }
      }
    }
  }

  //Processament de la casella
  if (td1.dataset.mina == 'false') {
    setMinesAdjacents(fila, columna, mAdj)
  } else {
    esMina(fila, columna)
  }
}

//Funció que afegeix banderes
function banderes(fila, columna) {
  let td1 = document.getElementById(`${fila}-${columna}`)
  if (td1.dataset.bandera == 'false') {
    td1.dataset.bandera = 'true'
    if (td1.dataset.mina == 'true') {
      document.getElementById(
        `${fila}-${columna}`
      ).innerHTML = `<td id="${fila}-${columna}" data-mina='true' data-obert='true'><img src='imatges/badera20px.jpg'></td>`
    } else if (td1.dataset.obert == 'false') {
      document.getElementById(
        `${fila}-${columna}`
      ).innerHTML = `<td id="${fila}-${columna}" data-mina='false' data-obert='true'><img src='imatges/badera20px.jpg'></td>`
    }
    bandera--
  } else if (td1.dataset.bandera == 'true') {
    td1.dataset.bandera = 'false'
    if (td1.dataset.mina == 'true') {
      document.getElementById(
        `${fila}-${columna}`
      ).innerHTML = `<td id="${fila}-${columna}" data-mina='true' data-obert='true'><img src='imatges/fons20px.jpg' onclick='obreCasella(${fila},${columna})'></td>`
    } else if (td1.dataset.obert == 'false') {
      document.getElementById(
        `${fila}-${columna}`
      ).innerHTML = `<td id="${fila}-${columna}" data-mina='false' data-obert='true'><img src='imatges/fons20px.jpg' onclick='obreCasella(${fila},${columna})'></td>`
    }
    bandera++
  }

  document.getElementById('nBanderes').innerHTML =
    `<img src='imatges/badera20px.jpg'> =` + Math.trunc(bandera)
}

//Funció que afegira les mines
function setMines() {
  for (let n = 0; n < caselles; n++) {
    minesSiNo.push(0)
  }
  for (let i = 0; i < mines; i++) {
    minesSiNo.shift()
    minesSiNo.push(1)
  }
  shuffle(minesSiNo)
}
//Funció que decidira l'ordre de les mines
function shuffle(minesSiNo) {
  let currentIndex = minesSiNo.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[minesSiNo[currentIndex], minesSiNo[randomIndex]] = [
      minesSiNo[randomIndex],
      minesSiNo[currentIndex]
    ]
  }

  return minesSiNo
}

//Funció que recorre les mines adjacents i conte les mines
function calculaAdjacents(fila, columna) {
  let mAdj = 0
  for (let n = 0; n < 3; n++) {
    for (let i = 0; i < 3; i++) {
      try {
        tdI = document.getElementById(`${fila - 1 + n}-${columna - 1 + i}`)
        //console.log(tdI);
        if (tdI.dataset.mina == 'true') {
          mAdj++
        }
      } catch (e) {}
    }
  }
  return mAdj
}

//Funció que s'activa quan tocas una mina
function esMina(fila, columna) {
  document.getElementById(
    `${fila}-${columna}`
  ).innerHTML = `<td><img src='imatges/mina20px.jpg'></td>`

  //Mostra totes les mines
  for (let n = 0; n < files; n++) {
    for (let i = 0; i < columnes; i++) {
      let td1 = document.getElementById(`${n}-${i}`)
      if (td1.dataset.mina == 'true') {
        document.getElementById(
          `${n}-${i}`
        ).innerHTML = `<td><img src='imatges/mina20px.jpg'></td>`
      } else if (td1.dataset.obert == 'false') {
        document.getElementById(
          `${n}-${i}`
        ).innerHTML = `<td><img src='imatges/fons20px.jpg'></td>`
      }
    }
  }
  //Has perdut
  setTimeout(function () {
    alert('Has perdut')
  }, 50)
  totalPerdudes++
  localStorage.setItem('Perdudes', totalPerdudes)
  document.getElementById(
    `${fila}-${columna}`
  ).innerHTML = `<td><img src='imatges/mina20px.jpg'></td>`
  clearInterval(myInterval)
}

//Funció que afegeix el numero de mines adjacents
function setMinesAdjacents(fila, columna, mAdj) {
  document.getElementById(`${fila}-${columna}`).innerHTML = `<td>${mAdj}</td>`
  totObertes++
  if (totObertes == minesSiNo.length - mines) {
    victoria()
  }
}

//Funció que s'activa quan has guanyat
function victoria() {
  tempsFinal = new Date()
  record()
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })
  setTimeout(function () {
    alert('Has guanyat')
  }, 50)
  totalGuanyades++
  localStorage.setItem('Guanyades', totalGuanyades)
  for (let n = 0; n < files; n++) {
    for (let i = 0; i < columnes; i++) {
      let td1 = document.getElementById(`${n}-${i}`)
      if (td1.dataset.mina == 'true') {
        document.getElementById(
          `${n}-${i}`
        ).innerHTML = `<td><img src='imatges/mina20px.jpg'></td>`
      }
    }
  }
  clearInterval(myInterval)
}

//Funció que ens mostra les estadistiques de les partides
function estadistiques() {
  let partidesTotal = totalGuanyades + totalPerdudes
  const popup = new Popup({
    id: 'download',
    title: 'Estadistiques',
    content:
      '<p>Total de partides: ' +
      partidesTotal +
      '</p><br><p>Partides guayades(' +
      ((totalGuanyades * 100) / partidesTotal).toFixed(2) +
      '%): ' +
      totalGuanyades +
      '</p><br><p>Partides perdudes(' +
      ((totalPerdudes * 100) / partidesTotal).toFixed(2) +
      '%): ' +
      totalPerdudes +
      '</p><br><p>Temps record= ' +
      tempsRecord,
    backgroundColor: '#000',
    titleColor: '#fff',
    textColor: '#fff',
    closeColor: '#fff',
    borderWidth: '.2em',
    borderColor: '#fff',
    linkColor: '#fff',
    fontSizeMultiplier: 1.2,
    titleMargin: '4%',
    underlineLinks: true
  })
  popup.show()
  /*
    let estats = window.open("", "_blank");
    estats.document.write('<p>Total de partides: ' + partidesTotal +
        '</p><br><p>Partides guayades(' + ((totalGuanyades * 100) / partidesTotal).toFixed(2) + "%): " + totalGuanyades +
        '</p><br><p>Partides perdudes(' + ((totalPerdudes * 100) / partidesTotal).toFixed(2) + "%): " + totalPerdudes +
        '</p><br><p>Temps record= ' + tempsRecord);*/
}

//Funció que calcula el temps
function temps() {
  if (segons == 60) {
    segons = 0
    minuts++
  }
  if (minuts == 60) {
    minuts = 0
    hores++
  }
  document.getElementById(`temps`).innerHTML =
    hores + ':' + minuts + ':' + segons
  segons++
  tRecord = hores + ':' + minuts + ':' + segons
}

//Funció que calcula el temps que s'ha trigat i compara el record
function record() {
  let diff = (tempsFinal - tempsInici) / 1000
  if (diff > tempsMax) {
    tempsRecord = tRecord
    localStorage.setItem('tMax', diff)
    localStorage.setItem('record', tempsRecord)
  }
}
