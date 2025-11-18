import { apiClient } from '@/utils/api';
import { User, UserCreateDTO, UserUpdateDTO } from '@/types';

export const userService = {
  async getMe(): Promise<User> {
    return apiClient.get<User>('/api/v1/users/me');
  },

  async updateMe(data: UserUpdateDTO): Promise<User> {
    return apiClient.put<User>('/api/v1/users/me', data);
  },

  async deleteMe(): Promise<void> {
    return apiClient.delete<void>('/api/v1/users/me');
  },

  async create(data: UserCreateDTO): Promise<User> {
    return apiClient.post<User>('/api/v1/users', data);
  },
};

