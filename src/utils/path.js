import path from 'path';
import { remote } from 'electron';
import { GAME_CLIENT_EXTRACTED_PATH, GAME_CLIENT_PACKAGE_PATH, GAME_CLIENT_PACKAGE_NAME, TEMPORARY_PATH, GAME_CLIENT_HASH_MAP_FILE_PATH, GAME_CLIENT_HASH_MAP_FILE_NAME, APP_DATA_HOME_PATH } from './constants';

const { app } = remote;
const homePath = app.getPath('home');
const appDataPath = path.resolve(homePath, APP_DATA_HOME_PATH);

function randomString() {
  return Math.random().toString(36).substring(7);
}

export const gameClientPath = (subpath = '') => path.resolve(appDataPath, GAME_CLIENT_EXTRACTED_PATH, subpath);
export const gameClientPackageFilePath = () => path.resolve(appDataPath, `${GAME_CLIENT_PACKAGE_PATH}/${GAME_CLIENT_PACKAGE_NAME}`);
export const gameClientPackagePath = () => path.resolve(appDataPath, GAME_CLIENT_PACKAGE_PATH);
export const gameClientExtractedPath = () => path.resolve(appDataPath, GAME_CLIENT_EXTRACTED_PATH);
export const gameClientExtractedHashMapFilePath = () => path.resolve(appDataPath, `${GAME_CLIENT_EXTRACTED_PATH}/${GAME_CLIENT_HASH_MAP_FILE_NAME}`);
export const gameClientExtractedDefaultSetFilePath = () => gameClientPath('./System/DefaultSet.tmp');
export const gameClientExtractedRfOnlineBinFilePath = () => gameClientPath('./RF_Online.bin');
export const gameClientHashMapFilePath = () => path.resolve(appDataPath, GAME_CLIENT_HASH_MAP_FILE_PATH);
export const temporaryPath = () => path.resolve(appDataPath, TEMPORARY_PATH);
export const temporaryRandomPath = () => path.resolve(appDataPath, `${TEMPORARY_PATH}/${randomString()}`);
export const temporaryFilePath = () => path.resolve(appDataPath, `${TEMPORARY_PATH}/${randomString()}.temp`);
