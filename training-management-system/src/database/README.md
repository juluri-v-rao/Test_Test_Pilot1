Database access lives in the Electron main process under `electron/database.js` so SQLite credentials and file operations stay outside the renderer.
