import React from 'react';
import PropTypes from 'prop-types';
import UserAccountCreateFormWrapper, { FieldGroup, FieldLabel, FieldInput, ButtonSubmit, HintMessage, ErrorMessage } from './styles';

export default class UserAccountCreateForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = { name: '' };

    this.onChangeName = (evt) => this.setState({ name: evt.target.value });
    this.onSubmit = (evt) => {
      if (typeof this.props.onSubmit === 'function') {
        this.props.onSubmit(this.state);
      }
    };
  }

  render() {
    return (
      <UserAccountCreateFormWrapper>
        {this.props.isError && (
          <ErrorMessage>
            {this.props.errorMessage}
          </ErrorMessage>
        )}

        <FieldGroup>
          <FieldLabel>Название игрового аккаунта:</FieldLabel>
          <FieldInput disabled={this.props.isLoading} placeholder="spiked" onChange={this.onChangeName} value={this.state.name} />
        </FieldGroup>

        <ButtonSubmit disabled={this.props.isLoading} onClick={this.onSubmit}>Создать</ButtonSubmit>
        <div className="pt15 mb15">
          <HintMessage>
            <span className="text-orange">{'<hint>'}</span> Используйте человеко-понятные названия аккаунтов, чтобы не запутаться в твинках {';)'}
          </HintMessage>
        </div>
      </UserAccountCreateFormWrapper>
    );
  }
}
