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
    this.stateHandler;

    this._handleConnect = this._handleConnect.bind(this);
    this._handleDisconnect = this._handleDisconnect.bind(this);
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
	}

	unbindDispatchers() {
		this.io.off('connect', this._handleConnect);
		this.io.off('disconnect', this._handleDisconnect);
	}

	_handleConnect() {
		this.isConnected = true;
    this.isConnecting = false;
    this.callStateHandler();
	}

	_handleDisconnect() {
		this.isConnected = false;
    this.isConnecting = true; // because socket.io have auto-reconnect delay
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
