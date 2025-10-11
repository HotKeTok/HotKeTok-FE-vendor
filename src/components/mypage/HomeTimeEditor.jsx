import styled from 'styled-components';
import { Column, Row } from '../../styles/flex';
import { typo, color } from '../../styles/tokens';
import Switch from '../common/Switch';

export default function HomeTimeEditor({ runningTime, setProfileData, profileData }) {
  const handleToggle = (dayId, isOpen) => {
    const updatedRunningTime = runningTime.map(day =>
      day.id === dayId
        ? {
            ...day,
            isOpen,
            startTime: isOpen ? '09:00' : null,
            endTime: isOpen ? '18:00' : null,
          }
        : day
    );
    setProfileData({ ...profileData, runningTime: updatedRunningTime });
  };

  const handleTimeChange = (dayId, timeType, value) => {
    const updatedRunningTime = runningTime.map(day =>
      day.id === dayId ? { ...day, [timeType]: value } : day
    );
    setProfileData({ ...profileData, runningTime: updatedRunningTime });
  };

  return (
    <TimeEditorContainer>
      {runningTime.map(day => (
        <Row key={day.id} $justify="flex-start" $align="center" style={{ width: '100%' }}>
          <DayLabel>{day.dayName}</DayLabel>
          <Row $justify="space-between" style={{ width: '100%' }}>
            <Row $gap={8} $align="center">
              <Switch checked={day.isOpen} onChange={e => handleToggle(day.id, e.target.checked)} />
              <StatusText $isOpen={day.isOpen}>{day.isOpen ? 'Open' : 'Closed'}</StatusText>
            </Row>
            <TimeInputContainer>
              {day.isOpen ? (
                <>
                  <TimeInput
                    type="text"
                    placeholder="09:00"
                    maxLength="5"
                    value={day.startTime || ''}
                    onChange={e => handleTimeChange(day.id, 'startTime', e.target.value)}
                    $isDefault={day.startTime === '09:00'}
                  />
                  <span>~</span>
                  <TimeInput
                    type="text"
                    placeholder="18:00"
                    maxLength="5"
                    value={day.endTime || ''}
                    onChange={e => handleTimeChange(day.id, 'endTime', e.target.value)}
                    $isDefault={day.endTime === '18:00'}
                  />
                </>
              ) : (
                <div style={{ width: '138px' }} />
              )}
            </TimeInputContainer>
          </Row>
        </Row>
      ))}
    </TimeEditorContainer>
  );
}

const TimeEditorContainer = styled(Column)`
  width: 100%;
  padding-top: 16px;
  gap: 16px;
`;

const DayLabel = styled.span`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  margin-right: 60px;
`;

const StatusText = styled.span`
  ${typo('body2')};
  color: ${props => (props.$isOpen ? color('grayscale.600') : color('grayscale.500'))};
  width: 40px;
`;

const TimeInputContainer = styled(Row)`
  gap: 4px;
  align-items: center;
  ${typo('body2')}
`;

const TimeInput = styled.input`
  width: 70px;
  padding: 13px 15px;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 6px;
  text-align: center;

  color: ${props => (props.$isDefault ? color('grayscale.400') : color('grayscale.900'))};

  &:focus {
    outline: none;
    border-color: ${color('brand.primary')};
  }
`;
