import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import Chat from './Chat';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import ChatInput from './ChatInput';
import useChatStore from '../../store/useChatStore';

// 날짜 구분자 포맷팅 함수
const formatDateSeparator = dateString => {
  const date = parseISO(dateString);
  if (isToday(date)) return '오늘';
  if (isYesterday(date)) return '어제';
  return format(date, 'yyyy년 M월 d일', { locale: ko });
};

/**
 * @description 헤더를 제외한 채팅방 컴포넌트
 * @param {Array} messages - 채팅 메시지 목록
 * @param {function} onSendMessage - 메시지 전송 핸들러 (문자열을 인자로 받음)
 * @param {number} currentUserId - 현재 사용자 ID
 */
export default function ChatRoom({ onSendMessage, currentUserId, participants }) {
  // message state는 ChatInput이 관리하므로 여기서는 필요 없음
  const messages = useChatStore(state => state.messages);
  const messageEndRef = useRef(null);

  // 메시지 목록이 변경될 때마다 맨 아래로 스크롤
  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messages]);

  const handleSendMessage = message => {
    if (message.trim() === '') return;
    onSendMessage(message);
  };

  // 날짜 구분자 렌더링을 위한 변수
  let lastDate = null;

  return (
    <Container>
      <MessageList>
        {messages.length > 0 &&
          messages.map(msg => {
            const key = msg.messageId || `${msg.senderId}-${msg.createdAt}`;
            const isMine = msg.senderId === currentUserId;
            const currentDate = new Date(msg.createdAt).toDateString();
            let dateSeparator = null;

            if (currentDate !== lastDate) {
              dateSeparator = <DateSeparator>{formatDateSeparator(msg.createdAt)}</DateSeparator>;
              lastDate = currentDate;
            }

            const senderInfo = participants.find(p => p.userId === msg.senderId) || {
              userName: '알 수 없음',
              profileImageUrl: null,
            };

            return (
              <React.Fragment key={key}>
                {dateSeparator}
                <Chat message={msg} isMine={isMine} senderInfo={senderInfo} />
              </React.Fragment>
            );
          })}
        {/* 스크롤을 위한 빈 div */}
        <div ref={messageEndRef} />
      </MessageList>
      <FixedInputWrapper>
        {/* ChatInput은 내부적으로 state를 관리하고, onSendMessage(문자열)를 호출 */}
        <ChatInput onSendMessage={handleSendMessage} />
      </FixedInputWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${color('grayscale.100')};
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 30px 30px 0 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DateSeparator = styled.div`
  text-align: center;
  align-self: center;
  color: ${color('grayscale.400')};
  ${typo('caption1')};
`;

const FixedInputWrapper = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;

  /* 배경색을 MessageList와 맞추거나 부모와 맞춤 */
  background-color: ${color('grayscale.100')};
  padding: 0px 30px 20px;
`;
