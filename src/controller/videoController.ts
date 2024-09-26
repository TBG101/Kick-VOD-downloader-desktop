import { IpcMain } from "electron";
import { Video } from "../models/videoModel";
import { VideoQueeModel } from "../models/VideoQueeModel";
import { parseTimeToMs } from "../utils/utils";
interface videoToDownload {
    video: Video;
    quality: string;
    start: string;
    end: string;
}

export class VideoController {
    ipcMain: IpcMain;
    queeModel = VideoQueeModel.getInstance();
    currentVideo: Video | undefined;
    constructor(ipcMain: IpcMain) {

        this.ipcMain = ipcMain;
        ipcMain.handle("getVideoData", async (event, url) => {
            const video = new Video(url);
            this.currentVideo = video;
            const videoData = await video.getVideoData();

            video.VideoData = videoData;

            await video.fromJson(videoData);
            console.log(video.toJson());

            return video.toJson();
        });

        ipcMain.handle("downloadVideo", async (event, videoToDownload: videoToDownload) => {
            console.log("received download request");
            const startTimeMs = parseTimeToMs(videoToDownload.start);
            const endTimeMs = parseTimeToMs(videoToDownload.end);
            this.queeModel.addVideo(this.currentVideo!, videoToDownload.quality, startTimeMs, endTimeMs);
            
            this.queeModel.StartQueeDonwloading();
        });


    }


}
