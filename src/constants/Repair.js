import { color } from '../styles/tokens';

// 수리 상태 상수 및 매핑
export const REPAIR_STATUS = {
  CHOOSING: 'CHOOSING', // 매칭 대기 중
  REJECTED: 'REJECTED', // 보냄 > 거절
  MATCHING: 'MATCHING', // 진행 중
  COMPLETED: 'COMPLETED', // 처리 완료
};

export const PROGRESS_STATUS_MAP = {
  CHOOSING: {
    ko: '매칭 대기중',
    description: '수리 요청자가 견적서를 확인하고 수락하길 기다리는 중이에요.',
    textColor: color('grayscale.600'),
  },
  REJECTED: {
    ko: '매칭 실패',
    description: '아쉽지만, 수리 요청자가 다른 업체의 견적을 선택했어요.',
    textColor: '#FF3F3F',
  },
  MATCHING: {
    ko: '진행 중',
    description: '견적이 수락됐어요! 이제 수리 진행을 준비해 주세요.',
    textColor: color('brand.primary'),
  },
  COMPLETED: {
    ko: '처리 완료',
    description: '요청하신 수리가 잘 마무리됐어요.',
    textColor: color('grayscale.600'),
  },
};
