import fs from "fs";
import axios from "axios";
import { exctractResolutionFromMaster, getCurrentDir, checkFolderName, mergeAllTsFiles, convertToMp4, deleteAllTs } from "../utils/utils";
import { BrowserWindow, ipcMain } from "electron";
const { pipeline } = require('stream');

interface tsFile {
  lenght: number;
  name: string;
}

interface getPlaylistData {
  length: number;
  playlist: tsFile[];
}


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
  browserWindow: BrowserWindow;

  constructor(url: String, browserWindow: BrowserWindow) {
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
    this.browserWindow = browserWindow;
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

  async getVideoData(): Promise<{ [key: string]: any }> {
    // this will get the vod info from the kick api and add it to the video object and return it as well
    console.log("getting vod data");

    return new Promise(async (resolve, reject) => {
      const split_url = this.url.split("/");
      const id = split_url[split_url.length - 1];
      const api_url = `https://kick.com/api/v1/video/${id}?${Date.now()}`;

      console.log(api_url, "zafazefaz");

      try {
        const response = await fetch(api_url, {
          credentials: "include",
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36 Edg/127.0.0.0",
            "Referer": "https://kick.com/",
            "Origin": "https://kick.com",
          }
        })
        if (response.ok) {
          console.log(response.status);
          const responseJson = await response.json();
          this.browserWindow.webContents.send("updateProgress", 0);
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
    console.log("download url is" + this.donwloadUrl);

    this.donwloadUrl = this.VideoData.source.replace(
      RegExp("master.[^/]*$"),
      `${selectedQuality}/`
    );

    try {
      const response = await fetch(this.donwloadUrl + "playlist.m3u8",
        {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36 Edg/127.0.0.0",
            "Referer": "https://kick.com/",
            "Origin": "https://kick.com",
          },
        }

      );
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

  private getTsFiles(playlist: string[], start = 0, end = 0): getPlaylistData {
    const tsList: tsFile[] = [];
    let currentLenght = 0;
    for (let i = 0; i < playlist.length; i++) {
      if (playlist[i].includes("#EXTINF:") === false) continue;
      // get the number.ts
      const tsLenght = playlist[i].replaceAll("#EXTINF:", "").replaceAll(",", "");

      currentLenght += parseFloat(tsLenght) * 1000;

      // get ts files between time stamp specified
      if (currentLenght > end && end !== 0) break;
      if (start >= currentLenght) continue;

      const tsFileNumber = playlist[i + 1];
      tsList.push({ lenght: parseFloat(tsLenght), name: tsFileNumber });

    }
    const data: getPlaylistData = {
      length: currentLenght,
      playlist: tsList,
    };
    return data;
  }

  // download the ts file from the server
  async downloadTS(downloadBaseURL: string, ts: tsFile, baseSavePath: string) {
    console.log(downloadBaseURL + "/" + ts.name);

    const response = await fetch(downloadBaseURL + ts.name, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36 Edg/127.0.0.0",
        "Referer": "https://kick.com/",
        "Origin": "https://kick.com",
      },
    });
    const dest = fs.createWriteStream(baseSavePath + ts.name);

    await new Promise<void>((resolve, reject) => {
      pipeline(response.body, dest, (err: any) => {
        if (err) {
          console.error('Pipeline failed.', err);
          reject
        } else {
          console.log('Pipeline succeeded.');
          resolve();
        }
      });
    });

  }

  async DonwloadVod(selectedQuality: string, start: number = 0, end: number = 0) {
    // this will download the vod
    // Video: Video Class Object

    const FolderName = checkFolderName(this.streamer + "_" + this.title);

    const baseSavePath = await getCurrentDir() + "/" + FolderName + "/";
    fs.mkdirSync(baseSavePath);
    const playlistData = await this.getVideoPlaylist(selectedQuality);
    console.log("playlist is" + playlistData);

    if (!playlistData) return;

    const { playlist, length } = this.getTsFiles(playlistData, start, end);
    console.log("playlist is" + playlist);

    let finishedTs = 0;
    let currentQuee = 0;
    // start downloadinng all the ts files
    for (let i = 0; i < playlist.length; i++) {
      while (currentQuee >= 10) {
        await setTimeout(() => {

        }, 250);
      }

      this.downloadTS(this.donwloadUrl, playlist[i], baseSavePath).then(() => {
        finishedTs++;
        console.log("number of ts finisehd ", finishedTs, "percentage is : ", (finishedTs / playlist.length) * 100);
        // send data to UI.
        this.browserWindow.webContents.send("updateProgress", (finishedTs / playlist.length) * 100);
        currentQuee--;
      });
    }

    mergeAllTsFiles(baseSavePath);
    convertToMp4(baseSavePath);
    deleteAllTs(baseSavePath);
  }
}
