import React from 'react';
import PropTypes from 'prop-types';
import UserAccountCreateFormWrapper, {
  FieldGroup,
  FieldLabel,
  FieldInput,
  ButtonSubmit,
  HintMessage,
  ErrorMessage,
} from './styles';

export default class UserAccountCreateForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = { name: '' };

    this.onChangeName = evt => this.setState({ name: evt.target.value });
    this.onSubmit = () => {
      const { onSubmit } = this.props;
      if (typeof onSubmit === 'function') {
        onSubmit(this.state);
      }
    };
  }

  render() {
    const { isError, errorMessage, isLoading } = this.props;
    const { name } = this.state;

    return (
      <UserAccountCreateFormWrapper>
        {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <FieldGroup>
          <FieldLabel>Название игрового аккаунта:</FieldLabel>
          <FieldInput
            disabled={isLoading}
            placeholder="yourlogin"
            onChange={this.onChangeName}
            value={name}
          />
        </FieldGroup>

        <ButtonSubmit disabled={isLoading} onClick={this.onSubmit}>
          Создать
        </ButtonSubmit>
        <div className="pt15 mb15">
          <HintMessage>
            <span className="text-orange">{'<hint>'}</span> Используйте
            человеко-понятные названия аккаунтов, чтобы не запутаться в твинках{' '}
            {';)'}
          </HintMessage>
        </div>
      </UserAccountCreateFormWrapper>
    );
  }
}
