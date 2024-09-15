class VideoQueeModel {
  constructor() {
    this.Quee = [];
    this.isDonwloading = false;
  }
  addVideo(video) {
    this.Quee.push(video);
  }
  removeVideo(video) {
    this.Quee = this.Quee.filter((vid) => vid.url !== video.url);
  }

  getVideo(url) {
    return this.Quee.find((vid) => vid.url === url);
  }

  async StartQueeDonwloading(selectedQuality) {
    if (this.isDonwloading) return;
    this.isDonwloading = true;
    while (this.Quee.length > 0) {
      const vid = this.Quee.pop();
      if (!vid) return;
      await vid.DonwloadVod(vid, selectedQuality);
    }
    this.isDonwloading = false;
  }
}
