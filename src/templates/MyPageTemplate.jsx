import styled, { css } from 'styled-components';
import { typo, color } from '../styles/tokens';
import VendorProfile from '../components/mypage/VendorProfile';

import HomeContent from '../components/mypage/HomeContent';
import NewsContent from '../components/mypage/NewsContent';
import ReviewContent from '../components/mypage/ReviewContent';

const TABS = [
  { id: 'home', label: '홈' },
  { id: 'news', label: '소식' },
  { id: 'review', label: '리뷰' },
];

export default function MyPageTemplate({
  myPageData,
  newsData,
  reviewData,
  tab,
  setTab,
  onPatchProfileInfo,
  onNewsEdit,
  onNewsDelete,
}) {
  const handleNewsDelete = news => {
    // 확인 팝업 추가
    onNewsDelete(news);
  };

  const renderContent = () => {
    switch (tab) {
      case 'home':
        return <HomeContent myPageData={myPageData} onPatchProfileInfo={onPatchProfileInfo} />;
      case 'news':
        return <NewsContent newsData={newsData} onEdit={onNewsEdit} onDelete={handleNewsDelete} />;
      case 'review':
        return <ReviewContent reviewData={reviewData} />;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Container>
        <VendorProfile myPageData={myPageData} />
        <Tab>
          {TABS.map(t => (
            <TabItem key={t.id} $active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </TabItem>
          ))}
        </Tab>
        <Content>{renderContent()}</Content>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 18px;
  padding-bottom: 30px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Container = styled.div`
  width: 53.7%;

  border: 1px solid ${color('grayscale.300')};
  border-radius: 20px;

  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Tab = styled.div`
  width: 100%;
  height: 38px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
`;

const TabItem = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  position: relative;
  border-bottom: 1px solid #dedede;

  transition: color 0.3s ease-in-out;

  ${props =>
    props.$active
      ? css`
          ${typo('subtitle1')}
          color: black;
        `
      : css`
          ${typo('body1')}
          color: ${color('grayscale.600')};
        `}

  // 가상 요소
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px; /* border 위에 위치하도록 조정 */
    width: 100%;
    height: 2px;
    background-color: black;
    transform: scaleX(0); /* 처음에는 보이지 않게 처리 */
    transform-origin: center; /* 중앙에서부터 나타나는 효과 */
    transition: transform 0.3s ease-in-out;
  }

  /* 활성 상태일 때 밑줄이 나타나도록 설정 */
  ${props =>
    props.$active &&
    css`
      &::after {
        transform: scaleX(1);
      }
    `}
`;

const Content = styled.div`
  width: 100%;

  padding: 30px 50px;

  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;
