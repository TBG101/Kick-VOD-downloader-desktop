import { Video } from "./videoModel";
import { VideoController } from "../controller/videoController";

interface VideoToDownload {
  video: Video;
  quality: string;
  start: number;
  end: number;

}

export class VideoQueeModel {
  Quee: VideoToDownload[];
  isDonwloading: boolean;
  private static instance: VideoQueeModel;

  static getInstance() {
    if (!VideoQueeModel.instance) {
      VideoQueeModel.instance = new VideoQueeModel();
    }
    return VideoQueeModel.instance;
  }

  private constructor() {
    this.Quee = [];
    this.isDonwloading = false;
  }



  addVideo(video: Video, quality: string, start: number = 0, end: number = 0) {
    const videoToDownload: VideoToDownload = {
      video: video,
      quality: quality,
      start: start,
      end: end,
    };
    this.Quee.push(videoToDownload);
  }
  removeVideo(video: Video) {
    this.Quee = this.Quee.filter((vid) => vid.video !== video);
  }

  getVideo(url: string) {
    return this.Quee.find((vid) => vid.video.url === url);
  }

  async StartQueeDonwloading() {
    console.log("Starting Quee");

    if (this.isDonwloading) return;
    this.isDonwloading = true;
    while (this.Quee.length > 0) {

      const vid = this.Quee[this.Quee.length - 1];
      console.log(vid);
      if (!vid) return;
      await vid.video.DonwloadVod(vid.quality, vid.start, vid.end);
      return;
    }
    this.isDonwloading = false;
  }
}
