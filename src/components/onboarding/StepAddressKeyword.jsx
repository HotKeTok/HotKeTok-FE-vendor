// src/components/onboarding/StepAddressKeyword.jsx
import React from 'react';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';
import TextField from '../common/TextField';
import ButtonSmall from '../common/ButtonSmall';
import Shell from './Shell';
import iconStep3 from '../../assets/onboarding/icon-register-step-3.svg';

/**
 * props
 * - keyword: string
 * - onChangeKeyword: (v:string)=>void
 * - loading: boolean
 * - showHelp: boolean
 * - results: Array<{ id, road, jibun }>
 * - onSearch: ()=>void
 * - onSelect: (addr)=>void
 * - onBack: ()=>void
 */
export default function StepAddressKeyword({
  keyword = '',
  onChangeKeyword,
  loading = false,
  showHelp = true,
  results = [],
  onSearch,
  onSelect,
  onBack,
}) {
  // 괄호 분리 함수
  const splitRoad = str => {
    const match = String(str).match(/^(.*?)(\s*\(.*\))$/);
    return match ? { road: match[1].trim(), bracket: match[2].trim() } : { road: str, bracket: '' };
  };

  const handleSubmit = e => {
    if (e) e.preventDefault();
    const q = String(keyword).trim();
    if (!loading && q.length >= 2) onSearch?.();
  };

  return (
    <Shell icon={iconStep3} onBack={onBack}>
      <Column $gap={20}>
        <Column $gap={4}>
          <MainText style={{ marginTop: '30px' }}>업체의 주소를 등록해주세요</MainText>
          <SubText>고객이 방문할 수 있는 주소를 알려주세요.</SubText>
        </Column>

        <Column $gap={8}>
          <Label>주소 검색</Label>
          {/* ⬇️ 폼으로 래핑 */}
          <form onSubmit={handleSubmit}>
            <Row $gap={6}>
              <TextField
                placeholder="예) 판교역로 235, 도산대로 33"
                value={keyword}
                onChange={e => onChangeKeyword?.(e.target.value)}
                onKeyDown={e => {
                  // IME 조합(한글 입력) 중 Enter는 무시
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                    // 여기서 preventDefault 안해도 form submit이 처리함
                  }
                }}
              />
              <ButtonSmall
                text={loading ? '검색중...' : '검색'}
                width="30%"
                active={!!keyword.trim() && !loading}
                onClick={handleSubmit}
                disabled={loading}
                // type="submit"  ← 지원하면 이 줄도 추가
              />
              {/* ButtonSmall이 submit 타입을 지원하지 않으면 숨김 submit 버튼 추가 */}
              <button type="submit" style={{ display: 'none' }} aria-hidden />
            </Row>
          </form>
        </Column>

        {showHelp && (
          <Column $gap={10}>
            <Row $gap={10}>
              <ExampleTitle>도로명</ExampleTitle>
              <ExampleDesc>예) 판교역로 235, 도산대로 8길 23</ExampleDesc>
            </Row>
            <Row $gap={10}>
              <ExampleTitle>동주소</ExampleTitle>
              <ExampleDesc>예) 연희동 42-18</ExampleDesc>
            </Row>
            <Row $gap={10}>
              <ExampleTitle>건물명</ExampleTitle>
              <ExampleDesc>예) 텐즈힐</ExampleDesc>
            </Row>
          </Column>
        )}

        {!showHelp && loading && <ExampleDesc style={{ marginTop: 6 }}>검색 중...</ExampleDesc>}

        {!showHelp && !loading && results.length > 0 && (
          <ListWrap>
            {results.map(a => {
              const { road, bracket } = splitRoad(a.road);
              return (
                <AddressCard key={a.id} onClick={() => onSelect?.(a)}>
                  <Column $gap={10}>
                    <Addr>
                      {road}
                      {bracket && (
                        <>
                          <br />
                          {bracket}
                        </>
                      )}
                    </Addr>
                    <Row $gap={8} $align="center">
                      <Jibun>지번</Jibun>
                      <JibunAddr>{a.jibun}</JibunAddr>
                    </Row>
                  </Column>
                </AddressCard>
              );
            })}
          </ListWrap>
        )}

        {!showHelp && !loading && results.length === 0 && (
          <ExampleDesc style={{ marginTop: 6 }}>검색 결과가 없습니다.</ExampleDesc>
        )}
      </Column>
    </Shell>
  );
}

/* 스타일 */
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
const ExampleTitle = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  white-space: nowrap;
`;
const ExampleDesc = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;
const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
  height: 400px;
  overflow-y: auto;
`;
const AddressCard = styled.div`
  width: 100%;
  text-align: left;
  cursor: pointer;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid ${color('grayscale.200')};
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
