import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Modal from './Modal';
import { Row } from '../../styles/flex';
import { typo, color } from '../../styles/tokens';
import CloseIcn from '../../assets/common/icon-close.svg?react';
import ArrowRightIcn from '../../assets/common/icon-arrow-right.svg?react';

// 1. props 이름을 startIndex로 변경 (기본값 0)
export default function ModalImageDetail({
  isOpen,
  onClose,
  imageUrls = [],
  clickedImageIndex = 0,
}) {
  // 2. useState의 초기값을 startIndex prop으로 설정
  const [currentIndex, setCurrentIndex] = useState(clickedImageIndex);

  // 3. useEffect를 수정하여 isOpen이나 startIndex가 변경될 때마다 currentIndex를 업데이트
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(clickedImageIndex);
    }
  }, [isOpen, clickedImageIndex]);

  // 이 부분은 Modal 컴포넌트가 처리하므로 필수는 아님
  if (!isOpen) {
    return null;
  }

  const handlePrev = e => {
    e.stopPropagation();
    setCurrentIndex(prevIndex => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  };

  const handleNext = e => {
    e.stopPropagation();
    setCurrentIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
  };

  const ImageModalStyle = {
    minWidth: '460px',
    minHeight: '50%',
    marginRight: '24px',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      justify="flex-end"
      padding={0}
      style={{ ...ImageModalStyle }}
    >
      <Row $justify="space-between" $align="center" style={{ padding: 16 }}>
        <Row $gap={6} $align="center">
          <Title>증상 사진</Title>
          <ImageCount>{`${currentIndex + 1}/${imageUrls.length}`}</ImageCount>
        </Row>
        <CloseIcn onClick={onClose} style={{ cursor: 'pointer' }} />
      </Row>
      <GalleryWrapper>
        <IcnWrapper $isDisabled={currentIndex === 0} onClick={handlePrev}>
          <StyledLeftNavButton direction="left" $isDisabled={currentIndex === 0} />
        </IcnWrapper>
        <LargeImage src={imageUrls[currentIndex]} alt={`상세 이미지 ${currentIndex + 1}`} />

        <IcnWrapper $isDisabled={currentIndex === imageUrls.length - 1} onClick={handleNext}>
          <StyledNavButton direction="right" $isDisabled={currentIndex === imageUrls.length - 1} />
        </IcnWrapper>
      </GalleryWrapper>
    </Modal>
  );
}

const Title = styled.div`
  ${typo('button2')};
  color: ${color('grayscale.700')};
`;

const ImageCount = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
`;

const GalleryWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding-bottom: 24px;
`;

const LargeImage = styled.img`
  flex: 1;

  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  user-select: none; /* 드래그 방지 */
`;

const IcnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 44px;
  height: 44px;
  user-select: none; /* 드래그 방지 */

  ${props =>
    props.$isDisabled
      ? css`
          cursor: not-allowed;
          pointer-events: none;
        `
      : css`
          cursor: pointer;
        `};
`;

const StyledNavButton = styled(ArrowRightIcn)`
  width: 10px;
  height: 16px;

  path {
    stroke: ${props => (props.$isDisabled ? color('grayscale.400') : color('grayscale.800'))};
  }
`;

const StyledLeftNavButton = styled(StyledNavButton)`
  transform: rotate(180deg);
`;
