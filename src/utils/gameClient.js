import Promise from 'bluebird';
import md5 from 'md5';
import md5File from 'md5-file/promise';
import { forEach } from 'lodash';
import { exists, readFile, readdir, writeFile } from './fs';
import { gameClientPath, gameClientPackageFilePath, gameClientHashMapFilePath, gameClientExtractedPath } from './path';

const requiredFiles = [
  'datatable/item.edf',
  'rf_online.bin',
];

function checkExists() {
  return Promise.mapSeries(requiredFiles, (subpath) => {
    return exists(gameClientPath(subpath));
  })
    .then((results) => {
      return !(results.find((res) => res === false) === false);
    });
}

function checkExistsPackage() {
  return exists(gameClientPackageFilePath());
}

function checkExistsHashMap(path) {
  return exists(path || gameClientHashMapFilePath());
}

function readHashMap(path) {
  return readFile(path || gameClientHashMapFilePath())
    .then((buf) => {
      const str = buf.toString();
      const json = JSON.parse(str);
      return json;
    })
    .catch((err) => {
      console.error(err);
      return {}; // igonore error
    });
}

function writeHashMap(hashMap = {}) {
  const str = JSON.stringify(hashMap);
  return writeFile(gameClientHashMapFilePath(), str);
}

function entryFormatter(string = '') {
  let newString = string;
  newString = newString.replace(gameClientExtractedPath(), '');
  newString = newString.replace(/[^a-z0-9.\-_]/gi, '');
  return newString.toLowerCase();
}

function buildHashMap() {
  return readdir(gameClientExtractedPath())
    .then((files) => {
      return files.map((file) => {
        const entry = entryFormatter(file);
        return { path: file, entry, md5: md5(entry), version: '' };
      });
    })
    .then((files) => {
      return Promise.mapSeries(files, async (file) => ({
        ...file,
        version: await md5File(file.path),
      }));
    })
    .then((hashMap) => {
      const objectMap = {};
      hashMap.forEach((file) => {
        if (objectMap[file.md5] !== undefined) {
          console.error('Name duplicated', file);
        }
        objectMap[file.md5] = file;
      });
      return objectMap;
    });
}

function getHashMapVersion(hashMap) {
  const strs = [];
  forEach(hashMap, (file) => {
    strs.push(file.version);
  });
  return md5(strs.sort().join(''));
}

function compareHashMaps(actual = {}, current = {}) {
  const notCompared = {};

  forEach(actual, (file, key) => {
    // update this files
    if (current[key] === undefined || current[key].version !== file.version) {
      notCompared[key] = {
        actual: file,
        current: current[key],
      };
    }
  });

  forEach(current, (file, key) => {
    // remove this files
    if (actual[key] === undefined) {
      notCompared[key] = {
        actual: undefined,
        current: file,
      };
    }
  });

  return notCompared;
}

export default {
  checkExists,
  checkExistsPackage,
  checkExistsHashMap,
  readHashMap,
  buildHashMap,
  getHashMapVersion,
  compareHashMaps,
  writeHashMap,
}
