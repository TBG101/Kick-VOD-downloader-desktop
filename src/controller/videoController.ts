import { BrowserWindow, IpcMain } from "electron";
import { Video } from "../models/videoModel";
import { VideoQueeModel } from "../models/VideoQueeModel";
import { parseTimeToMs } from "../utils/utils";
interface videoToDownload {
    video: Video;
    quality: string;
    startTime: string;
    endTime: string;
}

export class VideoController {
    ipcMain: IpcMain;
    queeModel = VideoQueeModel.getInstance();
    currentVideo: Video | undefined;
    constructor(ipcMain: IpcMain, browserWindow: BrowserWindow) {

        this.ipcMain = ipcMain;
        ipcMain.handle("getVideoData", async (event, url) => {
            const video = new Video(url, browserWindow);
            this.currentVideo = video;
            const videoData = await video.getVideoData();

            video.VideoData = videoData;

            await video.fromJson(videoData);
            console.log(video.toJson());

            return video.toJson();
        });

        ipcMain.handle("downloadVideo", async (event, videoToDownload: videoToDownload) => {
            console.log("received download request", videoToDownload);
            const startTimeMs = parseTimeToMs(videoToDownload.startTime);
            const endTimeMs = parseTimeToMs(videoToDownload.endTime);
            this.queeModel.addVideo(this.currentVideo!, videoToDownload.quality, startTimeMs, endTimeMs);
            this.queeModel.StartQueeDonwloading();
        });


    }


}
