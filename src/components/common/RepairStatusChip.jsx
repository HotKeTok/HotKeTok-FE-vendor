import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { PROGRESS_STATUS_MAP } from '../../constants/Repair';
import { typo, color } from '../../styles/tokens';
import InfoIcn from '../../assets/common/icon-info.svg?react';

const tooltipRoot = document.getElementById('tooltip-root');

export default function RepairStatusChip({ status }) {
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const chipRef = useRef(null);
  const statusInfo = PROGRESS_STATUS_MAP[status] || {};

  const handleMouseEnter = () => {
    if (!chipRef.current) return;
    const rect = chipRef.current.getBoundingClientRect();
    setCoords({
      top: rect.top - window.scrollY,
      left: rect.left + rect.width / 2,
    });
    setIsHovered(true);
  };

  return (
    <ChipWrapper
      ref={chipRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Chip $textColor={statusInfo.textColor}>
        {statusInfo.ko}
        <span>
          <StyledInfoIcn $textColor={statusInfo.textColor} />
        </span>
      </Chip>

      {isHovered &&
        ReactDOM.createPortal(
          <Tooltip style={{ top: coords.top, left: coords.left }}>
            {statusInfo.description}
            <TooltipArrow />
          </Tooltip>,
          tooltipRoot
        )}
    </ChipWrapper>
  );
}

const ChipWrapper = styled.div`
  display: inline-block;
`;

const Tooltip = styled.div`
  position: fixed;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);

  transform: translate(-50%, -100%);
  margin-top: -4px;

  background-color: ${color('grayscale.900')};
  color: ${color('grayscale.600')};
  padding: 8px 12px;
  border-radius: 6px;
  ${typo('caption2')};
  white-space: nowrap;
  z-index: 20000;
`;

const TooltipArrow = styled.div`
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid white;
`;

const Chip = styled.div`
  color: ${({ $textColor }) => $textColor};
  border-radius: 12px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 3px;
  ${typo('body2')};
`;

const StyledInfoIcn = styled(InfoIcn)`
  width: 16px;
  height: 16px;
  path {
    stroke: ${({ $textColor }) => $textColor};
  }
  circle {
    fill: ${({ $textColor }) => $textColor};
  }
`;
