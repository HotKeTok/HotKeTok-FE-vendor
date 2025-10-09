// src/components/total-repair/MainCard.jsx
import React from 'react';
import styled from 'styled-components';
import { Row } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';

export default function ColumnSection({ title, count, accentColor = '#3c66ff', children }) {
  return (
    <CardWrap>
      {/* 상단 타이틀 영역 */}
      <Header>
        <Row $gap={8} $align="center">
          <Dot $accent={accentColor} />
          <CardTitle>{title}</CardTitle>
          <Counter>{count}</Counter>
        </Row>
        <ColorLine $accent={accentColor} />
      </Header>

      {/* ✅ ScrollArea로 children 감싸기 */}
      <ScrollArea>{children}</ScrollArea>
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

  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  flex-shrink: 0; /* 스크롤 시 헤더 고정 */
`;

const ScrollArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 20px;
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

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $accent }) => $accent};
  display: inline-block;
`;

const ColorLine = styled.hr`
  width: 100%;
  height: 3px;
  border: none;
  background-color: ${({ $accent }) => $accent};
  margin-top: 20px;
  margin-bottom: 30px;
`;
