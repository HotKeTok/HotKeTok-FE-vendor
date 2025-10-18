// src/templates/SignUpTemplate.jsx
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import imgBackground from '../assets/common/img-background.png';

import LeftSection from '../components/onboarding/LeftSection';
import TextField from '../components/common/TextField';
import ButtonSmall from '../components/common/ButtonSmall';
import Button from '../components/common/Button';
import { Column, Row } from '../styles/flex';

import CheckPasswordIcon from '../assets/common/icon-check-password.svg';
import HidePasswordIcon from '../assets/common/icon-hide-password.svg';
import iconArrowLeft from '../assets/common/icon-arrow-left.svg';

/* -------------------- 유틸 -------------------- */
function formatPhone(raw) {
  const digits = String(raw || '')
    .replace(/\D/g, '')
    .slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
const getPhoneDigits = s => String(s || '').replace(/\D/g, '');

const ALLOWED_SPECIALS = '!,~,@,$,^,*,(,),_,+';
const allowedSpecialsClass = ALLOWED_SPECIALS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PW_ALLOWED_REGEX = new RegExp(`^[A-Za-z0-9${allowedSpecialsClass}]{9,16}$`);
const PW_HAS_LETTER = /[A-Za-z]/;
const PW_HAS_SPECIAL = new RegExp(`[${allowedSpecialsClass}]`);
function validatePassword(pw) {
  if (!PW_ALLOWED_REGEX.test(pw)) return false;
  if (!PW_HAS_LETTER.test(pw)) return false;
  if (!PW_HAS_SPECIAL.test(pw)) return false;
  return true;
}

/* -------------------- 템플릿(UI 전용) -------------------- */
export default function SignUpTemplate({
  onRequestPhone = async () => {},
  onVerifyCode = async () => {},
  onCheckUserId = async () => {},
  onSubmit = async () => {},
  onBack = () => {},
  onNotify = () => {},

  submitting = false,
  requestingPhone = false,
  verifyingCode = false,
  verifyingUserId = false,
}) {
  // RightSection 입력 상태
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(''); // 표시용(하이픈 포함)
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRe, setPasswordRe] = useState('');

  // 인증/중복확인 UI 상태
  const [phoneRequested, setPhoneRequested] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(null); // null|true|false
  const [idCheckResult, setIdCheckResult] = useState(null); // null|true|false

  // 파생 상태
  const digits = useMemo(() => getPhoneDigits(phone), [phone]);
  const isPhoneComplete = digits.length === 11;
  const isPasswordValid = useMemo(() => validatePassword(password), [password]);
  const isPasswordReSuccess = useMemo(
    () => password.length > 0 && password === passwordRe && isPasswordValid,
    [password, passwordRe, isPasswordValid]
  );

  // 비번 보기 토글
  const [showPw, setShowPw] = useState(false);
  const [showPwRe, setShowPwRe] = useState(false);

  // 입력 변화에 따른 리셋
  useEffect(() => {
    setPhoneVerified(null);
    setPhoneRequested(false);
    if (!isPhoneComplete) {
      setShowVerify(false);
      setVerifyCode('');
    }
  }, [digits, isPhoneComplete]);

  useEffect(() => {
    setIdCheckResult(null);
  }, [userId]);

  // 핸들러
  const handleChangePhone = e => setPhone(formatPhone(e.target.value));
  const handleChangeVerifyCode = e =>
    setVerifyCode(
      String(e.target.value || '')
        .replace(/\D/g, '')
        .slice(0, 6)
    );

  const handleRequestPhone = async () => {
    if (!isPhoneComplete) return;
    const res = await onRequestPhone({ phoneNumber: digits });
    setPhoneRequested(true);
    setShowVerify(true);
    // ✅ 전송 결과 토스트: 전화번호 포함
    if (res?.success) onNotify(`휴대폰 번호로 인증코드가 전송되었어요.`);
  };

  const handleVerifyCode = async () => {
    if (!verifyCode) return;
    const res = await onVerifyCode({ phoneNumber: digits, code: verifyCode });
    if (res?.success) {
      setPhoneVerified(true);
    }
  };

  const handleCheckUserId = async () => {
    if (!userId.trim()) return;
    const res = await onCheckUserId({ logInId: userId.trim() });
    setIdCheckResult(Boolean(res?.success));
  };

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !isPhoneComplete ||
      !userId.trim() ||
      !isPasswordValid ||
      !isPasswordReSuccess
    )
      return;
    await onSubmit({
      name: name.trim(),
      logInId: userId.trim(),
      password,
      phoneNumber: digits,
    });
  };

  const phoneBtnText = requestingPhone ? '전송중...' : phoneRequested ? '재전송' : '인증하기';
  const phoneBtnDisabled = requestingPhone || phoneVerified === true;

  return (
    <BackgroundContainer background={imgBackground}>
      <Content>
        {/* Left 유지 */}
        <LeftSection
          maintext={'회원가입하고 \n 서비스를 이용해 보세요.'}
          subtext={'우리 동네 수리 요청, \n 힛케톡에서 바로 만나보세요.'}
        />

        {/* Right만 UX 이식 */}
        <RightSection>
          <BackButton onClick={onBack}>
            <img src={iconArrowLeft} />
          </BackButton>

          <SignUpText>회원가입</SignUpText>

          <Column $gap={25}>
            {/* 이름 */}
            <Column $gap={4}>
              <Label>이름</Label>
              <TextField
                placeholder="이름 입력"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Column>

            {/* 휴대폰 */}
            <Column $gap={4}>
              <Label>휴대폰 번호</Label>
              <Row $gap={6}>
                <TextField
                  placeholder="휴대폰 번호 입력"
                  value={phone}
                  onChange={handleChangePhone}
                  inputMode="numeric"
                  maxLength={13}
                  disabled={phoneVerified === true}
                />
                <ButtonSmall
                  active={isPhoneComplete && !phoneBtnDisabled}
                  text={phoneBtnText}
                  width={100}
                  onClick={handleRequestPhone}
                  disabled={phoneBtnDisabled}
                />
              </Row>

              {showVerify && (
                <>
                  <Row $gap={6} style={{ marginTop: 4 }}>
                    <TextField
                      placeholder="인증번호 입력"
                      value={verifyCode}
                      onChange={handleChangeVerifyCode}
                      inputMode="numeric"
                      maxLength={6}
                      disabled={phoneVerified === true}
                    />
                    <ButtonSmall
                      active={verifyCode.length > 0 && phoneVerified !== true}
                      text={verifyingCode ? '확인중...' : '확인'}
                      width={100}
                      onClick={handleVerifyCode}
                      disabled={verifyingCode || phoneVerified === true}
                    />
                  </Row>

                  {/* 인증 결과 */}
                  {phoneVerified === true && (
                    <GuideText style={{ color: '#01D281' }}>인증번호가 일치해요.</GuideText>
                  )}
                  {phoneVerified === false && (
                    <GuideText style={{ color: '#FF3F3F' }}>인증번호가 일치하지 않아요.</GuideText>
                  )}
                </>
              )}
            </Column>

            {/* 아이디 */}
            <Column $gap={4}>
              <Label>아이디</Label>
              <Row $gap={6}>
                <TextField
                  placeholder="아이디 입력"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                />
                <ButtonSmall
                  active={userId.length > 0 && idCheckResult !== true}
                  text={verifyingUserId ? '확인중...' : '중복확인'}
                  width={100}
                  onClick={handleCheckUserId}
                  disabled={verifyingUserId || idCheckResult === true}
                />
              </Row>
              {idCheckResult === true && (
                <GuideText style={{ color: '#01D281' }}>사용 가능한 아이디예요.</GuideText>
              )}
              {idCheckResult === false && (
                <GuideText style={{ color: '#FF3F3F' }}>이미 존재하는 아이디예요.</GuideText>
              )}
              {idCheckResult === null && <GuideText>6~20자 이내로 입력해주세요.</GuideText>}
            </Column>

            {/* 비밀번호 */}
            <Column $gap={4}>
              <Label>비밀번호</Label>
              <TextField
                placeholder="비밀번호"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  const filtered = String(e.target.value || '').replace(
                    new RegExp(`[^A-Za-z0-9${allowedSpecialsClass}]`, 'g'),
                    ''
                  );
                  setPassword(filtered);
                }}
                maxLength={16}
                rightIcon={showPw ? HidePasswordIcon : CheckPasswordIcon}
                onRightIconClick={() => setShowPw(v => !v)}
                rightIconAriaLabel={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
              />
              {password.length > 0 &&
                (isPasswordValid ? (
                  <HelperText $status="success">사용 가능한 비밀번호예요.</HelperText>
                ) : (
                  <HelperText $status="error">
                    특수문자는 !,~,@,$,^,*,(,),_,+ 만 사용이 가능해요.
                  </HelperText>
                ))}

              <TextField
                placeholder="비밀번호 재확인"
                type={showPwRe ? 'text' : 'password'}
                value={passwordRe}
                onChange={e => {
                  const filtered = String(e.target.value || '').replace(
                    new RegExp(`[^A-Za-z0-9${allowedSpecialsClass}]`, 'g'),
                    ''
                  );
                  setPasswordRe(filtered);
                }}
                maxLength={16}
                rightIcon={showPwRe ? HidePasswordIcon : CheckPasswordIcon}
                onRightIconClick={() => setShowPwRe(v => !v)}
                rightIconAriaLabel={showPwRe ? '비밀번호 숨기기' : '비밀번호 보기'}
              />
              {passwordRe.length > 0 &&
                (isPasswordReSuccess ? (
                  <HelperText $status="success">비밀번호가 일치해요.</HelperText>
                ) : (
                  <HelperText $status="error">비밀번호가 일치하지 않아요.</HelperText>
                ))}

              {!isPasswordValid && (
                <GuideText>
                  영문 대소문자와 특수문자를 조합하여 9~16자리까지 가능하며,{'\n'}
                  특수문자는 !,~,@,$,^,*,(,),_,+ 만 사용이 가능해요.
                </GuideText>
              )}
            </Column>
          </Column>

          <Button
            text={submitting ? '가입 중...' : '회원가입'}
            onClick={handleSubmit}
            disabled={submitting}
            active={name && phoneVerified && idCheckResult && isPasswordReSuccess}
          />
        </RightSection>
      </Content>
    </BackgroundContainer>
  );
}

/* -------------------- 스타일 -------------------- */
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
  min-height: 90vh;
  padding: 75px 80px;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  background: #fff;
`;

const SignUpText = styled.div`
  ${typo('h2')};
  color: ${color('black')};
`;

const Label = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;

const GuideText = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.400')};
  white-space: pre-line;
`;

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

const HelperText = styled.div`
  ${typo('caption2')};
  color: ${p =>
    p.$status === 'error'
      ? '#ff3f3f'
      : p.$status === 'success'
      ? color('brand.primary')
      : color('grayscale.400')};
`;
