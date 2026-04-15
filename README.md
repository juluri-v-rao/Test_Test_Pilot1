# Snake

A minimal classic Snake game built with plain HTML, CSS, and JavaScript.

## Run

Open `index.html` directly in your browser.

If you prefer, you can also serve the folder with any static server, but it is not required.

## Files

- `index.html`: game page markup
- `styles.css`: minimal game styling
- `src/snake-logic.js`: deterministic game rules
- `src/main.js`: rendering, input handling, and game loop

## Manual Verification

- Start the game and confirm the snake moves one grid cell per tick.
- Use arrow keys or `W`, `A`, `S`, `D` to change direction.
- Confirm the snake grows by one segment and the score increments after eating food.
- Confirm food never appears on the snake body.
- Confirm wall collision or self-collision ends the game.
- Confirm `Restart` resets the score, snake, direction, and food.
- On small screens, confirm the on-screen buttons control the snake.
