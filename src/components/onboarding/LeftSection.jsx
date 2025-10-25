import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { color, typo } from '../../styles/tokens';

import iconLogo from '../../assets/common/icon-service-logo-name.svg';
import iconRepairLogo from '../../assets/common/icon-repair-logo.svg';
import iconHashtag1 from '../../assets/common/icon-hashtag-1.svg';
import iconHashtag2 from '../../assets/common/icon-hashtag-2.svg';
import iconHashtag3 from '../../assets/common/icon-hashtag-3.svg';

export default function LeftSection({
  maintext,
  subtext,
  textcolor = 'white',
  repairlogo = false,
  mainMarginTop = '90px',
  mainMarginBottom = '40px',
}) {
  return (
    <Container>
      <IconLogo src={repairlogo ? iconRepairLogo : iconLogo} />
      <WelcomeText
        $textcolor={textcolor}
        $marginTop={mainMarginTop}
        $marginBottom={mainMarginBottom}
      >
        {maintext}
      </WelcomeText>
      <H2Text $textcolor={textcolor}>{subtext}</H2Text>

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
  color: ${({ $textcolor }) => color($textcolor) || $textcolor};
  margin-top: ${({ $marginTop }) => $marginTop};
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
  white-space: pre-line;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 0.1s;
`;

const H2Text = styled.div`
  ${typo('h2')};
  color: ${({ $textcolor }) => color($textcolor) || $textcolor};
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

const Tag1 = styled.img`
  ${baseTag};
  top: 0;
  left: 0;
  z-index: 3;
  animation-delay: 0.5s;
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
