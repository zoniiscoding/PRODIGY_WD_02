const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const xScoreEl = document.getElementById("x-score");
const oScoreEl = document.getElementById("o-score");
const drawScoreEl = document.getElementById("draw-score");

let board, currentPlayer, gameActive, mode;
let xScore = 0, oScore = 0, drawScore = 0;

function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
  statusEl.textContent = mode === "pvp" ? "Player X's turn" : "Your turn (X)";
}

function initBoard() {
  board = Array(9).fill("");
  boardEl.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    boardEl.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] || !gameActive) return;

  makeMove(index, currentPlayer);

  if (mode === "ai" && gameActive && currentPlayer === "O") {
    setTimeout(aiMove, 500); 
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = boardEl.querySelector(`[data-index='${index}']`);
  cell.textContent = player;
  cell.classList.add("taken");

  if (checkWinner(player)) {
    statusEl.textContent = `🎉 ${player} Wins!`;
    gameActive = false;
    if (player === "X") xScoreEl.textContent = ++xScore;
    else oScoreEl.textContent = ++oScore;
    return;
  }

  if (!board.includes("")) {
    statusEl.textContent = "It's a Draw! 🤝";
    gameActive = false;
    drawScoreEl.textContent = ++drawScore;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusEl.textContent = mode === "pvp"
    ? `Player ${currentPlayer}'s turn`
    : (currentPlayer === "X" ? "Your turn (X)" : "AI's turn (O)");
}

function aiMove() {
  let emptyIndices = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
  let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, "O");
}

function checkWinner(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo => combo.every(idx => board[idx] === player));
}

function resetGame() {
  initBoard();
  currentPlayer = "X";
  gameActive = true;
  if (!mode) {
    statusEl.textContent = "Choose Mode: Player vs Player or Player vs AI";
  } else {
    statusEl.textContent = mode === "pvp" ? "Player X's turn" : "Your turn (X)";
  }
}

resetGame();
