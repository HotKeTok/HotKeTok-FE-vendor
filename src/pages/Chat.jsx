import React, { useState, useEffect } from 'react';
import ChatTemplate from '../templates/ChatTemplate';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import { deleteChatroom } from '../api/chatting-service';
import { useLocation } from 'react-router-dom';

export default function Chat() {
  const userId = useAuthStore(state => state.userId);
  const fetchChatRooms = useChatStore(state => state.fetchChatRooms);
  const enterChatRoom = useChatStore(state => state.enterChatRoom);
  const leaveChatRoom = useChatStore(state => state.leaveChatRoom);
  const sendMessage = useChatStore(state => state.sendMessage);
  const setUnreadCount = useChatStore(state => state.setUnreadCount);

  const chatRooms = useChatStore(state => state.chatRooms);
  const messages = useChatStore(state => state.messages);
  const participants = useChatStore(state => state.participants);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);

  const location = useLocation();
  const locationState = location.state || {};

  // 채팅방 종류 get
  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (locationState.roomId && chatRooms.length > 0 && !selectedChatRoomId) {
      const roomExists = chatRooms.some(room => room.roomId === locationState.roomId);

      if (roomExists) {
        setSelectedChatRoomId(locationState.roomId);
      }
    }
  }, [chatRooms, locationState.roomId, selectedChatRoomId]);

  // 채팅방 입장시 구독,
  useEffect(() => {
    if (selectedChatRoomId) {
      enterChatRoom(selectedChatRoomId);
      setUnreadCount(selectedChatRoomId, 0);
    }

    // 컴포넌트 언마운트 또는 채팅방 변경 시 이전 구독 해제
    return () => {
      leaveChatRoom();
    };
  }, [selectedChatRoomId]); // 의존성 배열에서 액션 함수들 제거 (안정적)

  // 채팅방 선택
  const handleSelectChatRoom = roomId => {
    setSelectedChatRoomId(roomId);
  };

  // 메시지 전송 핸들러
  const handleSendMessage = content => {
    if (!selectedChatRoomId || !userId || !content.trim()) return;

    const payload = {
      roomId: selectedChatRoomId,
      senderId: userId,
      content: content,
    };
    sendMessage(payload);
  };

  // 채팅방 나가기 (삭제)
  const handleDeleteChatRoom = async roomId => {
    if (!roomId) return;

    try {
      const success = await deleteChatroom(roomId);
      if (success) {
        fetchChatRooms(); // 목록 새로고침
        setSelectedChatRoomId(null); // 선택 해제
      } else {
        alert('채팅방 나가기에 실패했습니다.');
      }
    } catch (error) {
      console.error('채팅방 나가기 오류:', error);
      alert('오류가 발생했습니다.');
    }
  };

  const templateChatRooms = { data: chatRooms };

  return (
    <ChatTemplate
      chatRooms={templateChatRooms}
      selectedChatRoomId={selectedChatRoomId}
      selectedChatMessages={messages} // 스토어의 실시간 메시지 목록
      selectedChatParticipants={participants} // 스토어의 실시간 참여자 목록
      onSelectChatRoom={handleSelectChatRoom}
      onDeleteChatRoom={handleDeleteChatRoom}
      onSendMessage={handleSendMessage}
      currentUserId={userId} // 템플릿에 현재 유저 ID 전달
    />
  );
}
