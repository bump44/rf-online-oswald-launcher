import styled from 'styled-components';

export default styled.div`
  display: block;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border: 1px solid #232323;
  border-bottom: 0;
  box-shadow: 0 0 3px 1px #2f2f2f;
`;

export const AccountGroup = styled.div`
  width: 100%;
  border-bottom: 1px solid #232323;
  position: relative;
  cursor: pointer;
  transition: all .1s ease-in-out;

  &:hover {
    background-color: #232323;
  }

  ${(props) => (props.selected) && (`
    background-color: #232323;
  `)}
`;

export const AccountName = styled.div`
  font-size: 14px;
  padding: 5px;
  padding-left: 10px;
`;

export const SearchInput = styled.input.attrs({ placeholder: 'Поиск...', className: 'form-control' })`
  height: 30px;
  line-height: 30px;
  color: #e0e0e0;
  background: transparent;
  border: 1px solid #232323;
  outline: none;
  padding: 0 10px;
  text-shadow: none;
  font-size: 14px;
  font-weight: 300;
  border-radius: 0;
  border-bottom: 0;
  &:disabled,
  &[readonly],
  &:focus,
  &:hover {
    color: #e0e0e0;
    background: rgba(0, 0, 0, 0.1);
    outline: none;
    box-shadow: none;
    border-color: #232323;
  }
  &:disabled,
  &[readonly] {
    opacity: .7;
  }
`;
