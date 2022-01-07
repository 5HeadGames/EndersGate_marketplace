export type UserType = {
	data?: any;
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	avatar: any;
};

export type UserRegisterRequest = {
	email: string;
	name: string;
	lastName: string;
	identification: string;
	identificationType: string;
};

export type UserDataResponse = {
	id: number;
	email: string;
	name: string;
	lastname: string;
	identification: string;
	identificationType: string;
};

export type VerifyValues = {
	email: string;
	identification: string;
};

export type OptionType = {
	text: string;
	value: string;
	disabled: boolean;
	placeholder: boolean;
};

export interface AuthSession {
	accessToken?: string;
	user?: UserType;
}

export interface cardPropsInvestment {
	property: {
		id: number;
		name: string;
		location: string;
		description: string;
		raised: string;
		total_raised: string;
		minimun: string;
		targeted: string;
		days: string;
	};
}
export interface cardPropsProperty {
	property: {
		id: number;
		name: string;
		location: string;
		description: string;
		raised: string;
		total_raised: string;
		minimun: string;
		targeted: string;
		days: string;
	};
}
export type UserCreate = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};
export type RecoverPassword = {
	email: string;
};

export type ForgotPassword = {
	confirmPass: string;
	newPass: string;
};
