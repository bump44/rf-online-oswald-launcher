import Promise from "bluebird";
import md5 from "md5";
import md5File from "md5-file/promise";
import { forEach } from "lodash";
import { exists, readFile, readdir, writeFile } from "./fs";
import {
  gameClientPath,
  gameClientPackageFilePath,
  gameClientHashMapFilePath,
  gameClientExtractedPath
} from "./path";

const requiredFiles = ["datatable/item.edf", "rf_online.bin"];

async function checkExists() {
  const results = await Promise.mapSeries(requiredFiles, subpath => {
    return exists(gameClientPath(subpath));
  });

  return !(results.find(res => res === false) === false);
}

function checkExistsPackage() {
  return exists(gameClientPackageFilePath());
}

function checkExistsHashMap(path) {
  return exists(path || gameClientHashMapFilePath());
}

function readHashMap(path) {
  try {
    const buf = await readFile(path || gameClientHashMapFilePath());
    const str = buf.toString();
    const json = JSON.parse(str);
    return json;
  } catch (error) {
    console.error(error);
    return {}; // igonore error
  }
}

function writeHashMap(hashMap = {}) {
  const str = JSON.stringify(hashMap);
  return writeFile(gameClientHashMapFilePath(), str);
}

function entryFormatter(string = "") {
  let newString = string;
  newString = newString.replace(gameClientExtractedPath(), "");
  newString = newString.replace(/[^a-z0-9.\-_]/gi, "");
  return newString.toLowerCase();
}

async function buildHashMap() {
  const hashMap = await Promise.mapSeries(await readdir(gameClientExtractedPath()), async file => {
    const entry = entryFormatter(file);
    return { path: file, entry, md5: md5(entry), version: "", version: await md5File(file) };
  });

  const objectMap = {};
  hashMap.forEach(file => {
    if (objectMap[file.md5] !== undefined) {
      console.error("Name duplicated", file);
    }
    objectMap[file.md5] = file;
  });
  return objectMap;
}

function getHashMapVersion(hashMap) {
  const strs = [];
  forEach(hashMap, file => {
    strs.push(file.version);
  });
  return md5(strs.sort().join(""));
}

function compareHashMaps(actual = {}, current = {}) {
  const notCompared = {};

  forEach(actual, (file, key) => {
    // update this files
    if (current[key] === undefined || current[key].version !== file.version) {
      notCompared[key] = {
        actual: file,
        current: current[key]
      };
    }
  });

  forEach(current, (file, key) => {
    // remove this files
    if (actual[key] === undefined) {
      notCompared[key] = {
        actual: undefined,
        current: file
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
  writeHashMap
};
