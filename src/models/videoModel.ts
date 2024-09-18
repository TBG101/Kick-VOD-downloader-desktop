import fs from "fs";
import axios from "axios";
import { exctractResolutionFromMaster } from "../utils/utils";

export class Video {
  url: String;
  title: string;
  streamer: string;
  lenght: number;
  streamDate: string;
  VideoData: {
    [key: string]: any;
  };
  resolutions: string[];
  downloading: boolean;
  donwloadUrl: string;
  thumbnail: string;

  constructor(url: String) {
    this.url = url;
    this.title = "";
    this.streamer = "";
    this.lenght = 0;
    this.streamDate = "";
    this.VideoData = new Map();
    this.resolutions = [];
    this.downloading = false;
    this.donwloadUrl = "";
    this.thumbnail = "";
  }


  async getVideoData(): Promise<{ [key: string]: any }> {
    // this will get the vod info from the kick api and add it to the video object and return it as well
    return new Promise(async (resolve, reject) => {
      const split_url = this.url.split("/");
      const id = split_url[split_url.length - 1];
      const api_url = `https://kick.com/api/v1/video/${id}?${Date.now()}`;

      console.log(api_url, "zafazefaz");

      try {
        const response = await fetch(api_url, {
          credentials: "include",
        })
        if (response.ok) {
          console.log(response.status);
          const responseJson = await response.json();
          return resolve(responseJson);
        }
        else {
          console.log(response.status);
          reject("Stautus Code: " + response.status);
        }
      } catch (e: any) {
        reject(e);
      }
    });

  }

  async getVideoQuality(api_link: string): Promise<string[]> {
    // this will get the video quality from the kick api and return it
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(api_link, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.text();
          resolve(exctractResolutionFromMaster(data));
        } else {
          reject("Error: " + response.status);
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });

  }

  async getVideoPlaylist(selectedQuality: String) {
    // Video: Video Class Object
    this.donwloadUrl = this.VideoData.source.replace(
      RegExp("master.[^/]*$"),
      `${selectedQuality}/`
    );

    try {
      const response = await fetch(this.donwloadUrl + "playlist.m3u8");
      if (response.ok) {
        const data = await response.text();
        return data.split("\n");
      } else {
        console.log(response.status);
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }


  toJson() {
    return {
      url: this.url,
      title: this.title,
      streamer: this.streamer,
      lenght: this.lenght,
      streamDate: this.streamDate,
      // VideoData: this.VideoData,
      resolutions: this.resolutions,
      downloading: this.downloading,
      donwloadUrl: this.donwloadUrl,
      thumbnail: this.thumbnail,
    };
  }

  async fromJson(jsonData: {
    [key: string]: any;
  }) {

    this.title = jsonData.livestream.session_title;
    this.streamer = jsonData.livestream.channel.slug;
    this.thumbnail = jsonData.livestream.thumbnail;
    this.streamDate = jsonData.livestream.created_at.split(" ")[0];

    this.lenght = jsonData.livestream.duration
    this.resolutions = await this.getVideoQuality(jsonData.source) ?? [];



  }



  async downloadTS(downloadURL: string, tsNumber: string) {
    await axios
      .get(downloadURL + "/" + tsNumber, {
        responseType: "stream",
      })
      .then((response) => {
        response.data.pipe(fs.createWriteStream(tsNumber + ".ts"));
        // wait till the download finishes
        response.data.on("end", () => {
          console.log("Downloaded " + tsNumber);
        });
      });
  }

  async DonwloadVod(selectedQuality: string, start: number = 0, end: number = 0) {
    // this will download the vod
    // Video: Video Class Object
    const playlist = await this.getVideoPlaylist(selectedQuality);
    console.log(playlist);

    if (playlist === null) {
      return;
    }
  }

}
