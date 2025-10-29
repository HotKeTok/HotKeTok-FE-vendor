import { formatYMDWithKoreanTime } from './date';

export const parseEstimateDataForModal = apiData => {
  if (!apiData) {
    return {
      symptomPhotos: [],
      amount: 0,
      decisionLater: false,
      estimateDetails: '',
      description: '',
    };
  }

  const repairData = {
    id: apiData.estimateId,
    roomId: apiData.roomId,
    title: apiData.category,
    location: apiData.address,
    contact: apiData.phoneNumber,
    costBearer: apiData.payerName,

    estimateDetails: apiData.estimateComment,

    status: apiData.status,
    amount: apiData.estimatePrice, // (모달에서 0원을 '상담 후'로 처리)

    datetimeStr: formatYMDWithKoreanTime(apiData.estimateTime), // "2025.10.27 / 오전 11:47"
    repairDate: null, // datetimeStr을 사용하므로 이 값은 무시됨

    symptomPhotos: apiData.requestImage || [], // (항상 빈 배열을 보장)
    description: apiData.requestDescription || '', // '증상 설명'은 API에 없으므로 빈 값

    decisionLater: !!apiData.estimatePrice,
  };

  return repairData;
};
