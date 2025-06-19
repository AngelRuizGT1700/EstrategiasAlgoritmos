const arrayInput = document.getElementById("arrayInput");
const sortBtn = document.getElementById("sortBtn");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const animacion = document.getElementById("animacion");
const resultado = document.getElementById("resultado");

let numbers = [];
let original = [];
let paused = false;

function sleep(ms) {
  return new Promise((resolve) => {
    const check = () => (paused ? setTimeout(check, 50) : resolve());
    setTimeout(check, ms * 2);
  });
}

function renderArray(arr) {
  animacion.innerHTML = "";
  arr.forEach((num, i) => {
    const el = document.createElement("div");
    el.className = "array-element";
    el.textContent = num;
    el.id = `element-${i}`;
    animacion.appendChild(el);
  });
}

async function highlightRange(start, end, className) {
  for (let i = start; i <= end; i++) {
    const el = document.getElementById(`element-${i}`);
    if (el) el.classList.add(className);
  }
  await sleep(500);
  for (let i = start; i <= end; i++) {
    const el = document.getElementById(`element-${i}`);
    if (el) el.classList.remove(className);
  }
}

async function mergeSort(arr, left, right) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  log(`Dividiendo: [${arr.slice(left, right + 1)}]`);
  await highlightRange(left, right, "dividing");
  await mergeSort(arr, left, mid);
  await mergeSort(arr, mid + 1, right);
  await merge(arr, left, mid, right);
  log(`Mezclado: [${arr.slice(left, right + 1)}]`);
  await highlightRange(left, right, "conquering");
}

async function merge(arr, left, mid, right) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);
  let i = 0,
    j = 0,
    k = left;
  while (i < leftArr.length && j < rightArr.length) {
    arr[k] = leftArr[i] <= rightArr[j] ? leftArr[i++] : rightArr[j++];
    renderArray(arr);
    logStep(arr);
    await sleep(500);
    k++;
  }
  while (i < leftArr.length) arr[k++] = leftArr[i++];
  while (j < rightArr.length) arr[k++] = rightArr[j++];
  renderArray(arr);
}

// Ajusta el contenido para que, al llegar a la altura máxima de #resultado, los pasos se distribuyan en columnas
function logStep(arr) {
  const div = document.createElement("div");
  div.className = "log-step";
  div.textContent = `Paso: [${arr}]`;
  resultado.appendChild(div);
  resultado.scrollTop = resultado.scrollHeight;
}

function log(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.className = "log-msg";
  resultado.appendChild(div);
  resultado.scrollTop = resultado.scrollHeight;
}

sortBtn.addEventListener("click", () => {
  numbers = arrayInput.value
    .split(",")
    .map((x) => parseInt(x.trim()))
    .filter((n) => !isNaN(n));
  original = [...numbers];
  resultado.innerHTML = "";
  renderArray(numbers);
  log(`Array ingresado: [${numbers}]`);
});

startBtn.addEventListener("click", async () => {
  paused = false;
  resultado.innerHTML = "";
  renderArray(numbers);
  await mergeSort(numbers, 0, numbers.length - 1);
  log("Ordenamiento finalizado.");
});

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  log(`Pausa: ${paused ? "activada" : "desactivada"}`);
});

resetBtn.addEventListener("click", () => {
  numbers = [...original];
  paused = false;
  resultado.innerHTML = "";
  renderArray(numbers);
  log("Reiniciado.");
});
