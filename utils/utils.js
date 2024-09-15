export const exctractResolutionFromMaster = (intputString) => {
  const lines = intputString.split("\n");
  let outputQuality = [];

  lines.array.forEach((element) => {
    if (element.contains("/playlist.m3u8")) {
      outputQuality.push(element.replace("/playlist.m3u8", ""));
    }
  });
  return outputQuality;
};


