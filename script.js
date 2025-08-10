//Estado del carton
let cartonBingo = [];
let marcados = [];

//Guarda el estado en localstorage
function guardar() {
  localStorage.setItem("cartonBingo", JSON.stringify(cartonBingo));
  localStorage.setItem("marcados", JSON.stringify(marcados));
}

//Carga el estado del carton guardado
function cargar() {
  const cartonGuardado = localStorage.getItem("cartonBingo");
  const marcadosGuardados = localStorage.getItem("marcados");

  if (cartonGuardado && marcadosGuardados) {
    cartonBingo = JSON.parse(cartonGuardado);
    marcados = JSON.parse(marcadosGuardados);
    return true;
  }
  return false;
}

//Crea un cartón de bingo nuevo
function nuevoCarton() {
  cartonBingo = [];
  marcados = Array.from({ length: 5 }, () => Array(5).fill(false));

  //Rangos para cada columna (B-I-N-G-O)
  const rangos = [
    { min: 1, max: 15 },
    { min: 16, max: 30 },
    { min: 31, max: 45 },
    { min: 46, max: 60 },
    { min: 61, max: 75 },
  ];

  for (let col = 0; col < 5; col++) {
    const nums = [];
    while (nums.length < 5) {
      const n =
        Math.floor(Math.random() * (rangos[col].max - rangos[col].min + 1)) +
        rangos[col].min;
      if (!nums.includes(n)) nums.push(n);
    }
    cartonBingo.push(nums);
  }

  //Espacio "GRATIS" en el centro
  cartonBingo[2][2] = "GRATIS";
  marcados[2][2] = true;

  guardar();
}

// Dibuja el cartón en la pantalla
function dibujarCarton() {
  const contenedor = document.querySelector("#bingo-card");
  contenedor.innerHTML = "";

  // Encabezados
  ["B", "I", "N", "G", "O"].forEach((letra) => {
    const celda = document.createElement("div");
    celda.textContent = letra;
    celda.classList.add("celda", "encabezado");
    contenedor.appendChild(celda);
  });

  // Números
  for (let fila = 0; fila < 5; fila++) {
    for (let col = 0; col < 5; col++) {
      const celda = document.createElement("div");
      const valor = cartonBingo[col][fila];
      celda.textContent = valor;
      celda.classList.add("celda");

      if (valor === "GRATIS") {
        celda.classList.add("gratis", "marcada");
      } else if (marcados[col][fila]) {
        celda.classList.add("marcada");
      }

      if (valor !== "GRATIS") {
        celda.addEventListener("click", () => marcar(col, fila, celda));
      }

      contenedor.appendChild(celda);
    }
  }
}

// Marca o desmarca un número
function marcar(col, fila, celda) {
  marcados[col][fila] = !marcados[col][fila];
  celda.classList.toggle("marcada");
  guardar();
}

// Revisa si hay un bingo
function comprobarBingo() {
  // Comprobar cartón completo
  let cartonCompleto = true;
  for (let c = 0; c < 5; c++) {
    for (let r = 0; r < 5; r++) {
      if (!marcados[c][r]) {
        cartonCompleto = false;
        break;
      }
    }
    if (!cartonCompleto) {
      break;
    }
  }
  if (cartonCompleto) {
    return alert("BINGO! ¡Cartón completo!");
  }

  // Columnas
  for (let c = 0; c < 5; c++) {
    if (marcados[c].every((x) => x)) return alert("¡Bingo en columna!");
  }
  // Filas
  for (let r = 0; r < 5; r++) {
    if ([0, 1, 2, 3, 4].every((c) => marcados[c][r]))
      return alert("¡Bingo en fila!");
  }
  // Diagonales
  if ([0, 1, 2, 3, 4].every((i) => marcados[i][i]))
    return alert("¡Bingo en diagonal!");
  if ([0, 1, 2, 3, 4].every((i) => marcados[4 - i][i]))
    return alert("¡Bingo en diagonal!");

  alert("Aún no hay Bingo");
}

// Inicialización
document.querySelector("#nuevo-carton").addEventListener("click", () => {
  nuevoCarton();
  dibujarCarton();
});

document
  .querySelector("#comprobar-bingo")
  .addEventListener("click", comprobarBingo);

// Cargar el carton o crear uno nuevo
if (!cargar()) {
  nuevoCarton();
}
dibujarCarton();
