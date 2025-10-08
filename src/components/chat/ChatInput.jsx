import { useState } from 'react';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import IconSend from '../../assets/chat/icon-send.svg?react';
import IconEmoji from '../../assets/chat/icon-emoji.svg?react';

/**
 * @description 채팅 입력 컴포넌트
 * @param {function} onSendMessage - 메시지 전송 핸들러
 */
export default function ChatInput({ onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = e => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <MessageInputForm onSubmit={handleSendMessage}>
      <IconEmoji style={{ marginLeft: 20, marginRight: 0, cursor: 'pointer' }} />
      <TextInput
        placeholder="메시지를 입력하세요"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
      />
      <SendButton type="submit" $disabled={newMessage.trim() === ''}>
        <IconSend />
      </SendButton>
    </MessageInputForm>
  );
}

const MessageInputForm = styled.form`
  display: flex;
  align-items: center;
  background-color: ${color('grayscale.200')};
  border: 1px solid ${color('grayscale.300')};
  border-radius: 30px;
`;

const TextInput = styled.input`
  flex: 1;
  height: 44px;
  padding: 0 16px;
  border: 30px;
  background-color: ${color('grayscale.200')};

  ${typo('body1')};
  outline: none;
  border: none;

  &:focus {
    border-color: ${color('brand.primary')};
  }
`;

const SendButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;

  svg {
    path {
      stroke: ${({ $disabled }) => ($disabled ? color('grayscale.500') : color('brand.primary'))};
    }
  }
`;
