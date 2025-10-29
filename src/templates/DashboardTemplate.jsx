import { useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import RepairStatusBox from '../components/dashboard/RepairStatusBox';
import Calendar from '../components/dashboard/Calendar';
import BoxRepairDetailForDashboard from '../components/dashboard/BoxRepairDetailForDashboard';
import { Column, Row } from '../styles/flex';
import Modal from '../components/common/Modal';
import ModalRepairDetail from '../components/total-repair/ModalRepairDetail';
import ModalImageSlider from '../components/common/ModalImageSlider';
import { useNavigate } from 'react-router-dom';
import { isToday, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import NoDataIcn from '../assets/common/icon-no-content.svg?react';
import { parseEstimateDataForModal } from '../utils/repair';
import { apiFetchVendorEstimateDetail } from '../api/vendor-service';

export default function DashboardTemplate({
  repairCounts,
  currentDate,
  selectedDate,
  selectedDateRepairs,
  calendarData,
  setCurrentDate,
  setSelectedDate,
}) {
  const navigate = useNavigate();
  const [clickedRepairId, setClickedRepairId] = useState(null); // 클릭된 수리 ID
  const [detailModalOpen, setDetailModalOpen] = useState(false); // 수리 상세 모달

  // [추가] API로 가져온 모달 상세 데이터와 로딩 상태
  const [modalData, setModalData] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // 클릭된 이미지 인덱스
  const [selectedImageModalOpen, setSelectedImageModalOpen] = useState(false); // 이미지 모달

  // [수정] onDetailModalOpen 함수를 async로 변경하고 API 호출 로직 추가
  const onDetailModalOpen = async id => {
    setClickedRepairId(id);
    setDetailModalOpen(true);
    setIsModalLoading(true);
    setModalData(null); // 이전 데이터 초기화

    try {
      const response = await apiFetchVendorEstimateDetail(id);
      if (response.success) {
        setModalData(response.result); // API 응답 결과(raw data)를 state에 저장
      } else {
        console.error('견적서 상세 조회 실패:', response.message);
        setDetailModalOpen(false); // 실패 시 모달 닫기
      }
    } catch (error) {
      console.error('견적서 상세 조회 중 오류:', error);
      setDetailModalOpen(false); // 오류 시 모달 닫기
    } finally {
      setIsModalLoading(false);
    }
  };

  const onImageModalOpen = index => {
    setSelectedImageIndex(index);
    setSelectedImageModalOpen(true);
  };

  const onChatRoute = id => {
    navigate(`/chat`); // todo : id 기반 채팅방으로 이동
  };

  // [수정] API로 가져온 modalData를 파싱
  // (isModalLoading이 true이고 modalData가 null일 때, parseEstimateDataForModal이 기본 객체를 반환해줌)
  const parsedModalData = parseEstimateDataForModal(modalData);

  return (
    <Container>
      {detailModalOpen && (
        <ModalRepairDetail
          detailModalOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onChat={() => onChatRoute(clickedRepairId)}
          onImgClick={index => onImageModalOpen(index)}
          repairData={parsedModalData} // API로 가져와 파싱된 데이터
        />
      )}
      {selectedImageModalOpen && selectedImageIndex !== null && (
        <ModalImageSlider
          title="증상 사진"
          isOpen={selectedImageModalOpen && selectedImageIndex !== null}
          onClose={() => setSelectedImageModalOpen(false)}
          // [수정] 이미지 슬라이더도 API로 가져온 modalData의 symptomPhotos를 사용
          imageUrls={parsedModalData?.symptomPhotos || []}
          startIndex={selectedImageIndex}
        />
      )}
      <div>
        {/* 수리 현황 */}
        <Subtitle1>수리 현황</Subtitle1>
        <GridContainer>
          {Object.entries(repairCounts).map(([status, count]) => (
            <RepairStatusBox key={status} status={status} count={count} />
          ))}
        </GridContainer>
        <Calendar
          calendarData={calendarData}
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateChange={setCurrentDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      <RightContainer>
        <Column $gap={2}>
          <H3>
            {isToday(selectedDate) ? '오늘' : format(selectedDate, 'M/d(E)', { locale: ko })}의 일정
          </H3>
          <Caption1>총 {selectedDateRepairs.length}개의 일정이 있어요.</Caption1>
        </Column>
        {selectedDateRepairs.length > 0 ? (
          <RightScrollContainer>
            {selectedDateRepairs.map((repair, index) => (
              <BoxRepairDetailForDashboard
                key={index}
                repair={repair}
                // [수정] 클릭 시 API를 호출하는 onDetailModalOpen 함수 연결
                onDetailClick={() => onDetailModalOpen(repair.estimateId)}
              />
            ))}
          </RightScrollContainer>
        ) : (
          <Column $gap={10} $justify="center" $align="center " style={{ flex: 1 }}>
            <NoDataIcn width={24} height={24} />
            <Body1>진행 중인 수리건이 없어요</Body1>
          </Column>
        )}
      </RightContainer>
    </Container>
  );
}
const Container = styled.div`
  height: 100%;

  padding-bottom: 18px;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: 32fr 23fr;
  column-gap: 16px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;

  margin-top: 10px;
  margin-bottom: 16px;
`;

const RightContainer = styled.div`
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 10px;

  overflow: hidden;
`;

const RightScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Subtitle1 = styled.div`
  ${typo('subtitle1')};
  color: black;
`;

const H3 = styled.div`
  ${typo('h3')};
  color: black;

  flex-shrink: 0;
`;

const Caption1 = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;

const Body1 = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.300')};
`;
