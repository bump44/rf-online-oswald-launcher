import styled from 'styled-components';

export default styled.div`
  border: none;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: none;
  padding: 15px;
  padding-bottom: 0;
`;

export const AccountName = styled.div`
  font-size: 16px;
`;

export const AccountMetadataRow = styled.div`
  font-size: 12px;
`;
export const AccountMetadataTitle = styled.span`
  font-weight: 500;
`;
export const AccountMetadataValue = styled.span``;

export const AccountBanned = styled.div`
  padding: 15px;
  background: #ff9898;
  margin-bottom: 15px;
`;

export const AccountPremium = styled.div`
  margin-bottom: 15px;
`;

export const AccountActions = styled.div`
  padding-bottom: 15px;
`;

export const AccountButton = styled.button.attrs({
  className: 'btn btn-primary btn-sm',
})``;
