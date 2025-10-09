// src/templates/TotalRepairTemplate.jsx
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Row } from '../styles/flex';

import ColumnSection from '../components/total-repair/ColumnSection';
import RepairCard from '../components/total-repair/RepairCard';
import BoxRepairDetail from '../components/common/BoxRepairDetail';
import ModalRepairDetail from '../components/common/ModalRepairDetail';
import ModalImageSlider from '../components/common/ModalImageSlider';

export default function TotalRepairTemplate() {
  // ===== 좌측: 보낸 견적서(대기/실패) 데이터 =====
  const sentQuotes = useMemo(
    () => [
      {
        id: 'sq-001',
        status: 'CHOOSING', // 매칭 대기중
        title: '문/창문 수리',
        location: '동작 핫케톡 스테이 304호',
        repairDate: new Date('2024-11-20T12:00:00'),
        amount: 230000,
        costBearer: '입주민',
        contact: '010-0000-0000',
        description:
          '방문 하부 틈새로 바람이 새고, 열고 닫을 때 소음이 있습니다. 점검 요청드립니다.',
        estimateDetails: '하부 실리콘 보강 + 경첩 윤활 포함.',
        symptomPhotos: new Array(8).fill('https://via.placeholder.com/800x600'),
      },
      {
        id: 'sq-002',
        status: 'REJECTED', // 매칭 실패
        title: '문/창문 수리',
        location: '동작 핫케톡 스테이 304호',
        repairDate: new Date('2024-11-20T12:00:00'),
        amount: 230000,
        costBearer: '입주민',
        contact: '010-0000-0000',
        description:
          '바퀴벌레가 너무 많아졌습니다. 약 2주 정도 지속되고 있습니다. 원인 파악 요청드립니다.',
        estimateDetails: '업계 최고 수준 보장합니다. 합리적인 가격에 모시겠습니다.',
        symptomPhotos: new Array(8).fill('https://via.placeholder.com/800x600'),
      },
    ],
    []
  );

  // ===== 중간: 진행중 수리 데이터 =====
  const ongoingRepairs = useMemo(
    () => [
      {
        id: 'og-001',
        status: 'MATCHING',
        title: '문/창문 수리',
        location: '동작 핫케톡 스테이 304호',
        repairDate: new Date('2024-11-20T12:00:00'),
        amount: 230000,
        costBearer: '입주민',
        contact: '010-0000-0000',
        description:
          '바퀴벌레가 너무 많아졌습니다. 약 2주정도 된 것 같아요. 매번 꼼꼼하게 청소하는데 원인을 모르겠습니다.',
        estimateDetails: '업계 최고 수준 보장합니다. 합리적인 가격에 모시겠습니다.',
        symptomPhotos: new Array(8).fill('https://via.placeholder.com/800x600'),
      },
      {
        id: 'og-002',
        status: 'MATCHING',
        title: '문/창문 수리',
        location: '동작 핫케톡 스테이 304호',
        repairDate: new Date('2024-11-20T12:00:00'),
        amount: 230000,
        costBearer: '입주민',
        contact: '010-0000-0000',
        description: '하부 경첩 소음이 심합니다. 개폐 시 끼익 소리가 납니다.',
        estimateDetails: '경첩 윤활 및 부분 교체, 실리콘 보강 포함.',
        symptomPhotos: new Array(8).fill('https://via.placeholder.com/800x600'),
      },
    ],
    []
  );

  // ===== 모달/슬라이더 상태(템플릿에서 단일 관리) =====
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageStartIndex, setImageStartIndex] = useState(0);

  // 공통: 상세 열기 (id로 검색하여 선택)
  const openDetailById = id => {
    const found = sentQuotes.find(r => r.id === id) || ongoingRepairs.find(r => r.id === id);
    if (found) {
      setSelectedRepair(found);
      setDetailModalOpen(true);
    }
  };

  // 좌측 카드 클릭 핸들러 (보낸 견적서)
  const handleOpenSentQuote = id => openDetailById(id);

  // 중간 상세 열기 (BoxRepairDetail의 onDetailClick)
  const handleDetailClick = id => openDetailById(id);

  // 상세 모달 액션
  const handleCloseModal = () => setDetailModalOpen(false);
  const handleDelete = () => {
    alert('견적서를 삭제했습니다. (데모)');
    setDetailModalOpen(false);
  };
  const handleChat = () => {
    alert('채팅으로 이동합니다. (데모)');
  };

  // 이미지 썸네일 클릭 → 슬라이더 오픈
  const handleImgClick = index => {
    setImageStartIndex(index);
    setImageModalOpen(true);
  };
  const handleCloseImageModal = () => setImageModalOpen(false);

  return (
    <>
      <Row style={{ height: '100%' }}>
        {/* 좌측: 보낸 견적서 (대기/실패) */}
        <ColumnSection title="보낸 견적서" count={sentQuotes.length} accentColor="#3c66ff">
          {sentQuotes.map((q, i) => (
            <div key={q.id}>
              <RepairCard
                variant={q.status === 'REJECTED' ? 'rejected' : 'waiting'}
                title={q.title}
                address={q.location}
                datetime="2024.11.20 / 오전 12:00"
                onOpenModal={() => handleOpenSentQuote(q.id)} // ← 여기 클릭 시 모달
              />
              {i < sentQuotes.length - 1 && <Spacer12 />}
            </div>
          ))}
        </ColumnSection>

        {/* 중간: 진행중인 수리 — BoxRepairDetail (칩 숨김 + 초록 테두리) */}
        <ColumnSection title="진행중인 수리" count={ongoingRepairs.length} accentColor="#01D281">
          <PanelWrap>
            {ongoingRepairs.map(r => (
              <BoxRepairDetail
                key={r.id}
                repair={r}
                isToday={false}
                onDetailClick={handleDetailClick}
                borderColor="#01D281"
                hideStatusChip={true}
              />
            ))}
          </PanelWrap>
        </ColumnSection>

        {/* 우측: 처리 완료 — (예시) */}
        <ColumnSection title="처리 완료" count={10} accentColor="#A8A8A8">
          <RepairCard
            variant="done"
            title="문/창문 수리"
            address="동작 핫케톡 스테이 304호"
            datetime="2024.11.20"
            onOpenModal={() => {}}
          />
          <Spacer12 />
          <RepairCard
            variant="done"
            title="문/창문 수리"
            address="동작 핫케톡 스테이 304호"
            datetime="2024.11.20"
            onOpenModal={() => {}}
          />
        </ColumnSection>
      </Row>

      {/* 상세 모달 (대기/실패/진행 모두 공통) */}
      {selectedRepair && (
        <ModalRepairDetail
          detailModalOpen={detailModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDelete}
          onChat={handleChat}
          onImgClick={handleImgClick} // 썸네일 클릭 → 템플릿에서 슬라이더 오픈
          repairData={selectedRepair}
        />
      )}

      {/* 이미지 슬라이더 모달 */}
      {selectedRepair && (
        <ModalImageSlider
          title="증상 사진"
          isOpen={imageModalOpen}
          onClose={handleCloseImageModal}
          imageUrls={selectedRepair.symptomPhotos || []}
          startIndex={imageStartIndex}
        />
      )}
    </>
  );
}

/* ======================
 * Styles
 * ====================== */
const PanelWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Spacer12 = styled.div`
  height: 12px;
`;
