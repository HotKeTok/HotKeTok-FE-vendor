import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { color, typo } from '../../styles/tokens';
import RepairStatusChip from './RepairStatusChip';
import { Column, Row } from '../../styles/flex';
import Button from './Button';
import Modal from './Modal';

/**
 *
 * @description 수리 상세 모달 컴포넌트
 * @param {boolean} detailModalOpen - 모달 열림 상태
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {function} onDelete - 견적서 삭제 핸들러 (견적서 상태가 REJECTED일 때만 활성화)
 * @param {function} onChat - 채팅하기 핸들러
 * @param {function} onImgClick - 이미지 클릭 핸들러
 * @param {object} repairData - 수리 데이터 객체
 * @returns
 */
export default function ModalRepairDetail({
  detailModalOpen,
  onClose,
  onDelete,
  onChat,
  onImgClick,
  repairData,
}) {
  const {
    title,
    status,
    location,
    contact,
    repairDate,
    symptomPhotos,
    description,
    costBearer,
    amount,
    estimateDetails,
  } = repairData;

  return (
    <Modal style={{ width: '34%' }} isOpen={detailModalOpen} onClose={onClose}>
      <Container>
        <Column $gap={24}>
          <Column $gap={4} $align="flex-start">
            <Header>
              <Title>{title}</Title>
              <RepairStatusChip status={status} />
            </Header>
            <Address>{location}</Address>
          </Column>

          <InfoTable>
            <InfoRow
              label="수리 일시"
              value={format(new Date(repairDate), 'yyyy. MM. dd / a hh:mm', {
                locale: ko,
              })}
            />
            <InfoRow label="금액" value={`${amount.toLocaleString()}원`} />
            <InfoRow label="비용 부담" value={costBearer} />
            <InfoRow label="전화번호" value={contact} />
            <PhotoSection>
              <Label>증상 사진</Label>
              <PhotoGrid>
                {symptomPhotos.map((photoUrl, index) => (
                  <Thumbnail
                    key={index}
                    src={photoUrl}
                    alt={`증상 사진 ${index + 1}`}
                    onClick={() => onImgClick(index)}
                  />
                ))}
              </PhotoGrid>
            </PhotoSection>
            <InfoWithContent>
              <InfoRow label="증상 설명" />
              <DescriptionBox>{description}</DescriptionBox>
            </InfoWithContent>
            <InfoWithContent>
              <InfoRow label="견적 내용" />
              <DescriptionBox>{estimateDetails}</DescriptionBox>
            </InfoWithContent>
          </InfoTable>

          <Footer>
            {status !== 'REJECTED' && (
              <Button text="채팅하기" onClick={onChat} width={140} dismiss={true}></Button>
            )}
            <Button
              text="닫기"
              onClick={onClose}
              width={140}
              dismiss={status === 'REJECTED'}
            ></Button>
            {status === 'REJECTED' && (
              <Button
                text="견적서 삭제"
                onClick={onDelete}
                width={140}
                rest={{ background: 'rgba(255, 63, 63, 0.70)' }}
              ></Button>
            )}
          </Footer>
        </Column>
      </Container>
    </Modal>
  );
}

const InfoRow = ({ label, value }) => (
  <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </Row>
);

const Container = styled.div`
  min-width: 34%;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 4px;

  width: 100%;
`;

const Title = styled.h2`
  ${typo('h3')};
  color: #000;
`;

const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-bottom: 16px;
`;

const Address = styled.div`
  ${typo('body2')};
  color: #000;
`;

const Label = styled.span`
  ${typo('button2')};
  color: #000;
`;

const Value = styled.span`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  word-break: keep-all;
`;

const PhotoSection = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  align-items: flex-start;
  gap: space-between;
  gap: 10px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`;

const Thumbnail = styled.img`
  height: 80px;
  width: 80px;
  border-radius: 6px;
  cursor: pointer;
`;

const InfoWithContent = styled(Column)`
  width: 100%;
  gap: 4px;
  align-items: flex-start;
`;

const DescriptionBox = styled.div`
  width: 100%;
  background-color: ${color('grayscale.100')};
  border-radius: 6px;
  border: 1px solid ${color('grayscale.200')};
  padding: 13px 15px;
  ${typo('body2')};
  color: black;

  text-align: left;
  word-break: keep-all;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  gap: 6px;
`;
