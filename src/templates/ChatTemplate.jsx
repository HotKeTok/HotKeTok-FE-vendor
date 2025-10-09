import styled from 'styled-components';
import { typo, color } from '../styles/tokens';
import { Row } from '../styles/flex';
import ButtonRound from '../components/common/ButtonRound';
import { useState } from 'react';
import ChatRoom from '../components/chat/ChatRoom';
import ChatListItem from '../components/chat/ChatListItem';
import ChatRoomHeader from '../components/chat/ChatRoomHeader';
import ModalConfirm from '../components/common/ModalConfirm';

export default function ChatTemplate({
  chatRooms, // 채팅방 목록
  selectedChatRoomId, // 클릭된 채팅방 ID
  selectedChatMessages, // 선택된 채팅방의 메시지 목록
  onSelectChatRoom, // 채팅방 선택 핸들러
  onDeleteChatRoom, // 채팅방 삭제 핸들러
  onSendMessage, // 메시지 전송 핸들러
}) {
  const [read, setRead] = useState('all'); // ('all' | 'unread')
  const [modalOpen, setModalOpen] = useState(false);

  // todo : 실제 필터링된 채팅방 목록으로 변경
  const filteredChatRooms =
    read === 'all' ? chatRooms.data : chatRooms.data.filter(room => room.unreadCount > 0);

  const selectedChatRoom = chatRooms.data.find(room => room.roomId === selectedChatRoomId) || null;

  const currentUserId = 101;
  return (
    <Container>
      {modalOpen && (
        <ModalConfirm
          title={selectedChatRoom.participants[0]?.userName}
          description="채팅방을 나가시겠어요?"
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={() => {
            onDeleteChatRoom(selectedChatRoomId);
            setModalOpen(false);
          }}
          cancelText="아니요"
          confirmText="나가기"
        />
      )}
      {/* 채팅방 목록 */}
      <LeftContainer>
        {/* 헤더 */}
        <FixedHeaderWrapper>
          <Row $gap={10} align="center">
            <ButtonRound
              text="전체"
              filled={read === 'all'}
              height={38}
              onClick={() => setRead('all')}
            />
            <ButtonRound
              text="읽지 않음"
              filled={read === 'unread'}
              height={38}
              onClick={() => setRead('unread')}
            />
          </Row>
        </FixedHeaderWrapper>
        {/* 채팅방 목록 */}
        {filteredChatRooms.map(room => (
          <ChatListItem
            key={room.roomId}
            room={room}
            onSelect={onSelectChatRoom}
            isClicked={room.roomId === selectedChatRoomId}
          />
        ))}
      </LeftContainer>

      {/* 채팅방 */}
      <RightContainer>
        {selectedChatRoom && selectedChatRoom.participants.length > 0 && (
          <>
            <FixedHeaderWrapper>
              <ChatRoomHeader
                participants={selectedChatRoom.participants}
                profileImageUrl={selectedChatRoom.participants[0]?.profileImageUrl}
                status={selectedChatRoom.status}
                onDelete={() => {
                  setModalOpen(true);
                }}
              />
            </FixedHeaderWrapper>
            <RightScrollContainer>
              {selectedChatRoom ? (
                <ChatRoom
                  messages={selectedChatMessages}
                  onSendMessage={onSendMessage}
                  currentUserId={currentUserId}
                />
              ) : (
                <div>채팅방을 선택해주세요.</div>
              )}
            </RightScrollContainer>
          </>
        )}
      </RightContainer>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;

  padding-bottom: 18px;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: 46fr 67fr;
  column-gap: 16px;
`;

const SubContainerBase = styled.div`
  position: relative;

  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;

  overflow: hidden;
`;

const FixedHeaderWrapper = styled.div`
  position: sticky;
  top: 0;

  width: 100%;
`;

const LeftContainer = styled(SubContainerBase)`
  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 20px;
`;

const RightContainer = styled(SubContainerBase)`
  border: 1px solid ${color('grayscale.300')};

  display: flex;
  flex-direction: column;
`;

const RightScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;
