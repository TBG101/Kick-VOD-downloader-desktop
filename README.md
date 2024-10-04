# Kick.com Video Downloader

Kick.com Video Downloader is a cross-platform desktop application built with [ElectronJS](https://www.electronjs.org/), allowing users to download videos from [Kick.com](https://www.kick.com) with precise time selections.

## Features

- **Download Videos from Kick.com**: Easily download videos from Kick.com by pasting the video URL.
- **Download Specific Time**: Choose the exact start and end time for downloading a specific portion of the video.
- **Cross-Platform**: The App runs on windows only at the moment.
- **User-Friendly Interface**: Simple and intuitive design for easy use.

## Tech Stack

- **ElectronJS**: Main framework for building cross-platform desktop apps.
- **FFmpeg**: Used for trimming videos to the exact time range.
- **Kick.com API**: Fetch video data from Kick.com.

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TBG101/Kick-VOD-downloader-desktop
   cd Kick-VOD-downloader-desktop
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the app**
   ```bash
   npm start
   ```

## How to use

1. Paste Video URL: Enter the URL of the video from Kick.com that you want to download.
2. Select Time Range: Input the start and end time (hh:mm) for the specific portion of the video you want to download.
3. Choose Video Format: Select your preferred video format.
4. Download: Click on the download button to start downloading the video.
5. Queue Management: If you wish to download multiple videos, you can add them to the queue and download them in sequence.

## Screenshots
Soon

## TODO
 - [ ] Make the app run on linux and macOS
 - [ ] Add Quee for multiple downloads
 - [ ] Imporve Error handling  

## Contributing
Feel free to open issues or submit pull requests to improve this app.

## License
This project is licensed under the MIT License. See the LICENSE file for details.


