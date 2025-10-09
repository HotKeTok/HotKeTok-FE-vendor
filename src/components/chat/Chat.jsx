import React from 'react';
import styled, { css } from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import ProfileDefaultIcon from '../../assets/common/icon-profile-default.svg?react';
import { Row } from '../../styles/flex';

const formatTime = dateString => {
  const date = parseISO(dateString);
  return format(date, 'a h:mm', { locale: ko });
};

/**
 * @description 채팅 메시지 컴포넌트
 * @param {object}  - 컴포넌트 props
 * @param {object} message - 채팅 메시지 데이터
 * @param {boolean} isMine - 현재 사용자가 보낸 메시지인지 여부
 */
export default function Chat({ message, isMine }) {
  // todo: 실제 데이터에 따라 사용자 이름과 프로필 이미지를 동적으로 설정
  const senderInfo = {
    userName: message.senderId === 101 ? '김개발' : '박지효',
    profileImageUrl: message.senderId === 101 ? null : 'https://picsum.photos/200',
  };

  return (
    <MessageContainer isMine={isMine}>
      <ContentContainer isMine={isMine}>
        {!isMine && (
          <Row $gap={8} style={{ marginBottom: 2 }}>
            <ProfileImageWrapper>
              {senderInfo.profileImageUrl ? (
                <img src={senderInfo.profileImageUrl} alt="profile" />
              ) : (
                <ProfileDefaultIcon />
              )}
            </ProfileImageWrapper>
            <SenderName>{senderInfo.userName}</SenderName>
          </Row>
        )}
        <BubbleWrapper>
          {isMine && <Timestamp>{formatTime(message.createdAt)}</Timestamp>}
          <MessageBubble isMine={isMine}>{message.content}</MessageBubble>
          {!isMine && <Timestamp>{formatTime(message.createdAt)}</Timestamp>}
        </BubbleWrapper>
      </ContentContainer>
    </MessageContainer>
  );
}

const MessageContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  flex-direction: ${props => (props.isMine ? 'row-reverse' : 'row')};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isMine ? 'flex-end' : 'flex-start')};
  max-width: 70%;
`;

const ProfileImageWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;

  img,
  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SenderName = styled.div`
  ${typo('button2')};
  color: ${color('grayscale.800')};
`;

const BubbleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  flex-direction: ${props => (props.isMine ? 'row-reverse' : 'row')};
`;

const MessageBubble = styled.div`
  padding: 12px 18px;
  border-radius: 20px;
  ${typo('body2')};
  white-space: pre-wrap;
  word-break: break-all;

  ${props =>
    props.isMine
      ? css`
          background-color: ${color('brand.primary')};
          color: #fff;
          border-bottom-right-radius: 0px;
        `
      : css`
          background-color: #fff;
          color: ${color('grayscale.900')};
          box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
          border-bottom-left-radius: 0px;
        `}
`;

const Timestamp = styled.span`
  ${typo('caption2')};
  color: ${color('grayscale.400')};
  white-space: nowrap;
`;
