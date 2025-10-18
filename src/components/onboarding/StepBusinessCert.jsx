import React, { useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column } from '../../styles/flex';
import Button from '../common/Button';
import Shell from './Shell';
import ModalRegisterConfirm from './ModalRegisterConfirm' /* 경로 확인: templates가 아니라 components 위치라면 그대로 */;
import iconStep5 from '../../assets/onboarding/icon-register-step-5.svg';
import iconFolder from '../../assets/onboarding/icon-folder.svg';

// ✅ UI는 원본 그대로. 파일 객체는 상위로 전달만 함.
export default function StepBusinessCert({
  defaultFileName = '',
  summary,
  submitting = false,
  onBack,
  onConfirm, // 상위 템플릿이 실제 등록(onRegister) 실행
}) {
  const [fileName, setFileName] = useState(defaultFileName);
  const [fileObj, setFileObj] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
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
    setFileObj(f);
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

      <Button
        text={submitting ? '등록 중...' : '완료하기'}
        active={can && !submitting}
        onClick={() => can && setConfirmOpen(true)}
      />

      {/* 원본 모달 UI 유지 */}
      <ModalRegisterConfirm
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        data={summary}
        onConfirm={() => onConfirm?.({ file: fileObj, fileName })}
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
const IconFolder = styled.img`
  width: 33px;
`;
const UploadTitle = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.500')};
`;
const GuideText = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.400')};
  white-space: pre-line;
  margin-top: 4px;
`;
