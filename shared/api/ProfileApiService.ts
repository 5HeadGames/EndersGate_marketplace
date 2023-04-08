import { AxiosInstance } from 'axios';
import axiosClient from './AxiosClientConfig';
import { UserType } from 'interfaces/index';
import { UpdatePasswordRequest } from './dto/Profile.dto';

class Service {
	constructor(private client: AxiosInstance) {}
	async getUser(): Promise<UserType> {
		return this.client.get('/users');
	}

	async updatePassword(data: UpdatePasswordRequest): Promise<any> {
		return this.client.post('/profile/update-password', data);
	}
}

export const ProfilApiService = new Service(axiosClient);
