import { app, BrowserWindow, ipcMain } from 'electron';
import { VideoController } from '../controller/videoController';
import { Video } from '../models/videoModel';
import { VideoQueeModel } from '../models/VideoQueeModel';


const createWindow = () => {
  const win = new BrowserWindow({
    height: 450,
    width: 870,

    autoHideMenuBar: true,
    frame: true,
    center: true,
    darkTheme: true,
    hasShadow: true,
    resizable: false,
    title: "Kick Vod Downloader",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  let controler = new VideoController(ipcMain,win);
  let queeController = VideoQueeModel.getInstance();

  win.loadURL("http://127.0.0.1:5500/src/assets/index.html");
  win.webContents.openDevTools();

};

app.whenReady().then(() => {
  createWindow();
});
