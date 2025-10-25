import React, { useEffect, useState } from 'react';
import ChatTemplate from '../templates/ChatTemplate';
import { DUMMY_CHAT_ROOMS, DUMMY_CHATS } from '../mocks/chat';
import { getAccessToken } from '../utils/auth';
import useChatStore from '../store/useChatStore';

export default function Chat() {
  const accessToken = getAccessToken();
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

  const { connect, disconnect } = useChatStore();

  // todo: 로그인시 바로 연결하도록 수정 (임시)
  useEffect(() => {
    // accessToken이 존재하면 (로그인 성공 시) 웹소켓 연결
    if (accessToken !== '') {
      connect(accessToken);
    }

    // accessToken이 사라지면 (로그아웃 시) 웹소켓 연결 해제
    // useEffect의 클린업 함수를 활용
    return () => {
      disconnect();
    };
  }, [accessToken, connect, disconnect]);

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
