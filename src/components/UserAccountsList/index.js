import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { escapeRegExp } from 'lodash';
import cx from 'classnames';
import UserAccountsListWrapper, {
  AccountGroup,
  AccountName,
  SearchInput,
} from './styles';

const style = { minHeight: 100, height: '100%', marginBottom: 15 };

export default class UserAccountsList extends React.Component {
  static propTypes = {
    accounts: PropTypes.array,
    launchState: PropTypes.object,
    onSelect: PropTypes.func,
    selected: PropTypes.number,
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
    const { onSelect } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(account, index);
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

    const titles = ['заблокирован', 'создается', 'премиум'];

    return (
      titles[
        cx({
          0: account.isBanned,
          1: !account.isBanned && !account.bCreated,
          2: !account.isBanned && account.bCreated && account.bPremium,
        })
      ] || ''
    );
  }

  getAccountsByPredicates() {
    const { accounts } = this.props;
    const { searchString } = this.state;

    if (!searchString) {
      return accounts;
    }

    const regenerated = Object.assign([], accounts);
    const regex = new RegExp(escapeRegExp(searchString), 'ig');
    const testGM = new RegExp('GM', 'ig').test(searchString);
    const testPREMIUM = new RegExp('(PREMIUM|PREM|RUB)', 'ig').test(
      searchString,
    );

    return regenerated
      .map((account, index) => ({
        ...account,
        __index: index,
      }))
      .filter(
        account =>
          !!regex.test(account.name) ||
          (testGM && account.bGM) ||
          (testPREMIUM && account.bPremium),
      );
  }

  render() {
    const accountsByPredicates = this.getAccountsByPredicates();
    const { accounts, selected } = this.props;
    const { searchString } = this.state;

    return (
      <React.Fragment>
        {accounts.length >= 10 && (
          <SearchInput
            value={searchString}
            onChange={this.onChangeSearchString}
          />
        )}

        <Scrollbars
          style={style}
          renderTrackVertical={props => (
            <div
              {...props}
              style={{ ...props.style, right: 1, top: 1, bottom: 1 }}
            />
          )}
        >
          <UserAccountsListWrapper>
            {accountsByPredicates.map((account, index) => (
              <AccountGroup
                key={account.id}
                // eslint-disable-next-line
                onClick={this.onClick.bind(
                  null,
                  account,
                  // eslint-disable-next-line
                  account.__index !== undefined ? account.__index : index,
                )}
                selected={selected === index}
              >
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
