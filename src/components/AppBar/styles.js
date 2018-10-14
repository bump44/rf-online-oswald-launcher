import React from 'react';
import styled from 'styled-components';
import cx from 'classnames';

export default styled.div`
  height: 24px;
  background: #333;
  -webkit-app-region: drag;
  line-height: 24px;
  padding: 0 7px;
  display: flex;
  flex: 1;
  flex-direction: row;
  position: relative;
  z-index: 3;
`;

export const ServerLoginIndicator = styled.div.attrs({
  style: ({ backgroundColor }) => ({
    backgroundColor: `${backgroundColor}`,
  }),
})`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
  top: 8px;
`;

export const ServerLoginMessage = styled.div.attrs({
  style: ({ color }) => ({
    color: `${color}`,
  }),
})`
  position: absolute;
  font-size: 10px;
  font-family: Verdana, sans-serif;
  top: 17px;
  opacity: 0.7;
`;

export const Brand = styled.h1`
  font-size: 14px;
  color: #fff;
  text-transform: uppercase;
  line-height: 24px;
  margin-right: 15px;
`;

/* eslint-disable indent */
export const ConnectionStateWrapper = styled.span`
  font-size: 12px;
  color: #fff;
  line-height: 24px;

  ${props => props.type === 'success' && `color: #45da45;`} ${props =>
    props.type === 'error' && `color: red;`};
`;
/* eslint-enable indent */

export const ConnectionState = ({
  connected = false,
  connecting = false,
  isError = false,
  errorMessage = '',
} = {}) => (
  <ConnectionStateWrapper
    type={cx({
      success: connected,
      error: !connected && isError,
      default: !connected && !isError,
    })}
  >
    {connecting && <span>Подключаемся...</span>}
    {isError && <span>Ошибка: {errorMessage}</span>}
    {connected && <span>Соединение установлено</span>}
  </ConnectionStateWrapper>
);

export const ButtonClose = styled.button`
  background: transparent;
  border: 0;
  color: red;
  font-weight: 500;
  padding: 0 10px;
  vertical-align: middle;
  float: right;
  position: absolute;
  right: 0;
  top: -2px;
  padding-bottom: 2px;
  -webkit-app-region: no-drag;
  cursor: pointer;
  transition: all 0.1s linear;
  &:hover {
    background-color: #000;
  }
`;

export const AudioWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  -webkit-app-region: no-drag;
  max-width: 300px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #fff;
`;

export const AudioTrackName = styled.div`
  font-style: italic;
  width: 205px;
  overflow: hidden;
`;

export const AudioButtonAction = styled.button.attrs({
  className: 'btn btn-sm',
})`
  border: none;
  background: transparent;
  color: #fff;
  font-size: 12px;
  position: relative;
  top: 0px;
  padding: 6px;
  line-height: 12px;
  border-radius: 0;
  &:hover {
    background-color: #000;
  }
`;
