import path from 'path';
import { GAME_CLIENT_EXTRACTED_PATH, GAME_CLIENT_PACKAGE_PATH, GAME_CLIENT_PACKAGE_NAME, TEMPORARY_PATH, GAME_CLIENT_HASH_MAP_FILE_PATH, GAME_CLIENT_HASH_MAP_FILE_NAME } from './constants';

function randomString() {
  return Math.random().toString(36).substring(7);
}

export const gameClientPath = (subpath = '') => path.resolve('./common', GAME_CLIENT_EXTRACTED_PATH, subpath);
export const gameClientPackageFilePath = () => path.resolve('./common', `${GAME_CLIENT_PACKAGE_PATH}/${GAME_CLIENT_PACKAGE_NAME}`);
export const gameClientPackagePath = () => path.resolve('./common', GAME_CLIENT_PACKAGE_PATH);
export const gameClientExtractedPath = () => path.resolve('./common', GAME_CLIENT_EXTRACTED_PATH);
export const gameClientExtractedHashMapFilePath = () => path.resolve('./common', `${GAME_CLIENT_EXTRACTED_PATH}/${GAME_CLIENT_HASH_MAP_FILE_NAME}`);
export const gameClientExtractedDefaultSetFilePath = () => gameClientPath('./System/DefaultSet.tmp');
export const gameClientExtractedRfOnlineBinFilePath = () => gameClientPath('./RF_Online.bin');
export const gameClientHashMapFilePath = () => path.resolve('./common', GAME_CLIENT_HASH_MAP_FILE_PATH);
export const temporaryPath = () => path.resolve(TEMPORARY_PATH);
export const temporaryRandomPath = () => path.resolve(`${TEMPORARY_PATH}/${randomString()}`);
export const temporaryFilePath = () => path.resolve(`${TEMPORARY_PATH}/${randomString()}.temp`);
