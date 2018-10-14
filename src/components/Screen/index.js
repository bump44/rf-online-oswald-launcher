import React from 'react';
import PropTypes from 'prop-types';
import ScreenWrapper, {
  Overlay,
  Aside,
  Content,
  HintMessage,
  ButtonLogout,
} from './styles';

import LoginForm from '../LoginForm';
import TokenActivationForm from '../TokenActivationForm';
import UserAccountCreateForm from '../UserAccountCreateForm';
import UserAccountsList from '../UserAccountsList';
import UserAccountCard from '../UserAccountCard';
import OnlineStatus from '../OnlineStatus';

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
    serverDisplayState: PropTypes.object,
  };

  render() {
    const {
      userState,
      onClickLogout,
      userAccountsState,
      onSelectUserAccount,
      launchState,
      onSubmitUserAccountCreate,
      userAccountCreateState,
      onSubmitLogin,
      loginState,
      onSubmitTokenActivation,
      onClickBackFromTokenActivation,
      serverDisplayState,
      onClickLaunchUserAccount,
      onClickLaunchKillUserAccount,
      serverLoginState,
    } = this.props;

    const isReadyAccounts =
      !userAccountsState.isLoading && userAccountsState.accounts.length <= 0;
    const isReadyCreateNewAccount =
      !userAccountsState.isLoading && userAccountsState.accounts.length < 70;
    const isReadyUserLogin = !userState.obj && !loginState.isActivation;
    const isReadyUserActivation = !userState.obj && loginState.isActivation;

    return (
      <React.Fragment>
        <Overlay />
        <ScreenWrapper>
          <Aside>
            {userState.obj && (
              <React.Fragment>
                <div className="mb15">
                  <i className="fa fa-fw fa-user" />
                  <span className="text-orange">{userState.obj.name}</span>{' '}
                  <small>{userState.obj.role.title}</small>
                  &nbsp;
                  <ButtonLogout onClick={onClickLogout}>
                    <i className="fa fa-times" title="Выход" />
                  </ButtonLogout>
                </div>
                {isReadyAccounts && (
                  <HintMessage className="mb15">
                    <span className="text-orange">{'<hint>'}</span> У вас еще
                    нет игровых аккаунтов, создайте свой первый аккаунт:
                  </HintMessage>
                )}
                {userAccountsState.accounts.length > 0 && (
                  <UserAccountsList
                    accounts={userAccountsState.accounts}
                    onSelect={onSelectUserAccount}
                    selected={userAccountsState.selected}
                    launchState={launchState}
                  />
                )}
                {isReadyCreateNewAccount && (
                  <UserAccountCreateForm
                    onSubmit={onSubmitUserAccountCreate}
                    isLoading={userAccountCreateState.isLoading}
                    isError={userAccountCreateState.isError}
                    errorMessage={userAccountCreateState.errorMessage}
                  />
                )}
              </React.Fragment>
            )}
            {isReadyUserLogin && (
              <LoginForm
                onSubmit={onSubmitLogin}
                isLoading={loginState.isLoading}
                isError={loginState.isError}
                errorMessage={loginState.errorMessage}
              />
            )}
            {isReadyUserActivation && (
              <TokenActivationForm
                onSubmit={onSubmitTokenActivation}
                onClickBack={onClickBackFromTokenActivation}
                isLoading={loginState.isLoading}
                isError={loginState.isError}
                errorMessage={loginState.errorMessage}
              />
            )}
          </Aside>
          <Content>
            <OnlineStatus serverDisplayState={serverDisplayState} />
            {userAccountsState.accounts[userAccountsState.selected] !==
              undefined && (
              <UserAccountCard
                account={userAccountsState.accounts[userAccountsState.selected]}
                serverLoginState={serverLoginState}
                launchState={launchState}
                onClickLaunch={onClickLaunchUserAccount}
                onClickLaunchKill={onClickLaunchKillUserAccount}
              />
            )}
          </Content>
        </ScreenWrapper>
      </React.Fragment>
    );
  }
}
