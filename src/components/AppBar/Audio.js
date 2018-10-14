import React from 'react';
import PropTypes from 'prop-types';
import compact from 'lodash/compact';
import trackList from '../../assets/trackList';
import { AudioWrapper, AudioTrackName, AudioButtonAction } from './styles';

export default class AppBarAudio extends React.Component {
  static propTypes = {
    play: PropTypes.bool,
    onChangePlayOnStart: PropTypes.func.isRequired,
  };

  static defaultProps = {
    play: false,
  };

  constructor(props) {
    super(props);
    this.state = { track: this.getRandom() };
  }

  getByIndex = index => {
    if (!trackList[index]) {
      return null;
    }

    const track = Object.assign({}, trackList[index], { index });
    return track;
  };

  getRandom = () => {
    const len = trackList.length;

    if (!len) {
      return null;
    }

    const index = Math.floor(Math.random() * len - 1) + 1;
    return this.getByIndex(index);
  };

  onClickNext = () => {
    const { track } = this.state;

    if (!track) {
      if (trackList.length <= 0) {
        return null;
      }

      return this.setState({ track: this.getByIndex(0) });
    }

    const nextIndex = track.index + 1;

    if (this.getByIndex(nextIndex)) {
      return this.setState({ track: this.getByIndex(nextIndex) });
    }

    if (this.getByIndex(0)) {
      return this.setState({ track: this.getByIndex(0) });
    }

    return undefined;
  };

  onClickPrev = () => {
    const { track } = this.state;

    if (!track) {
      if (trackList.length <= 0) {
        return null;
      }

      return this.setState({ track: this.getByIndex(trackList.length - 1) });
    }

    const prevIndex = track.index - 1;

    if (prevIndex < 0 || !this.getByIndex(prevIndex)) {
      return this.setState({ track: this.getByIndex(trackList.length - 1) });
    }

    return this.setState({ track: this.getByIndex(prevIndex) });
  };

  onClickToggle = () => {
    const { track } = this.state;
    const { onChangePlayOnStart, play } = this.props;

    if (!track) {
      this.setState({ track: this.getRandom() });
    }

    onChangePlayOnStart(!play);
  };

  onEnded = () => {
    // yo!
    this.onClickNext();
  };

  render() {
    const { track } = this.state;
    const { play } = this.props;
    const isReady = play && track;

    return (
      <AudioWrapper>
        <AudioTrackName>
          {trackList.length <= 0 && <span>Track List Is Empty...</span>}
          {trackList.length > 0 &&
            track &&
            compact([track.executor, track.name]).join(' - ')}
        </AudioTrackName>
        <AudioButtonAction onClick={this.onClickPrev}>
          <i className="fa fa-fast-backward" aria-hidden="true" />
        </AudioButtonAction>
        {play && (
          <AudioButtonAction onClick={this.onClickToggle}>
            <i className="fa fa-stop" aria-hidden="true" />
          </AudioButtonAction>
        )}
        {!play && (
          <AudioButtonAction onClick={this.onClickToggle}>
            <i className="fa fa-play" aria-hidden="true" />
          </AudioButtonAction>
        )}
        <AudioButtonAction onClick={this.onClickNext}>
          <i className="fa fa-fast-forward" aria-hidden="true" />
        </AudioButtonAction>
        {isReady && (
          // eslint-disable-next-line
          <audio
            onEnded={this.onEnded}
            autoPlay={play}
            controls={false}
            src={track.path + track.filename}
          />
        )}
      </AudioWrapper>
    );
  }
}
