import React, { useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';
import TextField from '../common/TextField';
import Button from '../common/Button';
import Shell from './Shell';
import iconStep1 from '../../assets/onboarding/icon-register-step-1.svg';

export default function StepCompanyName({ defaultName = '', onNext, onBack }) {
  const [name, setName] = useState(defaultName);
  const limited = name.slice(0, 20);
  const can = !!limited.trim();

  return (
    <Shell icon={iconStep1} onBack={onBack}>
      <Column $gap={30}>
        <Column $gap={4}>
          <MainText style={{ marginTop: '70px' }}>업체의 이름을 알려주세요</MainText>
          <SubText>핫케톡에 공개적으로 등록될 이름이에요.</SubText>
        </Column>

        <Column $gap={6}>
          <Label>업체명</Label>
          <TextField
            placeholder="업체명을 입력해주세요."
            value={limited}
            onChange={e => setName(e.target.value)}
          />
          <Row $justify="space-between" $align="flex-start">
            <TipText>{`Tips! 업체명 혹은 간판명,\n명함에 적힌 이름이나 직함으로 입력해 주세요!`}</TipText>
            <CharCount>{`${limited.length}/20`}</CharCount>
          </Row>
        </Column>
      </Column>

      <Button
        text="다음"
        active={can}
        onClick={() => can && onNext({ companyName: limited.trim() })}
      />
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
const TipText = styled.div`
  ${typo('caption2')};
  color: #3c66ff;
  white-space: pre-line;
`;
const CharCount = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.400')};
`;
