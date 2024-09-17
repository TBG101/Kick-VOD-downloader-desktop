const fetchVideoDate = document.getElementById("fetch-data-btn");
const downloadVideo = document.getElementById("download-btn");
const videoUrl = document.getElementById("video-url");
const { ipcRenderer } = require("electron");

fetchVideoDate.addEventListener("click", () => {
  console.log("yes");

  ipcRenderer.send("fetch-data", videoUrl.value);
});
