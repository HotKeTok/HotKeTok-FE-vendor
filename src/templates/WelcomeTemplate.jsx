import React from 'react';
import styled from 'styled-components';
import LeftSection from '../components/onboarding/LeftSection';
import { Column, Row } from '../styles/flex';
import { color, typo } from '../styles/tokens';

const images = [
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/400/400',
  'https://picsum.photos/100/900',
  'https://picsum.photos/100/100',
  'https://picsum.photos/100/100',
  'https://picsum.photos/100/100',
  'https://picsum.photos/100/100',
];

export default function WelcomeTemplate() {
  return (
    <Background>
      <LeftSection
        maintext={`수리업무, 손쉽게 시작하는 \n 전문가들의 필수 서비스`}
        subtext={`우리 동네 수리 요청,\n핫케톡에서 바로 만나보세요.`}
        textcolor="black"
        repairlogo={true}
        mainMarginTop="10px"
      />
      <WhiteBox>
        <Column>
          <VendorName>메종인테리어</VendorName>
          <InformMessage>작성해 주신 정보를 바탕으로 인증을 진행하고 있어요.</InformMessage>
          <IngBadge>인증 중</IngBadge>
        </Column>
        <Column $gap={12}>
          <Row $justify={'space-between'}>
            <Label>이름</Label>
            <Content>메종인테리어</Content>
          </Row>
          <Row $justify={'space-between'}>
            <Label>업종</Label>
            <Content>종합설비업체</Content>
          </Row>
          <Row $justify={'space-between'}>
            <Label>주소</Label>
            <Content>
              서울특별시 강남구 영동대로 112길 46
              <br /> (엘에이치 삼성 도시형 생활주택)(LH삼성아파트) 1층
            </Content>
          </Row>
          <Column>
            <Label>소개</Label>
          </Column>
          <IntroductionBox>좋은 품질의 서비스 보장해드립니다.</IntroductionBox>
        </Column>
        <Column $gap={8} style={{ width: '100%' }}>
          <PhotoGrid>
            {images.map((img, i) => (
              <Thumb key={`${img.url || img.name}-${i}`}>
                <img src={img.url} alt={img.name || `img-${i}`} />
              </Thumb>
            ))}
          </PhotoGrid>
        </Column>
      </WhiteBox>
    </Background>
  );
}

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 23%;
  background: linear-gradient(180deg, #d8f4ea 0%, #fff 100%);
`;

const Container = styled.div`
  display: flex;
`;
const WhiteBox = styled.div`
  display: flex;
  min-width: 420px;
  padding: 40px;
  flex-direction: column;
  align-items: flex;
  gap: 10px;
  border-radius: 20px;
  border: 1px solid var(--Basic-GrayScale-Gray-200, #efefef);
  background: var(--Basic-GrayScale-Gray-100, #fafafb);
`;

const VendorName = styled.div`
  ${typo('webh2')};
  color: ${color('black')};
`;

const InformMessage = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  margin-top: 5px;
`;

const IngBadge = styled.div`
  width: 80px;
  margin-top: 15px;
  margin-bottom: 30px;

  ${typo('button1')};
  color: ${color('brand.primary')};
  display: flex;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 30px;
  border: 1px solid var(--Color-Primary, #01d281);
`;

const Label = styled.div`
  ${typo('button2')};
  color: ${color('black')};
`;

const Content = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  text-align: right;
`;

const IntroductionBox = styled.div`
  display: flex;
  height: 44px;
  padding: 13px 15px;
  gap: 10px;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid var(--Basic-GrayScale-Gray-200, #efefef);
  background: var(--Basic-GrayScale-Gray-100, #fafafb);
  ${typo('body2')};
  color: ${color('grayscale.800')};
  text-align: left;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`;

const Thumb = styled.div`
  height: 72px;
  border-radius: 6px;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
