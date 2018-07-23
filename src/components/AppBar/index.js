import React from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';
import AppBarWrapper, { Brand, ConnectionState, ButtonClose, ServerLoginIndicator, ServerLoginMessage } from './styles';
import Audio from './Audio';

export default class AppBar extends React.PureComponent {
  static propTypes = {
    brand: PropTypes.string.isRequired,
    socketState: PropTypes.shape({
      connected: PropTypes.bool,
      connecting: PropTypes.bool,
      isError: PropTypes.bool,
      errorMessage: PropTypes.string,
    }),
    onChangeAudioPlayOnStart: PropTypes.func.isRequired,
    userState: PropTypes.shape({
      audioPlayOnStart: PropTypes.bool,
    }),
    serverLoginState: PropTypes.shape({
      bConnected: PropTypes.bool,
      bConnection: PropTypes.bool,
      lastECode: PropTypes.string,
    }),
  };

  static defaultProps = {
    socketState: { connected: false, connecting: false, isError: false, errorMessage: '' },
  };

  constructor(props) {
    super(props);
    this.onClickQuit = () => remote.getCurrentWindow().close();
  }

  render() {
    const { brand, socketState, userState, serverLoginState } = this.props;

    return (
      <AppBarWrapper>
        <ServerLoginMessage color={serverLoginState.bConnected ? 'green' : serverLoginState.bConnection ? 'orange' : '#ddd'}>
          {serverLoginState.bConnected ? 'Логин сервер доступен' : serverLoginState.bConnection ? 'Ожидание ответа от логин сервера' : 'Логин сервер не отвечает'}
        </ServerLoginMessage>
        <ServerLoginIndicator
          backgroundColor={serverLoginState.bConnected ? 'green' : serverLoginState.bConnection ? 'orange' : '#ddd'}
        />
        <Brand>{brand}</Brand>
        <ConnectionState
          {...socketState}
        />
        <Audio play={userState.audioPlayOnStart} onChangePlayOnStart={this.props.onChangeAudioPlayOnStart} />
        <ButtonClose onClick={this.onClickQuit}>x</ButtonClose>
      </AppBarWrapper>
    );
  }
}
