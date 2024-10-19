const { ipcRenderer } = require("electron");

const fetchVideoDataElement = document.getElementById("fetch-data-btn");
const downloadVideoElement = document.getElementById("download-btn");
const videoUrlElement = document.getElementById("video-url");
const qualitySelectorElement = document.getElementById("quality-select");
const progressPercentageElement = document.getElementById(
  "progress-percentage"
);

// input fields for start and end time
const startTimeHour = document.getElementById("start_time_input_h");
const startTimeMinute = document.getElementById("start_time_input_m");
const startTimeSecond = document.getElementById("start_time_input_s");

const endTimeHour = document.getElementById("end_time_input_h");
const endTimeMinute = document.getElementById("end_time_input_m");
const endTimeSecond = document.getElementById("end_time_input_s");

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

function checkTimeInputFormat() {
  if (startTimeHour.value > 23) {
    startTimeHour.value = 23;
  }
  if (startTimeMinute.value > 59) {
    startTimeMinute.value = 59;
  }
  if (startTimeSecond.value > 59) {
    startTimeSecond.value = 59;
  }
  if (endTimeHour.value > 23) {
    endTimeHour.value = 23;
  }
  if (endTimeMinute.value > 59) {
    endTimeMinute.value = 59;
  }
  if (endTimeSecond.value > 59) {
    endTimeSecond.value = 59;
  }
}

function downloadVideoFile() {
  console.log(currentVideo);
  if (checkTimeInputFormat() === false) {
    console.log("Uncorrect time input format");
    // TODO handle exception here
    return;
  }

  const startTime = `${startTimeHour.value}:${startTimeMinute.value}:${startTimeSecond.value}`;
  const endTime = `${endTimeHour.value}:${endTimeMinute.value}:${endTimeSecond.value}`;

  const data = {
    video: currentVideo,
    quality: qualitySelectorElement.value,
    startTime: startTime,
    endTime: endTime,
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
