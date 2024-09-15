const { app, BrowserWindow } = require("electron");
const isDev = require('electron-is-dev');

// Hot reload in development mode
if (isDev) {
  require("electron-reload")(path.join(__dirname, "./"), {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
    awaitWriteFinish: true,
  });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});
