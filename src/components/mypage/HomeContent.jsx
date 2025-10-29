import styled from 'styled-components';
import TimeIcn from '../../assets/mypage/icon-time.svg?react';
import PhoneIcn from '../../assets/mypage/icon-phone.svg?react';
import BookmarkIcn from '../../assets/mypage/icon-bookmark.svg?react';
import LocationIcn from '../../assets/mypage/icon-location.svg?react';
import { typo, color } from '../../styles/tokens';
import { Column } from '../../styles/flex';
import HomeContentRow from './HomeContentRow';
import { useEffect, useState } from 'react';
import HomeContentImageItem from './HomeContentImageItem';
import PhotoIcn from '../../assets/common/icon-photo.svg?react';
import ModalImageSlider from '../common/ModalImageSlider';
import ModalProfileInfo from './ModalProfileInfo';
import Toast from '../common/Toast';
import { daysOfWeek } from '../../constants/Date';
import { MyPageContext } from '../../context/MyPageData';

export default function HomeContent({ myPageData, onPatchProfileInfo }) {
  const contextValue = {
    data: myPageData,
    updateData: onPatchProfileInfo,
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [profileEditData, setProfileEditData] = useState({
    introduction: myPageData.introduction || '',
    runningTime: myPageData.runningTime || {},
    phoneNumber: myPageData.phoneNumber || '',
    profileImage: myPageData.image || '',
    introductionImage: myPageData.introductionImage || [],
  });

  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedImageModalOpen, setSelectedImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const originalImages = myPageData.introductionImage || [];

    const newDisplayUrls = originalImages.map(src => {
      if (src instanceof Blob) {
        return URL.createObjectURL(src);
      }
      if (typeof src === 'string') {
        return src;
      }
      if (src && typeof src.url === 'string') {
        return src.url;
      }
      return '';
    });

    setImageUrls(newDisplayUrls);

    return () => {
      newDisplayUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [myPageData.introductionImage]);

  const hasMoreThanThreeImages = imageUrls.length > 3;
  const firstThreeImages = imageUrls.slice(0, 3);
  const nestedGridImages = imageUrls.slice(3, 7);

  const actualNestedGridImageCount = nestedGridImages.length;
  const showNestedGridOverlay = hasMoreThanThreeImages && actualNestedGridImageCount > 1;

  useEffect(() => {
    setProfileEditData({
      introduction: myPageData.introduction || '',
      runningTime: myPageData.runningTime || {},
      phoneNumber: myPageData.phoneNumber || '',
      profileImage: myPageData.image || '',
      introductionImage: myPageData.introductionImage || [],
    });
  }, [myPageData]);

  const handleExpandClick = () => {
    setShowAllImages(true);
  };

  const handleImageClick = index => {
    setSelectedImageIndex(index);
    setSelectedImageModalOpen(true);
  };

  const handleMyPageInfoConfirm = (jsonData, profileFile, introFiles) => {
    setModalOpen(false);
    onPatchProfileInfo(jsonData, profileFile, introFiles);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setProfileEditData({
      introduction: myPageData.introduction || '',
      runningTime: myPageData.runningTime || {},
      phoneNumber: myPageData.phoneNumber || '',
      profileImage: myPageData.image || '',
      introductionImage: myPageData.introductionImage || [],
    });
  };

  const { introduction, phoneNumber, category, addressAndDetail, detailAddress, runningTime } =
    myPageData;
  const { openingTime, closingTime, working_day_of_week } = runningTime === null ? {} : runningTime;

  const notWorkingDays = working_day_of_week
    ? daysOfWeek.filter(day => !working_day_of_week.includes(day))
    : [];

  return (
    <MyPageContext.Provider value={contextValue}>
      <Container>
        <ModalProfileInfo
          isOpen={modalOpen}
          onClose={handleModalClose}
          profileEditData={profileEditData}
          setProfileEditData={setProfileEditData}
          onPatchProfileInfo={handleMyPageInfoConfirm}
        />
        <ModalImageSlider
          title="증상 사진"
          isOpen={selectedImageModalOpen && selectedImageIndex !== null}
          onClose={() => setSelectedImageModalOpen(false)}
          imageUrls={imageUrls}
          startIndex={selectedImageIndex}
        />
        <Introduction>
          <Title>소개</Title>
          <Text>{introduction || '소개글이 없습니다.'}</Text>
        </Introduction>
        <Column $gap={12}>
          <HomeContentRow
            isEmpty={!runningTime || (openingTime === null && closingTime === null)}
            icon={TimeIcn}
            label="영업 시간"
            values={[
              {
                id: 1,
                value: `${openingTime} ~ ${closingTime}`,
                color: color('grayscale.800'),
              },
              {
                id: 2,
                value: `${
                  notWorkingDays.length === 0
                    ? '(휴무 없음)'
                    : `(${notWorkingDays.join(', ')} 휴무)`
                }`,
                color: '#FF3F3F',
              },
            ]}
            onOpen={() => setModalOpen(true)}
          />
          <HomeContentRow
            isEmpty={!phoneNumber}
            icon={PhoneIcn}
            label="전화번호"
            values={[
              {
                id: 1,
                value: phoneNumber || '정보 없음',
                color: color('grayscale.800'),
              },
            ]}
          />
          <HomeContentRow
            isEmpty={!category}
            icon={LocationIcn}
            label="카테고리"
            values={[
              {
                id: 1,
                value: category || '정보 없음',
                color: color('grayscale.800'),
              },
            ]}
          />
          <HomeContentRow
            isEmpty={!addressAndDetail}
            icon={BookmarkIcn}
            label="주소"
            values={[
              {
                id: 1,
                value: addressAndDetail
                  ? `${addressAndDetail} ${detailAddress || ''}`.trim()
                  : '정보 없음',
                color: color('grayscale.800'),
              },
            ]}
          />
        </Column>

        {imageUrls.length > 0 && (
          <ImageGallerySection>
            {!showAllImages ? (
              <ImageList>
                {firstThreeImages.map((src, index) => (
                  <HomeContentImageItem
                    key={`first-${index}`}
                    src={src}
                    alt={`갤S러리 이미지 ${index + 1}`}
                    onClick={() => handleImageClick(index)}
                  />
                ))}
                {nestedGridImages.length === 1 && (
                  <HomeContentImageItem
                    key={`nested-single`}
                    src={nestedGridImages[0]}
                    alt={`갤러리 이미지 4`}
                    onClick={() => handleImageClick(3)}
                  />
                )}

                {hasMoreThanThreeImages && nestedGridImages.length > 1 && (
                  <NestedGridWrapper onClick={handleExpandClick}>
                    {nestedGridImages.map((src, index) => {
                      return (
                        <NestedImageItemContainer key={`nested-${index}`}>
                          <NestedImageItem src={src} alt={`갤러리 이미지 ${index + 4}`} />
                          {index === nestedGridImages.length - 1 && showNestedGridOverlay && (
                            <NestedOverlayContent>
                              <PhotoIcnWrapper>
                                <PhotoIcn />
                              </PhotoIcnWrapper>
                            </NestedOverlayContent>
                          )}
                        </NestedImageItemContainer>
                      );
                    })}
                  </NestedGridWrapper>
                )}
              </ImageList>
            ) : (
              <AllImagesGrid>
                {imageUrls.map((src, index) => (
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
    </MyPageContext.Provider>
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

const ImageList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const AllImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

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
