import React from 'react';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import IcnClose from '../../assets/common/icon-close.svg?react';
import Button from './Button';
import Modal from './Modal';
import { Column } from '../../styles/flex';

/**
 * 공통 확인 모달 컴포넌트
 * @param {object} props
 * @param {boolean} props.isOpen - 모달의 표시 여부
 * @param {string} props.title - 모달 제목
 * @param {string} props.description - 모달 설명
 * @param {function} props.onClose - 취소/닫기 버튼 클릭 핸들러
 * @param {function} props.onConfirm - 확인 버튼 클릭 핸들러
 * @param {string} [props.cancelText='아니요'] - 취소 버튼 텍스트
 * @param {string} [props.confirmText='확인'] - 확인 버튼 텍스트
 */
export default function ModalConfirm({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  cancelText = '아니오',
  confirmText = '확인',
}) {
  if (!isOpen) {
    return null;
  }

  const modalStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '300px',
    maxWidth: '500px',
    borderRadius: '12px',
    padding: '14px',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} style={modalStyle}>
      <CloseIcon onClick={onClose} aria-label="Close modal" />
      <Column style={{ marginBottom: 26 }}>
        <ModalTitle>{title}</ModalTitle>
        <ModalDesc>{description}</ModalDesc>
      </Column>

      <ButtonRow>
        <Button active={true} dismiss={true} text={cancelText} onClick={onClose} />
        <Button text={confirmText} onClick={onConfirm} />
      </ButtonRow>
    </Modal>
  );
}

const CloseIcon = styled(IcnClose)`
  width: 100%;
  align-self: flex-end;

  width: 12px;
  height: 12px;
  margin-top: 4px;
  margin-left: 4px;
  cursor: pointer;

  path {
    stroke: ${color('grayscale.500')};
  }
`;

const ModalTitle = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
  margin-top: 10px;
`;

const ModalDesc = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
  white-space: pre-wrap;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 6px;
  width: 100%;
`;
