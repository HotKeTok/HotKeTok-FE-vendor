import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import imgBackground from '../assets/common/img-background.png';
import { Column } from '../styles/flex';

import TextField from '../components/common/TextField';
import Button from '../components/common/Button';
import LeftSection from '../components/onboarding/LeftSection';

export default function SignInTemplate() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const nav = useNavigate();

  return (
    <BackgroundContainer background={imgBackground}>
      <Content>
        <LeftSection
          maintext={'환영합니다! \n 계정에 로그인해 주세요.'}
          subtext={'우리 동네 수리 요청, \n 힛케톡에서 바로 만나보세요.'}
        />
        <RightSection>
          <LoginText>로그인</LoginText>
          <Column $gap={14}>
            <Column>
              <Label>아이디</Label>
              <TextField
                placeholder={'아이디를 입력해주세요.'}
                onChange={e => setUserId(e.target.value)}
              />
            </Column>
            <Column>
              <Label>비밀번호</Label>
              <TextField
                placeholder={'비밀번호를 입력해주세요.'}
                onChange={e => setPassword(e.target.value)}
              />
            </Column>
          </Column>
          <Column $gap={20}>
            <Button text={'로그인'} active={userId && password ? true : false} />
            <SignUpButtonWrapper>
              <SignUpButton
                onClick={() => {
                  nav('/sign-up');
                }}
              >
                회원가입
              </SignUpButton>
            </SignUpButtonWrapper>
          </Column>
        </RightSection>
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
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 20%;
  left: 15%;
  bottom: 20%;
  right: 12%;
`;

const RightSection = styled.div`
  display: flex;
  width: 500px;
  padding: 72px 79px;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  background: #fff;
`;

const LoginText = styled.div`
  ${typo('h2')};
  color: ${color('black')};
`;

const Label = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
  margin-bottom: 4px;
`;

const SignUpButtonWrapper = styled.div`
  display: flex;
  justify-content: cetner;
  align-self: center;
`;

const SignUpButton = styled.div`
  cursor: pointer;
  ${typo('button2')};
  color: ${color('grayscale.600')};
  width: 100px;
  padding: 10px 20px;
  gap: 10px;
`;
