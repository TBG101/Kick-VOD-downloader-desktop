const { ipcRenderer } = require("electron");

const fetchVideoData = document.getElementById("fetch-data-btn");
const downloadVideo = document.getElementById("download-btn");
const videoUrl = document.getElementById("video-url");
const qualitySelector = document.getElementById("quality-select");

const startTime = document.getElementById("start-time");
const endTime = document.getElementById("end-time");

let currentVideo = {};

fetchVideoData.addEventListener("click", fetchVideoData);

downloadVideo.addEventListener("click", downloadVideoFile);

function fetchVideoData() {
  ipcRenderer.invoke("getVideoData", videoUrl.value).then((data) => {
    console.log(data);
    currentVideo = data;
    document.getElementById(
      "image-container"
    ).innerHTML = `<img id="image" src="${data.thumbnail}" alt="thumbnail" />`;

    document.getElementById("title").innerText = "Title: " + data.title;
    document.getElementById("streamer").innerText =
      "Streamer: " + data.streamer;
    document.getElementById("date").innerText = "Date: " + data.streamDate;
    document.getElementById("duration").innerText =
      "Duration: " + Date(data.lenght);

    qualitySelector.innerHTML = '<option value="source">Source</option>';
    for (let i = 0; i < data.resolutions.length; i++) {
      qualitySelector.innerHTML += `<option value="${data.resolutions[i]}">${data.resolutions[i]}</option>`;
    }
    qualitySelector.removeAttribute("disabled");
  });
}

function downloadVideoFile() {
  console.log(currentVideo);

  // TODO add validation for start and end time
  ipcRenderer.invoke("downloadVideo", {
    video: currentVideo,
    quality: qualitySelector.value,
    startTime: startTime.value,
    endTime: endTime.value,
  });
}
