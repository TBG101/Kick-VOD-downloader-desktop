const { default: axios } = require("axios");
const { exctractResolutionFromMaster } = require("../utils/utils.js");
import * as fs from "fs";

class VideoController {
  async getVideoData(Video) {
    // this will get the vod info from the kick api and add it to the video object and return it as well
    // Video: Video Class Object

    const split_url = Video.url.split("/");
    const id = split_url[split_url.length - 1];
    const api_url = `https://kick.com/api/v1/video/${id}?${Date.now()}`;
    let resposne;
    try {
      resposne = await fetch(api_url, {
        method: "GET",
      });
    } catch (e) {
      console.log(e);
    }

    if (resposne.ok) {
      const data = await resposne.json();
      Video.VideoData = data;
      return data;
    } else {
      return null;
    }
  }

  async getVideoQuality(Video) {
    // this will get the video quality from the kick api and return it
    // Video: Video Class Object
    const api_link = Video.VideoData["source"];
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

  async getVideoPlaylist(Video, selectedQuality) {
    // Video: Video Class Object
    video.donwloadUrl = Video.VideoData["source"].replace(
      RegExp(String.raw("master.[^/]*$")),
      `${selectedQuality}/`
    );

    try {
      const response = await fetch(video.donwloadUrl + playlist.m3u8);
      if (response.ok) {
        const data = await response.text();
        return data.split("\n");
      } else return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async downloadTS(downloadURL, tsNumber) {
    await axios
      .get(downloadURL + "/" + tsNumber + ".ts", {
        responseType: "stream",
      })
      .then((response) => {
        response.data.pipe(fs.createWriteStream(tsNumber + ".ts"));
        // wait till the download finishes
        response.data.on("end", () => {
          console.log("Downloaded " + tsNumber + ".ts");
        });
      });
  }

  async DonwloadVod(video, selectedQuality) {
    // this will download the vod
    // Video: Video Class Object
    const playlist = this.getVideoPlaylist(video, selectedQuality);
    if (playlist === null) {
      return;
    }
    const resolution = exctractResolutionFromMaster(playlist);
    video.resolutions = resolution;
    video.downloading = true;

    for (let i = 0; i < playlist.length; i++) {
      await this.downloadTS(video.donwloadUrl, playlist[i]);
    }
    video.downloading = false;
  }
}
