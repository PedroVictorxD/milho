import { apiClient } from '@/utils/api';
import { Business, BusinessCreateDTO, BusinessUpdateDTO } from '@/types';

export const businessService = {
  async getAll(): Promise<Business[]> {
    return apiClient.get<Business[]>('/api/v1/business/all');
  },

  async getById(id: string): Promise<Business> {
    return apiClient.get<Business>(`/api/v1/business/${id}`);
  },

  async create(data: BusinessCreateDTO): Promise<Business> {
    return apiClient.post<Business>('/api/v1/business/create', data);
  },

  async update(id: string, data: BusinessUpdateDTO): Promise<Business> {
    return apiClient.put<Business>(`/api/v1/business/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/v1/business/${id}`);
  },
};

