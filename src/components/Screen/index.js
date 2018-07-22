import React from 'react';
import PropTypes from 'prop-types';
import { compact } from 'lodash';
import ScreenWrapper, { Overlay, Aside, Content, HintMessage, ButtonLogout } from './styles';

import LoginForm from '../LoginForm';
import TokenActivationForm from '../TokenActivationForm';
import UserAccountCreateForm from '../UserAccountCreateForm';
import UserAccountsList from '../UserAccountsList';
import UserAccountCard from '../UserAccountCard';

export default class Screen extends React.PureComponent {
  static propTypes = {
    onSubmitLogin: PropTypes.func.isRequired,
    onSubmitTokenActivation: PropTypes.func.isRequired,
    onClickBackFromTokenActivation: PropTypes.func.isRequired,
    onSubmitUserAccountCreate: PropTypes.func.isRequired,
    onClickLogout: PropTypes.func.isRequired,
    onSelectUserAccount: PropTypes.func.isRequired,
    onClickLaunchUserAccount: PropTypes.func.isRequired,
    onClickLaunchKillUserAccount: PropTypes.func.isRequired,

    loginState: PropTypes.object,
    userState: PropTypes.object,
    userAccountsState: PropTypes.object,
    userAccountCreateState: PropTypes.object,
    launchState: PropTypes.object,
    serverLoginState: PropTypes.shape({
      bConnected: PropTypes.bool,
      bConnection: PropTypes.bool,
      lastECode: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Overlay />
        <ScreenWrapper>
          <Aside>
            {this.props.userState.obj && (
              <React.Fragment>
                <div className="mb15">
                  <i className="fa fa-fw fa-user" />
                  <span className="text-orange">{this.props.userState.obj.name}</span> <small>{this.props.userState.obj.role.title}</small>
                  &nbsp;
                  <ButtonLogout onClick={this.props.onClickLogout}>
                    <i className="fa fa-times" title="Выход" />
                  </ButtonLogout>
                </div>
                {!this.props.userAccountsState.isLoading && this.props.userAccountsState.accounts.length <= 0 && (
                  <HintMessage className="mb15">
                    <span className="text-orange">{'<hint>'}</span> У вас еще нет игровых аккаунтов, создайте свой первый аккаунт:
                  </HintMessage>
                )}
                {this.props.userAccountsState.accounts.length > 0 && (
                  <UserAccountsList
                    accounts={this.props.userAccountsState.accounts}
                    onSelect={this.props.onSelectUserAccount}
                    launchState={this.props.launchState}
                  />
                )}
                {!this.props.userAccountsState.isLoading && (
                  <UserAccountCreateForm
                    onSubmit={this.props.onSubmitUserAccountCreate}
                    isLoading={this.props.userAccountCreateState.isLoading}
                    isError={this.props.userAccountCreateState.isError}
                    errorMessage={this.props.userAccountCreateState.errorMessage}
                  />
                )}
              </React.Fragment>
            )}
            {!this.props.userState.obj && !this.props.loginState.isActivation && (
              <LoginForm
                onSubmit={this.props.onSubmitLogin}
                isLoading={this.props.loginState.isLoading}
                isError={this.props.loginState.isError}
                errorMessage={this.props.loginState.errorMessage}
              />
            )}
            {!this.props.userState.obj && this.props.loginState.isActivation && (
              <TokenActivationForm
                onSubmit={this.props.onSubmitTokenActivation}
                onClickBack={this.props.onClickBackFromTokenActivation}
                isLoading={this.props.loginState.isLoading}
                isError={this.props.loginState.isError}
                errorMessage={this.props.loginState.errorMessage}
              />
            )}
          </Aside>
          <Content>
            {this.props.userAccountsState.accounts[this.props.userAccountsState.selected] !== undefined && (
              <UserAccountCard
                account={this.props.userAccountsState.accounts[this.props.userAccountsState.selected]}
                serverLoginState={this.props.serverLoginState}
                launchState={this.props.launchState}
                onClickLaunch={this.props.onClickLaunchUserAccount}
                onClickLaunchKill={this.props.onClickLaunchKillUserAccount}
              />
            )}
          </Content>
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}
