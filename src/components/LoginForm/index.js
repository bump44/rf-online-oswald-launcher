import React from 'react';
import PropTypes from 'prop-types';
import LoginFormWrapper, {
  FieldGroup,
  FieldLabel,
  FieldInput,
  ButtonSubmit,
  HintMessage,
  ErrorMessage,
} from './styles';

export default class LoginForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = { ident: '', password: '' };

    this.onChangeIdent = evt => this.setState({ ident: evt.target.value });
    this.onChangePassword = evt =>
      this.setState({ password: evt.target.value });
    this.onSubmit = () => {
      const { onSubmit } = this.props;
      if (typeof onSubmit === 'function') {
        onSubmit(this.state);
      }
    };
  }

  render() {
    const { isError, errorMessage, isLoading } = this.props;
    const { ident, password } = this.state;

    return (
      <LoginFormWrapper>
        {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <FieldGroup>
          <FieldLabel>Логин или e-mail адрес:</FieldLabel>
          <FieldInput
            disabled={isLoading}
            placeholder="example@gmail.da"
            onChange={this.onChangeIdent}
            value={ident}
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel>Пароль:</FieldLabel>
          <FieldInput
            disabled={isLoading}
            placeholder="**********"
            type="password"
            onChange={this.onChangePassword}
            value={password}
          />
        </FieldGroup>

        <ButtonSubmit disabled={isLoading} onClick={this.onSubmit}>
          Войти
        </ButtonSubmit>

        <hr />

        <HintMessage>
          <span className="text-orange">{'<hint>'}</span> На одном системном
          аккаунте может быть множество игровых аккаунтов. Используйте его как
          единую точку доступа ко всем игровым аккаунтам.
        </HintMessage>
      </LoginFormWrapper>
    );
  }
}
