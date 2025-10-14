import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { color, typo } from '../../styles/tokens';

import iconLogo from '../../assets/common/icon-service-logo-name.svg';
import iconHashtag1 from '../../assets/common/icon-hashtag-1.svg';
import iconHashtag2 from '../../assets/common/icon-hashtag-2.svg';
import iconHashtag3 from '../../assets/common/icon-hashtag-3.svg';

export default function LeftSection({ maintext, subtext }) {
  return (
    <Container>
      <IconLogo src={iconLogo} />
      <WelcomeText>{maintext}</WelcomeText>
      <H2Text>{subtext}</H2Text>

      <HashtagStack>
        <Tag1 src={iconHashtag1} />
        <Tag2 src={iconHashtag2} />
        <Tag3 src={iconHashtag3} />
      </HashtagStack>
    </Container>
  );
}

/* =====================
 * Animation
 * ===================== */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* 부유(둥둥) 애니메이션 */
const float = keyframes`
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const IconLogo = styled.img`
  width: 160px;
`;

const WelcomeText = styled.div`
  ${typo('webh1')};
  color: ${color('white')};
  margin-top: 90px;
  margin-bottom: 40px;
  white-space: pre-line;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 0.1s;
`;

const H2Text = styled.div`
  ${typo('h2')};
  color: ${color('white')};
  margin-bottom: 40px;
  white-space: pre-line;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 0.3s;
`;

/* =====================
 * Hashtag stacking
 * ===================== */
const HashtagStack = styled.div`
  position: relative;
  width: 360px;
  height: 140px;
`;

const baseTag = css`
  position: absolute;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
`;

/* 각각 약간 다른 부유감 + 시간차 */
const Tag1 = styled.img`
  ${baseTag};
  top: 0;
  left: 0;
  z-index: 3;
  animation-delay: 0.5s;
  /* 등장 이후 천천히 둥둥 */
  animation: ${fadeIn} 0.8s ease forwards 0.5s, ${float} 4.2s ease-in-out infinite 1.3s;
`;

const Tag2 = styled.img`
  ${baseTag};
  top: 30px;
  left: 120px;
  z-index: 2;
  animation: ${fadeIn} 0.8s ease forwards 0.7s, ${float} 4.8s ease-in-out infinite 1.6s;
`;

const Tag3 = styled.img`
  ${baseTag};
  top: 67px;
  left: 10px;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease forwards 0.9s, ${float} 5.3s ease-in-out infinite 2s;
`;
