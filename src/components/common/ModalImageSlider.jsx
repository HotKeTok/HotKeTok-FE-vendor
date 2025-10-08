import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Modal from './Modal';
import { Row } from '../../styles/flex';
import { typo, color } from '../../styles/tokens';
import CloseIcn from '../../assets/common/icon-close.svg?react';
import ArrowRightIcn from '../../assets/common/icon-arrow-right.svg?react';

export default function ModalImageSlider({
  title,
  isOpen,
  onClose,
  imageUrls = [],
  startIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
    }
  }, [isOpen, startIndex]);

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
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
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
          <Title>{title}</Title>
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
  height: 100%;

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
