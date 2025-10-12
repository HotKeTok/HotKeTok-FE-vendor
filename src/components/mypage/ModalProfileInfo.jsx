import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import styled, { css } from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';
import Button from '../common/Button';
import TextField from '../common/TextField';
import HomeTimeEditor from './HomeTimeEditor';
import HomeImgGrid from './HomeImgGrid';
import EditIcn from '../../assets/common/icon-edit-pencil.svg?react';
import ProfileDefaultIcn from '../../assets/common/icon-profile-default.svg?react';
import ArrowDownIcn from '../../assets/common/icon-arrow-down.svg?react';
import { formatPhone } from '../../utils/format';

export default function ModalProfileInfo({
  isOpen,
  onClose,
  myPageData,
  onPatchProfileInfo,
  profileData,
  setProfileData,
}) {
  const { introduction, phoneNumber, runningTime, introductionImage } = profileData;
  const [isTimeEditorOpen, setIsTimeEditorOpen] = useState(false);

  const handlePhoneChange = e => {
    const formattedValue = formatPhone(e.target.value);
    setProfileData({ ...profileData, phoneNumber: formattedValue });
  };

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setInitialData(profileData);
    }
  }, [isOpen]);

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(profileData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      style={{ width: '42%', maxHeight: '90%', overflow: 'scroll' }}
    >
      <Container $gap={6} $align="flex-start">
        <Title>프로필 관리</Title>

        {/* 상단 프로필 영역 (프로필 이미지, 이름, 카테고리) */}
        <Column $gap={10} $align="center" style={{ width: '100%' }}>
          <ProfileImageContainer>
            {profileData.profileImg ? (
              <ProfileImg src={profileData.profileImg} alt="프로필 이미지" />
            ) : (
              <ProfileDefaultIcn />
            )}
            <EditIconWrapper>
              <EditIcn />
            </EditIconWrapper>
            <HiddenFileInput
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  // todo: 실제 서버 url
                  setProfileData({ ...profileData, profileImg: imageUrl });
                }
              }}
            />
          </ProfileImageContainer>
          <div>
            <Title>{myPageData.name}</Title>
            <Caption>{myPageData.category}</Caption>
          </div>

          {/* 소개 영역 */}
          <Column $gap={24} $align="center" style={{ width: '100%' }}>
            <RowContainer>
              <Label>소개</Label>
              <TextField
                placeholder="가게 소개를 입력해주세요"
                value={introduction || ''}
                onChange={e => setProfileData({ ...profileData, introduction: e.target.value })}
                width="100%"
                maxLength={50}
              />
              <TextLength>{introduction?.length || 0}/50</TextLength>
            </RowContainer>

            {/* 전화번호 영역 */}
            <RowContainer>
              <Label>전화번호</Label>
              <TextField
                placeholder="예) 010-0000-0000"
                value={phoneNumber || ''}
                onChange={handlePhoneChange}
                width="100%"
              />
            </RowContainer>

            {/* 영업 시간 영역 */}
            <RowContainer>
              <LabelRow>
                <Label>영업 시간</Label>
              </LabelRow>

              <ToggleContainer onClick={() => setIsTimeEditorOpen(prev => !prev)}>
                <Row $justify="space-between" style={{ width: '100%' }}>
                  <Label style={{ color: '#a8a8a8' }}>영업 시간을 입력해주세요</Label>
                  <IcnContainer $isOpened={isTimeEditorOpen}>
                    <ToggleIcn />
                  </IcnContainer>
                </Row>
                {isTimeEditorOpen && (
                  <HomeTimeEditor
                    runningTime={runningTime}
                    setProfileData={setProfileData}
                    profileData={profileData}
                  />
                )}
              </ToggleContainer>
            </RowContainer>

            {/* 업체 사진 영역 */}
            <RowContainer>
              <Label>업체 소개 사진</Label>
              <HomeImgGrid
                images={introductionImage}
                setProfileData={setProfileData}
                profileData={profileData}
              />
            </RowContainer>
          </Column>
        </Column>
      </Container>
      <BtnContainer>
        <Button text="취소하기" width={136} dismiss onClick={onClose} />
        <Button
          text="저장하기"
          active={isDirty}
          width={136}
          onClick={() => {
            onPatchProfileInfo(profileData);
            onClose();
          }}
        />
      </BtnContainer>
    </Modal>
  );
}

const Container = styled(Column)`
  padding-left: 6px;
  padding-right: 6px;
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const BtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 40px;
`;

const Title = styled.div`
  ${typo('h3')};
  color: #000;
`;

const ProfileImageContainer = styled.label`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const EditIconWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Caption = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.400')};
`;

const Label = styled.label`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

const TextLength = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  ${typo('caption1')};
  color: ${color('grayscale.400')};
`;

const LabelRow = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const ToggleContainer = styled.div`
  width: 100%;
  padding: 13px 15px;

  background-color: ${color('grayscale.100')};
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};

  cursor: pointer;
`;

const IcnContainer = styled.div`
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props =>
    props.$isOpened &&
    css`
      transform: rotate(180deg);
      transition: transform 0.2s;
    `}
`;

const ToggleIcn = styled(ArrowDownIcn)`
  width: 9px;
  height: 13px;
`;
