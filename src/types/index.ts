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
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastMassageAt: string;
}

export type Message = {
  id: number | string; // стринги для ошибок отправки
  chatId: number;
  text: string;
  createdAt: string;
  fromMe: boolean;
  failed?: boolean;
}