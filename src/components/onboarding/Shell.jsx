import React from 'react';
import styled from 'styled-components';
import iconArrowLeft from '../../assets/common/icon-arrow-left.svg';

export default function Shell({ icon, children, onBack }) {
  return (
    <RightSection>
      <BackButton onClick={onBack}>
        <img src={iconArrowLeft} alt="back" />
      </BackButton>
      {icon ? <IconStep src={icon} alt="step" /> : null}
      {children}
    </RightSection>
  );
}

const RightSection = styled.div`
  position: relative;
  display: flex;
  width: 500px;
  min-height: 80vh;
  padding: 95px 80px 30px 80px;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  background: #fff;
`;

const BackButton = styled.button`
  position: absolute;
  top: 25px;
  left: 20px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    width: 10px;
  }
`;

const IconStep = styled.img`
  position: absolute;
  top: 20px;
  right: 30px;
`;
