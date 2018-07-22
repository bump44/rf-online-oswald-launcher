import React from 'react';
import PropTypes from 'prop-types';
import TokenActivationFormWrapper, { FieldGroup, FieldLabel, FieldInput, ButtonSubmit, ErrorMessage, HintMessage, Actions, ButtonBack } from './styles';

export default class TokenActivationForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClickBack: PropTypes.func.isRequired,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = { key: '' };

    this.onChangeKey = (evt) => this.setState({ key: evt.target.value });
    this.onSubmit = () => {
      if (typeof this.props.onSubmit === 'function') {
        this.props.onSubmit(this.state);
      }
    };
  }

  render() {
    return (
      <TokenActivationFormWrapper>
        {this.props.isError && (
          <ErrorMessage>
            {this.props.errorMessage}
          </ErrorMessage>
        )}

        <HintMessage>
          На ваш e-mail адрес, указанный при регистрации, отправлен код активации, введите его в форму ниже:
        </HintMessage>

        <FieldGroup>
          <FieldLabel>Код активации:</FieldLabel>
          <FieldInput disabled={this.props.isLoading} placeholder="KEY" onChange={this.onChangeKey} value={this.state.key} />
        </FieldGroup>

        <Actions>
          <ButtonBack onClick={this.props.onClickBack}>
            <i className="fa fa-fw fa-arrow-left" />
          </ButtonBack>
          <ButtonSubmit disabled={this.props.isLoading} onClick={this.onSubmit}>
            <i className="fa fa-fw fa-check" />
            Подтвердить
          </ButtonSubmit>
        </Actions>
      </TokenActivationFormWrapper>
    );
  }
}
