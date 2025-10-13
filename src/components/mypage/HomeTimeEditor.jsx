import styled, { css } from 'styled-components';
import { Column, Row } from '../../styles/flex';
import { typo, color } from '../../styles/tokens';
import { daysOfWeek } from '../../constants/Date';

export default function HomeTimeEditor({ runningTime, setProfileData, profileData, initialData }) {
  const handleTimeChange = (e, timeType, value) => {
    const updatedRunningTime = {
      ...runningTime,
      [timeType]: value,
    };
    setProfileData({ ...profileData, runningTime: updatedRunningTime });
  };

  const handleDayToggle = (e, day) => {
    const { working_day_of_week } = profileData.runningTime;
    let updatedDays;
    if (working_day_of_week.includes(day)) {
      updatedDays = working_day_of_week.filter(d => d !== day);
    } else {
      updatedDays = [...working_day_of_week, day];
    }
    const updatedRunningTime = {
      ...runningTime,
      working_day_of_week: updatedDays,
    };
    setProfileData({ ...profileData, runningTime: updatedRunningTime });
  };

  const { openingTime, closingTime, working_day_of_week } = profileData.runningTime;

  return (
    <TimeEditorContainer>
      <Row $justify="flex-start" align="center" $gap={10} style={{ width: '100%' }}>
        <TimeInput
          type="text"
          placeholder="09:00"
          maxLength="5"
          value={openingTime || ''}
          onChange={e => handleTimeChange(e, 'openingTime', e.target.value)}
          $isDefault={openingTime == initialData.openingTime}
        />
        <Row $justify="center" $align="center">
          ~
        </Row>
        <TimeInput
          type="text"
          placeholder="18:00"
          maxLength="5"
          value={closingTime || ''}
          onChange={e => handleTimeChange(e, 'closingTime', e.target.value)}
          $isDefault={closingTime == initialData.closingTime}
        />
      </Row>
      <Column $gap={14} $justify="flex-start" $align="flex-start" style={{ width: '100%' }}>
        <Label>영업 요일을 선택해주세요</Label>
        <DayGrid>
          {daysOfWeek.map((day, index) => {
            const isOpen = working_day_of_week.includes(day);
            return (
              <DayButton
                key={index}
                type="button"
                $isOpen={isOpen}
                onClick={e => handleDayToggle(e, day)}
              >
                {day}
              </DayButton>
            );
          })}
        </DayGrid>
      </Column>
    </TimeEditorContainer>
  );
}

const TimeEditorContainer = styled(Column)`
  width: 100%;
  padding-top: 8px;
  gap: 30px;
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

const Label = styled.label`
  ${typo('body2')};
  color: ${color('grayscale.400')};
`;

const DayGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

const DayButton = styled.button`
  width: 100%;
  padding-top: 6px;
  padding-bottom: 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  ${typo('button2')}

  border: 1px solid transparent;
  border-radius: 6px;

  ${props =>
    props.$isOpen
      ? css`
          background-color: ${color('brand.primary')};
          color: white;
        `
      : css`
          background-color: white;
          color: ${color('brand.primary')};
          border-color: ${color('brand.primary')};
        `};
`;
