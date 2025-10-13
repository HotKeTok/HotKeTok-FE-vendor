import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import CloseIcn from '../../assets/common/icon-close.svg?react';
import PhotoAddIcn from '../../assets/common/icon-camera.svg?react';

export default function HomeImgGrid({ images, setProfileEditData, profileEditData }) {
  const handleImageDelete = indexToDelete => {
    const updatedImages = images.filter((_, index) => index !== indexToDelete);
    setProfileEditData({ ...profileEditData, introductionImage: updatedImages });
  };

  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (images.length + files.length > 10) {
      alert('이미지는 최대 10장까지 등록할 수 있습니다.');
      return;
    }

    const newImageUrls = files.map(file => URL.createObjectURL(file));
    // todo: 서버 url 받아오기 (현재는 로컬로 처리)
    setProfileEditData({ ...profileEditData, introductionImage: [...images, ...newImageUrls] });
  };

  return (
    <ImageGridContainer>
      {images.length < 10 && (
        <ImageUploadLabel>
          <PhotoAddIcn />
          <span>사진 {images.length}/10</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </ImageUploadLabel>
      )}
      {images.map((src, index) => (
        <ImageWrapper key={index}>
          <Image src={src} alt={`소개 사진 ${index + 1}`} />
          <DeleteButton onClick={() => handleImageDelete(index)}>
            <CloseIcn />
          </DeleteButton>
        </ImageWrapper>
      ))}
    </ImageGridContainer>
  );
}

const ImageGridContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 100px));
  gap: 8px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;

  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: white;

  svg {
    width: 10px;
    height: 10px;

    path {
      stroke: #fff;
    }
  }
`;

const ImageUploadLabel = styled.label`
  position: relative;
  width: 100%;
  height: 100px;
  padding: 10px;

  border-radius: 7.5px;
  border: 1px dashed ${color('grayscale.300')};
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  ${typo('caption1')};
  color: ${color('grayscale.400')};
`;
