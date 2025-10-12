import React from 'react';
import styled from 'styled-components';
import imgBackground from '../assets/common/img-background.png';

export default function SignInTemplate() {
  return (
    <BackgroundContainer background={imgBackground}>
      <Content>
        <h1>안녕하세요</h1>
        <p>이건 배경 이미지 위에 놓인 텍스트입니다.</p>
      </Content>
    </BackgroundContainer>
  );
}

// 배경 컨테이너
const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: ${({ background }) => `url(${background})`};
  background-size: cover;
  background-position: center;
  position: relative;
`;

// 오버레이 콘텐츠
const Content = styled.div`
  top: 30%;
  left: 10%;
  color: white;
  font-size: 2rem;
`;
