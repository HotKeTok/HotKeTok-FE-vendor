import React, { useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';
import TextField from '../common/TextField';
import Button from '../common/Button';
import Shell from './Shell';
import iconStep3 from '../../assets/onboarding/icon-register-step-3.svg';

export default function StepAddressDetail({ baseAddress, defaultDetail = '', onNext, onBack }) {
  const [detail, setDetail] = useState(defaultDetail);
  const can = !!detail.trim();

  // ✅ 괄호 분리 함수
  const splitRoad = str => {
    const match = String(str).match(/^(.*?)(\s*\(.*\))$/);
    return match ? { road: match[1].trim(), bracket: match[2].trim() } : { road: str, bracket: '' };
  };

  const { road, bracket } = splitRoad(baseAddress?.road || '');

  return (
    <Shell icon={iconStep3} onBack={onBack}>
      <Column $gap={20}>
        <Column $gap={4}>
          <MainText style={{ marginTop: '90px' }}>업체의 주소를 등록해주세요</MainText>
          <SubText>고객이 방문할 수 있는 주소를 알려주세요.</SubText>
        </Column>

        <SelectedBox>
          <Addr>
            {baseAddress?.sido} {baseAddress?.sigungu} {road}
            {bracket && (
              <>
                <br />
                {bracket}
              </>
            )}
            {baseAddress?.building && (
              <>
                <br />
                {baseAddress?.building}
              </>
            )}
          </Addr>

          <Row $gap={8} $align="center">
            <Jibun>지번</Jibun>
            <JibunAddr>{baseAddress?.jibun}</JibunAddr>
          </Row>
        </SelectedBox>

        <Column $gap={6}>
          <Label>상세 주소</Label>
          <TextField
            placeholder="예) 현대프라자"
            value={detail}
            onChange={e => setDetail(e.target.value)}
          />
          <GuideText style={{ color: '#3C66FF' }}>* 상세 주소를 반드시 입력해주세요.</GuideText>
        </Column>
      </Column>

      <Button text="다음" active={can} onClick={() => can && onNext({ detail: detail.trim() })} />
    </Shell>
  );
}

const MainText = styled.div`
  ${typo('webh2')};
  color: ${color('black')};
`;
const SubText = styled.div`
  ${typo('body1')};
  color: ${color('black')};
  white-space: pre-line;
`;
const Label = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;
const GuideText = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.400')};
  margin-top: 4px;
  white-space: pre-line;
`;

const SelectedBox = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 14px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid #efefef;
  background: #fafafb;
`;
const Addr = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  line-height: 1.5;
  word-break: keep-all;
`;
const JibunAddr = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.600')};
`;
const Jibun = styled.div`
  display: flex;
  width: 38px;
  height: 22px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 0.5px solid #a8a8a8;
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;
