// src/components/total-repair/RepairCard.jsx
import React from 'react';
import styled from 'styled-components';
import { Row, Column } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';
import RepairStatusChip from '../common/RepairStatusChip';
import iconChevron from '../../assets/common/icon-chevron.svg';

/**
 * 수리 카드
 * @param {'waiting'|'rejected'|'done'} variant - 카드 상태
 * @param {string} title - 카드 제목 (예: '문/창문 수리')
 * @param {string} address - 주소 라인
 * @param {string} datetime - 날짜/시간 라인
 * @param {function} onOpenModal - 카드 클릭 시 모달을 열기 위한 핸들러
 * @param {object} modalPayload - 모달에 전달할 데이터(상태별로 다르게 사용)
 * @param {boolean} showChevron - 타이틀 옆 > 아이콘 표시 여부 (기본 true)
 */
export default function RepairCard({
  variant = 'waiting',
  title,
  address,
  datetime,
  onOpenModal,
  modalPayload,
  showChevron = true,
}) {
  // 상태별 칩 구성
  let chip = null;
  if (variant === 'waiting') chip = <RepairStatusChip status="CHOOSING" />;
  if (variant === 'rejected') chip = <RepairStatusChip status="REJECTED" />;
  // variant === 'done' 인 경우 칩 없음

  return (
    <CardWrap
      $variant={variant}
      onClick={() => onOpenModal?.(variant, modalPayload)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onOpenModal?.(variant, modalPayload);
      }}
    >
      <Column $gap={6}>
        <Row $align="center" $justify="space-between">
          <Row $align="center">
            <CardTitle>{title}</CardTitle>
            {showChevron && (
              <IconChevronBtn aria-label="상세 보기">
                <img src={iconChevron} alt="" />
              </IconChevronBtn>
            )}
          </Row>
          {chip}
        </Row>

        {address && <Body2Black>{address}</Body2Black>}
        {datetime && <Caption1Black>{datetime}</Caption1Black>}
      </Column>
    </CardWrap>
  );
}

/* ======================
 * Styles
 * ====================== */

const CardWrap = styled.div`
  cursor: pointer;
  padding: 20px 22px;
  border-radius: 16px;
  background: ${color('grayscale.100')};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'rejected'
        ? 'rgba(255, 63, 63, 0.50)' // 매칭 실패 테두리
        : color('grayscale.200')};
  transition: box-shadow 0.15s ease, transform 0.05s ease;
  &:hover {
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

const CardTitle = styled.div`
  ${typo('button1')};
  color: ${color('black')};
`;

const Body2Black = styled.div`
  ${typo('body2')};
  color: ${color('black')};
`;

const Caption1Black = styled.div`
  ${typo('caption1')};
  color: ${color('black')};
`;
