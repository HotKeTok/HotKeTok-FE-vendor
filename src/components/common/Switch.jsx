import styled from 'styled-components';
import { color } from '../../styles/tokens';

export default function Switch({ checked, onChange, ...props }) {
  return (
    <SwitchContainer>
      <HiddenInput type="checkbox" checked={checked} onChange={onChange} {...props} />
      <VisibleSwitch>
        <SwitchThumb />
      </VisibleSwitch>
    </SwitchContainer>
  );
}

const SwitchContainer = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

const SwitchThumb = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 2.5px;
  left: 2px;

  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
`;

const VisibleSwitch = styled.div`
  width: 49.5px;
  height: 30px;
  border-radius: 999px; // 캡슐 형태
  background-color: ${color('grayscale.300')};
  position: relative;

  transition: background-color 0.3s ease-in-out;

  ${HiddenInput}:checked + & {
    background-color: ${color('grayscale.700')};
  }

  ${HiddenInput}:checked + & > ${SwitchThumb} {
    transform: translateX(20.5px);
  }
`;
