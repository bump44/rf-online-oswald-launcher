import styled from 'styled-components';

export default styled.div`
  display: block;
  width: 100%;
`;

export const FieldGroup = styled.div`
  margin-bottom: 15px;
`;

export const FieldLabel = styled.div`
  margin-bottom: 0.5rem;
  font-size: 14px;
`;

export const FieldInput = styled.input.attrs({ className: 'form-control' })`
  height: 30px;
  line-height: 30px;
  color: #e0e0e0;
  background: rgba(0, 0, 0, 0.41);
  border: 1px solid #000;
  outline: none;
  padding: 0 10px;
  text-shadow: none;
  font-size: 14px;
  font-weight: 300;
  &:disabled,
  &[readonly],
  &:focus,
  &:hover {
    color: #e0e0e0;
    background: rgba(0, 0, 0, 0.41);
  }
  &:disabled,
  &[readonly] {
    opacity: 0.7;
  }
`;

export const ButtonSubmit = styled.button.attrs({
  className: 'btn btn-primary btn-sm',
})`
  width: 83%;
  margin-left: 2%;
`;

export const ButtonBack = styled.button.attrs({
  className: 'btn btn-default btn-sm',
})`
  width: 15%;
  > i {
    position: relative;
    left: -2px;
    top: -1px;
  }
`;

export const HintMessage = styled.span`
  font-size: 11px;
  line-height: 12px;
  display: block;
  font-family: Verdana, sans-serif;
  color: #9e9e9e;
  margin-bottom: 15px;
`;

export const Actions = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ErrorMessage = styled.div`
  font-size: 11px;
  line-height: 12px;
  display: block;
  font-family: Verdana, sans-serif;
  margin-bottom: 15px;
  color: #ff6161;
`;
