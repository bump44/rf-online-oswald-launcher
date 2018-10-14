import React from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';
import cx from 'classnames';
import AppBarWrapper, {
  Brand,
  ConnectionState,
  ButtonClose,
  ServerLoginIndicator,
  ServerLoginMessage,
} from './styles';

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
    socketState: {
      connected: false,
      connecting: false,
      isError: false,
      errorMessage: '',
    },
  };

  constructor(props) {
    super(props);
    this.onClickQuit = () => remote.getCurrentWindow().close();
  }

  render() {
    const {
      brand,
      socketState,
      userState,
      serverLoginState,
      onChangeAudioPlayOnStart,
    } = this.props;

    const color = cx({
      green: serverLoginState.bConnected,
      orange: !serverLoginState.bConnected && serverLoginState.bConnection,
      '#ddd': !serverLoginState.bConnected && !serverLoginState.bConnection,
    });

    return (
      <AppBarWrapper>
        <ServerLoginMessage color={color}>
          {cx({
            'Логин сервер доступен': serverLoginState.bConnected,
            'Ожидание ответа от логин сервера':
              !serverLoginState.bConnected && serverLoginState.bConnection,
            'Логин сервер не отвечает':
              !serverLoginState.bConnected && !serverLoginState.bConnection,
          })}
        </ServerLoginMessage>
        <ServerLoginIndicator backgroundColor={color} />
        <Brand>{brand}</Brand>
        <ConnectionState {...socketState} />
        <Audio
          play={userState.audioPlayOnStart}
          onChangePlayOnStart={onChangeAudioPlayOnStart}
        />
        <ButtonClose onClick={this.onClickQuit}>x</ButtonClose>
      </AppBarWrapper>
    );
  }
}
