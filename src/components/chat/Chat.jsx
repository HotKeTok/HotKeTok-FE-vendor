import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import ProfileDefaultIcon from '../../assets/common/icon-profile-default.svg?react';
import { Row } from '../../styles/flex';
import { toKoreanTime } from '../../utils/date';
import { useNavigate } from 'react-router-dom';

const formatTime = dateString => {
  const date = parseISO(dateString);
  return format(date, 'a h:mm', { locale: ko });
};

export default function Chat({ message, isMine, senderInfo }) {
  const navigate = useNavigate();
  const [isEstimateSelected, parsedData] = useMemo(() => {
    try {
      const data = JSON.parse(message.content);
      if (data && data.type === 'ESTIMATE_SELECTED') {
        return [true, data];
      }
    } catch (e) {
      // Not JSON
    }
    return [false, null];
  }, [message.content]);

  const handleDetailClick = () => {
    if (parsedData) {
      // 상세페이지가 따로 없으므로
      navigate(`/total-repair`);
    }
  };

  return (
    <MessageContainer isMine={isMine}>
      <ContentContainer isMine={isMine}>
        {!isMine && (
          <Row $gap={8} style={{ marginBottom: 2 }}>
            <ProfileImageWrapper>
              {senderInfo.profileImageUrl ? (
                <img src={senderInfo.profileImageUrl} alt="profile" />
              ) : (
                <ProfileDefaultIcon />
              )}
            </ProfileImageWrapper>
            <SenderName>{senderInfo.userName}</SenderName>
          </Row>
        )}
        <BubbleWrapper>
          {isMine && <Timestamp>{formatTime(toKoreanTime(message.createdAt))}</Timestamp>}
          <MessageBubble isMine={isMine} $isEstimate={isEstimateSelected}>
            {isEstimateSelected ? (
              <EstimateView>
                <EstimateContent>
                  <EstimateTitle>사장님의 견적서를 선택했어요!</EstimateTitle>
                  <ImageGrid>
                    {(parsedData.imageUrls || []).map((url, index) => (
                      <EstimateImage key={index} src={url} alt={`estimate-${index}`} />
                    ))}
                  </ImageGrid>
                </EstimateContent>
                <DetailButton isMine={isMine} onClick={handleDetailClick}>
                  자세히 보기
                </DetailButton>
              </EstimateView>
            ) : (
              message.content
            )}
          </MessageBubble>
          {!isMine && <Timestamp>{formatTime(toKoreanTime(message.createdAt))}</Timestamp>}
        </BubbleWrapper>
      </ContentContainer>
    </MessageContainer>
  );
}

const MessageContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  flex-direction: ${props => (props.isMine ? 'row-reverse' : 'row')};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isMine ? 'flex-end' : 'flex-start')};
  max-width: 70%;
`;

const ProfileImageWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;

  img,
  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SenderName = styled.div`
  ${typo('button2')};
  color: ${color('grayscale.800')};
`;

const BubbleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  flex-direction: ${props => (props.isMine ? 'row-reverse' : 'row')};
`;

const MessageBubble = styled.div`
  padding: ${props => (props.$isEstimate ? '0' : '12px 18px')};
  border-radius: 20px;
  ${typo('body2')};
  white-space: pre-wrap;
  word-break: break-all;
  overflow: hidden;

  ${props =>
    props.isMine
      ? css`
          background-color: ${color('brand.primary')};
          color: #fff;
          border-bottom-right-radius: 0px;
        `
      : css`
          background-color: #fff;
          color: ${color('grayscale.900')};
          box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
          border-bottom-left-radius: 0px;
        `}
`;

const Timestamp = styled.span`
  ${typo('caption2')};
  color: ${color('grayscale.400')};
  white-space: nowrap;
`;

const EstimateView = styled.div`
  padding: 18px 18px 12px 18px;
  display: flex;
  flex-direction: column;
`;

const EstimateContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EstimateTitle = styled.span`
  ${typo('subtitle2')};
  color: inherit;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const EstimateImage = styled.img`
  width: 100%;
  max-width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  background-color: ${color('grayscale.200')};
`;

const DetailButton = styled.button`
  width: 200px;
  padding: 14px;
  margin: 5px;
  text-align: center;
  ${typo('button2')};
  cursor: pointer;
  border-radius: 10px;

  ${props =>
    props.isMine
      ? css`
          background-color: rgba(255, 255, 255, 0.2);
          color: #fff;
        `
      : css`
          background-color: ${color('grayscale.200')};
          color: ${color('grayscale.900')};
        `}
`;
