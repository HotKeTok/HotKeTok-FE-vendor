import React from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';

export default function ModalRegisterConfirm({ open, onClose, onConfirm, data }) {
  const { name, typeTitle, addr1, addr2, intro, images = [] } = data || {};

  return (
    <Modal isOpen={open} onClose={onClose} style={{ width: '420px', padding: 0 }}>
      <Wrap>
        <Column $gap={30}>
          <Header>
            <Title>아래 정보로 회원 등록을 진행할까요?</Title>
            <Desc>{`사업자등록증을 확인하고 업체 인증이 완료되면 \n 알림을 보내드릴게요.`}</Desc>
          </Header>

          <InfoTable>
            <InfoRow label="이름" value={name} />
            <InfoRow label="업종" value={typeTitle} />
            <InfoRow
              label="주소"
              value={
                <div>
                  {addr1}
                  <br />
                  {addr2}
                </div>
              }
            />
            <Column $gap={8} style={{ width: '100%' }}>
              <InfoRow label="소개" />
              <DescBox>{intro}</DescBox>
            </Column>

            <Column $gap={8} style={{ width: '100%' }}>
              <PhotoGrid>
                {images.map((img, i) => (
                  <Thumb key={`${img.url || img.name}-${i}`}>
                    <img src={img.url} alt={img.name || `img-${i}`} />
                  </Thumb>
                ))}
              </PhotoGrid>
            </Column>
          </InfoTable>

          <Footer>
            <Button text="취소하기" width={140} dismiss onClick={onClose} />
            <Button text="등록하기" width={140} onClick={onConfirm} />
          </Footer>
        </Column>
      </Wrap>
    </Modal>
  );
}

/* --- 내부 소품 --- */
const InfoRow = ({ label, value }) => (
  <Row style={{ justifyContent: 'space-between' }}>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </Row>
);

const Wrap = styled.div`
  padding: 24px 30px;
  border-radius: 14px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.div`
  ${typo('h3')};
  color: #000;
  margin-bottom: 4px;
`;

const Desc = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  white-space: pre-line;
  text-align: start;
`;

const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.span`
  ${typo('button2')};
  color: #000;
`;

const Value = styled.span`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  text-align: right;
  word-break: keep-all;
`;

const DescBox = styled.div`
  width: 100%;
  background-color: ${color('grayscale.100')};
  border-radius: 6px;
  border: 1px solid ${color('grayscale.200')};
  padding: 10px 12px;
  ${typo('body2')};
  color: ${color('grayscale.800')};
  min-height: 40px;
  text-align: start;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`;

const Thumb = styled.div`
  height: 72px;
  border-radius: 6px;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  gap: 6px;
`;
