(function () {
  const snakeLogic = window.SnakeLogic;
  const gridSize = snakeLogic.GRID_SIZE;
  const createInitialState = snakeLogic.createInitialState;
  const queueDirection = snakeLogic.queueDirection;
  const stepGame = snakeLogic.stepGame;
  const TICK_MS = 140;

  const board = document.getElementById("board");
  const score = document.getElementById("score");
  const status = document.getElementById("status");
  const restartButton = document.getElementById("restart-button");
  const controlButtons = document.querySelectorAll("[data-direction]");

  let state = createInitialState();
  let timerId = null;

  buildBoard();
  render();
  startLoop();

  window.addEventListener("keydown", handleKeydown);
  restartButton.addEventListener("click", restartGame);

  for (let index = 0; index < controlButtons.length; index += 1) {
    const button = controlButtons[index];
    button.addEventListener("click", () => {
      state = queueDirection(state, button.dataset.direction);
    });
  }

  function buildBoard() {
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < gridSize * gridSize; index += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      fragment.appendChild(cell);
    }

    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }

    board.appendChild(fragment);
  }

  function render() {
    const cells = board.children;

    for (let index = 0; index < cells.length; index += 1) {
      cells[index].className = "cell";
    }

    for (let index = 0; index < state.snake.length; index += 1) {
      const segment = state.snake[index];
      const cell = getCell(segment.x, segment.y);

      if (!cell) {
        continue;
      }

      cell.classList.add("snake");
      if (index === 0) {
        cell.classList.add("head");
      }
    }

    if (state.food) {
      const foodCell = getCell(state.food.x, state.food.y);
      if (foodCell) {
        foodCell.classList.add("food");
      }
    }

    score.textContent = String(state.score);
    status.textContent = state.isGameOver
      ? "Game over. Press Restart to play again."
      : "Use arrow keys or WASD to play.";
  }

  function getCell(x, y) {
    const cell = board.children[y * gridSize + x];
    return cell || null;
  }

  function handleKeydown(event) {
    const nextDirection = mapKeyToDirection(event.key);
    if (!nextDirection) {
      return;
    }

    event.preventDefault();
    state = queueDirection(state, nextDirection);
  }

  function mapKeyToDirection(key) {
    switch (key) {
      case "ArrowUp":
      case "w":
      case "W":
        return "up";
      case "ArrowDown":
      case "s":
      case "S":
        return "down";
      case "ArrowLeft":
      case "a":
      case "A":
        return "left";
      case "ArrowRight":
      case "d":
      case "D":
        return "right";
      default:
        return null;
    }
  }

  function startLoop() {
    stopLoop();
    timerId = window.setInterval(() => {
      state = stepGame(state);
      render();

      if (state.isGameOver) {
        stopLoop();
      }
    }, TICK_MS);
  }

  function stopLoop() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function restartGame() {
    state = createInitialState();
    render();
    startLoop();
  }
})();
