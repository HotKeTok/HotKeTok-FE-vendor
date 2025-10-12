import Modal from '../common/Modal';
import { color, typo } from '../../styles/tokens';
import { Row, Column } from '../../styles/flex';
import TextField from '../common/TextField';
import styled from 'styled-components';
import Button from '../common/Button';

// editData가 있으면 수정, 없으면 등록
export default function ModalNewsRegister({
  isOpen,
  onClose,
  isEdit,
  initialData,
  newsInput,
  setNewsInput,
  onRegister,
}) {
  const isDirty = JSON.stringify(initialData) !== JSON.stringify(newsInput);

  return (
    <Modal isOpen={isOpen} onClose={onClose} style={{ width: '500px' }}>
      <Column $gap={24} $align="flex-start">
        <Title>{isEdit ? '소식 수정' : '소식 작성'}</Title>
        <Column $gap={4} $align="flex-start" style={{ width: '100%' }}>
          <Label>제목</Label>
          <TextField
            placeholder="제목을 작성해주세요"
            value={newsInput.title}
            onChange={e => setNewsInput({ ...newsInput, title: e.target.value })}
            width="100%"
            maxLength={30}
          />
          <TextLength>{newsInput.title.length}/30</TextLength>
        </Column>
        <Column $gap={4} $align="flex-start" style={{ width: '100%' }}>
          <Label>내용</Label>
          <Textarea
            placeholder="내용을 작성해주세요"
            value={newsInput.content}
            onChange={e => setNewsInput({ ...newsInput, content: e.target.value })}
            maxLength={300}
          />
          <TextLength>{newsInput.content.length}/300</TextLength>
        </Column>

        <Row $gap={8} style={{ width: '100%' }} $justify="center" $align="center">
          <Button text="취소하기" width="136px" dismiss onClick={onClose} />
          <Button
            active={isDirty && newsInput.title && newsInput.content}
            text={isEdit ? '수정하기' : '작성하기'}
            width="136px"
            onClick={onRegister}
            disabled={!newsInput.title || !newsInput.content}
          />
        </Row>
      </Column>
    </Modal>
  );
}

const Title = styled.div`
  ${typo('h3')};
  color: #000;
`;

const Label = styled.div`
  ${typo('button2')};
  color: ${color('grayscale.600')};
`;

const TextLength = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  ${typo('caption1')};
  color: ${color('grayscale.400')};
`;

const Textarea = styled.textarea`
  ${typo('body2')};
  color: ${color('black')};
  width: 100%;
  min-height: 200px;
  padding: 13px 15px;
  border-radius: 6px;
  border: 1px solid ${color('grayscale.200')};
  background: ${color('grayscale.100')};
  resize: none;
  outline: none;
  &::placeholder {
    color: ${color('grayscale.400')};
  }
`;
