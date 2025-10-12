import React from 'react';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import imgBackground from '../assets/common/img-background.png';

import TextField from '../components/common/TextField';
import Button from '../components/common/Button';
import ButtonSmall from '../components/common/ButtonSmall';

import LeftSection from '../components/onbording/LeftSection';
import { Column, Row } from '../styles/flex';

import iconArrowLeft from '../assets/common/icon-arrow-left.svg';
import { useNavigate } from 'react-router-dom';

export default function SignUpTemplate() {
  const nav = useNavigate();

  return (
    <BackgroundContainer background={imgBackground}>
      <Content>
        <LeftSection
          maintext={'회원가입하고 \n 서비스를 이용해 보세요.'}
          subtext={'우리 동네 수리 요청, \n 힛케톡에서 바로 만나보세요.'}
        />
        <RightSection>
          <BackButton
            onClick={() => {
              nav(-1);
            }}
          >
            <img src={iconArrowLeft} />
          </BackButton>
          <SignUpText>회원가입</SignUpText>
          <Column $gap={30}>
            <Column>
              <Label>이름</Label>
              <TextField placeholder={'이름 입력'} />
            </Column>

            <Column>
              <Label>휴대폰 번호</Label>
              <Row $gap={6}>
                <TextField placeholder={'휴대폰 번호 입력'} />
                <ButtonSmall text={'인증하기'} width={100} />
              </Row>
            </Column>

            <Column>
              <Label>아이디</Label>
              <Row $gap={6}>
                <TextField placeholder={'아이디 입력'} />
                <ButtonSmall text={'중복확인'} width={100} />
              </Row>
              <GuideText>6~20자 이내로 입력해주세요.</GuideText>
            </Column>

            <Column $gap={4}>
              <Label style={{ marginBottom: '0px' }}>비밀번호</Label>
              <TextField placeholder={'비밀번호'} />
              <TextField placeholder={'비밀번호 재확인'} />
              <GuideText>
                {`영문 대소문자와 특수문자를 조합하여 9~16자리까지 가능하며, \n 특수문자는 ~,@,$,^,*,(,),_,+ 만 사용이 가능해요.`}
              </GuideText>
            </Column>
          </Column>
          <Button text={'회원가입'} />
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
  align-items: center;
  position: absolute;
  top: 20%;
  left: 15%;
  bottom: 20%;
  right: 12%;
`;

const RightSection = styled.div`
  position: relative;
  display: flex;
  width: 500px;
  min-height: 90vh;
  padding: 85px 80px;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  background: #fff;
`;

const SignUpText = styled.div`
  ${typo('h2')};
  color: ${color('black')};
`;

const Label = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
  margin-bottom: 4px;
`;

const GuideText = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.400')};
  margin-top: 4px;
  white-space: pre-line;
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
