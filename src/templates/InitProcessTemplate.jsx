import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import imgBackground from '../assets/common/img-background.png';
import LeftSection from '../components/onboarding/LeftSection';

import StepCompanyName from '../components/onboarding/StepCompanyName';
import StepCompanyType from '../components/onboarding/StepCompanyType';
import StepAddressKeyword from '../components/onboarding/StepAddressKeyword';
import StepAddressDetail from '../components/onboarding/StepAddressDetail';
import StepIntroduce from '../components/onboarding/StepIntroduce';
import StepBusinessCert from '../components/onboarding/StepBusinessCert';

export default function InitProcessTemplate({
  onRegister = async () => ({ success: false }),
  onSearchAddress = async () => ({ success: false, results: [] }),
  submitting = false,
}) {
  const nav = useNavigate();

  // 1) 스텝 플로우 정의
  const STEP_FLOW = [
    'CompanyName',
    'CompanyType',
    'AddressKeyword',
    'AddressDetail',
    'Introduce',
    'BusinessCert',
  ];

  const [step, setStep] = useState('CompanyName');
  const [ctx, setCtx] = useState({
    companyName: '',
    companyType: '',
    baseAddress: null,
    detail: '',
    intro: '',
    images: [], // [{name,url,file}]
    file: null,
  });
  const next = patch => setCtx(prev => ({ ...prev, ...patch }));

  // 2) 뒤로가기: 첫 단계면 로그인으로, 그 외엔 이전 스텝으로
  const handleBack = () => {
    const idx = STEP_FLOW.indexOf(step);
    if (idx <= 0) {
      nav('/sign-in');
    } else {
      setStep(STEP_FLOW[idx - 1]);
    }
  };

  // ===== 주소 검색 상태는 템플릿이 관리 (UI 상태) =====
  const [addrKeyword, setAddrKeyword] = useState('');
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrShowHelp, setAddrShowHelp] = useState(true);
  const [addrResults, setAddrResults] = useState([]);

  const handleSearchAddress = async () => {
    const q = (addrKeyword || '').trim();
    if (!q || addrLoading) return;
    setAddrLoading(true);
    try {
      const res = await onSearchAddress({ keyword: q, page: 0, size: 10 });
      setAddrResults(res?.results || []);
    } finally {
      setAddrShowHelp(false);
      setAddrLoading(false);
    }
  };

  const CATEGORY_TITLE_MAP = {
    general: '종합설비업체',
    interior: '인테리어/리모델링 업체',
    special: '전문업체',
  };

  // ===== 등록 payload 구성 (명세서 반영) =====
  const buildPayload = fileOverride => {
    const category = CATEGORY_TITLE_MAP[ctx.companyType] || ''; // ← 한글 라벨을 보냄
    const address = `${ctx.baseAddress?.sido || ''} ${ctx.baseAddress?.sigungu || ''} ${
      ctx.baseAddress?.road || ''
    }`.trim();
    const detailAddress = `${ctx.baseAddress?.building || ''} ${ctx.detail || ''}`.trim();

    const data = {
      name: ctx.companyName,
      category,
      address,
      detailAddress,
      introduction: ctx.intro,
    };
    const images = (ctx.images || []).map(x => x.file).filter(Boolean);
    const file = fileOverride ?? ctx.file;
    return { data, file, images };
  };

  const handleConfirmRegister = async fileOverride => {
    const payload = buildPayload(fileOverride);

    const res = await onRegister(payload);
    if (res?.success) {
      alert('등록이 완료되었어요!');
      nav('/');
    } else {
      alert(res?.message || '등록에 실패했어요. 다시 시도해주세요.');
    }
  };

  return (
    <BackgroundContainer background={imgBackground}>
      <Content>
        <LeftSection
          maintext={'업체 정보를 입력하고 \n프로필을 완성해 보세요.'}
          subtext={'우리 동네 수리 요청, \n 핫케톡에서 바로 만나보세요.'}
        />

        {step === 'CompanyName' && (
          <StepCompanyName
            defaultName={ctx.companyName}
            onBack={handleBack}
            onNext={({ companyName }) => {
              next({ companyName });
              setStep('CompanyType');
            }}
          />
        )}

        {step === 'CompanyType' && (
          <StepCompanyType
            defaultType={ctx.companyType}
            onBack={handleBack}
            onNext={({ companyType }) => {
              next({ companyType });
              setStep('AddressKeyword');
            }}
          />
        )}

        {step === 'AddressKeyword' && (
          <StepAddressKeyword
            keyword={addrKeyword}
            onChangeKeyword={setAddrKeyword}
            loading={addrLoading}
            showHelp={addrShowHelp}
            results={addrResults}
            onSearch={handleSearchAddress}
            onBack={handleBack}
            onSelect={baseAddress => {
              next({ baseAddress });
              setStep('AddressDetail');
            }}
          />
        )}

        {step === 'AddressDetail' && (
          <StepAddressDetail
            baseAddress={ctx.baseAddress}
            defaultDetail={ctx.detail}
            onBack={handleBack}
            onNext={({ detail }) => {
              next({ detail });
              setStep('Introduce');
            }}
          />
        )}

        {step === 'Introduce' && (
          <StepIntroduce
            defaultIntro={ctx.intro}
            defaultImages={ctx.images}
            onBack={handleBack}
            onNext={({ intro, images }) => {
              next({ intro, images });
              setStep('BusinessCert');
            }}
          />
        )}

        {step === 'BusinessCert' && (
          <StepBusinessCert
            defaultFileName={''}
            submitting={submitting}
            onBack={handleBack}
            summary={{
              name: ctx.companyName,
              typeTitle: CATEGORY_TITLE_MAP[ctx.companyType] || '',
              addr1: `${ctx.baseAddress?.sido || ''} ${ctx.baseAddress?.sigungu || ''} ${
                ctx.baseAddress?.road || ''
              }`,
              addr2: `${ctx.baseAddress?.building || ''} ${ctx.detail || ''}`.trim(),
              intro: ctx.intro || '',
              images: (ctx.images || []).map(it => ({ name: it.name, url: it.url })),
            }}
            onConfirm={({ file }) => {
              handleConfirmRegister(file);
              // (선택) 이후 상태에도 보관하고 싶다면 다음 줄을 추가
              next({ file });
            }}
          />
        )}
      </Content>
    </BackgroundContainer>
  );
}

/* 레이아웃: 그대로 */
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
