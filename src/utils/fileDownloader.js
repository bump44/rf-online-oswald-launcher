import request from 'request';
import Promise from 'bluebird';
import { createWriteStream, mkdir, rename } from './fs';
import { temporaryFilePath, temporaryPath } from './path';

class FileDownloader {
  constructor(url) {
    this.url = url;
    this.totalBytes = 0;
    this.downloadedBytes = 0;
    this.request;
    this.response;
    this.writeFilePath;
    this.writeStream;
  }
  start(tickHandler) {
    return new Promise(async (resolve, reject) => {
      await mkdir(temporaryPath());
      this.writeFilePath = temporaryFilePath();
      this.writeStream = createWriteStream(this.writeFilePath);

      this.request = request({
        method: 'get',
        uri: this.url,
      });
      this.request.pipe(this.writeStream);
      this.request.on('error', (err) => reject(err));
      this.request.on('response', (response) => {
        this.response = response;
        this.totalBytes = parseInt(response.headers['content-length'], 10) || 0;
        if (response.statusCode !== 200) {
          this.request.abort();
          return reject(new Error(response.statusMessage));
        }
      });
      this.request.on('data', (buf) => {
        this.downloadedBytes += buf.length;
        if (typeof tickHandler === 'function') {
          tickHandler(this);
        }
      });
      this.request.on('end', () => resolve(this));
    });
  }
  getPercent() {
    if (this.totalBytes <= 0) {
      return 0;
    }
    if (this.downloadedBytes >= this.totalBytes) {
      return 100;
    }
    return parseFloat((this.downloadedBytes / this.totalBytes * 100).toFixed(2));
  }
  rename(newPath) {
    return rename(this.writeFilePath, newPath)
      .then(() => this);
  }
}

export default FileDownloader;
