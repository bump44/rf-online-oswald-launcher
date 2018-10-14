import React from 'react';
import PropTypes from 'prop-types';
import TokenActivationFormWrapper, {
  FieldGroup,
  FieldLabel,
  FieldInput,
  ButtonSubmit,
  ErrorMessage,
  HintMessage,
  Actions,
  ButtonBack,
} from './styles';

export default class TokenActivationForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClickBack: PropTypes.func.isRequired,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = { key: '' };

    this.onChangeKey = evt => this.setState({ key: evt.target.value });
    this.onSubmit = () => {
      const { onSubmit } = this.props;
      if (typeof onSubmit === 'function') {
        onSubmit(this.state);
      }
    };
  }

  render() {
    const { isError, errorMessage, isLoading, onClickBack } = this.props;
    const { key } = this.state;

    return (
      <TokenActivationFormWrapper>
        {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <HintMessage>
          На ваш e-mail адрес, указанный при регистрации, отправлен код
          активации, введите его в форму ниже:
        </HintMessage>

        <FieldGroup>
          <FieldLabel>Код активации:</FieldLabel>
          <FieldInput
            disabled={isLoading}
            placeholder="KEY"
            onChange={this.onChangeKey}
            value={key}
          />
        </FieldGroup>

        <Actions>
          <ButtonBack onClick={onClickBack}>
            <i className="fa fa-fw fa-arrow-left" />
          </ButtonBack>
          <ButtonSubmit disabled={isLoading} onClick={this.onSubmit}>
            <i className="fa fa-fw fa-check" />
            Подтвердить
          </ButtonSubmit>
        </Actions>
      </TokenActivationFormWrapper>
    );
  }
}
