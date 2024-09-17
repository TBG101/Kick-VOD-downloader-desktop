import fs from "fs";
import axios from "axios";

export class Video {
  url: String;
  title: string;
  streamer: string;
  lenght: number;
  streamDate: string;
  VideoData: Map<string, any>;
  resolutions: String[];
  downloading: boolean;
  donwloadUrl: string;
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
  }


  async getVideoData(): Promise<Map<any, any>> {
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
        console.log(response.headers.forEach((value, name) => {
          console.log(name, value);
        }));


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

  async getVideoQuality() {
    // this will get the video quality from the kick api and return it
    const api_link: string = this.VideoData.get("source") ?? "";

    try {
      const response = await fetch(api_link, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getVideoPlaylist(selectedQuality: String) {
    // Video: Video Class Object
    this.donwloadUrl = this.VideoData.get("source").replace(
      RegExp("master.[^/]*$"),
      `${selectedQuality}/`
    );

    try {
      const response = await fetch(this.donwloadUrl + "playlist.m3u8");
      if (response.ok) {
        const data = await response.text();
        return data.split("\n");
      } else return null;
    } catch (e) {
      console.log(e);
      return null;
    }
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
    if (playlist === null) {
      return;
    }
  }

  toJson() {
    return {
      url: this.url,
      title: this.title,
      streamer: this.streamer,
      lenght: this.lenght,
      streamDate: this.streamDate,
      VideoData: this.VideoData,
      resolutions: this.resolutions,
      downloading: this.downloading,
      donwloadUrl: this.donwloadUrl,
    };
  }

}
