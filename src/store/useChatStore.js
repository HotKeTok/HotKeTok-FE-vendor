import { getChatroomList, getChatroomDetail } from '../api/chatting-service';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { create } from 'zustand';
import { getAccessToken } from '../utils/auth';

// 채팅 및 웹소켓 전역 관리
const useChatStore = create((set, get) => ({
  // STOMP 클라이언트 인스턴스
  stompClient: null,
  isConnected: false,

  // 채팅 관련 상태
  chatRooms: [], // 채팅방 상태
  currentRoomId: null, // 현재 입장한 채팅방 ID
  messages: [], // 현재 채팅방의 메시지 목록
  participants: [], // 현재 채팅방 참여자 목록
  subscription: null, // STOMP 구독 객체

  connect: () => {
    if (get().isConnected || get().stompClient) {
      console.log('이미 웹소켓에 연결되어 있거나 연결 시도 중입니다.');
      return;
    }

    if (import.meta.env.DEV && window.stompClient) {
      console.warn('HMR: 기존 STOMP 클라이언트를 재사용합니다.');
      set({ stompClient: window.stompClient, isConnected: window.stompClient.connected });
      return;
    }

    const url = import.meta.env.VITE_API_BASE_URL_GENERAL;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${url}/ws-stomp`),

      beforeConnect: () => {
        const token = getAccessToken();
        if (token) {
          client.connectHeaders = {
            Authorization: `Bearer ${token}`,
          };
        } else {
          console.error('STOMP: 연결 토큰이 없습니다.');
        }
      },

      debug: str => console.log(new Date(), str),
      reconnectDelay: 10000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log('STOMP 연결 성공!');
        set({ isConnected: true });
      },
      onStompError: frame => {
        console.error('STOMP 오류:', frame.headers['message']);
      },
    });

    client.activate();
    set({ stompClient: client });

    if (import.meta.env.DEV) {
      window.stompClient = client;
    }
  },

  // 웹소켓 연결 해제
  disconnect: () => {
    const client = get().stompClient;
    if (client) {
      client.deactivate();
      console.log('STOMP 연결이 해제되었습니다.');

      // ✅ [적용] HMR용 전역 객체 정리
      if (import.meta.env.DEV) {
        window.stompClient = null;
      }

      set({
        stompClient: null,
        isConnected: false,
        subscription: null,
        currentRoomId: null,
        messages: [],
      });
    }
  },

  // 채팅방 목록 가져오기
  fetchChatRooms: async () => {
    // ✅ accessToken 인자 제거
    const token = getAccessToken();
    if (!token) return;

    const { success, data } = await getChatroomList(token);
    if (success) {
      set({ chatRooms: data });
    }
  },

  enterChatRoom: async roomId => {
    const accessToken = getAccessToken();

    const client = get().stompClient;
    if (!client || !get().isConnected) {
      console.error('STOMP 클라이언트가 연결되지 않았습니다.');
      return;
    }

    get().subscription?.unsubscribe(); // 이전 구독 해제
    set({ currentRoomId: roomId, messages: [] });

    const { success, data } = await getChatroomDetail(accessToken, roomId);
    if (success) {
      set({ messages: data.messages, participants: data.participants });
    }

    const newSubscription = client.subscribe(`/topic/chat/room/${roomId}`, message => {
      const newMessage = JSON.parse(message.body);
      set(state => ({ messages: [...state.messages, newMessage] }));
    });
    set({ subscription: newSubscription });
  },

  // 채팅방 나가기 (상태 초기화)
  leaveChatRoom: () => {
    get().subscription?.unsubscribe();
    set({ currentRoomId: null, messages: [], subscription: null });
  },

  sendMessage: payload => {
    const client = get().stompClient;
    console.log('sendMessage payload:', payload);

    if (client && get().isConnected) {
      client.publish({
        destination: '/pub/chat/message',
        body: JSON.stringify(payload),
      });
    } else {
      console.error('STOMP 클라이언트가 연결되지 않아 메시지를 보낼 수 없습니다.');
    }
  },

  setUnreadCount: (roomId, count) => {
    set(state => ({
      chatRooms: state.chatRooms.map(room =>
        room.roomId === roomId ? { ...room, unreadCount: count } : room
      ),
    }));
  },
}));

export default useChatStore;
