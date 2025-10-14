// src/pages/onboarding/InitProcessContractor.jsx
// ============================================================================
// 🔹 수리업체 회원등록 퍼널 (이름 → 업종 → 주소(검색/선택/상세) → 소개/사진 → 사업자등록증)
//  - useFunnel로 단계 전환
//  - 기존 InitProcess.jsx와 유사한 구조/스타일 유지
// ============================================================================

import React, { useState } from 'react';
import styled from 'styled-components';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useNavigate } from 'react-router-dom';

import { color, typo } from '../styles/tokens';
import { Column, Row } from '../styles/flex';
import LeftSection from '../components/onboarding/LeftSection';
import ModalRegisterConfirm from '../components/onboarding/ModalRegisterConfirm';
import TextField from '../components/common/TextField';
import Button from '../components/common/Button';
import ButtonSmall from '../components/common/ButtonSmall';

import imgBackground from '../assets/common/img-background.png';
import iconArrowLeft from '../assets/common/icon-arrow-left.svg';
import iconFolder from '../assets/onboarding/icon-folder.svg';
import iconCamera from '../assets/onboarding/icon-camera.svg';

// 단계 아이콘 (사용자 안내대로 추가된 경로)
import iconStep1 from '../assets/onboarding/icon-register-step-1.svg';
import iconStep2 from '../assets/onboarding/icon-register-step-2.svg';
import iconStep3 from '../assets/onboarding/icon-register-step-3.svg';
import iconStep4 from '../assets/onboarding/icon-register-step-4.svg';
import iconStep5 from '../assets/onboarding/icon-register-step-5.svg';

const FixedLeftSection = React.memo(LeftSection);

/* ============================================================================
 * 모의 주소 검색 (실서비스에서는 API 대체)
 * ========================================================================== */
function mockSearchAddresses(keyword) {
  const seed = (keyword || '').trim();
  if (!seed) return [];
  return [
    {
      id: '1',
      sido: '서울특별시',
      sigungu: '강남구',
      road: `${seed} 112길 46`,
      building: '(엘에이치 삼성 도시형 생활주택)(LH삼성아파트)',
      jibun: '서울특별시 강남구 삼성동 109-21',
    },
    {
      id: '2',
      sido: '서울특별시',
      sigungu: '강남구',
      road: `${seed} 101로 12`,
      building: '(역삼 자이 101동)',
      jibun: '서울특별시 강남구 역삼동 10-21',
    },
    {
      id: '3',
      sido: '서울특별시',
      sigungu: '강남구',
      road: `${seed} 45길 23`,
      building: '(역삼 래미안 203동)',
      jibun: '서울특별시 강남구 역삼동 23-5',
    },
  ];
}

/* ============================================================================
 * 공통 레이아웃(배경/좌우 섹션) + 우측 카드 틀
 * ========================================================================== */
function Shell({ icon, children, onBack }) {
  const nav = useNavigate();
  return (
    <RightSection>
      <BackButton onClick={() => (onBack ? onBack() : nav(-1))}>
        <img src={iconArrowLeft} alt="back" />
      </BackButton>
      <IconStep src={icon} alt="step" />
      {children}
    </RightSection>
  );
}

/* ============================================================================
 * STEP 1: 업체명 입력
 * ========================================================================== */
function StepCompanyName({ defaultName = '', onNext }) {
  const [name, setName] = useState(defaultName);
  const limited = name.slice(0, 20);
  const can = !!limited.trim();

  return (
    <Shell icon={iconStep1}>
      <Column $gap={30}>
        <Column $gap={4}>
          <MainText style={{ marginTop: '70px' }}>업체의 이름을 알려주세요</MainText>
          <SubText>핫케톡에 공개적으로 등록될 이름이에요.</SubText>
        </Column>

        <Column $gap={6}>
          <Label>업체명</Label>
          <TextField
            placeholder={'업체명을 입력해주세요.'}
            value={limited}
            onChange={e => setName(e.target.value)}
          />
          <Row $justify={'space-between'} $align="flex-start">
            <TipText>{`Tips! 업체명 혹은 간판명,\n명함에 적힌 이름이나 직함으로 입력해 주세요!`}</TipText>
            <CharCount>{`${limited.length}/20`}</CharCount>
          </Row>
        </Column>
      </Column>

      <Button
        text={'다음'}
        active={can}
        onClick={() => can && onNext({ companyName: limited.trim() })}
      />
    </Shell>
  );
}

/* ============================================================================
 * STEP 2: 업종 선택
 * ========================================================================== */
const COMPANY_TYPES = [
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

function StepCompanyType({ defaultType, onNext, onBack }) {
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
        text={'다음'}
        active={!!selected}
        onClick={() => selected && onNext({ companyType: selected })}
      />
    </Shell>
  );
}

/* ============================================================================
 * STEP 3A: 주소 검색 키워드 입력
 * ========================================================================== */
function StepAddressKeyword({ defaultKeyword = '', onNext, onBack }) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [results, setResults] = useState([]);
  const [showHelp, setShowHelp] = useState(true);

  const search = () => {
    const list = mockSearchAddresses(keyword);
    setResults(list);
    setShowHelp(false);
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
          <Row $gap={6}>
            <TextField
              placeholder="예) 판교역로 235, 도산대로 33"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <ButtonSmall text="검색" width="30%" active={!!keyword.trim()} onClick={search} />
          </Row>
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

        {!showHelp && results.length > 0 && (
          <ListWrap>
            {results.map(a => (
              <AddressCard key={a.id} onClick={() => onNext({ baseAddress: a })}>
                <Column $gap={10}>
                  <Addr>
                    {a.sido} {a.sigungu} {a.road}
                    <br />
                    {a.building}
                  </Addr>
                  <Row $gap={8} $align="center">
                    <Jibun>지번</Jibun>
                    <JibunAddr>{a.jibun}</JibunAddr>
                  </Row>
                </Column>
              </AddressCard>
            ))}
          </ListWrap>
        )}

        {!showHelp && results.length === 0 && (
          <ExampleDesc style={{ marginTop: 6 }}>검색 결과가 없습니다.</ExampleDesc>
        )}
      </Column>
    </Shell>
  );
}

/* ============================================================================
 * STEP 3B: 상세주소 입력
 * ========================================================================== */
function StepAddressDetail({ baseAddress, defaultDetail = '', onNext, onBack }) {
  const [detail, setDetail] = useState(defaultDetail);
  const can = !!detail.trim();

  return (
    <Shell icon={iconStep3} onBack={onBack}>
      <Column $gap={20}>
        <Column $gap={4}>
          <MainText style={{ marginTop: '90px' }}>업체의 주소를 등록해주세요</MainText>
          <SubText>고객이 방문할 수 있는 주소를 알려주세요.</SubText>
        </Column>

        <SelectedBox>
          <Addr>
            {baseAddress.sido} {baseAddress.sigungu} {baseAddress.road}
            <br />
            {baseAddress.building}
          </Addr>
          <Row $gap={8} $align="center">
            <Jibun>지번</Jibun>
            <JibunAddr>{baseAddress.jibun}</JibunAddr>
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

      <Button text={'다음'} active={can} onClick={() => can && onNext({ detail: detail.trim() })} />
    </Shell>
  );
}

/* ============================================================================
 * STEP 4: 업체 소개 + 사진 업로드(최대 10장)
 * ========================================================================== */
function StepIntroduce({ defaultIntro = '', defaultImages = [], onNext, onBack }) {
  const [intro, setIntro] = useState(defaultIntro);
  const [images, setImages] = useState(defaultImages); // [{name, url, file}]
  const can = intro && images.length > 0;

  const handlePick = e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = [...images];
    for (const f of files) {
      if (next.length >= 10) break;
      const url = URL.createObjectURL(f);
      next.push({ name: f.name, url, file: f });
    }
    setImages(next.slice(0, 10));
    e.target.value = '';
  };

  const removeAt = idx => {
    const next = [...images];
    const item = next[idx];
    if (item?.url?.startsWith('blob:')) URL.revokeObjectURL(item.url);
    next.splice(idx, 1);
    setImages(next);
  };

  return (
    <Shell icon={iconStep4} onBack={onBack}>
      <Column>
        <Column $gap={30}>
          <Column $gap={4}>
            <MainText style={{ marginTop: '50px' }}>업체 소개와 사진을 등록해주세요.</MainText>
            <SubText2>
              {`업체를 소개할 수 있는 사진을 등록해주세요. \n소개와 사진은 나중에 수정할 수 있어요.`}
            </SubText2>
          </Column>

          <Column $gap={6}>
            <Label>업체 소개</Label>
            <Textarea
              placeholder="업체 소개글을 입력해주세요."
              value={intro}
              onChange={e => setIntro(e.target.value.slice(0, 300))}
            />
            <Row $justify="flex-end">
              <CharCount>{`${intro.length}/300`}</CharCount>
            </Row>
          </Column>
        </Column>
        <Column $gap={8}>
          <Label>업체 사진</Label>

          <UploadGrid>
            {/* 업로드 슬롯 */}
            {images.length < 10 && (
              <UploadSlot onClick={() => document.getElementById('photo-input').click()}>
                <UploadIcon src={iconCamera} alt="folder" />
                <UploadText>사진 {images.length}/10</UploadText>
              </UploadSlot>
            )}

            {/* 썸네일들 */}
            {images.map((img, i) => (
              <Thumb key={i}>
                <img src={img.url} alt={img.name} />
                <RemoveBtn onClick={() => removeAt(i)}>×</RemoveBtn>
              </Thumb>
            ))}
          </UploadGrid>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handlePick}
          />
        </Column>
      </Column>
      <Button text={'다음'} active={can} onClick={() => onNext({ intro: intro.trim(), images })} />
    </Shell>
  );
}

/* ============================================================================
 * STEP 5: 사업자등록증 업로드 (PDF 또는 이미지)
 * ========================================================================== */
function StepBusinessCert({ defaultFileName = '', summary, onNext, onBack }) {
  const [fileName, setFileName] = useState(defaultFileName);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const can = !!fileName;

  const pick = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ok = f.type === 'application/pdf' || f.type.startsWith('image/');
    if (!ok) {
      alert('사업자등록증은 PDF나 이미지로 등록할 수 있어요.');
      e.target.value = '';
      return;
    }
    setFileName(f.name);
  };

  return (
    <Shell icon={iconStep5} onBack={onBack}>
      <Column $gap={20}>
        <Column $gap={4}>
          <MainText style={{ marginTop: '50px' }}>사업자등록증을 업로드해주세요.</MainText>
          <SubText>제출된 자료는 인증 외 다른 용도로 사용되지 않아요.</SubText>
        </Column>

        <UploadBox onClick={() => document.getElementById('biz-cert-input').click()}>
          <Column $align="center" $gap={10}>
            <IconFolder src={iconFolder} alt="folder" />
            <UploadTitle>{fileName || '파일 선택하기'}</UploadTitle>
          </Column>
          <input
            id="biz-cert-input"
            type="file"
            accept="application/pdf,image/*"
            style={{ display: 'none' }}
            onChange={pick}
          />
        </UploadBox>

        <GuideText style={{ color: '#3C66FF' }}>
          * 사업자등록증은 PDF나 이미지로 등록할 수 있어요.
          <br />* 제출된 자료는 인증 외 다른 용도로 사용되지 않아요.
        </GuideText>
      </Column>

      <Button text={'완료하기'} active={can} onClick={() => can && setConfirmOpen(true)} />

      {/* 등록확인 모달 */}
      <ModalRegisterConfirm
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        data={summary}
        onConfirm={() => {
          onNext?.({ bizCert: fileName });
          navigate('/'); // 등록하기 → 홈 이동
        }}
      />
    </Shell>
  );
}

/* ============================================================================
 * 메인: 퍼널
 * ========================================================================== */
export default function InitProcessTemplate() {
  const Funnel = useFunnel({
    id: 'contractor-init',
    initial: { step: 'CompanyName', context: {} },
    steps: {},
    routes: step => `/init/contractor/${step}`,
  });

  return (
    <BackgroundContainer background={imgBackground}>
      <Content>
        <FixedLeftSection
          maintext={'업체 정보를 입력하고 \n프로필을 완성해 보세요.'}
          subtext={'우리 동네 수리 요청, \n 핫케톡에서 바로 만나보세요.'}
        />

        {/* 오른쪽 카드만 단계별로 교체 렌더 */}
        <Funnel.Render
          CompanyName={({ history, context }) => (
            <StepCompanyName
              defaultName={context.companyName}
              onNext={({ companyName }) => history.push('CompanyType', { ...context, companyName })}
            />
          )}
          CompanyType={({ history, context }) => (
            <StepCompanyType
              defaultType={context.companyType}
              onBack={history.back}
              onNext={({ companyType }) =>
                history.push('AddressKeyword', { ...context, companyType })
              }
            />
          )}
          AddressKeyword={({ history, context }) => (
            <StepAddressKeyword
              defaultKeyword={context.addressKeyword}
              onBack={history.back}
              onNext={({ baseAddress }) =>
                history.push('AddressDetail', { ...context, baseAddress })
              }
            />
          )}
          AddressDetail={({ history, context }) => (
            <StepAddressDetail
              baseAddress={context.baseAddress}
              defaultDetail={context.detail}
              onBack={history.back}
              onNext={({ detail }) => history.push('Introduce', { ...context, detail })}
            />
          )}
          Introduce={({ history, context }) => (
            <StepIntroduce
              defaultIntro={context.intro}
              defaultImages={context.images || []}
              onBack={history.back}
              onNext={({ intro, images }) =>
                history.push('BusinessCert', { ...context, intro, images })
              }
            />
          )}
          BusinessCert={({ history, context }) => (
            <StepBusinessCert
              defaultFileName={context.bizCert}
              onBack={history.back}
              summary={{
                name: context.companyName,
                // COMPANY_TYPES의 title을 그대로 쓰고 싶으면 아래 한 줄로 교체:
                // typeTitle: COMPANY_TYPES.find(t => t.key === context.companyType)?.title || '',
                typeTitle:
                  ['general', 'interior', 'special']
                    .map(k => ({
                      k,
                      t: {
                        general: '종합설비업체',
                        interior: '인테리어/리모델링 업체',
                        special: '전문업체',
                      }[k],
                    }))
                    .find(x => x.k === context.companyType)?.t || '',
                addr1: `${context.baseAddress?.sido || ''} ${context.baseAddress?.sigungu || ''} ${
                  context.baseAddress?.road || ''
                }`,
                addr2: `${context.baseAddress?.building || ''} ${context.detail || ''}`.trim(),
                intro: context.intro || '',
                images: (context.images || []).map(it => ({ name: it.name, url: it.url })),
              }}
              onNext={({ bizCert }) => {
                // 필요시 컨텍스트 저장만 (모달의 onConfirm에서 홈으로 이동)
                history.push('Done', { ...context, bizCert });
              }}
            />
          )}
        />
      </Content>
    </BackgroundContainer>
  );
}

/* ============================================================================
 * 스타일 (기존 템플릿과 동일한 톤)
 * ========================================================================== */

// 배경 컨테이너/오버레이
const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: ${({ background }) => `url(${background})`};
  background-size: cover;
  background-position: center;
  position: relative;
`;
const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 20%;
  left: 15%;
  bottom: 20%;
  right: 12%;
`;

const RightSection = styled.div`
  position: relative;
  display: flex;
  width: 500px;
  min-height: 80vh;
  padding: 95px 80px 30px 80px;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  background: #fff;
`;

// 타이포
const MainText = styled.div`
  ${typo('webh2')};
  color: ${color('black')};
`;
const SubText = styled.div`
  ${typo('body1')};
  color: ${color('black')};
  white-space: pre-line;
`;

const SubText2 = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
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
const TipText = styled.div`
  ${typo('caption2')};
  color: #3c66ff;
  white-space: pre-line;
`;
const CharCount = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.400')};
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

// 버튼/아이콘
const BackButton = styled.button`
  position: absolute;
  top: 25px;
  left: 20px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  & img {
    width: 10px;
  }
`;
const IconStep = styled.img`
  position: absolute;
  top: 20px;
  right: 30px;
`;

// 카드류
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

// 주소 리스트/선택 박스
const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
`;
const AddressCard = styled.div`
  width: 100%;
  text-align: left;
  cursor: pointer;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid ${color('grayscale.200')};
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
  gap: 10px;
  border-radius: 4px;
  border: 0.5px solid #a8a8a8;
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

// 소개/업로드
const Textarea = styled.textarea`
  height: 100px;
  resize: none;
  border-radius: 8px;
  border: 1px solid ${color('grayscale.200')};
  padding: 13px 15px;
  ${typo('body2')};
  color: ${color('grayscale.800')};
  outline: none;
  background-color: ${color('grayscale.100')};
`;

const UploadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
`;
const UploadSlot = styled.div`
  height: 60px;
  border: 1px dashed ${color('grayscale.300')};
  border-radius: 5px;
  background: #fafafb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
`;
const UploadText = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.500')};
  margin-top: 6px;
`;

const Thumb = styled.div`
  position: relative;
  height: 60px;
  border-radius: 5px;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  cursor: pointer;
`;

// 사업자등록증
const UploadBox = styled.div`
  width: 100%;
  height: 160px;
  border: 1px dashed ${color('grayscale.300')};
  border-radius: 6px;
  background: #fafafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const UploadIcon = styled.img`
  width: 15px;
`;

const IconFolder = styled.img`
  width: 33px;
`;
const UploadTitle = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.500')};
`;

// 완료 안내
const SuccessTitle = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.800')};
  margin-bottom: 6px;
`;
const SuccessSub = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  text-align: center;
`;
