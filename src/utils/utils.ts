export const exctractResolutionFromMaster = (intputString: string) => {
  const lines = intputString.split("\n");
  let outputQuality: string[] = [];

  lines.forEach((element) => {
    if (element.includes("/playlist.m3u8")) {
      outputQuality.push(element.replace("/playlist.m3u8", ""));
    }
  });
  return outputQuality;
};

// function to get the current working directory
export const getCurrentDir = () => {
  return process.cwd();
}


// check if folder name can be used and is valid else change invalid characters to _
export const checkFolderName = (folderName: string) => {
  return folderName.replace(/[^a-z0-9]/gi, '_');
}


// parse time of hh:mm:ss to milliseconds
export const parseTimeToMs = (time: string) => {
  const timeArray = time.split(":");
  return parseInt(timeArray[0]) * 60 * 60 * 1000 + parseInt(timeArray[1]) * 60 * 1000 + parseInt(timeArray[2]) * 1000;
}

