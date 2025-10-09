import React from 'react';
import styled from 'styled-components';
import { Column, Row } from '../styles/flex';
import { color, typo } from '../styles/tokens';

import MainCard from '../components/total-repair/MainCard';

export default function TotalRepairTemplate() {
  return (
    <>
      <Row style={{ height: '100%' }}>
        <MainCard title="보낸 견적서" count={2} accentColor="#3c66ff">
          보낸 견적서
        </MainCard>
        <MainCard title="진행중인 수리" count={2} accentColor="#01D281">
          진행중인 수리
        </MainCard>
        <MainCard title="처리 완료" count={2} accentColor="#A8A8A8">
          처리완료임
        </MainCard>
      </Row>
    </>
  );
}
