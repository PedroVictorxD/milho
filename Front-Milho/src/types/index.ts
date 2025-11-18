// User Types
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface UserUpdateDTO {
  name: string;
  username: string;
  email: string;
  password: string;
}

// Authentication Types
export interface AuthenticationInput {
  email: string;
  password: string;
  remember: boolean;
}

export interface AuthenticationResponse extends User {
  token: string;
}

// Delivery Truck Types
export interface DeliveryTruck {
  id: string;
  trackSign: string;
  truckName: string;
  weight: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryTruckCreate {
  businessId: string;
  trackSign: string;
  truckName: string;
  weight: number;
}

export interface DeliveryTruckUpdate {
  businessId: string;
  trackSign: string;
  truckName: string;
  weight: number;
}

// Business Types
export interface Business {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  deliveryTrucks: DeliveryTruck[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessCreateDTO {
  name: string;
  cnpj?: string;
  phone?: string;
}

export interface BusinessUpdateDTO {
  name: string;
  cnpj: string;
  phone: string;
}

