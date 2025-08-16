const animals = ["2.png","3.png","4.png","5.png","6.png","7.png","8.png","9.png"];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timerInterval = null;
let seconds = 0;

const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const playerDisplay = document.getElementById("player-display");
const timerDisplay = document.getElementById("timer");
const congratsDisplay = document.getElementById("congrats");
const gameBoard = document.getElementById("game-board");

// Login
document.getElementById("start-game").addEventListener("click", () => {
  const playerName = document.getElementById("player-name").value.trim();
  if (!playerName) { alert("Digite seu nome!"); return; }

  loginScreen.style.display = "none";
  gameScreen.style.display = "block";
  playerDisplay.textContent = playerName;

  startGame();
});

// Reiniciar
document.getElementById("restart-game").addEventListener("click", () => startGame());

// Sair
document.getElementById("exit-game").addEventListener("click", () => {
  clearInterval(timerInterval);
  gameScreen.style.display = "none";
  loginScreen.style.display = "block";
  document.getElementById("player-name").value = "";
});

// Iniciar jogo
function startGame() {
  clearInterval(timerInterval);
  seconds = 0;
  timerDisplay.textContent = "Tempo: 0s";
  congratsDisplay.style.display = "none";

  firstCard = null;
  secondCard = null;
  lockBoard = false;

  let deck = [...animals, ...animals];
  deck.sort(() => Math.random() - 0.5);

  gameBoard.innerHTML = "";
  deck.forEach(animal => {
    const card = document.createElement("div");
    card.classList.add("card");

    const front = document.createElement("div");
    front.classList.add("card-face","front");
    front.textContent = "?";

    const back = document.createElement("div");
    back.classList.add("card-face","back");
    back.style.backgroundImage = `url(img/${animal})`;

    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener("click", () => flipCard(card, animal));
    gameBoard.appendChild(card);
  });

  // Temporizador
  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Tempo: ${seconds}s`;
  }, 1000);
}

// Virar carta
function flipCard(card, animal) {
  if (lockBoard || card.classList.contains("flip")) return;

  card.classList.add("flip");

  if (!firstCard) { firstCard = { card, animal }; return; }
  secondCard = { card, animal };
  lockBoard = true;

  checkMatch();
}

// Checar par
function checkMatch() {
  if (firstCard.animal === secondCard.animal) {
    resetTurn();
    checkGameEnd();
  } else {
    setTimeout(() => {
      firstCard.card.classList.remove("flip");
      secondCard.card.classList.remove("flip");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Checar fim do jogo
function checkGameEnd() {
  const allFlipped = document.querySelectorAll(".card:not(.flip)").length === 0;
  if (allFlipped) {
    clearInterval(timerInterval);
    congratsDisplay.textContent = `Parabéns! Você finalizou o jogo em ${seconds} segundos!`;
    congratsDisplay.style.display = "block";
  }
}
