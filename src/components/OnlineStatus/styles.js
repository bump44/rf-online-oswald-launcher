import styled from 'styled-components';

export default styled.div`
  display: block;
  width: 100%;
  margin-bottom: 15px;
  overflow: hidden;
`;

export const Block = styled.div`
  float: left;
  margin-right: 10px;
`;

export const IconImage = styled.i.attrs({})`
  width: 30px;
  height: 25px;
  display: block;
  background-size: contain;
  border-radius: 2px;
  float: left;
  margin-right: 10px;
  background-position: center center;
`;

export const Value = styled.span`
  color: #fff;
  text-shadow: 1px 1px 0px rgba(51, 51, 51, 0.78);
`;
