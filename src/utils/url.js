import { GAME_CLIENT_DOWNLOAD_PACKAGE_URL, GAME_CLIENT_DOWNLOAD_FILE_URL } from './constants';

export function getGameClientPackageUrl() {
  return GAME_CLIENT_DOWNLOAD_PACKAGE_URL;
}

export function getGameClientFileUrl(filename) {
  return GAME_CLIENT_DOWNLOAD_FILE_URL.replace(':filename', filename);
}
