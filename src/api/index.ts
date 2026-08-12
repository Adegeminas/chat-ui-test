import { http } from './http';
import { type AuthResponse, type Chat, type LoginPayload, type Message } from '../types';

export const api = {
	login(payload: LoginPayload) {
		return http<AuthResponse>('/login', {
			method: 'POST',
			body: JSON.stringify(payload),
		});
	},

	getChats(page: number, limit: number) {
		return http<Chat[]>(
			`/chats?_page=${page}&_limit=${limit}&_sort=lastMessageAt&_order=desc`,
		);
	},

	getMessages(chatId: number, page: number, limit: number) {
		return http<Message[]>(
			`/messages?chatId=${chatId}&_page=${page}&_limit=${limit}&_sort=createdAt&_order=desc`,
		);
	},

	sendMessage(payload: {
		chatId: number;
		text: string;
		createdAt: string;
		fromMe: boolean;
	}) {
		return http<Message>('/messages', {
			method: 'POST',
			body: JSON.stringify(payload),
		});
	},
};
