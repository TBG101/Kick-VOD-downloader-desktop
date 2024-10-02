const execSync = require('child_process').execSync;


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
  console.log(time);

  const timeArray = time.split(":");
  return parseInt(timeArray[0]) * 60 * 60 * 1000 + parseInt(timeArray[1]) * 60 * 1000 + parseInt(timeArray[2]) * 1000;
}

export const mergeAllTsFiles = (basePath: string) => {
  execSync(`cd ${basePath} & copy /b *.ts all.ts`);
}

export const convertToMp4 = (basePath: string) => {
  // convert all.ts to mp4 with ffmpeg
  execSync(`ffmpeg -i ${basePath}all.ts -c copy ${basePath}output.mp4`);
}

export const deleteAllTs = (basePath : string) =>{
  //delete all tsfiles in directory
  execSync(`cd ${basePath} & del *.ts`); 
}