import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import Chat from './Chat';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import IconSend from '../../assets/chat/icon-send.svg?react';
import ChatInput from './ChatInput';

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
 * @param {function} onSendMessage - 메시지 전송 핸들러
 * @param {number} currentUserId - 현재 사용자 ID
 */
export default function ChatRoom({ messages, onSendMessage, currentUserId }) {
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);

  // 메시지 목록이 변경될 때마다 맨 아래로 스크롤
  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSendMessage = e => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  // 날짜 구분자 렌더링을 위한 변수
  let lastDate = null;

  return (
    <Container>
      <MessageList>
        {messages.map(msg => {
          const isMine = msg.senderId === currentUserId; // 현재 사용자가 보낸 메시지인지 확인
          const currentDate = new Date(msg.createdAt).toDateString();
          let dateSeparator = null;

          if (currentDate !== lastDate) {
            dateSeparator = <DateSeparator>{formatDateSeparator(msg.createdAt)}</DateSeparator>;
            lastDate = currentDate;
          }

          return (
            <React.Fragment key={msg.messageId}>
              {dateSeparator}
              <Chat message={msg} isMine={isMine} />
            </React.Fragment>
          );
        })}
        <div ref={messageEndRef} />
      </MessageList>
      <FixedInputWrapper>
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

  padding: 0px 30px 20px;
`;
