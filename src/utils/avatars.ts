import avatar1 from '../assets/avatars/1.svg';
import avatar2 from '../assets/avatars/2.svg';
import avatar3 from '../assets/avatars/3.svg';
import avatar4 from '../assets/avatars/4.svg';
import avatar5 from '../assets/avatars/5.svg';

const map = [avatar1, avatar2, avatar3, avatar4, avatar5];

export const getAvatar = (key: number): string => {
	return map[key - 1] ?? avatar1;
};
