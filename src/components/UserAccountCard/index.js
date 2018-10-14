import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import UserAccountCardWrapper, {
  AccountName,
  AccountMetadataRow,
  AccountMetadataTitle,
  AccountMetadataValue,
  AccountBanned,
  AccountPremium,
  AccountButton,
  AccountActions,
} from './styles';

export default class UserAccountCard extends React.PureComponent {
  static propTypes = {
    account: PropTypes.object.isRequired,
    onClickLaunch: PropTypes.func,
    onClickLaunchKill: PropTypes.func,
    launchState: PropTypes.object,
    serverLoginState: PropTypes.shape({
      bConnected: PropTypes.bool,
      bConnection: PropTypes.bool,
      lastECode: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.getAccountStateMessage = this.getAccountStateMessage.bind(this);
    this.isDisabledLaunch = this.isDisabledLaunch.bind(this);
    this.onClickLaunch = this.onClickLaunch.bind(this);
    this.onClickLaunchKill = this.onClickLaunchKill.bind(this);
  }

  onClickLaunch() {
    const { onClickLaunch, account } = this.props;
    if (typeof onClickLaunch === 'function') {
      onClickLaunch(account);
    }
  }

  onClickLaunchKill() {
    const { onClickLaunchKill, account } = this.props;
    if (typeof onClickLaunchKill === 'function') {
      onClickLaunchKill(account);
    }
  }

  isDisabledLaunch() {
    const { launchState, account, serverLoginState } = this.props;
    const worker = launchState.workers[account.id];

    if (!serverLoginState.bConnected) {
      return true;
    }

    if (!worker) {
      return false;
    }

    return worker.queue || worker.running || worker.execution;
  }

  getAccountStateMessage() {
    const { account, serverLoginState, launchState } = this.props;
    const { workers } = launchState;

    const worker = workers[account.id];

    if (account.isBanned) {
      return 'заблокирован';
    }

    if (!serverLoginState.bConnected) {
      return 'ожидание ответа от логин сервера';
    }

    if (worker && worker.queue) {
      return 'в очереди на запуск';
    }

    if (worker && worker.running) {
      return 'запускается';
    }

    if (worker && worker.execution) {
      return 'запущен';
    }

    if (account.bCreated) {
      return 'готов к запуску';
    }

    return 'создается...';
  }

  render() {
    const { account, launchState } = this.props;
    const { workers } = launchState;

    const worker = workers[account.id];
    const isWorkerExecution = worker && worker.execution;

    return (
      <UserAccountCardWrapper>
        <AccountName
          className={cx({
            'text-orange': account.bPremium,
            'text-gold': account.bGM,
            'text-muted': !account.bCreated,
            'text-red': account.isBanned,
          })}
        >
          {account.bGM && <span>[GM]&nbsp;</span>}
          {account.name}
          &nbsp;
          <small className="text-muted">{this.getAccountStateMessage()}</small>
        </AccountName>

        <AccountMetadataRow>
          <AccountMetadataTitle>Первый запуск:</AccountMetadataTitle>
          &nbsp;
          <AccountMetadataValue>
            {account.firstLoginAt
              ? moment(account.lastLoginAt).format('LLLL')
              : '—'}
            &nbsp;
            {account.firstLoginIp ? `(${account.firstLoginIp})` : ''}
          </AccountMetadataValue>
        </AccountMetadataRow>

        <AccountMetadataRow>
          <AccountMetadataTitle>Последний запуск:</AccountMetadataTitle>
          &nbsp;
          <AccountMetadataValue>
            {account.lastLoginAt
              ? moment(account.lastLoginAt).format('LLLL')
              : '—'}
            &nbsp;
            {account.lastLoginIp ? `(${account.lastLoginIp})` : ''}
          </AccountMetadataValue>
        </AccountMetadataRow>

        <hr />

        <AccountPremium>
          <AccountName>
            Премиум{' '}
            <small className="text-muted">
              {account.bPremium ? 'подключен' : 'не подключен'}
            </small>
          </AccountName>
          {account.bPremium && (
            <AccountMetadataRow>
              <AccountMetadataTitle>
                Дата подключения и отключения:
              </AccountMetadataTitle>
              &nbsp;
              <AccountMetadataValue>
                c {moment(account.premiumFrom).format('LLL')} по{' '}
                {moment(account.premiumTo).format('LLL')}
                &nbsp;осталось:{' '}
                <b>{moment(account.premiumTo).diff(moment(), 'days')}</b> дней
              </AccountMetadataValue>
            </AccountMetadataRow>
          )}
        </AccountPremium>

        {account.isBanned && (
          <AccountBanned>
            {account.bannedTo && (
              <AccountMetadataRow>
                <AccountMetadataTitle>
                  Доступ к аккаунту ограничен до:
                </AccountMetadataTitle>
                &nbsp;
                <AccountMetadataValue>
                  {moment(account.bannedTo).format('LLL')}
                </AccountMetadataValue>
              </AccountMetadataRow>
            )}
            {!account.bannedTo && (
              <AccountMetadataRow>
                <AccountMetadataTitle>
                  Аккаунт навсегда заблокирован
                </AccountMetadataTitle>
              </AccountMetadataRow>
            )}
            <AccountMetadataRow>
              <AccountMetadataTitle>Дата блокировки:</AccountMetadataTitle>
              &nbsp;
              <AccountMetadataValue>
                {moment(account.bannedFrom).format('LLL')}
              </AccountMetadataValue>
            </AccountMetadataRow>
            <AccountMetadataRow>
              <AccountMetadataTitle>Причина:</AccountMetadataTitle>
              &nbsp;
              <AccountMetadataValue>
                {account.banReason || '—'}
              </AccountMetadataValue>
            </AccountMetadataRow>
          </AccountBanned>
        )}
        <AccountActions>
          {!account.isBanned && (
            <React.Fragment>
              <AccountButton
                onClick={this.onClickLaunch}
                disabled={this.isDisabledLaunch()}
              >
                <i className="fa fa-fw fa-play" />
                Запустить
              </AccountButton>
              &nbsp;
            </React.Fragment>
          )}
          {isWorkerExecution && (
            <React.Fragment>
              <AccountButton
                className="btn btn-danger btn-sm"
                onClick={this.onClickLaunchKill}
              >
                <i className="fa fa-fw fa-times" />
                Закрыть процесс (принудительно)
              </AccountButton>
              &nbsp;
            </React.Fragment>
          )}
          <AccountButton className="btn btn-warning btn-sm">
            {account.bPremium ? 'Продлить' : 'Подключить'}
            &nbsp;премиум
          </AccountButton>
        </AccountActions>
      </UserAccountCardWrapper>
    );
  }
}
