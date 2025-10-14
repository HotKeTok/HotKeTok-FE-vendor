import React from 'react';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';

import iconLogo from '../../assets/common/icon-service-logo-name.svg';
import iconHashtag from '../../assets/common/icon-service-hashtag.svg';

export default function LeftSection({ maintext, subtext }) {
  return (
    <Container>
      <IconLogo src={iconLogo} />
      <WelcomeText>{maintext}</WelcomeText>
      <H2Text>{subtext}</H2Text>
      <IconHashtag src={iconHashtag} />
    </Container>
  );
}

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
`;

const H2Text = styled.div`
  ${typo('h2')};
  color: ${color('white')};
  margin-bottom: 40px;
  white-space: pre-line;
`;

const IconHashtag = styled.img``;
