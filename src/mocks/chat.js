export const DUMMY_CHAT_ROOMS = {
  data: [
    {
      roomId: 1,
      lastMessageContent: '발신 테스트',
      lastMessageTime: '2025-10-09T12:27:50.757481',
      unreadCount: 1,
      participants: [
        {
          userId: 101,
          userName: '김개발',
          profileImageUrl: 'https://picsum.photos/200',
          senderType: 'HOUSE_USER',
          joinedAt: '2025-09-23T02:27:42.744024',
        },
        {
          userId: 102,
          userName: '박디자인',
          profileImageUrl: 'https://picsum.photos/200',
          senderType: 'HOUSE_USER',
          joinedAt: '2025-09-23T02:27:42.747750',
        },
      ],
    },
    {
      roomId: 2,
      lastMessageContent: '네 그럼 다음 주에 뵙겠습니다!',
      lastMessageTime: '2025-09-24T18:05:11.234567',
      unreadCount: 3,
      participants: [
        {
          userId: 101,
          userName: '김개발',
          profileImageUrl: 'https://picsum.photos/200',
          senderType: 'HOUSE_USER',
          joinedAt: '2025-09-24T10:15:00.123456',
        },
        {
          userId: 103,
          userName: '이마케터',
          profileImageUrl: null,
          senderType: 'HOUSE_USER',
          joinedAt: '2025-09-24T10:15:00.567890',
        },
      ],
    },
    {
      roomId: 3,
      lastMessageContent: '아직 메시지가 없습니다.',
      lastMessageTime: '2025-09-25T09:00:00.000000',
      unreadCount: 0,
      participants: [
        {
          userId: 102,
          userName: '박디자인',
          profileImageUrl: 'https://picsum.photos/200',
          senderType: 'HOUSE_USER',
          joinedAt: '2025-09-25T09:00:00.000000',
        },
        {
          userId: 103,
          userName: '이마케터',
          profileImageUrl: null,
          senderType: 'HOUSE_USER',
          joinedAt: '2025-09-25T09:00:00.000000',
        },
      ],
    },
  ],
};

export const DUMMY_CHATS = {
  1: {
    // roomId: 1
    data: [
      {
        messageId: 2,
        roomId: 1,
        senderId: 101,
        content: '첫 문장 테스트',
        createdAt: '2025-09-23T12:26:41.550112',
      },
      {
        messageId: 3,
        roomId: 1,
        senderId: 102,
        content: '발신 테스트',
        createdAt: '2025-09-23T12:27:50.757481',
      },
      {
        messageId: 2,
        roomId: 1,
        senderId: 101,
        content: '첫 문장 테스트',
        createdAt: '2025-09-30T12:26:41.550112',
      },
      {
        messageId: 3,
        roomId: 1,
        senderId: 102,
        content: '발신 테스트',
        createdAt: '2025-09-30T12:27:50.757481',
      },
    ],
  },
  2: {
    // roomId: 2
    data: [
      {
        messageId: 4,
        roomId: 2,
        senderId: 101,
        content: '안녕하세요, 프로젝트 관련해서 논의드릴 게 있습니다.',
        createdAt: '2025-09-24T17:50:30.111222',
      },
      {
        messageId: 5,
        roomId: 2,
        senderId: 103,
        content: '네, 안녕하세요! 어떤 내용일까요?',
        createdAt: '2025-09-24T17:51:15.333444',
      },
      {
        messageId: 6,
        roomId: 2,
        senderId: 101,
        content: '이번 마케팅 페이지 시안 관련해서요. 혹시 다음 주에 시간 괜찮으신가요?',
        createdAt: '2025-10-09T18:02:00.555666',
      },
      {
        messageId: 7,
        roomId: 2,
        senderId: 103,
        content: '네 좋습니다. 그럼 다음 주에 뵙겠습니다!',
        createdAt: '2025-10-09T18:05:11.234567',
      },
    ],
  },
  3: {
    // roomId: 3
    data: [],
  },
};
