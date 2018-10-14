import {
  GAME_CLIENT_UPDATE_SERVER_URL,
  SOCKET_CONNECTION_URL,
  PROGRAM_UPDATE_SERVICE_URL,
  ACCOUNT_URL,
  FORUM_URL,
} from '../config';

import packagejson from '../../package.json';

export {
  GAME_CLIENT_UPDATE_SERVER_URL,
  SOCKET_CONNECTION_URL,
  PROGRAM_UPDATE_SERVICE_URL,
  ACCOUNT_URL,
  FORUM_URL,
};

export const APP_DATA_HOME_PATH = packagejson.productName || '__rf_online__';
export const GAME_CLIENT_PACKAGE_PATH = 'game_client/package';
export const GAME_CLIENT_PACKAGE_NAME = 'game_client.zip';
export const GAME_CLIENT_EXTRACTED_PATH = 'game_client/extracted';
export const GAME_CLIENT_VERSION_URL = `${GAME_CLIENT_UPDATE_SERVER_URL}/version`;
export const GAME_CLIENT_DOWNLOAD_PACKAGE_URL = `${GAME_CLIENT_UPDATE_SERVER_URL}/download/package/game_client.zip`;
export const GAME_CLIENT_DOWNLOAD_HASH_MAP_URL = `${GAME_CLIENT_UPDATE_SERVER_URL}/download/hash_map.json`;
export const GAME_CLIENT_DOWNLOAD_FILE_URL = `${GAME_CLIENT_UPDATE_SERVER_URL}/download/file/:filename`;
export const GAME_CLIENT_HASH_MAP_FILE_NAME = 'hash_map.json';
export const GAME_CLIENT_HASH_MAP_FILE_PATH = `game_client/${GAME_CLIENT_HASH_MAP_FILE_NAME}`;

export const SOCKET_ACTION_API_GET_TOKEN = 'api_getToken';
export const SOCKET_ACTION_API_ACTIVATE_TOKEN = 'api_activateToken';
export const SOCKET_ACTION_API_USER_ACCOUNTS_INDEX_BY_USER_ID =
  'api_userAccounts_indexByUserId';
export const SOCKET_ACTION_API_USER_ACCOUNTS_CREATE = 'api_userAccounts_create';
export const SOCKET_ACTION_API_CREATE_SESSION = 'api_createSession';

export const SOCKET_LISTEN_UR = 'ur';
export const SOCKET_LISTEN_USER_ACCOUNTS_CREATED = 'userAccounts_created';
export const SOCKET_LISTEN_USER_ACCOUNTS_UPDATED = 'userAccounts_updated';
export const SOCKET_LISTEN_SERVER_LOGIN__HAVE_NEW_STATE =
  'serverLogin__haveNewState';
export const SOCKET_LISTEN_SERVER_DISPLAY__HAVE_NEW_STATE =
  'serverDisplay__haveNewState';

export const LS_STATE_USER = '__state_user__';
export const TEMPORARY_PATH = 'temporary';
