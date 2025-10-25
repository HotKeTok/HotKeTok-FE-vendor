// src/components/find-repair/QuoteSheet.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { color, typo } from '../../styles/tokens';

import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import TextField from '../../components/common/TextField';

import iconCheckFilled from '../../assets/common/icon-check-filled.svg';
import iconCheckNotFilled from '../../assets/common/icon-check-not-filled.svg';

/**
 * 견적서 작성 시트 (Overlay에 렌더)
 * props:
 *  - request: { title, address, preferredDate, ... }  // 상세에서 내려온 선택 항목
 *  - onClose: () => void                               // 시트 닫기
 */
export default function QuoteSheet({ request, onClose }) {
  const [amount, setAmount] = React.useState('');
  const [afterConsult, setAfterConsult] = React.useState(false);
  const [content, setContent] = React.useState('');
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const isActive = (afterConsult || amount.trim() !== '') && content.trim() !== '';

  return (
    <SheetPanel>
      <Column $gap={30}>
        <Column>
          <H2_black>견적서 작성</H2_black>
          <Body2_black>
            작성한 견적서를 기반으로
            <br /> 의뢰인이 검토 후 견적서를 선택하면 매칭이 이루어져요.
          </Body2_black>
        </Column>

        <Column $gap={4}>
          <Caption1_800>금액</Caption1_800>
          {!afterConsult && (
            <Row $align="center" $gap={10}>
              <TextField
                placeholder="예) 100,000"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
                style={{ width: 200 }}
              />
              <Body2_600>원</Body2_600>
            </Row>
          )}
          <CheckRow onClick={() => setAfterConsult(v => !v)} style={{ marginTop: '6px' }}>
            <CheckIcon src={afterConsult ? iconCheckFilled : iconCheckNotFilled} />
            <Body2_800>상담 후 결정</Body2_800>
          </CheckRow>
        </Column>

        <Column $gap={8}>
          <Caption1_800>내용</Caption1_800>
          <Textarea
            placeholder="견적 내용을 상세하게 작성해 주세요."
            maxLength={300}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <CharCount>{content.length}/300</CharCount>
        </Column>

        <SheetFooter>
          <GhostButton onClick={onClose}>취소</GhostButton>
          <Button
            text="견적서 보내기"
            width="160px"
            active={isActive}
            onClick={() => {
              if (isActive) setConfirmOpen(true);
            }}
          />
        </SheetFooter>

        {/* 확인 모달 */}
        <Modal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          style={{ width: 450, borderRadius: 12, padding: '24px 30px' }}
        >
          <Column $gap={30}>
            <Column $gap={4} $align={'start'}>
              <Title>견적서를 보낼까요?</Title>
              <Body2_black>{request?.address ?? ''}</Body2_black>
            </Column>
            <Column $gap={12}>
              <ConfirmRow>
                <Button2_black>수리 분야</Button2_black>
                <Body2_600>{request?.title ?? ''}</Body2_600>
              </ConfirmRow>
              <ConfirmRow>
                <Button2_black>수리 예정 날짜</Button2_black>
                <Body2_600>{request?.preferredDate ?? ''}</Body2_600>
              </ConfirmRow>
              <ConfirmRow>
                <Button2_black>금액</Button2_black>
                <Body2_600>
                  {afterConsult ? '상담 후 결정' : `${Number(amount || 0).toLocaleString()}원`}
                </Body2_600>
              </ConfirmRow>
              <ConfirmRow $col>
                <Button2_black>내용</Button2_black>
                <ConfirmTextBox>{content}</ConfirmTextBox>
              </ConfirmRow>
            </Column>

            <ConfirmActions>
              <ConfirmCancel onClick={() => setConfirmOpen(false)}>아니요</ConfirmCancel>
              <Button text="네, 보낼게요" width="130px" onClick={() => setConfirmOpen(false)} />
            </ConfirmActions>
          </Column>
        </Modal>
      </Column>
    </SheetPanel>
  );
}

/* ========== 로컬 스타일 (템플릿에 의존하지 않도록 자체 포함) ========== */
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => ($gap != null ? `${$gap}px` : 0)};
  align-items: ${({ $align }) => $align || 'stretch'};
`;
const Row = styled.div`
  display: flex;
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  gap: ${({ $gap }) => ($gap != null ? `${$gap}px` : 0)};
`;

const SheetPanel = styled.div`
  width: 49%;
  height: 100%;
  background: #fff;
  border-radius: 30px 0 0 30px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.06);
  padding: 0 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${keyframes`
    from { transform: translateX(40px); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  `} 0.3s ease-out both;
`;

const CheckRow = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-align: left;
`;
const CheckIcon = styled.img``;

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
const CharCount = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.400')};
  text-align: right;
`;

const SheetFooter = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
const GhostButton = styled.button`
  ${typo('button2')};
  padding: 12px 16px;
  border-radius: 10px;
  height: 42px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  color: ${color('black')};
  cursor: pointer;
  white-space: nowrap;
`;

const Title = styled.div`
  ${typo('h3')};
  color: ${color('black')};
`;
const Body2_black = styled.div`
  ${typo('body2')};
  color: ${color('black')};
`;
const Button2_black = styled.div`
  ${typo('button2')};
  color: ${color('black')};
`;
const Body2_600 = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;
const Body2_800 = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
`;
const H2_black = styled.div`
  ${typo('webh2')};
  color: ${color('black')};
  margin-bottom: 6px;
`;
const Caption1_800 = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
`;

const ConfirmRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: ${({ $col }) => ($col ? 'flex-start' : 'center')};
  gap: 10px;
  ${({ $col }) => $col && 'flex-direction: column;'}
`;
const ConfirmTextBox = styled.div`
  ${typo('body2')};
  color: ${color('black')};
  text-align: start;
  width: 100%;
  min-height: 90px;
  padding: 13px 15px;
  border-radius: 6px;
  border: 1px solid ${color('grayscale.200')};
  background: ${color('grayscale.100')};
  white-space: pre-wrap;
`;
const ConfirmActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
`;
const ConfirmCancel = styled.button`
  ${typo('button2')};
  padding: 12px 16px;
  width: 130px;
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  color: ${color('grayscale.600')};
  cursor: pointer;
`;
