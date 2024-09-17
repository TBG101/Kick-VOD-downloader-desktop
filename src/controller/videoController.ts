import { IpcMain } from "electron";
import { Video } from "../models/videoModel";

export class VideoController {
    ipcMain: IpcMain;
    constructor(ipcMain: IpcMain) {
        this.ipcMain = ipcMain;
        this.ipcMain.on("getVideoData", async (event, url) => {
            const video = new Video(url);
            const videoData = await video.getVideoData();
            video.VideoData = videoData;

            event.reply("video", video.toJson());
        });
        
    }
}
