export type UpdatePasswordRequest = {
	password: string;
	newPassword: string;
};

export class ProfileResponse {
	id: number;
	email: string;
	fullname: string;
	lastname: string;
	phoneNumber: string;

	static mapValuesTo(data: any) {
		const obj = new ProfileResponse();

		obj.id = data.id;
		obj.email = data.email;
		obj.fullname = data.fullname;
		obj.phoneNumber = data.phoneNumber;

		return { ...obj };
	}
}
