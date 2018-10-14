import React from 'react';
import PropTypes from 'prop-types';
import LoaderWrapper, {
  Overlay,
  Content,
  LoadingIndicator,
  Message,
  ProgressWrapper,
  ProgressValue,
  ProgressMessage,
  ErrorIndicator,
  ProgressMessageSpan,
} from './styles';

export default class Loader extends React.PureComponent {
  static propTypes = {
    message: PropTypes.string,
    type: PropTypes.string,
    progress: PropTypes.shape({
      percent: PropTypes.number,
      message: PropTypes.string,
    }),
  };

  render() {
    const { progress, type, message } = this.props;

    return (
      <React.Fragment>
        <Overlay />
        <LoaderWrapper>
          <Content type={type}>
            {type === 'danger' ? <ErrorIndicator /> : <LoadingIndicator />}
            {message && <Message>{message}</Message>}

            {progress && (
              <ProgressWrapper>
                <ProgressValue width={progress.percent} />
                {progress.message && (
                  <ProgressMessage>
                    <ProgressMessageSpan>
                      {progress.message}
                    </ProgressMessageSpan>
                  </ProgressMessage>
                )}
              </ProgressWrapper>
            )}
          </Content>
        </LoaderWrapper>
      </React.Fragment>
    );
  }
}
