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
  chatRooms,
  selectedChatRoomId,
  selectedChatMessages,
  selectedChatParticipants,
  onSelectChatRoom,
  onDeleteChatRoom,
  onSendMessage,
  currentUserId,
}) {
  const [read, setRead] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  const filteredChatRooms =
    read === 'all' ? chatRooms.data : chatRooms.data.filter(room => room.unreadCount > 0);

  const selectedChatRoom = chatRooms.data.find(room => room.roomId === selectedChatRoomId) || null;

  return (
    <Container>
      {/* 4. [수정] selectedChatRoom이 null일 때 오류 방지 */}
      {modalOpen && selectedChatRoom && (
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
        {/* 3. [수정] selectedChatRoom이 있을 때만 헤더와 채팅방을, 없으면 Empty 뷰를 렌더링 */}
        {selectedChatRoom ? (
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
              <ChatRoom
                messages={selectedChatMessages}
                onSendMessage={onSendMessage}
                currentUserId={currentUserId}
                participants={selectedChatParticipants}
              />
            </RightScrollContainer>
          </>
        ) : (
          <EmptyChatContainer>
            <div>채팅방을 선택해주세요.</div>
          </EmptyChatContainer>
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
  z-index: 10; // 스크롤 시 다른 컨텐츠에 가려지지 않도록
  background-color: #fff; // 헤더 배경색
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

// 3. [추가] 채팅방 미선택 시 보여줄 빈 컨테이너
const EmptyChatContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  ${typo.body1}
  color: ${color('grayscale.500')};
`;
