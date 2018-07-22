import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { escapeRegExp } from 'lodash';
import cx from 'classnames';
import UserAccountsListWrapper, { AccountGroup, AccountName, SearchInput } from './styles';

const style = { minHeight: 100, height: '100%', marginBottom: 15 };

export default class UserAccountsList extends React.Component {
  static propTypes = {
    accounts: PropTypes.array,
    launchState: PropTypes.object,
    onSelect: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onChangeSearchString = this.onChangeSearchString.bind(this);
    this.getAccountsByPredicates = this.getAccountsByPredicates.bind(this);
    this.getAccountTextMessage = this.getAccountTextMessage.bind(this);

    this.state = { searchString: '' };
  }

  onChangeSearchString(evt) {
    const searchString = (evt.target.value || '').trim();
    this.setState({ searchString });
  }

  onClick(account, index) {
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(account, index);
    }
  }

  getAccountTextMessage(account) {
    const { launchState } = this.props;
    const { workers } = launchState;
    const worker = workers[account.id];

    if (worker && worker.queue) {
      return 'в очереди';
    }

    if (worker && worker.running) {
      return 'запускается';
    }

    if (worker && worker.execution) {
      return 'запущен';
    }

    return account.isBanned ? 'заблокирован' : !account.bCreated ? 'создается' : account.bPremium ? 'премиум' : '';
  }

  getAccountsByPredicates() {
    const { accounts } = this.props;
    const { searchString } = this.state;

    if (!searchString) {
      return accounts;
    }

    const regenerated = Object.assign([], accounts);
    const regex = new RegExp(escapeRegExp(searchString), 'ig');
    const testGM = (new RegExp('GM', 'ig')).test(searchString);
    const testPREMIUM = (new RegExp('(PREMIUM|PREM|RUB)', 'ig')).test(searchString);

    return regenerated
      .map((account, index) => ({
        ...account,
        __index: index,
      }))
      .filter((account) => !!regex.test(account.name) || (testGM && account.bGM) || (testPREMIUM && account.bPremium));
  }

  render() {
    const accounts = this.getAccountsByPredicates();

    return (
      <React.Fragment>
        {this.props.accounts.length >= 10 && (
          <SearchInput value={this.state.searchString} onChange={this.onChangeSearchString} />
        )}

        <Scrollbars
          style={style}
          renderTrackVertical={(props) => <div {...props} style={{ ...props.style, right: 1, top: 1, bottom: 1, }} />}
        >
          <UserAccountsListWrapper>
            {accounts.map((account, index) => (
              <AccountGroup
                key={account.id}
                onClick={this.onClick.bind(null, account, account.__index !== undefined ? account.__index : index)}
              >
                <AccountName
                  className={cx({
                    'text-orange': account.bPremium,
                    'text-gold': account.bGM,
                    'text-muted': !account.bCreated,
                    'text-red': account.isBanned,
                  })}
                >
                  {account.bGM && (<span>[GM]&nbsp;</span>)}
                  {account.name}
                  &nbsp;
                  <small className="text-muted">
                    {this.getAccountTextMessage(account)}
                  </small>
                </AccountName>
              </AccountGroup>
            ))}
          </UserAccountsListWrapper>
        </Scrollbars>
      </React.Fragment>
    );
  }
}
