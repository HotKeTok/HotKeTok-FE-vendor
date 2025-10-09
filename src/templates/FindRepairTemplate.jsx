import React, { useMemo, useState, useContext } from 'react';
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

/* ===========================
 * 목데이터
 * ============================ */
const MOCK_REQUESTS = [
  {
    id: 'R001',
    title: '문/창문 수리',
    address: '동작 핫케톡 스테이 304호',
    requestedAt: '2024.11.20 / 오전 12:00',
    preferredDate: '2024.11.20 / 오전 12:00',
    costPayer: '입주민',
    phone: '010-1234-1234',
    images: [
      '/images/sample_1.jpg',
      '/images/sample_2.jpg',
      '/images/sample_3.jpg',
      '/images/sample_4.jpg',
      '/images/sample_5.jpg',
      '/images/sample_6.jpg',
    ],
    description:
      '바퀴벌레가 너무 많이꼈습니다. 약 2주정도 된 것 같아요. 매번 꼼꼼하게 청소하는데 원인을 모르겠습니다.',
  },
  {
    id: 'R002',
    title: '싱크대 누수',
    address: '동작 핫케톡 스테이 502호',
    requestedAt: '2024.11.20 / 오후 02:30',
    preferredDate: '2024.11.22 / 오전 10:00',
    costPayer: '집주인',
    phone: '010-0000-0000',
    images: ['/images/sample_1.jpg', '/images/sample_2.jpg'],
    description: '하부장 안쪽이 젖어있고 물방울이 맺혀요. 실리콘과 배관 확인이 필요합니다.',
  },
  {
    id: 'R003',
    title: '보일러 점검',
    address: '동작 핫케톡 스테이 203호',
    requestedAt: '2024.11.19 / 오후 07:10',
    preferredDate: '2024.11.23 / 오후 01:00',
    costPayer: '입주민',
    phone: '010-2222-3333',
    images: [],
    description: '온수가 일정하지 않고, 때때로 소음이 발생합니다. 안전점검 요청합니다.',
  },
  {
    id: 'R004',
    title: '요청1',
    address: '동작 핫케톡 스테이 203호',
    requestedAt: '2024.11.19 / 오후 07:10',
    preferredDate: '2024.11.23 / 오후 01:00',
    costPayer: '입주민',
    phone: '010-2222-3333',
    images: [],
    description: '온수가 일정하지 않고, 때때로 소음이 발생합니다. 안전점검 요청합니다.',
  },
  {
    id: 'R005',
    title: '요청2',
    address: '동작 핫케톡 스테이 203호',
    requestedAt: '2024.11.19 / 오후 07:10',
    preferredDate: '2024.11.23 / 오후 01:00',
    costPayer: '입주민',
    phone: '010-2222-3333',
    images: [],
    description: '온수가 일정하지 않고, 때때로 소음이 발생합니다. 안전점검 요청합니다.',
  },
  {
    id: 'R006',
    title: '요청3',
    address: '동작 핫케톡 스테이 203호',
    requestedAt: '2024.11.19 / 오후 07:10',
    preferredDate: '2024.11.23 / 오후 01:00',
    costPayer: '입주민',
    phone: '010-2222-3333',
    images: [],
    description: '온수가 일정하지 않고, 때때로 소음이 발생합니다. 안전점검 요청합니다.',
  },
  {
    id: 'R007',
    title: '요청4',
    address: '동작 핫케톡 스테이 203호',
    requestedAt: '2024.11.19 / 오후 07:10',
    preferredDate: '2024.11.23 / 오후 01:00',
    costPayer: '입주민',
    phone: '010-2222-3333',
    images: [],
    description: '온수가 일정하지 않고, 때때로 소음이 발생합니다. 안전점검 요청합니다.',
  },
];

/* ============================
 * 메인
 * ============================ */
export default function FindRepairTemplate() {
  const [requests] = useState(MOCK_REQUESTS); // []로 변경하면 수리 요청 없을 때 화면 확인 가능
  const [selectedId, setSelectedId] = useState(requests[0]?.id ?? null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  // 🔹 Layout의 Overlay 포털 제어
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
        {/* 좌측 상세 (Overlay가 열리면 살짝 줄어듬) */}
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

        {/* 우측 리스트 (Overlay 열리면 숨김) */}
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
 * 견적서 작성 시트 (Overlay 내부에 렌더)
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
          {/* ✅ afterConsult=false 일 때만 금액 입력칸 표시 */}
          {!afterConsult && (
            <Row $align="center" $gap={10}>
              <TextField
                placeholder="예) 100,000"
                value={amount}
                /* ✅ 숫자만 입력되도록 onChange에서 비숫자 제거 */
                onChange={e => {
                  const onlyDigits = e.target.value.replace(/\D/g, '');
                  setAmount(onlyDigits);
                }}
                width="200px"
                inputMode="numeric" // (가능하면) 모바일 숫자 키패드
                pattern="[0-9]*" // (가능하면) 숫자만
              />
              <Body2_600>원</Body2_600>
            </Row>
          )}

          {/* ✅ 체크 아이콘 토글 */}
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
                  // TODO: 실제 전송 로직 연동 지점
                  setConfirmOpen(false);
                  // onClose(); // 전송 후 시트까지 닫고 싶으면 주석 해제
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
 * 스타일
 * ============================ */

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

/* 좌측 상세: Overlay 열리면 살짝 왼쪽으로 이동 */
const LeftSection = styled.div`
  width: ${({ $shifted }) => ($shifted ? '50%' : '60%')};
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease; /* ✅ width 변화로 부드럽게 줄어듦 */
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

/* 좌측 상세 박스 */
const RequestDetailBox = styled.div`
  padding: 24px 30px;
  width: 100%;
  background-color: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 20px;
  overflow: hidden;
`;

/* 이미지 그리드: 오른쪽부터 차오르게 */
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

/* 우측 리스트 스크롤 */
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

/* 빈 상태 */
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

/* 타이포 */
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

/* ========= Overlay에 올라갈 오른쪽 시트 ========= */
const SheetPanel = styled.div`
  /* OverlayRoot의 오른쪽 끝에 맞춰 가득 차는 패널 */
  width: 49%;
  height: 100%;
  background: #fff; /* 🔹 흰 배경은 패널에만 */
  border-radius: 30px 0 0 30px; /* 헤더쪽 곡률과 맞추면 자연스러움 */
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

/* ============================
 * 모달 스타일
 * ============================ */

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
