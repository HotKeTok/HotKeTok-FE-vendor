// src/templates/FindRepairTemplate.jsx
import React, { useMemo, useState, useContext, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Column, Row } from '../styles/flex';
import { color, typo } from '../styles/tokens';

import Button from '../components/common/Button';
import TextField from '../components/common/TextField';
import Modal from '../components/common/Modal';
import ModalImageSlider from '../components/common/ModalImageSlider';

import { OverlayContext } from '../styles/OverlayContext';

import iconChevron from '../assets/common/icon-chevron.svg';
import iconGrayLogo from '../assets/common/icon-gray-logo.svg';
import iconSad from '../assets/common/icon-sad.svg';
import iconCheckFilled from '../assets/common/icon-check-filled.svg';
import iconCheckNotFilled from '../assets/common/icon-check-not-filled.svg';

/* ============================
 * 메인 (UI 전용)
 * ============================ */
export default function FindRepairTemplate({ requests = [] }) {
  // 🔹 선택/뷰어 등 UI 상태만 관리
  const [selectedId, setSelectedId] = useState(requests[0]?.id ?? null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  // 요청 목록이 바뀔 때 첫 항목으로 선택 초기화(최초 로딩 포함)
  useEffect(() => {
    if (!requests || requests.length === 0) {
      setSelectedId(null);
    } else if (!selectedId || !requests.some(r => r.id === selectedId)) {
      setSelectedId(requests[0].id);
    }
  }, [requests]); // eslint-disable-line react-hooks/exhaustive-deps

  const { isOpen: overlayOpen, setOverlayContent, clearOverlay } = useContext(OverlayContext);

  const selected = useMemo(
    () => requests.find(r => r.id === selectedId) || null,
    [requests, selectedId]
  );

  const openQuoteSheet = () => {
    if (!selected) return;
    setOverlayContent(<QuoteSheet request={selected} onClose={clearOverlay} />);
  };

  return (
    <Container>
      <Row $gap={16} style={{ height: '100%', position: 'relative' }}>
        {/* 좌측 상세 */}
        <LeftSection $shifted={overlayOpen}>
          {selected ? (
            <RequestDetailBox>
              <Row $justify={'space-between'} $align={'center'}>
                <Title>{selected.title}</Title>
                {!overlayOpen && (
                  <Button text="견적 보내기" width="136px" onClick={openQuoteSheet} />
                )}
              </Row>

              <Column $gap={10}>
                <Body2_black style={{ marginBottom: '24px' }}>{selected.address}</Body2_black>

                <Row $justify={'space-between'}>
                  <Button2_black>수리 희망 날짜</Button2_black>
                  <Body2_600>{selected.preferredDate}</Body2_600>
                </Row>

                <Row $justify={'space-between'}>
                  <Button2_black>비용 부담</Button2_black>
                  <Body2_600>{selected.costPayer}</Body2_600>
                </Row>

                <Row $justify={'space-between'}>
                  <Button2_black>전화번호</Button2_black>
                  <Body2_600>{selected.phone}</Body2_600>
                </Row>

                <Row $justify={'space-between'}>
                  <Button2_black>증상 사진</Button2_black>
                  {selected.images.length > 0 ? (
                    <ImageGrid>
                      {selected.images.map((src, idx) => (
                        <Thumb
                          key={idx}
                          onClick={() => {
                            setViewerIndex(idx);
                            setViewerOpen(true);
                          }}
                        >
                          <img src={src} alt={`증상 사진 ${idx + 1}`} />
                        </Thumb>
                      ))}
                    </ImageGrid>
                  ) : (
                    <Body2_600>등록된 사진이 없어요.</Body2_600>
                  )}
                </Row>

                <Column $gap={8} style={{ marginTop: '8px' }}>
                  <Button2_black>증상 설명</Button2_black>
                  <DescriptionBox>{selected.description}</DescriptionBox>
                </Column>
              </Column>
            </RequestDetailBox>
          ) : (
            <LeftEmptyWrap>
              <EmptyIcon src={iconGrayLogo} alt="" />
            </LeftEmptyWrap>
          )}
        </LeftSection>

        {/* 이미지 슬라이더 */}
        <ModalImageSlider
          title={selected?.title || ''}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          imageUrls={selected?.images || []}
          startIndex={viewerIndex}
        />

        {/* 우측 리스트 */}
        {!overlayOpen && (
          <RightSection>
            <RequestList
              requests={requests}
              selectedId={selectedId}
              onSelect={id => setSelectedId(id)}
            />
          </RightSection>
        )}
      </Row>
    </Container>
  );
}

/* ============================
 * 우측 리스트
 * ============================ */
function RequestList({ requests, selectedId, onSelect }) {
  return (
    <Column style={{ height: '100%' }}>
      <Title>받은 수리 요청</Title>
      <RepairState>총 {requests.length}개의 요청이 있어요.</RepairState>

      {requests.length === 0 ? (
        <RightEmptyPanel>
          <EmptyIcon src={iconSad} alt="" />
          <EmptyTitle>받은 수리 요청이 없어요.</EmptyTitle>
        </RightEmptyPanel>
      ) : (
        <ListScroll>
          <Column $gap={12}>
            {requests.map(req => {
              const isActive = req.id === selectedId;
              return (
                <RequestCard key={req.id} $active={isActive} onClick={() => onSelect(req.id)}>
                  <Column $gap={6}>
                    <Row $align={'center'} $justify={'space-between'}>
                      <Row $align={'center'}>
                        <CardTitle>{req.title}</CardTitle>{' '}
                        <IconChevronBtn aria-label="상세 보기">
                          <img src={iconChevron} alt="" />
                        </IconChevronBtn>
                      </Row>
                    </Row>
                    <Body2_black>{req.address}</Body2_black>
                    <Caption1_Black>{req.requestedAt}</Caption1_Black>
                  </Column>
                </RequestCard>
              );
            })}
          </Column>
        </ListScroll>
      )}
    </Column>
  );
}

/* ============================
 * 견적서 작성 시트 (Overlay)
 * ============================ */
function QuoteSheet({ request, onClose }) {
  const [amount, setAmount] = useState('');
  const [afterConsult, setAfterConsult] = useState(false);
  const [content, setContent] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

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
                onChange={e => {
                  const onlyDigits = e.target.value.replace(/\D/g, '');
                  setAmount(onlyDigits);
                }}
                width="200px"
                inputMode="numeric"
                pattern="[0-9]*"
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
          {/* 최대 300자 안내는 Textarea placeholder로 유지 */}
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
        <Modal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          style={{ width: 450, borderRadius: 12, padding: '24px 30px' }}
        >
          <Column $gap={30}>
            <Column $gap={4} $align={'start'}>
              <Title>견적서를 보낼까요?</Title>
              <Body2_black>{request.address}</Body2_black>
            </Column>
            <Column $gap={12}>
              <ConfirmRow>
                <Button2_black>수리 분야</Button2_black>
                <Body2_600>{request.title}</Body2_600>
              </ConfirmRow>
              <ConfirmRow>
                <Button2_black>수리 예정 날짜</Button2_black>
                <Body2_600>{request.preferredDate}</Body2_600>
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
              <Button
                text="네, 보낼게요"
                width="130px"
                onClick={() => {
                  // TODO: 실제 전송 로직 연결지점 (POST 견적 생성 API 등)
                  setConfirmOpen(false);
                }}
              />
            </ConfirmActions>
          </Column>
        </Modal>
      </Column>
    </SheetPanel>
  );
}

/* ============================
 * 스타일 (기존 유지)
 * ============================ */

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const LeftSection = styled.div`
  width: ${({ $shifted }) => ($shifted ? '50%' : '60%')};
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
`;

const RightSection = styled.div`
  width: 40%;
  height: 97%;
  background-color: #fff;
  border-radius: 20px;
  padding: 20px 20px 0px 20px;
  display: flex;
  flex-direction: column;
`;

const RequestDetailBox = styled.div`
  padding: 24px 30px;
  width: 100%;
  background-color: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 20px;
  overflow: hidden;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 80px);
  grid-auto-rows: 80px;
  gap: 6px;
  direction: rtl;
`;
const Thumb = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  background: ${color('grayscale.200')};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
const DescriptionBox = styled.div`
  ${typo('body2')}
  color: ${color('black')};
  padding: 13px 15px;
  border-radius: 6px;
  border: 1px solid ${color('grayscale.200')};
  background: ${color('grayscale.100')};
`;

const ListScroll = styled.div`
  margin-top: 8px;
  padding-right: 8px;
  overflow-y: auto;
  height: 100%;
`;
const RequestCard = styled.div`
  cursor: pointer;
  padding: 20px 22px;
  border-radius: 16px;
  border: 1px solid ${({ $active }) => ($active ? color('brand.primary') : color('grayscale.200'))};
  background: ${({ $active }) => ($active ? color('white') : color('grayscale.100'))};
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease,
    transform 0.05s ease;
  &:hover {
    border-color: ${color('brand.400')};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(1px);
  }
`;
const IconChevronBtn = styled.button`
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  img {
    width: 5px;
    height: auto;
  }
`;

const RightEmptyPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
const LeftEmptyWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const EmptyIcon = styled.img``;
const EmptyTitle = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.500')};
`;

const Title = styled.div`
  ${typo('h3')};
  color: ${color('black')};
`;
const CardTitle = styled.div`
  ${typo('button1')};
  color: ${color('black')};
`;
const RepairState = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
  margin-bottom: 10px;
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
const Caption1_Black = styled.div`
  ${typo('caption1')};
  color: ${color('black')};
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

const SheetPanel = styled.div`
  width: 49%;
  height: 100%;
  background: #fff;
  border-radius: 30px 0 0 30px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.06);
  padding: 0px 60px;
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
