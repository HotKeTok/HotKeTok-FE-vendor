import React, { useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column } from '../../styles/flex';
import Button from '../common/Button';
import Shell from './Shell';
import iconStep2 from '../../assets/onboarding/icon-register-step-2.svg';

export const COMPANY_TYPES = [
  {
    key: 'general',
    title: '종합설비업체',
    desc1: '• 수도, 전기, 보일러, 가스, 타일, 도배 등 기본 주거 설비 전반 담당',
    desc2: '• 특징: 다양한 문제를 일괄으로 해결, 긴급 출동 가능',
  },
  {
    key: 'interior',
    title: '인테리어/리모델링 업체',
    desc1: '• 도배, 장판, 욕실, 창호, 타일, 페인트, 공간 구조 변경',
    desc2: '• 특징: 기능적 수리보다 공간 개선과 연출',
  },
  {
    key: 'special',
    title: '전문업체',
    desc1: '• 에어컨, 보일러, 가전, 목공, 유리/샤시 전문',
    desc2: '',
  },
];

export default function StepCompanyType({ defaultType, onNext, onBack }) {
  const [selected, setSelected] = useState(defaultType || '');

  return (
    <Shell icon={iconStep2} onBack={onBack}>
      <Column $gap={20}>
        <Column $gap={4}>
          <MainText>업종을 선택해주세요</MainText>
          <SubText>어떤 분야를 다루는지 고객에게 알릴 수 있어요.</SubText>
        </Column>

        <Column $gap={12}>
          {COMPANY_TYPES.map(item => (
            <TypeCard
              key={item.key}
              $selected={selected === item.key}
              onClick={() => setSelected(item.key)}
            >
              <TypeTitle>{item.title}</TypeTitle>
              <TypeDesc>{item.desc1}</TypeDesc>
              {item.desc2 ? <TypeDesc>{item.desc2}</TypeDesc> : null}
            </TypeCard>
          ))}
        </Column>
      </Column>

      <Button
        text="다음"
        active={!!selected}
        onClick={() => selected && onNext({ companyType: selected })}
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
`;
const TypeCard = styled.div`
  width: 100%;
  padding: 24px;
  border-radius: 12px;
  border: 1.5px solid ${({ $selected }) => ($selected ? color('brand.primary') : '#EFEFEF')};
  background: #fff;
  cursor: pointer;
`;
const TypeTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
  margin-bottom: 6px;
`;
const TypeDesc = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.600')};
`;
