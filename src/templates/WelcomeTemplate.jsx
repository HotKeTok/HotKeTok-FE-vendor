// src/templates/WelcomeTemplate.jsx
import React from 'react';
import styled from 'styled-components';
import LeftSection from '../components/onboarding/LeftSection';
import { Column, Row } from '../styles/flex';
import { color, typo } from '../styles/tokens';
import Shell from '../components/onboarding/Shell';
import { useNavigate } from 'react-router-dom';

const fallbackImages = [
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/400/400',
  'https://picsum.photos/100/900',
  'https://picsum.photos/100/100',
  'https://picsum.photos/100/100',
  'https://picsum.photos/100/100',
  'https://picsum.photos/100/100',
];

export default function WelcomeTemplate({ loading = false, error = '', vendor = null }) {
  const vendorName = vendor?.name ?? '메종인테리어';
  const vendorCategory = vendor?.category ?? '종합설비업체';
  const vendorIntro = vendor?.introduction ?? '좋은 품질의 서비스 보장해드립니다.';

  const fullAddress = vendor?.fullAddress
    ? vendor.fullAddress.split('\n')
    : ['서울특별시 강남구 영동대로 112길 46', '(엘에이치 삼성 도시형 생활주택)(LH삼성아파트) 1층'];

  const images =
    Array.isArray(vendor?.introductionImage) && vendor.introductionImage.length > 0
      ? vendor.introductionImage
      : fallbackImages;

  const nav = useNavigate();
  const handleBack = () => {
    nav('/sign-in');
  };

  return (
    <Background>
      <LeftSection
        maintext={`수리업무, 손쉽게 시작하는 \n 전문가들의 필수 서비스`}
        subtext={`우리 동네 수리 요청,\n핫케톡에서 바로 만나보세요.`}
        textcolor="black"
        repairlogo={true}
        mainMarginTop="10px"
      />
      <Shell height="45vh" onBack={handleBack}>
        <Column>
          <VendorName>{loading ? '불러오는 중…' : vendorName}</VendorName>
          <InformMessage>
            {error
              ? '업체 정보를 불러오지 못했습니다.'
              : '작성해 주신 정보를 바탕으로 인증을 진행하고 있어요.'}
          </InformMessage>
          <IngBadge>인증 중</IngBadge>
        </Column>

        <Column $gap={12}>
          <Row $justify={'space-between'}>
            <Label>이름</Label>
            <Content>{vendorName}</Content>
          </Row>
          <Row $justify={'space-between'}>
            <Label>업종</Label>
            <Content>{vendorCategory}</Content>
          </Row>
          <Row $justify={'space-between'}>
            <Label>주소</Label>
            <Content>
              {fullAddress.map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < fullAddress.length - 1 && <br />}
                </span>
              ))}
            </Content>
          </Row>
          <Column>
            <Label>소개</Label>
          </Column>
          <IntroductionBox>{vendorIntro}</IntroductionBox>
        </Column>

        <Column $gap={8} style={{ width: '100%' }}>
          <PhotoGrid>
            {images.map((img, i) => {
              const src = typeof img === 'string' ? img : img?.url;
              const alt = typeof img === 'object' && img?.name ? img.name : `img-${i}`;
              return (
                <Thumb key={`${src}-${i}`}>
                  <img src={src} alt={alt} />
                </Thumb>
              );
            })}
          </PhotoGrid>
        </Column>
      </Shell>
    </Background>
  );
}

/* ======================
 * Styles (기존 유지)
 * ====================== */
const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 17% 0 20%;
  background: linear-gradient(180deg, #d8f4ea 0%, #fff 100%);
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
  margin-bottom: 15px;

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
  margin-top: 12px;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`;

const Thumb = styled.div`
  height: 80%;
  border-radius: 6px;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
