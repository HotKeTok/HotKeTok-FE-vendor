// src/components/total-repair/MainCard.jsx
import React from 'react';
import styled from 'styled-components';
import { Row } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';

/**
 * 재사용 카드 컴포넌트
 * @param {string} title - 카드 상단 타이틀
 * @param {number|string} count - 카운터(숫자/문자)
 * @param {string} accentColor - 포인트 컬러 (상단 점 + 구분 라인 동일 적용)
 * @param {React.ReactNode} children - (옵션) 카드 내부의 콘텐츠
 */
export default function MainCard({ title, count, accentColor = '#3c66ff', children }) {
  return (
    <CardWrap>
      <Row $gap={8} $align="center">
        <Dot $accent={accentColor} />
        <CardTitle>{title}</CardTitle>
        <Counter>{count}</Counter>
      </Row>
      <ColorLine $accent={accentColor} />
      {/* 필요 시 카드 본문 삽입 */}
      {children}
    </CardWrap>
  );
}

const CardWrap = styled.div`
  width: 33%;
  height: 97%;
  background-color: #fff;
  border-radius: 20px;
  padding: 20px 20px 0 20px;
  margin-right: 10px;
`;

const CardTitle = styled.div`
  ${typo('subtitle1')}
  color: ${color('black')};
`;

const Counter = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 10px;
  background-color: ${color('grayscale.300')};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 6px;
`;

/** 아이콘 대신 색 변경 가능한 점 */
const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $accent }) => $accent};
  display: inline-block;
`;

/** 색상 변경 가능한 구분선 */
const ColorLine = styled.hr`
  width: 100%;
  height: 3px;
  border: none;
  background-color: ${({ $accent }) => $accent};
  margin-top: 20px;
  margin-bottom: 30px;
`;
