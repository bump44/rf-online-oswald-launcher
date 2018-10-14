import io from 'socket.io-client';

class SocketClient {
	constructor(url, options = {}) {
		this.url = url;
		this.options = options;
		this.connectOptions = options.connectOptions || {};
		this.jwt = options.jwt;
		this.io;
		this.isConnected = false;
    this.isConnecting = false;
    this.reconnectError = null;
    this.stateHandler;

    this._handleConnect = this._handleConnect.bind(this);
    this._handleDisconnect = this._handleDisconnect.bind(this);
    this._handleReconnectError = this._handleReconnectError.bind(this);
    this._handleReconnect = this._handleReconnect.bind(this);
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
		this.io.on('connect', this._handleConnect);
    this.io.on('disconnect', this._handleDisconnect);
    this.io.on('reconnect_error', this._handleReconnectError);
    this.io.on('reconnect', this._handleReconnect);
	}

	unbindDispatchers() {
		this.io.off('connect', this._handleConnect);
    this.io.off('disconnect', this._handleDisconnect);
    this.io.off('reconnect_error', this._handleReconnectError);
    this.io.off('reconnect', this._handleReconnect);
	}

	_handleConnect() {
		this.isConnected = true;
    this.isConnecting = false;
    this.reconnectError = null;
    this.callStateHandler();
  }

  _handleReconnect() {
    this.isConnected = false;
    this.isConnecting = true;
    this.reconnectError = null;
    this.callStateHandler();
  }

	_handleDisconnect() {
		this.isConnected = false;
    this.isConnecting = true; // because socket.io have auto-reconnect delay
    this.callStateHandler();
  }

  _handleReconnectError(err) {
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
