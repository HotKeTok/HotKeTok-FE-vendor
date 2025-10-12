// src/components/common/OptionsMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import MenuIcn from '../../assets/common/icon-menu.svg?react';
import { color, typo } from '../../styles/tokens';

/**
 * @function OptionsMenu
 * @description 메뉴 아이콘(기본: MenuIcn, 또는 props.icon으로 받은 이미지)을 클릭하면 옵션 리스트 표시
 *
 * @param {object[]} options - 옵션 배열 [{ label, onClick }]
 * @param {string} [icon] - 대체 아이콘 이미지 경로(src). 전달 안하면 기본 MenuIcn 사용.
 * @param {number} [iconSize=16.5] - 아이콘 렌더링 크기(px)
 */
export default function OptionsMenu({ options = [], icon, iconSize }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // ✅ 기본 크기 설정 (props 없을 경우 16.5)
  const finalSize = iconSize ?? 16.5;

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = () => setIsOpen(prev => !prev);

  const handleItemClick = onClick => {
    onClick?.();
    setIsOpen(false);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <IconWrapper onClick={handleMenuClick} aria-label="옵션 메뉴 열기" role="button">
        {icon ? (
          <IconImg src={icon} alt="menu" $size={finalSize} />
        ) : (
          <MenuIcn width={finalSize} height={finalSize} />
        )}
      </IconWrapper>

      {isOpen && (
        <MenuContainer>
          {options.map((option, index) => (
            <MenuItem key={index} onClick={() => handleItemClick(option.onClick)}>
              {option.label}
            </MenuItem>
          ))}
        </MenuContainer>
      )}
    </Wrapper>
  );
}

/* ================================
 * Styled-components
 * ================================ */

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconImg = styled.img`
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 30%;
  background-color: ${color('grayscale.100')};
  border-radius: 10px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
`;

const MenuItem = styled.div`
  padding: 16px 22px;
  cursor: pointer;
  white-space: nowrap;
  ${typo('body2')};
  color: ${color('grayscale.800')};

  &:hover {
    background-color: ${color('grayscale.200')};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${color('grayscale.300')};
  }
`;
