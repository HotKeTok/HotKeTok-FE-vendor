import React, { useState } from 'react';
import ChatTemplate from '../templates/ChatTemplate';
import { DUMMY_CHAT_ROOMS, DUMMY_CHATS } from '../mocks/chat';

export default function Chat() {
  const [chatRooms, setChatRooms] = useState(DUMMY_CHAT_ROOMS); // 채팅방 목록
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null); // 클릭된 채팅방 ID
  const [selectedChatMessages, setSelectedChatMessages] = useState(
    DUMMY_CHATS[selectedChatRoomId]?.data || []
  ); // 선택된 채팅방의 메시지 목록

  const handleChatRoomDelete = roomId => {
    // todo: 채팅방 삭제 API 연동
    setChatRooms(prevRooms => ({
      ...prevRooms,
      data: prevRooms.data.filter(room => room.roomId !== roomId),
    }));
    if (selectedChatRoomId === roomId) {
      setSelectedChatRoomId(null);
      setSelectedChatMessages([]);
    }
  };

  const onSendMessage = content => {
    // todo: 메시지 전송 API 연동
    if (!selectedChatRoomId) return;
    setSelectedChatMessages(prevMessages => [
      ...prevMessages,
      { id: Date.now(), content, sender: 'me' },
    ]);
  };

  return (
    <ChatTemplate
      chatRooms={chatRooms}
      selectedChatRoomId={selectedChatRoomId}
      selectedChatMessages={selectedChatMessages}
      onSelectChatRoom={roomId => {
        setSelectedChatRoomId(roomId);
        setSelectedChatMessages(DUMMY_CHATS[roomId]?.data || []);
      }}
      onDeleteChatRoom={handleChatRoomDelete}
      onSendMessage={onSendMessage}
    />
  );
}
