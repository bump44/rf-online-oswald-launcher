import React from 'react';
import Promise from 'bluebird';
import log from 'electron-log';
import { remote } from 'electron';
import axios from 'axios';
import queue from 'async/queue';
import { trim, throttle, get } from 'lodash';
import { execFile } from 'child_process';
import AppBar from '../components/AppBar';
import LoaderStyle from '../components/Loader';
import ScreenStyle from '../components/Screen';

import gameClient from '../utils/gameClient';
import FileDownloader from '../utils/fileDownloader';

import { getGameClientPackageUrl, getGameClientFileUrl } from '../utils/url';
import { mkdir, rmdir, unlink } from '../utils/fs';
import { gameClientPath, gameClientPackagePath, gameClientExtractedPath, temporaryPath, gameClientPackageFilePath, gameClientExtractedHashMapFilePath, gameClientExtractedDefaultSetFilePath, gameClientExtractedRfOnlineBinFilePath } from '../utils/path';
import { extract } from '../utils/zip';
import { GAME_CLIENT_DOWNLOAD_HASH_MAP_URL, GAME_CLIENT_VERSION_URL, SOCKET_CONNECTION_URL, SOCKET_ACTION_API_GET_TOKEN, LS_STATE_USER, SOCKET_ACTION_API_USER_ACCOUNTS_INDEX_BY_USER_ID, SOCKET_ACTION_API_USER_ACCOUNTS_CREATE, SOCKET_LISTEN_UR, SOCKET_LISTEN_USER_ACCOUNTS_CREATED, SOCKET_LISTEN_USER_ACCOUNTS_UPDATED, SOCKET_LISTEN_SERVER_LOGIN__HAVE_NEW_STATE, SOCKET_ACTION_API_ACTIVATE_TOKEN, PROGRAM_UPDATE_SERVICE_URL } from '../utils/constants';
import SocketClient from '../utils/socketClient';

const queueWorkers = queue((task, cb) => setImmediate(() => {
  task.onRunning();

  const defaultSetPath = gameClientExtractedDefaultSetFilePath();
  // const rfOnlineBinPath = gameClientExtractedRfOnlineBinFilePath();
  const rootPath = gameClientExtractedPath();
  const buffer = Buffer.from(task.defaultSet);

  // NEED VALID DEFAULTSET, BECAUSE CLIENT THROW LANG PACK ERROR
  // fs.writeFile(defaultSetPath, buffer, (err) => {
    // if (err) {
      // return cb(err);
    // }

    task.onExecution();
    const child = execFile('RF_Online.bin', { cwd: rootPath }, task.onExecutionOut);
    task.onChild(child);
    return cb();
  // });
}));

class Loader extends React.Component {
  constructor(props) {
    super(props);

    this.socketClient;

    this.connectToSocketServer = this.connectToSocketServer.bind(this);
    this.handleStateSocket = this.handleStateSocket.bind(this);
    this.handleSocketEventUr = this.handleSocketEventUr.bind(this);
    this.handleSocketEventUserAccountCreated = this.handleSocketEventUserAccountCreated.bind(this);
    this.handleSocketEventUserAccountUpdated = this.handleSocketEventUserAccountUpdated.bind(this);
    this.handleSocketEventServerLoginHaveNewState = this.handleSocketEventServerLoginHaveNewState.bind(this);

    this.execStartupCheckers = this.execStartupCheckers.bind(this);
    this.checkAndUpdateProgram = this.checkAndUpdateProgram.bind(this);
    this.checkAndUpdateGameClient = this.checkAndUpdateGameClient.bind(this);

    this.buildGameClientHashMap = this.buildGameClientHashMap.bind(this);
    this.checkExistsGameClientHashMap = this.checkExistsGameClientHashMap.bind(this);
    this.checkExistsGameClient = this.checkExistsGameClient.bind(this);
    this.checkUpdateGameClient = this.checkUpdateGameClient.bind(this);
    this.checkExistsGameClientPackage = this.checkExistsGameClientPackage.bind(this);
    this.downloadGameClientPackage = this.downloadGameClientPackage.bind(this);
    this.extractGameClientPackage = this.extractGameClientPackage.bind(this);
    this.createPaths = this.createPaths.bind(this);
    this.getProgressProps = this.getProgressProps.bind(this);

    this.changeStateServerLogin = this.changeStateServerLogin.bind(this);
    this.changeStateSocket = this.changeStateSocket.bind(this);
    this.changeStateGameClient = this.changeStateGameClient.bind(this);
    this.changeStateLogin = this.changeStateLogin.bind(this);
    this.changeStateUserAccountCreate = this.changeStateUserAccountCreate.bind(this);
    this.changeStateUser = this.changeStateUser.bind(this);
    this.changeStateLaunch = this.changeStateLaunch.bind(this);
    this.changeStateLaunchWorker = this.changeStateLaunchWorker.bind(this);
    this.changeStateUserAccounts = this.changeStateUserAccounts.bind(this);
    this.changeStateUserThrottle = throttle(() => window.localStorage.setItem(LS_STATE_USER, JSON.stringify(this.state.user)));

    this.onSubmitLogin = this.onSubmitLogin.bind(this);
    this.onSubmitTokenActivation = this.onSubmitTokenActivation.bind(this);
    this.onSubmitUserAccountCreate = this.onSubmitUserAccountCreate.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
    this.onClickBackFromTokenActivation = this.onClickBackFromTokenActivation.bind(this);
    this.onSelectUserAccount = this.onSelectUserAccount.bind(this);
    this.onClickLaunchUserAccount = this.onClickLaunchUserAccount.bind(this);
    this.onClickLaunchKillUserAccount = this.onClickLaunchKillUserAccount.bind(this);
    this.onChangeUserAudioPlayOnStart = (value) => this.changeStateUser({ audioPlayOnStart: !!value });

    let lsStateUser = {
      obj: null,
      jwt: '', // last used
      audioPlayOnStart: true,
      selected: null,
    };

    try {
      lsStateUser = Object.assign({}, lsStateUser, JSON.parse(window.localStorage.getItem(LS_STATE_USER, lsStateUser)) || lsStateUser);
    } catch (err) {
      console.error(err);
    }

    this.state = {
      user: lsStateUser,
      userAccounts: {
        isLoading: false,
        isError: false,
        errorMessage: '',
        accounts: [],
        selected: lsStateUser.selected,
      },
      userAccountCreate: {
        isLoading: false,
        isError: false,
        errorMessage: '',
        payload: {},
        response: null,
      },
      pages: {
        isLoading: false,
        isError: false,
        errorMessage: '',
        pages: [],
      },
      serverLogin: { bConnected: false, bConnection: false, lastECode: null },
      launch: {
        /**
         * { key: userAccountId
         *    queue: bool,
         *    account: object,
         *    running: bool,
         *    execution: bool,
         * }
         */
        workers: {},
      },
      login: {
        isLoading: false,
        isError: false,
        isActivation: false,
        errorMessage: '',
        payload: {},
        response: null,
      },
      socket: {
        isConnected: false,
        isConnecting: false,
      },
      isLoading: false,
      isError: false,
      message: '',
      programSettings: {
        brand: 'RF-Oswald',
        accountUrl: 'https://rf-oswald.ru',
        forumUrl: 'https://forum.rf-oswald.ru',
      },
      gameClient: {
        packageDownloaded: false, // game client package is exists?
        exists: false, // game client is exists?
        downloading: false, // state is downloading
        percent: 0, // downloaded/extracted percents
        extracting: false, // state is extracting
        hashMapExists: false, // game client hash map exists?
        hashMap: {},
        hashMapVersion: null,
        // external hash map data (downloading from the server)
        actualHashMapExists: false,
        actualHashMap: {},
        actualHashMapVersion: null,
      },
    };
  }

  componentWillMount() {
    log.info('Initialize loaders...');

    this.execStartupCheckers();
    this.socketClient = new SocketClient(SOCKET_CONNECTION_URL, { jwt: this.state.user.jwt });
    this.socketClient.setStateHandler(this.handleStateSocket);
    this.connectToSocketServer();
  }

  handleSocketEventUserAccountCreated(obj) {
    if (!this.state.user.obj || this.state.user.obj.id !== obj.userId) {
      return;
    }

    // prepend created account to the stack
    this.setState((prevState) => {
      const { accounts } = prevState.userAccounts;
      return {
        ...prevState,
        userAccounts: {
          ...prevState.userAccounts,
          accounts: [obj, ...accounts],
          selected: 0,
        },
      };
    });
  }

  handleSocketEventServerLoginHaveNewState(state = {}) {
    this.changeStateServerLogin({ ...state/* , bConnected: true */ });
  }

  handleSocketEventUserAccountUpdated(obj) {
    if (!this.state.user.obj || this.state.user.obj.id !== obj.userId) {
      return;
    }

    this.setState((prevState) => {
      const { accounts } = prevState.userAccounts;
      const nextAccounts = Object.assign([], accounts);
      const stateAccountIndex = nextAccounts.findIndex((account) => account.id === obj.id);
      const nextStateAccount = Object.assign({}, nextAccounts[stateAccountIndex], obj);
      nextAccounts[stateAccountIndex] = nextStateAccount;

      return {
        ...prevState,
        userAccounts: {
          ...prevState.userAccounts,
          accounts: [...nextAccounts],
        },
      };
    });
  }

  handleSocketEventUr(obj) {
    this.changeStateUser({ obj, accounts: [] });
    // load user accounts
    this.changeStateUserAccounts({ isLoading: true, isError: false, accounts: [] });

    if (!obj) {
      return;
    }

    this.socketClient.io.emit(SOCKET_ACTION_API_USER_ACCOUNTS_INDEX_BY_USER_ID, obj.id, (response) => {
      if (response.error) {
        this.changeStateUserAccounts({ isLoading: false, isError: true, errorMessage: response.error });
        console.error(SOCKET_ACTION_API_USER_ACCOUNTS_INDEX_BY_USER_ID, obj.id, response.error, response);
      } else {
        this.changeStateUserAccounts({ isLoading: false, accounts: response.result.results });
      }
    });
  }

  connectToSocketServer(jwt = null) {
    if (jwt !== null) {
      this.socketClient.setJwt(jwt);
      this.changeStateUser({ jwt });
    }

    this.socketClient.connect();
    this.socketClient.io.on(SOCKET_LISTEN_UR, this.handleSocketEventUr);
    this.socketClient.io.on(SOCKET_LISTEN_USER_ACCOUNTS_CREATED, this.handleSocketEventUserAccountCreated);
    this.socketClient.io.on(SOCKET_LISTEN_USER_ACCOUNTS_UPDATED, this.handleSocketEventUserAccountUpdated);
    this.socketClient.io.on(SOCKET_LISTEN_SERVER_LOGIN__HAVE_NEW_STATE, this.handleSocketEventServerLoginHaveNewState)
  }

  onClickLaunchKillUserAccount(account) {
    const key = account.id;
    const { workers } = this.state.launch;
    const worker = workers[key];

    if (worker && worker.execution && worker.pid) {
      process.kill(worker.pid);
    }
  }

  onClickLaunchUserAccount(account) {
    const key = account.id;
    log.info(`Launching account ${key}`)

    queueWorkers.push({
      defaultSet: [0x00],
      onRunning: () => this.changeStateLaunchWorker(key, { queue: false, running: true }),
      onExecution: () => this.changeStateLaunchWorker(key, { running: false, execution: true }),
      onExecutionOut: () => this.changeStateLaunchWorker(key, { running: false, execution: false, pid: null }),
      onChild: (child) => this.changeStateLaunchWorker(key, { pid: child.pid }),
    }, (err) => {
      if (err) {
        this.changeStateLaunchWorker(key, { queue: false, running: false, execution: false });
        console.error(err);
        log.error(`Failed launch account ${key}`);
        return;
      }
    });
  }

  onSelectUserAccount(account, index) {
    this.changeStateUserAccounts({ selected: index });
    this.changeStateUser({ selected: index }); // save to local storage
  }

  onClickLogout() {
    this.changeStateUser({ obj: null, jwt: '' });
    this.changeStateUserAccounts({ accounts: [] });
  }

  onClickBackFromTokenActivation() {
    this.changeStateLogin({ isActivation: false });
  }

  onSubmitLogin({ ident, password }) {
    const payload = { ident, password };
    this.changeStateLogin({ isLoading: true, isError: false, payload, response: null });

    this.socketClient.io.emit(SOCKET_ACTION_API_GET_TOKEN, payload, (response) => {
      const computed = {};
      if (response.error) {
        computed.errorMessage = `${response.code}: ${response.error}`;
      } else if (!response.result.isActive && !response.result.confirmed) {
        computed.isActivation = true;
      } else {
        this.connectToSocketServer(response.result.token);
        computed.isLoading = true; // force to loading, because we waiting response from socket
        this.socketClient.io.once('ur', () => this.changeStateLogin({ isLoading: false }));
      }
      this.changeStateLogin({ isLoading: false, isError: !!response.error, response, ...computed });
    });
  }

  onSubmitTokenActivation({ key }) {
    const token = get(this.state.login.response, 'result.token');
    const payload = { key, token };

    this.changeStateLogin({ isLoading: true, isError: false, payload, activationResponse: null });

    this.socketClient.io.emit(SOCKET_ACTION_API_ACTIVATE_TOKEN, payload, (activationResponse) => {
      const computed = {};
      if (activationResponse.error) {
        computed.errorMessage = `${activationResponse.code}: ${activationResponse.error}`;
      } else {
        this.connectToSocketServer(token);
        computed.isActivation = false;
        computed.isLoading = true; // force to loading, because we waiting response from socket
        this.socketClient.io.once('ur', () => this.changeStateLogin({ isLoading: false }));
      }
      this.changeStateLogin({ isLoading: false, isError: !!activationResponse.error, activationResponse, ...computed });
    });
  }

  onSubmitUserAccountCreate({ name }) {
    const payload = { name, userId: this.state.user.obj.id };
    this.changeStateUserAccountCreate({ isLoading: true, isError: false, payload, response: null });

    this.socketClient.io.emit(SOCKET_ACTION_API_USER_ACCOUNTS_CREATE, payload, (response) => {
      const computed = {};
      if (response.error) {
        computed.errorMessage = `${response.code}: ${response.error}`;
      }
      this.changeStateUserAccountCreate({ isLoading: false, isError: !!response.error, response, ...computed });
    });
  }

  handleStateSocket() {
    this.changeStateSocket({ isConnected: this.socketClient.isConnected, isConnecting: this.socketClient.isConnecting });
  }

  changeStateToLoading(message = 'Загрузка...') {
    this.setState({ isLoading: true, isError: false, message });
  }

  changeStateToError(message = 'Unknown') {
    this.setState({ isLoading: false, isError: true, message });
  }

  changeStateMessage(message = '') {
    this.setState({ message });
  }

  changeStateLaunch(nextState = {}) {
    this.setState((prevState) => ({
      ...prevState,
      launch: {
        ...prevState.launch,
        ...nextState,
      },
    }));
  }

  changeStateLaunchWorker(key, nextState = {}) {
    this.setState((prevState) => ({
      ...prevState,
      launch: {
        ...prevState.launch,
        workers: {
          ...prevState.launch.workers,
          [key]: {
            ...(prevState.launch.workers[key] || {}),
            ...nextState,
          },
        },
      },
    }));
  }

  changeStateServerLogin(nextState = {}) {
    this.setState((prevState) => ({
      ...prevState,
      serverLogin: {
        ...prevState.serverLogin,
        ...nextState,
      },
    }));
  }

  changeStateUserAccounts(nextState = {}) {
    this.setState((prevState) => ({
      ...prevState,
      userAccounts: {
        ...prevState.userAccounts,
        ...nextState,
      },
    }));
  }

  changeStateUser(nextState = {}) {
    this.setState((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        ...nextState,
      },
    }), this.changeStateUserThrottle);
  }

  changeStateUserAccountCreate(nextState = {}) {
    this.setState((prevState) => ({
      ...prevState,
      userAccountCreate: {
        ...prevState.userAccountCreate,
        ...nextState,
      },
    }));
  }

  changeStateLogin(nextState = {}) {
    this.setState((prevState) => ({
      ...prevState,
      login: {
        ...prevState.login,
        ...nextState,
      },
    }));
  }

  changeStateSocket(nextState = {}) {
    this.setState((prevState) => ({
      ...prevState,
      socket: {
        ...prevState.socket,
        ...nextState,
      },
    }));
  }

  changeStateGameClient(nextState = {}) {
    this.setState((prevState) => ({
      ...prevState,
      gameClient: {
        ...prevState.gameClient,
        ...nextState,
      },
    }));
  }

  execStartupCheckers() {
    this.changeStateToLoading();

    return Promise.delay(300)
      .then(() => this.createPaths())
      .then(() => this.checkAndUpdateProgram())
      .then(() => this.checkAndUpdateGameClient())
      .then(() => this.setState({ isLoading: false }))
      .catch((err) => this.changeStateToError(err.message));
  }

  createPaths() {
    this.changeStateMessage('Удаляем временные файлы...');

    return rmdir(temporaryPath())
      .then(() => {
        this.changeStateMessage('Проверяем и создаем директории клиента...');

        return Promise.all([
          mkdir(gameClientPackagePath()),
          mkdir(temporaryPath()),
        ]);
      });
  }

  checkAndUpdateProgram() {
    const { app, autoUpdater, dialog } = remote;
    const feedUrl = `${PROGRAM_UPDATE_SERVICE_URL}/update/${process.platform}/${app.getVersion()}`;

    log.info(`Setup autoUpdater, feed: ${feedUrl}`)

    this.changeStateMessage(`Проверяем обновления для лаунчера ${app.getVersion()}...`);
    autoUpdater.setFeedURL(feedUrl);

    try {
      autoUpdater.checkForUpdates();
      autoUpdater.on('update-downloaded', (evt, releaseNotes, releaseName) => {
        const dialogOpts = {
          type: 'info',
          buttons: ['Установить', 'Позже'],
          title: 'Доступно обновление',
          message: process.platform === 'win32' ? releaseNotes : releaseName,
          detail: `Загружена новая версия лаунчера '${releaseName}'. Установить сейчас?`
        };
        dialog.showMessageBox(dialogOpts, (response) => {
          if (response === 0) autoUpdater.quitAndInstall();
        });
      });
      autoUpdater.on('error', (err) => log.error('Failed check updates', err));
      setInterval(() => autoUpdater.checkForUpdates(), 5 * 60 * 1000);
      return Promise.resolve();
    } catch (err) {
      console.error(err);
      log.error('Failed setup autoUpdater', err);
      return Promise.resolve();
    }
  }

  checkAndUpdateGameClient() {
    return this.checkExistsGameClient()
      .then((exists) => {
        if (exists) {
          return this.checkUpdateGameClient();
        }

        return this.checkExistsGameClientPackage()
          .then((packageDownloaded) => {
            if (!packageDownloaded) {
              return this.downloadGameClientPackage();
            }
            return true;
          })
          .then(() => this.extractGameClientPackage())
          .then(() => this.checkUpdateGameClient());
      });
  }

  checkExistsGameClient() {
    this.changeStateMessage('Проверяем наличие игрового клиента...');

    return gameClient.checkExists()
      .then((exists) => {
        this.changeStateGameClient({ exists });
        return exists;
      });
  }

  checkExistsGameClientHashMap() {
    this.changeStateMessage('Проверяем наличие карты обновления игрового клиента...');

    return gameClient.checkExistsHashMap()
      .then((hashMapExists) => {
        this.changeStateGameClient({ hashMapExists });
        return hashMapExists;
      })
      .then((hashMapExists) => {
        if (hashMapExists) {
          return true;
        }

        // try load hashMap from game_client extracted files
        return gameClient
          .checkExistsHashMap(gameClientExtractedHashMapFilePath())
          .then((hashMapExists) => {
            if (hashMapExists) {
              return gameClient.readHashMap(gameClientExtractedHashMapFilePath())
                .then((hashMap) => gameClient.writeHashMap(hashMap).then(() => hashMap))
                .then((hashMap) => {
                  this.changeStateGameClient({
                    hashMapExists: true,
                    hashMap,
                  });
                  return true;
                });
            }

            return hashMapExists;
          });
      });
  }

  buildGameClientHashMap() {
    this.changeStateMessage('Создаем карту обновления игрового клиента...');

    return gameClient.buildHashMap()
      .then((hashMap) => {
        return gameClient.writeHashMap(hashMap).then(() => hashMap);
      })
      .then((hashMap) => {
        this.changeStateGameClient({
          hashMapExists: true,
          hashMap,
          hashMapVersion: gameClient.getHashMapVersion(hashMap)
        });
      });
  }

  checkUpdateGameClient() {
    this.setState({ message: 'Проверяем наличие обновлений...' });

    return this.checkExistsGameClientHashMap()
      .then((hashMapExists) => {
        if (hashMapExists) {
          return gameClient.readHashMap()
            .then((hashMap) => {
              this.changeStateGameClient({ hashMap, hashMapVersion: gameClient.getHashMapVersion(hashMap) });
              return hashMap;
            });
        }
        return this.buildGameClientHashMap();
      })
      .then(() => new Promise((resolve) => this.setState({}, resolve))) // next tick
      .then(() => {
        // upload external hash map
        return Promise.all([
          axios.get(GAME_CLIENT_DOWNLOAD_HASH_MAP_URL),
          axios.get(GAME_CLIENT_VERSION_URL),
        ])
        .spread((actualHashMapReq, actualHashMapVersionReq) => {
          const actualHashMap = actualHashMapReq.data;
          const actualHashMapVersion = actualHashMapVersionReq.data;
          this.changeStateGameClient({ actualHashMapExists: true, actualHashMapVersion, actualHashMap });
          return [actualHashMap, actualHashMapVersion];
        })
        .spread((actualHashMap, actualHashMapVersion) => {
          if (this.state.gameClient.hashMapVersion !== actualHashMapVersion) {
            return gameClient.compareHashMaps(actualHashMap, this.state.gameClient.hashMap);
          }
          return {};
        })
        .then((hashFilesToUpdate) => {
          const len = Object.keys(hashFilesToUpdate);
          if (len <= 0) {
            return true;
          }

          this.changeStateMessage('Загружаем обновления...');
          this.changeStateGameClient({ downloading: true });

          const iterable = Object.values(hashFilesToUpdate);
          const totalFilesToUpdate = iterable.length;
          let currentFilesUpdated = 0;

          const percent = () => {
            if (totalFilesToUpdate <= 0) {
              return 0;
            }
            if (currentFilesUpdated >= totalFilesToUpdate) {
              return 100;
            }
            return parseFloat((currentFilesUpdated / totalFilesToUpdate * 100).toFixed(2));
          };

          const nextHashMap = this.state.gameClient.hashMap;
          const pathExists = {};

          const updateFile = async ({ actual, current }) => {
            // remove files
            await deleteFile({ actual, current });

            return (new FileDownloader(getGameClientFileUrl(actual.md5)))
              .start()
              .then((res) => {
                nextHashMap[actual.md5] = nextHashMap[actual.md5] || {};
                nextHashMap[actual.md5] = {
                  ...actual,
                  path: gameClientPath(actual.path),
                };
                const folderPaths = nextHashMap[actual.md5].path.split(/(\/|\\)/);
                const folderPath = trim(folderPaths.slice(0, folderPaths.length - 1).join(''), '\\');
                if (pathExists[folderPath] === undefined) {
                  pathExists[folderPath] = true;
                  return mkdir(folderPath).then(() => res.rename(nextHashMap[actual.md5].path));
                }
                return res.rename(nextHashMap[actual.md5].path);
              });
          };

          const deleteFile = async ({ actual, current }) => {
            if (actual && actual.path) {
              await unlink(gameClientPath(actual.path));
              if (nextHashMap[actual.md5] !== undefined) {
                delete nextHashMap[actual.md5];
              }
            }
            if (current && current.path) {
              await unlink(current.path);
              if (nextHashMap[current.md5] !== undefined) {
                delete nextHashMap[current.md5];
              }
            }
            return Promise.resolve();
          };

          return Promise.each(iterable, async (data, index, len) => {
            let promise;
            if (data.actual) {
              promise = updateFile(data);
            } else if (data.current) {
              promise = deleteFile(data);
            }

            return promise.then(() => {
              // progress
              currentFilesUpdated += 1;
              this.changeStateGameClient({ percent: percent() });
            })
          })
          .then(() => {
            this.changeStateGameClient({ downloading: false, hashMap: nextHashMap, hashMapVersion: gameClient.getHashMapVersion(nextHashMap) });
            return gameClient.writeHashMap(nextHashMap).then(() => nextHashMap);
          });
        });
      });
  }

  checkExistsGameClientPackage() {
    this.setState({ message: 'Проверяем наличие загруженного чистого клиента...' });

    return gameClient.checkExistsPackage()
      .then((packageDownloaded) => {
        this.changeStateGameClient({ packageDownloaded });
        return packageDownloaded;
      });
  }

  downloadGameClientPackage() {
    this.changeStateMessage('Скачиваем игровой клиент...');
    this.changeStateGameClient({ downloading: true, percent: 0 });

    const fileDownloader = new FileDownloader(getGameClientPackageUrl());

    return fileDownloader.start((self) => {
        // change percent
        this.changeStateGameClient({ percent: self.getPercent() });
      })
      .then((res) => {
        return res.rename(gameClientPackageFilePath());
      })
      .then((res) => {
        this.changeStateGameClient({ downloading: false, percent: 100 });
        return res;
      });
  }

  extractGameClientPackage() {
    this.setState({ message: 'Распаковываем игровой клиент...' });
    this.changeStateGameClient({ extracting: true });

    return extract(gameClientPackageFilePath(), ({ percent }) => {
      this.changeStateGameClient({ percent });
    }).then((res) => {
      this.changeStateGameClient({ percent: 100, extracting: false });
      this.setState({ message: 'Переносим ресурсы клиента в рабочую директорию...' });
      return rmdir(gameClientExtractedPath())
        .then(() => Promise.delay(1000))
        .then(() => res.rename(gameClientExtractedPath()));
    });
  }

  getProgressProps() {
    if (this.state.gameClient.downloading || this.state.gameClient.extracting) {
      return {
        progress: {
          percent: this.state.gameClient.percent,
          message: `${this.state.gameClient.percent}%`
        },
      };
    }

    return {};
  }

  render() {
    const { programSettings, isLoading, isError, message, socket } = this.state;

    const subrender = () => {
      if (isLoading || isError) {
        return (
          <LoaderStyle
            message={message}
            type={isError ? 'danger' : 'default'}
            {...this.getProgressProps()}
          />
        );
      }

      if (!socket.isConnected) {
        return (
          <LoaderStyle
            message="Подключаемся к аккаунту..."
            type="default"
          />
        );
      }

      return (
        <ScreenStyle
          onSubmitLogin={this.onSubmitLogin}
          onSubmitTokenActivation={this.onSubmitTokenActivation}
          onClickBackFromTokenActivation={this.onClickBackFromTokenActivation}
          onSubmitUserAccountCreate={this.onSubmitUserAccountCreate}
          onClickLogout={this.onClickLogout}
          onSelectUserAccount={this.onSelectUserAccount}
          onClickLaunchUserAccount={this.onClickLaunchUserAccount}
          onClickLaunchKillUserAccount={this.onClickLaunchKillUserAccount}

          loginState={this.state.login}
          userState={this.state.user}
          userAccountsState={this.state.userAccounts}
          userAccountCreateState={this.state.userAccountCreate}
          serverLoginState={this.state.serverLogin}
          launchState={this.state.launch}
        />
      );
    }

    return (
      <React.Fragment>
        <AppBar
          brand={programSettings.brand}
          onChangeAudioPlayOnStart={this.onChangeUserAudioPlayOnStart}
          userState={this.state.user}
          serverLoginState={this.state.serverLogin}
        />

        {subrender()}
      </React.Fragment>
    );
  }
}

export default Loader;
