import { UserType } from 'interfaces';

export class VerifyValuesRequest {
	email: string;
	identification: string;
	phone: string;

	static mapValuesTo(data: any) {
		const obj = new VerifyValuesRequest();
		obj.email = data.email;
		obj.identification = data.identification;
		obj.phone = data.phone;
		return obj;
	}
}

export type VerifyValues = {
	valid: boolean;
	messages: string[];
};

export class VerifyValuesResponse {
	email: VerifyValues;
	identification: VerifyValues;
	phone: VerifyValues;

	static mapValuesTo(data: any) {
		const obj = new VerifyValuesResponse();
		obj.email = data.email;
		obj.identification = data.identification;
		obj.phone = data.phone;
		return obj;
	}
}

export class UserRegisterRequest {
	email: string;
	name: string;
	lastname: string;
	identification: string;
	identificationType: string;
	phone: string;
	password: string;

	static mapValuesTo(data: any) {
		const obj = new UserRegisterRequest();
		obj.email = data.email;
		obj.identification = data.cedula;
		obj.identificationType = data.documentIdentity;
		obj.name = data.name;
		obj.lastname = data.lastName;
		obj.phone = data.phoneNumber;
		obj.password = data.password;
		return obj;
	}
}

export interface AuthSession {
	accessToken: string;
	user: UserType;
}

export interface LoginRequest {
	username: string;
	password: string;
}
