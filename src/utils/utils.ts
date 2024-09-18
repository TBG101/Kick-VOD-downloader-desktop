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


