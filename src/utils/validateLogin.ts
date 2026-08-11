export type LoginFormValues = {
	login: string;
	password: string;
};

export type LoginFormErrors = {
	login: string;
	password: string;
};

export const validateLogin = (form: LoginFormValues): LoginFormErrors => {
	const errors: LoginFormErrors = {
		login: '',
		password: '',
	};

	if (!form.login.trim()) {
		errors.login = 'Введите логин';
	}

	if (!form.password) {
		errors.password = 'Введите пароль';
	}

	return errors;
};

export const isLoginValid = (errors: LoginFormErrors) => {
	return !errors.login && !errors.password;
};
