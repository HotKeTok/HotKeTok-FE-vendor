// src/templates/SignInTemplate.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import imgBackground from '../assets/common/img-background.png';
import { Column } from '../styles/flex';

import LeftSection from '../components/onboarding/LeftSection';
import TextField from '../components/common/TextField';
import Button from '../components/common/Button';

export default function SignInTemplate({
  submitting = false,
  onSubmit = async () => {},
  onSignUp = () => {},
  onNotify = () => {},
}) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = Boolean(userId.trim() && password);

  const handleSubmit = async () => {
    if (!canSubmit) {
      onNotify('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    await onSubmit({ logInId: userId, password });
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && canSubmit && !submitting) {
      handleSubmit();
    }
  };

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
                placeholder="아이디를 입력해주세요."
                value={userId}
                onChange={e => setUserId(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </Column>
            <Column>
              <Label>비밀번호</Label>
              <TextField
                placeholder="비밀번호를 입력해주세요."
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </Column>
          </Column>
          <Column $gap={20}>
            <Button
              text={submitting ? '로그인 중...' : '로그인'}
              onClick={handleSubmit}
              disabled={submitting}
              active={canSubmit && !submitting}
            />
            <SignUpButtonWrapper>
              <SignUpButton onClick={onSignUp}>회원가입</SignUpButton>
            </SignUpButtonWrapper>
          </Column>
        </RightSection>
      </Content>
    </BackgroundContainer>
  );
}

/* ===== 스타일 ===== */
const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: ${({ background }) => `url(${background})`};
  background-size: cover;
  background-position: center;
  position: relative;
`;

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
  justify-content: center;
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
