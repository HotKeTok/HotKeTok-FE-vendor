import React, { useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';
import Button from '../common/Button';
import TextField from '../common/TextField'; // TextArea는 스타일로 구현
import Shell from './Shell';
import iconStep4 from '../../assets/onboarding/icon-register-step-4.svg';
import iconCamera from '../../assets/onboarding/icon-camera.svg';

export default function StepIntroduce({ defaultIntro = '', defaultImages = [], onNext, onBack }) {
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
            {images.length < 10 && (
              <UploadSlot onClick={() => document.getElementById('photo-input').click()}>
                <UploadIcon src={iconCamera} alt="folder" />
                <UploadText>사진 {images.length}/10</UploadText>
              </UploadSlot>
            )}

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
      <Button text="다음" active={can} onClick={() => onNext({ intro: intro.trim(), images })} />
    </Shell>
  );
}

const MainText = styled.div`
  ${typo('webh2')};
  color: ${color('black')};
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

const CharCount = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.400')};
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
const UploadIcon = styled.img`
  width: 15px;
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
