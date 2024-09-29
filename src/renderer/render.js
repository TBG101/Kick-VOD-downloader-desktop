const { ipcRenderer } = require("electron");

const fetchVideoDataElement = document.getElementById("fetch-data-btn");
const downloadVideoElement = document.getElementById("download-btn");
const videoUrlElement = document.getElementById("video-url");
const qualitySelectorElement = document.getElementById("quality-select");
const progressPercentageElement = document.getElementById(
  "progress-percentage"
);
const startTime = document.getElementById("start-time");
const endTime = document.getElementById("end-time");

const progressFill = document.querySelector(".progress-fill");

let currentVideo = {};

fetchVideoDataElement.addEventListener("click", fetchVideoData);

downloadVideoElement.addEventListener("click", downloadVideoFile);

listenForProgressUpdates();

function listenForProgressUpdates() {
  ipcRenderer.on("updateProgress", (event, progress) => {
    console.log(progress);
    updateProgress(progress);
  });
}

function fetchVideoData() {
  ipcRenderer.invoke("getVideoData", videoUrlElement.value).then((data) => {
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

    qualitySelectorElement.innerHTML = '<option value="source">Source</option>';
    for (let i = 0; i < data.resolutions.length; i++) {
      qualitySelectorElement.innerHTML += `<option value="${data.resolutions[i]}">${data.resolutions[i]}</option>`;
    }
    qualitySelectorElement.removeAttribute("disabled");
  });
}

function downloadVideoFile() {
  console.log(currentVideo);
  const data = {
    video: currentVideo,
    quality: qualitySelectorElement.value,
    startTime: startTime.value,
    endTime: endTime.value,
  };
  console.log("Data to send from UI: ", data);

  // TODO add validation for start and end time
  ipcRenderer.invoke("downloadVideo", data);
}

function updateProgress(progress) {
  progressFill.style.width = `${progress}%`;
  progressPercentageElement.innerText = `${progress}%`;
  if (progress === 100) {
    progressFill.style.backgroundColor = "green";
  }
}
