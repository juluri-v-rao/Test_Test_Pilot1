const GRID_SIZE = 16;

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function createInitialState(random = Math.random) {
  const snake = [
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ];

  return {
    gridSize: GRID_SIZE,
    snake,
    direction: "right",
    pendingDirection: "right",
    food: getRandomFoodPosition(snake, GRID_SIZE, random),
    score: 0,
    isGameOver: false,
  };
}

function queueDirection(state, nextDirection) {
  if (!DIRECTIONS[nextDirection]) {
    return state;
  }

  if (OPPOSITES[state.direction] === nextDirection) {
    return state;
  }

  return {
    ...state,
    pendingDirection: nextDirection,
  };
}

function stepGame(state, random = Math.random) {
  if (state.isGameOver) {
    return state;
  }

  const direction = state.pendingDirection;
  const move = DIRECTIONS[direction];
  const nextHead = {
    x: state.snake[0].x + move.x,
    y: state.snake[0].y + move.y,
  };

  const ateFood = positionsEqual(nextHead, state.food);
  const nextSnake = [nextHead, ...state.snake];

  if (!ateFood) {
    nextSnake.pop();
  }

  const outOfBounds =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= state.gridSize ||
    nextHead.y >= state.gridSize;

  const hitSelf = nextSnake
    .slice(1)
    .some((segment) => positionsEqual(segment, nextHead));

  if (outOfBounds || hitSelf) {
    return {
      ...state,
      direction,
      isGameOver: true,
      snake: nextSnake,
    };
  }

  return {
    ...state,
    direction,
    snake: nextSnake,
    food: ateFood
      ? getRandomFoodPosition(nextSnake, state.gridSize, random)
      : state.food,
    score: ateFood ? state.score + 1 : state.score,
  };
}

function getRandomFoodPosition(snake, gridSize, random = Math.random) {
  const openCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const isOccupied = snake.some((segment) => segment.x === x && segment.y === y);
      if (!isOccupied) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  const index = Math.floor(random() * openCells.length);
  return openCells[index];
}

function positionsEqual(a, b) {
  return Boolean(a && b) && a.x === b.x && a.y === b.y;
}

window.SnakeLogic = {
  GRID_SIZE,
  createInitialState,
  queueDirection,
  stepGame,
};
