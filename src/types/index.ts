export type AuthResponse = {
  token: string;
};

export type LoginPayload = {
  login: string;
  password: string;
};

export type Chat = {
  id: number;
  name: string;
  avatar: number; // 1 .. 5
  online: boolean;
  lastMessage: string;
  lastMessageAt: string;
};

export type Message = {
  id: number | string; // стринги для ошибок отправки
  chatId: number;
  text: string;
  createdAt: string;
  fromMe: boolean;
  failed?: boolean;
};
