import styled from 'styled-components';

export default styled.div`
  position: relative;
  z-index: 2;
  padding: 0 7px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 220px;
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.38);

  ${(props) => props.type === 'danger' && (`
    border: 2px solid rgba(193, 15, 15, 0.72);
  `)}
`;

export const LoadingIndicator = styled.i.attrs({
  className: 'fa fa-spinner fa-spin',
})`
  font-size: 28px;
  margin-bottom: 15px;
`;

export const ErrorIndicator = styled.i.attrs({
  className: 'fa fa-times',
})`
  font-size: 28px;
  margin-bottom: 15px;
  color: red;
`;

export const Message = styled.div`
  font-size: 14px;
  font-weight: 300;
  line-height: 16px;
  margin-bottom: 15px;
`;

export const ProgressWrapper = styled.div`
  height: 3px;
  background: #fff;
  width: 100%;
  position: relative;
  z-index: 1;
`;

export const ProgressValue = styled.div.attrs({
  style: ({ width }) => ({
    width: `${width}%`,
  }),
})`
  height: 3px;
  background: #00c4ff;
  position: absolute;
  z-index: 2;
`;

export const ProgressMessage = styled.div`
  font-size: 12px;
  line-height: 14px;
  position: relative;
  top: -5px;
  z-index: 3;
`;

export const ProgressMessageSpan = styled.span`
  padding: 0 4px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 2px;
`;

export const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1;
`;
