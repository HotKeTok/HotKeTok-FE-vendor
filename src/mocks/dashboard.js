export const DASHBOARD_DUMMY_DATA = {
  repairCounts: {
    new: 0,
    inProgress: 1,
    completed: 2,
  },

  calendarData: [
    {
      date: '2025-10-02',
      repairs: [
        {
          id: 1,
          type: '보일러/난방',
        },
        {
          id: 2,
          type: '보일러/난방',
        },
      ],
    },
    {
      date: '2025-10-06',
      repairs: [
        {
          id: 1,
          type: '문/창문',
        },
        {
          id: 2,
          type: '문/창문',
        },
      ],
    },
    {
      date: '2025-10-07',
      repairs: [
        {
          id: 1,
          type: '화장실',
        },
        {
          id: 2,
          type: '화장실',
        },
        {
          id: 3,
          type: '화장실',
        },
      ],
    },
    {
      date: '2025-10-08',
      repairs: [
        {
          id: 1,
          type: '기타',
        },
        {
          id: 2,
          type: '기타',
        },
        {
          id: 3,
          type: '기타',
        },
      ],
    },
    {
      date: '2025-10-09',
      repairs: [
        {
          id: 1,
          type: '보일러/난방',
        },
        {
          id: 2,
          type: '보일러/난방',
        },
      ],
    },
    {
      date: '2025-10-13',
      repairs: [
        {
          id: 1,
          type: '문/창문',
        },
        {
          id: 2,
          type: '문/창문',
        },
      ],
    },
    {
      date: '2025-10-14',
      repairs: [
        {
          id: 1,
          type: '화장실',
        },
        {
          id: 2,
          type: '화장실',
        },
        {
          id: 3,
          type: '화장실',
        },
      ],
    },
    {
      date: '2025-10-16',
      repairs: [
        {
          id: 1,
          type: '기타',
        },
        {
          id: 2,
          type: '기타',
        },
      ],
    },
    {
      date: '2025-10-20',
      repairs: [
        {
          id: 1,
          type: '보일러/난방',
        },
        {
          id: 2,
          type: '보일러/난방',
        },
      ],
    },
    {
      date: '2025-10-21',
      repairs: [
        {
          id: 1,
          type: '문/창문',
        },
        {
          id: 2,
          type: '문/창문',
        },
        {
          id: 3,
          type: '문/창문',
        },
      ],
    },
    {
      date: '2025-10-23',
      repairs: [
        {
          id: 1,
          type: '화장실',
        },
        {
          id: 2,
          type: '화장실',
        },
      ],
    },
    {
      date: '2025-10-27',
      repairs: [
        {
          id: 1,
          type: '기타',
        },
        {
          id: 2,
          type: '기타',
        },
      ],
    },
    {
      date: '2025-10-28',
      repairs: [
        {
          id: 1,
          type: '보일러/난방',
        },
        {
          id: 2,
          type: '보일러/난방',
        },
        {
          id: 3,
          type: '보일러/난방',
        },
      ],
    },
    {
      date: '2025-10-30',
      repairs: [
        {
          id: 1,
          type: '문/창문',
        },
        {
          id: 2,
          type: '문/창문',
        },
      ],
    },
  ],

  selectedDateRepairs: [
    {
      id: 1021,
      status: 'MATCHING', // 처리 상태
      title: '보일러/난방 수리', // 수리 이름
      location: '행복 빌라 201호', // 수리 위치
      repairDate: '2025-10-05T20:45:37.828842', // 수리 날짜
      amount: 150000, // 금액
      costBearer: '임대인', // 비용 부담자
      contact: '010-1234-5678', // 전화번호
      description: '보일러 온수가 나오지 않습니다. 빠른 확인 부탁드립니다.', // 내용
      estimateDetails: '견적 내용 예시입니다. 견적 내용 예시입니다.', // 견적 내용
      symptomPhotos: [
        // 증상 사진 URL 배열
        'https://picsum.photos/200',
        'https://picsum.photos/200',
        'https://picsum.photos/200',
        'https://picsum.photos/200',
        'https://picsum.photos/200',
        'https://picsum.photos/200',
      ],
    },
    {
      id: 1021,
      status: 'CHOOSING',
      title: '보일러/난방 수리',
      location: '행복 빌라 201호',
      repairDate: '2025-10-05T20:45:37.828842',
      amount: 150000,
      costBearer: '임대인', // 비용 부담자
      contact: '010-1234-5678',
      description: '보일러 온수가 나오지 않습니다. 빠른 확인 부탁드립니다.',
      estimateDetails: '견적 내용 예시입니다. 견적 내용 예시입니다.',
      symptomPhotos: [
        // 증상 사진 URL 배열
        'https://picsum.photos/200',
        'https://picsum.photos/200',
        'https://picsum.photos/200',
        'https://picsum.photos/200',
        'https://picsum.photos/200',
        'https://picsum.photos/200',
      ],
    },
    {
      id: 1022,
      status: 'COMPLETED',
      title: '문/창문 수리',
      location: '능곡 캐슬 스테이 304호',
      repairDate: '2025-10-05T20:45:37.828842',
      amount: 230000,
      costBearer: '입주민',
      contact: '010-0000-0000',
      description: '현관문 디지털 도어락이 작동하지 않습니다. 교체가 필요해 보입니다.',
      estimateDetails: '견적 내용 예시입니다. 견적 내용 예시입니다.',
      symptomPhotos: ['https://picsum.photos/200'],
    },
  ],
};
