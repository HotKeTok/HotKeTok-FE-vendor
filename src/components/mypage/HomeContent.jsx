import styled from 'styled-components';
import TimeIcn from '../../assets/mypage/icon-time.svg?react';
import PhoneIcn from '../../assets/mypage/icon-phone.svg?react';
import BookmarkIcn from '../../assets/mypage/icon-bookmark.svg?react';
import LocationIcn from '../../assets/mypage/icon-location.svg?react';
import { typo, color } from '../../styles/tokens';
import { Column } from '../../styles/flex';
import HomeContentRow from './HomeContentRow';
import { useState } from 'react';
import HomeContentImageItem from './HomeContentImageItem';
import PhotoIcn from '../../assets/common/icon-photo.svg?react';
import ModalImageSlider from '../common/ModalImageSlider';
import ModalProfileInfo from './ModalProfileInfo';
import Toast from '../common/Toast';

export default function HomeContent({ myPageData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    introduction: myPageData.introduction || '',
    runningTime: myPageData.runningTime || {},
    phoneNumber: myPageData.phoneNumber || '',
    image: myPageData.introductionImage || '',
    introductionImage: myPageData.introductionImage || [],
  });

  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedImageModalOpen, setSelectedImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const images = myPageData.introductionImage || [];
  const hasMoreThanThreeImages = images.length > 3;

  const firstThreeImages = images.slice(0, 3);
  const nestedGridImages = images.slice(3, 7);

  const actualNestedGridImageCount = nestedGridImages.length;
  const showNestedGridOverlay = hasMoreThanThreeImages && actualNestedGridImageCount > 1;

  const handleExpandClick = () => {
    setShowAllImages(true);
  };

  const handleImageClick = index => {
    setSelectedImageIndex(index);
    setSelectedImageModalOpen(true);
  };

  const handleMyPageInfoConfirm = updatedData => {
    console.log('Updated MyPage Data:', updatedData);
    setModalOpen(false);
  };

  return (
    <Container>
      <ModalProfileInfo
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        myPageData={myPageData}
        onPatchProfileInfo={handleMyPageInfoConfirm}
        profileData={profileData}
        setProfileData={setProfileData}
      />
      <ModalImageSlider
        title="증상 사진"
        isOpen={selectedImageModalOpen && selectedImageIndex !== null}
        onClose={() => setSelectedImageModalOpen(false)}
        imageUrls={myPageData.introductionImage}
        startIndex={selectedImageIndex}
      />
      <Introduction>
        <Title>소개</Title>
        <Text>{myPageData.introduction || '소개글이 없습니다.'}</Text>
      </Introduction>
      <Column $gap={12}>
        <HomeContentRow
          isEmpty={'임시'}
          icon={TimeIcn}
          label="영업 시간"
          value={myPageData.runningTime || '정보 없음'}
        />
        <HomeContentRow
          isEmpty={!myPageData.phoneNumber}
          icon={PhoneIcn}
          label="전화번호"
          value={myPageData.phoneNumber || '정보 없음'}
        />
        <HomeContentRow
          isEmpty={!myPageData.category}
          icon={LocationIcn}
          label="카테고리"
          value={myPageData.category || '정보 없음'}
        />
        <HomeContentRow
          isEmpty={!myPageData.address}
          icon={BookmarkIcn}
          label="주소"
          value={
            myPageData.address
              ? `${myPageData.address} ${myPageData.detailAddress || ''}`.trim()
              : '정보 없음'
          }
        />
      </Column>

      {images.length > 0 && (
        <ImageGallerySection>
          {!showAllImages ? (
            // 초기 뷰
            <ImageList>
              {firstThreeImages.map((src, index) => (
                <HomeContentImageItem
                  key={`first-${index}`}
                  src={src}
                  alt={`갤러리 이미지 ${index + 1}`}
                  onClick={() => handleImageClick(index)}
                />
              ))}
              {nestedGridImages.length === 1 && ( // 4번째 자리가 있고 Nested Grid가 없다면
                <HomeContentImageItem
                  key={`nested-single`}
                  src={nestedGridImages[0]}
                  alt={`갤러리 이미지 4`}
                  onClick={() => handleImageClick(3)}
                />
              )}

              {hasMoreThanThreeImages &&
                nestedGridImages.length > 1 && ( // 4번째 자리가 있고 Nested Grid가 있다면
                  <NestedGridWrapper onClick={handleExpandClick}>
                    {nestedGridImages.map((src, index) => (
                      <NestedImageItemContainer key={`nested-${index}`}>
                        <NestedImageItem src={src} alt={`갤러리 이미지 ${index + 4}`} />
                        {/* Nested Grid의 마지막 이미지에만 오버레이 적용 */}
                        {index === nestedGridImages.length - 1 && showNestedGridOverlay && (
                          <NestedOverlayContent>
                            {/* 새롭게 추가된 컨테이너 */}
                            <PhotoIcnWrapper>
                              {/* 아이콘 래퍼 추가 */}
                              <PhotoIcn />
                            </PhotoIcnWrapper>
                          </NestedOverlayContent>
                        )}
                      </NestedImageItemContainer>
                    ))}
                  </NestedGridWrapper>
                )}
            </ImageList>
          ) : (
            // 확장 뷰: 모든 이미지를 보여주는 그리드
            <AllImagesGrid>
              {images.map((src, index) => (
                <HomeContentImageItem
                  key={`all-${index}`}
                  src={src}
                  alt={`갤러리 이미지 ${index + 1}`}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </AllImagesGrid>
          )}
        </ImageGallerySection>
      )}
      <ManageButton onClick={() => setModalOpen(true)}>프로필 관리</ManageButton>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Introduction = styled.div`
  padding: 16px 18px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
`;

const Title = styled.h3`
  ${typo('button2')}
  color: ${color('grayscale.800')};
`;

const Text = styled.p`
  ${typo('body2')}
  color: ${color('grayscale.600')};
`;

const ImageGallerySection = styled.div``;

// 초기 뷰 (3 + 1)
const ImageList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

// 전체 이미지 뷰
const AllImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

// 네 번째 아이템 (2x2 그리드)
const NestedGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
`;

const NestedImageItemContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
`;

const NestedImageItem = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: ${color('grayscale.100')};
`;

const NestedOverlayContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const PhotoIcnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 20px;

  svg {
    width: 100%;
    height: 100%;
    fill: #fff;
  }
`;

const ManageButton = styled.div`
  width: 100%;
  height: 46px;

  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};

  ${typo('body2')}
  color: ${color('grayscale.800')};

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`;
