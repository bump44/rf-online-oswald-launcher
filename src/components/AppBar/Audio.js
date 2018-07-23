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
  getByIndex = (index) => {
    if (!trackList[index]) {
      return null;
    }

    const track = Object.assign({}, trackList[index], { index });
		return track;
  }
	getRandom = () => {
		const len = trackList.length;

		if (!len) {
      return null;
    }

    const index = Math.floor(Math.random() * len - 1) + 1;
    return this.getByIndex(index);
  }
	onClickNext = () => {
		if (!this.state.track) {
      if (trackList.length <= 0) {
        return null;
      }

      return this.setState({ track: this.getByIndex(0) });
    }

    const nextIndex = this.state.track.index + 1;

    if (this.getByIndex(nextIndex)) {
      return this.setState({ track: this.getByIndex(nextIndex) });
    } else if (this.getByIndex(0)) {
      return this.setState({ track: this.getByIndex(0) });
    }
	}
	onClickPrev = (el) => {
		if (!this.state.track) {
      if (trackList.length <= 0) {
        return null;
      }

      return this.setState({ track: this.getByIndex(trackList.length - 1) });
    }

		const prevIndex = this.state.track.index - 1;

		if (prevIndex < 0 || !this.getByIndex(prevIndex)) {
      return this.setState({ track: this.getByIndex(trackList.length - 1) });
    } else {
      return this.setState({ track: this.getByIndex(prevIndex) });
    }
	}
	onClickToggle = (el) => {
    if (!this.state.track) {
      this.setState({ track: this.getRandom() });
    }

    this.props.onChangePlayOnStart(!this.props.play);
  }

	onEnded = (el) => {
		// yo!
		this.onClickNext();
  }

	render() {
    return (
      <AudioWrapper>
        <AudioTrackName>
          {trackList.length <= 0 && (
            <span>Track List Is Empty...</span>
          )}
          {trackList.length > 0 && this.state.track && (
            compact([this.state.track.executor, this.state.track.name]).join(' - ')
          )}
        </AudioTrackName>
        <AudioButtonAction onClick={this.onClickPrev}>
          <i className="fa fa-fast-backward" aria-hidden="true"></i>
        </AudioButtonAction>
        {this.props.play && (
          <AudioButtonAction onClick={this.onClickToggle}>
            <i className="fa fa-stop" aria-hidden="true"></i>
          </AudioButtonAction>
        )}
        {!this.props.play && (
          <AudioButtonAction onClick={this.onClickToggle}>
            <i className="fa fa-play" aria-hidden="true"></i>
          </AudioButtonAction>
        )}
        <AudioButtonAction onClick={this.onClickNext}>
          <i className="fa fa-fast-forward" aria-hidden="true"></i>
        </AudioButtonAction>
        {this.props.play && this.state.track && (
          <audio
            onEnded={this.onEnded}
            autoPlay={this.props.play}
            controls={false}
            src={this.state.track.path+this.state.track.filename}
          />
        )}
      </AudioWrapper>
    );
	}
}
