import React from 'react';
import PropTypes from 'prop-types';
import OnlineStatusWrapper, { Block, IconImage, Value } from './styles';

export default class OnlineStatus extends React.Component {
  static propTypes = {
    serverDisplayState: PropTypes.shape({
      user: PropTypes.shape({
        a: PropTypes.number,
        b: PropTypes.number,
        c: PropTypes.number,
        total: PropTypes.number,
      }),
      map: PropTypes.object,
    }),
  };

  render() {
    return (
      <OnlineStatusWrapper>
        <Block>
          <IconImage className="accretia_icon" />
          <Value>{this.props.serverDisplayState.user.a}</Value>
        </Block>
        <Block>
          <IconImage className="bellato_icon" />
          <Value>{this.props.serverDisplayState.user.b}</Value>
        </Block>
        <Block>
          <IconImage className="cora_icon" />
          <Value>{this.props.serverDisplayState.user.c}</Value>
        </Block>
      </OnlineStatusWrapper>
    );
  }
}
