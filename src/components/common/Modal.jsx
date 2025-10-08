import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

// modal-root가 없을 때도 동작하도록 보강
const modalRoot =
  document.getElementById('modal-root') ||
  (() => {
    const el = document.createElement('div');
    el.id = 'modal-root';
    document.body.appendChild(el);
    return el;
  })();

/**
 * @description 모달 기본 컴포넌트
 * @param {boolean} isOpen - 모달 열림 여부
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {ReactNode} children - 모달 내부에 렌더링할 컴포넌트
 * @param {object} style - 추가 스타일링을 위한 객체
 * @param {string} justify - 모달 수평 정렬 (기본값: 'center')
 * @param {string} align - 모달 수직 정렬 (기본값: 'center')
 * @param {number} padding - 모달 내부 패딩 (기본값: 24)
 * @returns {JSX.Element|null}
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  style,
  justify = 'center',
  align = 'center',
  padding = 24,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose} justify={justify} align={align}>
      <ModalContainer onClick={e => e.stopPropagation()} style={{ padding, ...style }}>
        {children}
      </ModalContainer>
    </ModalOverlay>,
    modalRoot
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
  z-index: 10000;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10001;

  width: auto;
`;
