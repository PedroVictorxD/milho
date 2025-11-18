'use client';

import { useState, useEffect } from 'react';
import { deliveryTruckService } from '@/services/deliveryTruckService';
import { businessService } from '@/services/businessService';
import { DeliveryTruck, DeliveryTruckCreate, Business } from '@/types';
import { Truck, Plus, X, Trash2, Building2, Hash, Weight, Package, Loader2 } from 'lucide-react';

export default function DeliveryTruckScreen() {
  const [trucks, setTrucks] = useState<DeliveryTruck[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<DeliveryTruckCreate>({
    businessId: '',
    trackSign: '',
    truckName: '',
    weight: 0,
  });

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const data = await businessService.getAll();
      setBusinesses(data);
      // Carrega todos os caminhões de todas as empresas
      const allTrucks: DeliveryTruck[] = [];
      for (const business of data) {
        allTrucks.push(...business.deliveryTrucks);
      }
      setTrucks(allTrucks);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deliveryTruckService.create(formData);
      setShowForm(false);
      setFormData({ businessId: '', trackSign: '', truckName: '', weight: 0 });
      loadBusinesses();
    } catch (err) {
      setError('Erro ao criar caminhão');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este caminhão?')) {
      return;
    }
    try {
      await deliveryTruckService.delete(id);
      loadBusinesses();
    } catch (err) {
      setError('Erro ao excluir caminhão');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="text-green-700 font-medium">Carregando caminhões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-800 mb-2">Caminhões de Entrega</h1>
            <p className="text-green-600">Gerencie a frota de caminhões</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              showForm
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {showForm ? (
              <>
                <X size={20} />
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <Plus size={20} />
                <span>Novo Caminhão</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <X size={20} />
            <span>{error}</span>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-500"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-2 rounded-full">
                <Truck className="text-green-600" size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Novo Caminhão</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={formData.businessId}
                    onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  >
                    <option value="">Selecione uma empresa</option>
                    {businesses.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placa *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.trackSign}
                    onChange={(e) => setFormData({ ...formData, trackSign: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="ABC-1234"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Caminhão *
                </label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.truckName}
                    onChange={(e) => setFormData({ ...formData, truckName: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="Nome do caminhão"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) *
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              <span>Criar Caminhão</span>
            </button>
          </form>
        )}

        {trucks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Truck className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-lg">Nenhum caminhão cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trucks.map((truck) => (
              <div
                key={truck.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Truck className="text-green-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{truck.truckName}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(truck.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir caminhão"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Hash size={18} className="text-green-600" />
                    <span className="text-sm"><strong>Placa:</strong> {truck.trackSign}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Weight size={18} className="text-green-600" />
                    <span className="text-sm"><strong>Peso:</strong> {truck.weight.toLocaleString('pt-BR')} kg</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Package size={18} className="text-green-600" />
                    <span className="text-sm"><strong>Quantidade:</strong> {truck.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
