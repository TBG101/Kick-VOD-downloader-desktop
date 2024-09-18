import { IpcMain } from "electron";
import { Video } from "../models/videoModel";
import { VideoQueeModel } from "../models/VideoQueeModel";

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

        ipcMain.handle("downloadVideo", async (event, url, quality, start, end) => {
            console.log("received download request");
            
            this.queeModel.addVideo(this.currentVideo!, quality, start, end);
            this.queeModel.StartQueeDonwloading();
        });


    }


}
