const inputNumero = document.getElementById("numero");
const btnCalcular = document.getElementById("btn-calcular");
const btnIniciar = document.getElementById("btn-iniciar");
const btnDetener = document.getElementById("btn-detener");
const btnReiniciar = document.getElementById("btn-reiniciar");
const animacion = document.getElementById("animacion");
const resultado = document.getElementById("resultado");

let memo = {};
let animationQueue = [];
let animationInterval;
let isAnimating = false;
let animationSpeed = 1000;
let finalResult = null;

// Función de Fibonacci con memoización
function fibonacci(n, parentId = null, path = []) {
  return new Promise((resolve) => {
    const nodeId = `node-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)}`;
    const nodeValue = n;

    animationQueue.push({
      type: "create",
      nodeId,
      nodeValue,
      parentId,
      path: [...path, n],
    });

    if (n in memo) {
      animationQueue.push({
        type: "memo",
        nodeId,
        value: memo[n],
      });
      resolve(memo[n]);
      return;
    }

    if (n <= 0) {
      memo[n] = 0;
      animationQueue.push({
        type: "base",
        nodeId,
        value: 0,
      });
      resolve(0);
      return;
    }

    if (n === 1) {
      memo[n] = 1;
      animationQueue.push({
        type: "base",
        nodeId,
        value: 1,
      });
      resolve(1);
      return;
    }

    Promise.all([
      fibonacci(n - 1, nodeId, [...path, n]),
      fibonacci(n - 2, nodeId, [...path, n]),
    ]).then(([fib1, fib2]) => {
      const sum = fib1 + fib2;
      memo[n] = sum;

      animationQueue.push({
        type: "result",
        nodeId,
        value: sum,
        fib1,
        fib2,
      });

      resolve(sum);
    });
  });
}

function renderNode(nodeId, value, parentId = null) {
  const node = document.createElement("div");
  node.id = nodeId;
  node.className = "node";
  node.textContent = `f(${value})`;

  if (parentId) {
    const parent = document.getElementById(parentId);
    let childrenContainer = parent.nextElementSibling;

    if (
      !childrenContainer ||
      !childrenContainer.classList.contains("children-container")
    ) {
      childrenContainer = document.createElement("div");
      childrenContainer.className = "children-container";
      parent.parentNode.insertBefore(childrenContainer, parent.nextSibling);
    }

    const childContainer = document.createElement("div");
    childContainer.className = "child";
    childContainer.appendChild(node);
    childrenContainer.appendChild(childContainer);
  } else {
    animacion.innerHTML = "";
    const treeContainer = document.createElement("div");
    treeContainer.className = "tree";
    treeContainer.appendChild(node);
    animacion.appendChild(treeContainer);
  }

  return node;
}

function updateMemoDisplay() {
  let memoDiv = resultado.querySelector(".memo-array");
  if (!memoDiv) {
    memoDiv = document.createElement("div");
    memoDiv.className = "memo-array";
    resultado.appendChild(memoDiv);
  }

  const displayed = new Set(
    Array.from(memoDiv.querySelectorAll("span[data-key]")).map((span) =>
      span.getAttribute("data-key")
    )
  );

  const newEntries = Object.entries(memo)
    .sort((a, b) => a[0] - b[0])
    .filter(([key]) => !displayed.has(key));

  if (newEntries.length > 0) {
    newEntries.forEach(([key, value]) => {
      const span = document.createElement("span");
      span.setAttribute("data-key", key);
      span.textContent = `fibonacci(${key}) = ${value}`;
      memoDiv.appendChild(span);
    });
  }

  if (finalResult && !resultado.querySelector(".final-result")) {
    const resultDiv = document.createElement("div");
    resultDiv.className = "final-result";
    resultDiv.textContent = `Resultado final: fib(${inputNumero.value}) = ${finalResult}`;
    resultado.appendChild(resultDiv);
  }
}

function processAnimationQueue() {
  if (animationQueue.length === 0) {
    stopAnimation();
    btnCalcular.disabled = false;
    btnIniciar.disabled = true;
    return;
  }

  const step = animationQueue.shift();
  const node =
    document.getElementById(step.nodeId) ||
    renderNode(step.nodeId, step.nodeValue, step.parentId);

  switch (step.type) {
    case "create":
      node.classList.add("highlight");
      break;
    case "memo":
      node.classList.remove("highlight");
      node.classList.add("memo");
      node.textContent += ` = ${step.value} (memo)`;
      break;
    case "base":
      node.classList.remove("highlight");
      node.classList.add("base");
      node.textContent += ` = ${step.value}`;
      break;
    case "result":
      node.classList.remove("highlight");
      node.textContent += ` = ${step.fib1} + ${step.fib2} = ${step.value}`;
      break;
  }

  updateMemoDisplay();
  node.scrollIntoView({ behavior: "smooth", block: "center" });
}

function startAnimation() {
  if (isAnimating || animationQueue.length === 0) return;

  isAnimating = true;
  btnIniciar.disabled = true;
  btnDetener.disabled = false;

  animationInterval = setInterval(processAnimationQueue, animationSpeed);
}

function stopAnimation() {
  clearInterval(animationInterval);
  isAnimating = false;

  if (animationQueue.length > 0) {
    btnIniciar.disabled = false; // Permitir reanudar si hay pasos pendientes
  }

  btnDetener.disabled = true;
  btnCalcular.disabled = false;
}

function reset() {
  stopAnimation();
  memo = {};
  animationQueue = [];
  finalResult = null;
  animacion.innerHTML = "";
  resultado.innerHTML = "";
  btnIniciar.disabled = true;
  btnDetener.disabled = true;
  btnCalcular.disabled = false;
}

btnCalcular.addEventListener("click", () => {
  reset();
  const n = parseInt(inputNumero.value);
  if (n >= 0 && n <= 6) {
    btnCalcular.disabled = true;
    btnIniciar.disabled = true;

    fibonacci(n).then((result) => {
      finalResult = result;
      startAnimation(); // Inicia automáticamente la animación
    });
  } else {
    alert("Por favor ingresa un número entre 0 y 6");
  }
});

btnIniciar.addEventListener("click", startAnimation);
btnDetener.addEventListener("click", stopAnimation);
btnReiniciar.addEventListener("click", reset);

inputNumero.addEventListener("change", () => {
  let value = parseInt(inputNumero.value);
  if (isNaN(value)) value = 0;
  if (value < 0) inputNumero.value = 0;
  if (value > 6) inputNumero.value = 6;
});
