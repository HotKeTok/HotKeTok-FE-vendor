import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import RepairStatusChip from '../common/RepairStatusChip';
import OptionsMenu from '../common/OptionsMenu';
import { Row } from '../../styles/flex';

/**
 * 채팅방 헤더 컴포넌트
 * @param {Array} participants - 채팅 참여자 목록
 * @param {string} profileImageUrl - 프로필 이미지 URL
 * @returns {JSX.Element} 채팅방 헤더 컴포넌트
 */
export default function ChatRoomHeader({
  participants,
  profileImageUrl,
  status = 'COMPLETED', // TODO: api 수정시 반영
  onDelete,
}) {
  const menuOptions = [{ label: '채팅방 나가기', onClick: onDelete }];

  return (
    <Container>
      <Row>
        <Profile src={profileImageUrl} alt="프로필 이미지" />
        <div style={{ marginLeft: 12 }}>
          <Title>{participants.map(p => p.userName).join(', ')}</Title>
          <Address>서울시 강남구 역삼동</Address>
          {/* todo: 실제 주소 연결 */}
        </div>
      </Row>
      <Row align="center">
        <RepairStatusChip status={status} />
        <OptionsMenu options={menuOptions} />
      </Row>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;

  padding: 21px 39px;
  background-color: #fff;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid ${color('grayscale.300')};
`;

const Profile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const Title = styled.div`
  ${typo('button1')};
  color: ${color('grayscale.800')};
`;

const Address = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;
