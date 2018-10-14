import fs from 'fs';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import recreaddir from 'recursive-readdir';

export const stat = path =>
  new Promise((resolve, reject) =>
    fs.stat(path, (err, res) => (err ? reject(err) : resolve(res))),
  );
export const exists = path =>
  new Promise(resolve =>
    fs.stat(path, err => (err ? resolve(false) : resolve(true))),
  );
export const createWriteStream = path => fs.createWriteStream(path);
export const unlink = path =>
  new Promise((resolve, reject) =>
    fs.unlink(path, err => {
      if (err && err.code !== 'ENOENT') {
        return reject(err);
      }
      return resolve(true);
    }),
  );

export const readFile = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, buf) => {
      if (err) {
        return reject(err);
      }

      return resolve(buf);
    });
  });

export const writeFile = (path, buf) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, buf, err => {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });

export const mkdir = path =>
  new Promise((resolve, reject) => {
    mkdirp(path, err => {
      if (err) {
        return reject(err);
      }

      return resolve(path);
    });
  });

export const rmdir = path =>
  new Promise((resolve, reject) => {
    rimraf(path, [], err => {
      if (err) {
        return reject(err);
      }

      return resolve(path);
    });
  });

export const rename = (oldPath, newPath) =>
  new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, err => {
      if (err) {
        return reject(err);
      }
      return resolve(newPath);
    });
  });

export const readdir = path => recreaddir(path);
