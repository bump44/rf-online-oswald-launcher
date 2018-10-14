import request from 'request';
import Promise from 'bluebird';
import { createWriteStream, mkdir, rename } from './fs';
import { temporaryFilePath, temporaryPath } from './path';

class FileDownloader {
  constructor(url) {
    this.url = url;
    this.totalBytes = 0;
    this.downloadedBytes = 0;
    this.request = undefined;
    this.response = undefined;
    this.writeFilePath = undefined;
    this.writeStream = undefined;
  }

  start(tickHandler) {
    return new Promise(async (resolve, reject) => {
      await mkdir(temporaryPath());
      this.writeFilePath = temporaryFilePath();
      this.writeStream = createWriteStream(this.writeFilePath);

      try {
        this.request = request({
          method: 'get',
          uri: this.url,
        });
      } catch (err) {
        return reject(err);
      }

      this.request.pipe(this.writeStream);
      this.request.on('error', err => reject(err));
      this.request.on('response', response => {
        this.response = response;
        this.totalBytes = parseInt(response.headers['content-length'], 10) || 0;
        if (response.statusCode !== 200) {
          this.request.abort();
          return reject(new Error(response.statusMessage));
        }
        return undefined;
      });
      this.request.on('data', buf => {
        this.downloadedBytes += buf.length;
        if (typeof tickHandler === 'function') {
          tickHandler(this);
        }
      });
      this.request.on('end', () => resolve(this));
      return undefined;
    });
  }

  getPercent() {
    if (this.totalBytes <= 0) {
      return 0;
    }
    if (this.downloadedBytes >= this.totalBytes) {
      return 100;
    }
    return parseFloat(
      ((this.downloadedBytes / this.totalBytes) * 100).toFixed(2),
    );
  }

  async rename(newPath) {
    await rename(this.writeFilePath, newPath);
    return this;
  }
}

export default FileDownloader;
