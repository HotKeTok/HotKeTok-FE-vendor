// src/templates/TotalRepairTemplate.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Row } from '../styles/flex';

import ColumnSection from '../components/total-repair/ColumnSection';
import RepairCard from '../components/total-repair/RepairCard';
import BoxRepairDetail from '../components/total-repair/BoxRepairDetail';
import ModalRepairDetail from '../components/total-repair/ModalRepairDetail';
import ModalImageSlider from '../components/common/ModalImageSlider';

export default function TotalRepairTemplate({
  loading = false,
  error = '',
  // { count, items: [...] }
  sentQuotes = { count: 0, items: [] },
  ongoingRepairs = { count: 0, items: [] },
  doneRepairs = { count: 0, items: [] },
  loadDetail, // ✅ 추가: 상세 로딩 함수 (optional)
}) {
  // ===== 모달/슬라이더 상태 =====
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageStartIndex, setImageStartIndex] = useState(0);

  // ✅ 공통 상세 열기
  const openDetailById = async id => {
    if (typeof loadDetail === 'function') {
      try {
        const detail = await loadDetail(id);
        setSelectedRepair(detail);
        setDetailModalOpen(true);
        return;
      } catch (e) {
        alert(e?.message || '상세 정보를 불러오지 못했습니다.');
        return;
      }
    }
    // 폴백: 현재 리스트에서 찾아 모달
    const found =
      (sentQuotes.items || []).find(r => String(r.id) === String(id)) ||
      (ongoingRepairs.items || []).find(r => String(r.id) === String(id));
    if (found) {
      setSelectedRepair(found);
      setDetailModalOpen(true);
    }
  };

  // 좌측 카드 클릭
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

  // 이미지 슬라이더 모달
  const handleImgClick = index => {
    setImageStartIndex(index);
    setImageModalOpen(true);
  };
  const handleCloseImageModal = () => setImageModalOpen(false);

  const leftCount = sentQuotes?.count ?? (sentQuotes?.items?.length || 0);
  const midCount = ongoingRepairs?.count ?? (ongoingRepairs?.items?.length || 0);
  const rightCount = doneRepairs?.count ?? (doneRepairs?.items?.length || 0);

  return (
    <>
      <Row style={{ height: '100%' }}>
        {/* 좌측: 보낸 견적서 (대기/실패) */}
        <ColumnSection title="보낸 견적서" count={leftCount} accentColor="#3c66ff">
          {(sentQuotes.items || []).map((q, i) => (
            <div key={q.id}>
              <RepairCard
                variant={q.status === 'REJECTED' ? 'rejected' : 'waiting'}
                title={q.title}
                address={q.location}
                datetime={q.datetimeStr || ''}
                onOpenModal={() => handleOpenSentQuote(q.id)}
              />
              {i < (sentQuotes.items?.length || 0) - 1 && <Spacer12 />}
            </div>
          ))}
          {loading && <SmallNote>불러오는 중…</SmallNote>}
          {!!error && <ErrorNote>{error}</ErrorNote>}
        </ColumnSection>

        {/* 중간: 진행중 수리 */}
        <ColumnSection title="진행중인 수리" count={midCount} accentColor="#01D281">
          <PanelWrap>
            {(ongoingRepairs.items || []).map(r => (
              <BoxRepairDetail
                key={r.id}
                repair={r}
                isToday={false}
                onDetailClick={handleDetailClick}
                borderColor="#01D281"
                hideStatusChip={true}
              />
            ))}
            {loading && <SmallNote>불러오는 중…</SmallNote>}
            {!!error && <ErrorNote>{error}</ErrorNote>}
          </PanelWrap>
        </ColumnSection>

        {/* 우측: 처리 완료 */}
        <ColumnSection title="처리 완료" count={rightCount} accentColor="#A8A8A8">
          {(doneRepairs.items || []).map((r, idx) => (
            <div key={r.id}>
              <RepairCard
                variant="done"
                title={r.title}
                address={r.location}
                datetime={r.datetimeStr || ''}
                onOpenModal={() => openDetailById(r.id)} // 완료도 상세 열 수 있도록 통일
              />
              {idx < (doneRepairs.items?.length || 0) - 1 && <Spacer12 />}
            </div>
          ))}
          {loading && <SmallNote>불러오는 중…</SmallNote>}
          {!!error && <ErrorNote>{error}</ErrorNote>}
        </ColumnSection>
      </Row>

      {/* 상세 모달 */}
      {selectedRepair && (
        <ModalRepairDetail
          detailModalOpen={detailModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDelete}
          onChat={handleChat}
          onImgClick={handleImgClick}
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
const SmallNote = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 8px;
`;
const ErrorNote = styled.div`
  font-size: 12px;
  color: #ff3b30;
  margin-top: 8px;
`;
