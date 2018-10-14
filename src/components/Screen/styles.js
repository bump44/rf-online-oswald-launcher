import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex: 1 1;
  flex-direction: row;
  position: relative;
  z-index: 2;
  height: 100%;
`;

export const ButtonLogout = styled.button`
  padding: 0;
  background: transparent;
  color: #fff;
  border: none;
  float: right;
  outline: none;
  &:hover {
    color: #ddd;
    cursor: pointer;
  }
`;

export const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1;
`;

export const Aside = styled.div`
  padding: 15px;
  max-width: 300px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  background: #333;
  color: #f7f7f7;
`;

export const Content = styled.div`
  padding: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const HintMessage = styled.span`
  font-size: 11px;
  line-height: 12px;
  display: block;
  font-family: Verdana, sans-serif;
  color: #9e9e9e;
`;
