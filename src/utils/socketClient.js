import io from 'socket.io-client';

class SocketClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.connectOptions = options.connectOptions || {};
    this.jwt = options.jwt;
    this.io = undefined;
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectError = null;
    this.stateHandler = undefined;

    this.handleConnect = this.handleConnect.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleReconnectError = this.handleReconnectError.bind(this);
    this.handleReconnect = this.handleReconnect.bind(this);
  }

  setJwt(jwt) {
    this.jwt = jwt;
    return this;
  }

  setStateHandler(cb) {
    this.stateHandler = cb;
    return this;
  }

  callStateHandler() {
    if (typeof this.stateHandler === 'function') {
      this.stateHandler(this);
    }
  }

  bindDispatchers() {
    this.io.on('connect', this.handleConnect);
    this.io.on('disconnect', this.handleDisconnect);
    this.io.on('reconnect_error', this.handleReconnectError);
    this.io.on('reconnect', this.handleReconnect);
  }

  unbindDispatchers() {
    this.io.off('connect', this.handleConnect);
    this.io.off('disconnect', this.handleDisconnect);
    this.io.off('reconnect_error', this.handleReconnectError);
    this.io.off('reconnect', this.handleReconnect);
  }

  handleConnect() {
    this.isConnected = true;
    this.isConnecting = false;
    this.reconnectError = null;
    this.callStateHandler();
  }

  handleReconnect() {
    this.isConnected = false;
    this.isConnecting = true;
    this.reconnectError = null;
    this.callStateHandler();
  }

  handleDisconnect() {
    this.isConnected = false;
    this.isConnecting = true; // because socket.io have auto-reconnect delay
    this.callStateHandler();
  }

  handleReconnectError(err) {
    this.reconnectError = err;
    this.callStateHandler();
  }

  disconnect() {
    if (this.io === undefined) {
      return this;
    }

    this.unbindDispatchers();
    this.io.disconnect();
    this.io = undefined;
    return this;
  }

  connect() {
    this.disconnect();
    const query = {};
    query.token = this.jwt;

    const connectOptions = {
      ...this.connectOptions,
      query: {
        ...query,
        ...(this.connectOptions.query || {}),
      },
    };

    this.isConnecting = true;
    this.io = io(this.url, connectOptions);
    this.callStateHandler();
    this.bindDispatchers();
    return this.io;
  }
}

export default SocketClient;
