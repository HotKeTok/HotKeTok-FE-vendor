import React from 'react';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import ProfileDefaultIcn from '../../assets/common/icon-profile-default.svg';
import { parseISO, isToday, format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 오늘과 다른 날짜를 구분하여 반환하는 함수
const formatTime = dateString => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return format(date, 'a h:mm', { locale: ko });
  } else {
    return format(date, 'yyyy.MM.dd');
  }
};

export default function ChatListItem({
  isClicked,
  room, // 채팅방 데이터
  onSelect, // 채팅방 선택 핸들러
}) {
  const title = room.participants.map(p => p.userName).join(', ');

  // 첫 번째 참여자의 프로필 이미지를 대표 이미지로 사용 => 추후 개선 필요
  const profileImage = room.participants[0]?.profileImageUrl;

  return (
    <ListItem onClick={() => onSelect(room.roomId)} $isClicked={isClicked}>
      <ProfileImageWrapper>
        {profileImage ? <img src={profileImage} alt={`${title} profile`} /> : <ProfileDefaultIcn />}
      </ProfileImageWrapper>

      <ContentWrapper>
        <TitleLine>
          <Title>{title}</Title>
        </TitleLine>
        <Location>동작 핫케톡 스테이 304호</Location>
        <LastMessage>{room.lastMessageContent}</LastMessage>
      </ContentWrapper>

      <MetaWrapper>
        <Timestamp>{formatTime(room.lastMessageTime)}</Timestamp>
        {room.unreadCount > 0 && <UnreadBadge>{room.unreadCount}</UnreadBadge>}
      </MetaWrapper>
    </ListItem>
  );
}

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color, border-color 0.2s ease-in-out;

  border-radius: 10px;
  border: 1px solid transparent;

  &:hover {
    border-color: ${color('grayscale.300')};
    background-color: ${color('grayscale.200')};
  }

  background-color: ${props => (props.$isClicked ? color('grayscale.200') : 'transparent')};
`;

const ProfileImageWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TitleLine = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.span`
  ${typo('button1')}
  font-size: 16px;
  font-weight: 600;
  color: ${color('grayscale.800')};
`;

const Location = styled.div`
  ${typo('caption2')}
  color: ${color('grayscale.600')};

  margin-bottom: 5px;
`;

const LastMessage = styled.p`
  ${typo('body2')}
  color: ${color('grayscale.800')};
  margin: 0;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetaWrapper = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin-left: 10px;
`;

const Timestamp = styled.span`
  ${typo('caption1')}
  color: ${color('grayscale.600')};
`;

const UnreadBadge = styled.div`
  background-color: ${color('brand.primary')};
  color: white;
  min-width: 22px;
  height: 22px;
  border-radius: 50%;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;
