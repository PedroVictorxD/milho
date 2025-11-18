import { apiClient } from '@/utils/api';
import { DeliveryTruck, DeliveryTruckCreate, DeliveryTruckUpdate } from '@/types';

export const deliveryTruckService = {
  async getById(id: string): Promise<DeliveryTruck> {
    return apiClient.get<DeliveryTruck>(`/api/v1/delivery/trucks/${id}`);
  },

  async create(data: DeliveryTruckCreate): Promise<DeliveryTruck> {
    return apiClient.post<DeliveryTruck>('/api/v1/delivery/trucks/create', data);
  },

  async update(id: string, data: DeliveryTruckUpdate): Promise<DeliveryTruck> {
    return apiClient.put<DeliveryTruck>(`/api/v1/delivery/trucks/update/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/v1/delivery/trucks/delete/${id}`);
  },
};

