import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import { Row } from '../../styles/flex';
import StarIcn from '../../assets/common/icon-star.svg?react';

export default function VendorProfile({ myPageData }) {
  const { name, category, image, rate, reviewCount } = myPageData;

  return (
    <Container>
      <ProfileImg src={image} alt="프로필 이미지" />
      <div>
        <Row $gap={8} $align="center">
          <Title>{name}</Title>
          <Body2>{category}</Body2>
        </Row>

        <Row $gap={14} $align="center" style={{ padding: '4px 0px' }}>
          <Rate $gap={6} $align="center">
            {<StarIcn />}
            {` ${rate}`}
          </Rate>
          <Review>{`후기 ${reviewCount}`}</Review>
        </Row>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 30px 0px 24px 36px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const Title = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.800')};
`;

const Body2 = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

const Review = styled(Body2)`
  color: ${color('grayscale.500')};
`;

const Rate = styled(Row)`
  ${typo('button2')};
  color: ${color('brand.primary')};
`;
