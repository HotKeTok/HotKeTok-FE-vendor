import styled from 'styled-components';
import { color } from '../../styles/tokens';

export default function HomeContentImageItem({ src, alt, onClick }) {
  return (
    <GalleryItemWrapper onClick={onClick}>
      <GalleryImage src={src} alt={alt} />
    </GalleryItemWrapper>
  );
}

const GalleryItemWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 10px;
  overflow: hidden;
  background-color: ${color('grayscale.100')};
  cursor: pointer;
`;

const GalleryImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
