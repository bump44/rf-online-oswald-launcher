import React from 'react';
import PropTypes from 'prop-types';
import LoginFormWrapper, { FieldGroup, FieldLabel, FieldInput, ButtonSubmit, HintMessage, ErrorMessage } from './styles';

export default class LoginForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = { ident: '', password: '' };

    this.onChangeIdent = (evt) => this.setState({ ident: evt.target.value });
    this.onChangePassword = (evt) => this.setState({ password: evt.target.value });
    this.onSubmit = (evt) => {
      if (typeof this.props.onSubmit === 'function') {
        this.props.onSubmit(this.state);
      }
    };
  }

  render() {
    return (
      <LoginFormWrapper>
        {this.props.isError && (
          <ErrorMessage>
            {this.props.errorMessage}
          </ErrorMessage>
        )}

        <FieldGroup>
          <FieldLabel>Логин или e-mail адрес:</FieldLabel>
          <FieldInput disabled={this.props.isLoading} placeholder="example@gmail.da" onChange={this.onChangeIdent} value={this.state.ident} />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel>Пароль:</FieldLabel>
          <FieldInput disabled={this.props.isLoading} placeholder="**********" type="password" onChange={this.onChangePassword} value={this.state.password} />
        </FieldGroup>

        <ButtonSubmit disabled={this.props.isLoading} onClick={this.onSubmit}>Войти</ButtonSubmit>

        <hr />

        <HintMessage>
          <span className="text-orange">{'<hint>'}</span> На одном системном аккаунте может быть множество игровых аккаунтов. Используйте его как единую точку доступа ко всем игровым аккаунтам.
        </HintMessage>
      </LoginFormWrapper>
    );
  }
}
