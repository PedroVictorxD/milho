'use client';

import { useState, useEffect, useCallback } from 'react';
import { deliveryTruckService } from '@/services/deliveryTruckService';
import { businessService } from '@/services/businessService';
import { DeliveryTruck, DeliveryTruckCreate, Business, DeliveryTruckUpdate } from '@/types';
import { Truck, Plus, X, Trash2, Hash, Weight, Package, Loader2, ArrowLeft, Building2, Edit2, Save } from 'lucide-react';
import Link from 'next/link';

interface BusinessTrucksScreenProps {
  businessId: string;
}

export default function BusinessTrucksScreen({ businessId }: BusinessTrucksScreenProps) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [trucks, setTrucks] = useState<DeliveryTruck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DeliveryTruckCreate>({
    businessId: businessId,
    trackSign: '',
    truckName: '',
    weight: 0,
  });
  const [editFormData, setEditFormData] = useState<DeliveryTruckUpdate>({
    businessId: businessId,
    trackSign: '',
    truckName: '',
    weight: 0,
  });

  const loadBusiness = useCallback(async () => {
    try {
      setLoading(true);
      const data = await businessService.getById(businessId);
      setBusiness(data);
      setTrucks(data.deliveryTrucks);
      setError('');
    } catch (err) {
      setError('Erro ao carregar dados da empresa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    loadBusiness();
  }, [loadBusiness]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deliveryTruckService.create(formData);
      setShowForm(false);
      setFormData({ businessId: businessId, trackSign: '', truckName: '', weight: 0 });
      loadBusiness();
    } catch (err) {
      setError('Erro ao criar caminhão');
      console.error(err);
    }
  };

  const handleEdit = (truck: DeliveryTruck) => {
    setEditFormData({
      businessId: businessId,
      trackSign: truck.trackSign,
      truckName: truck.truckName,
      weight: truck.weight,
    });
    setEditingId(truck.id);
    setShowForm(false);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ businessId: businessId, trackSign: '', truckName: '', weight: 0 });
  };

  const handleUpdate = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      await deliveryTruckService.update(id, editFormData);
      setEditingId(null);
      setEditFormData({ businessId: businessId, trackSign: '', truckName: '', weight: 0 });
      loadBusiness();
    } catch (err) {
      setError('Erro ao atualizar caminhão');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este caminhão?')) {
      return;
    }
    try {
      await deliveryTruckService.delete(id);
      loadBusiness();
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

  if (!business) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            <p>Empresa não encontrada</p>
            <Link href="/business" className="text-green-600 hover:text-green-700 underline mt-2 inline-block">
              Voltar para empresas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/business"
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft size={20} />
            <span>Voltar para empresas</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <Building2 className="text-green-600" size={24} />
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-green-800">{business.name}</h1>
              </div>
              <p className="text-green-600 text-sm sm:text-base">Caminhões de entrega</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto ${
                showForm
                  ? 'bg-red-500 hover:bg-red-600 hover:scale-105 text-white'
                  : 'bg-green-600 hover:bg-green-700 hover:scale-105 text-white'
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
                  <span className="hidden sm:inline">Novo Caminhão</span>
                  <span className="sm:hidden">Novo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <X size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-green-500"
          >
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="bg-green-100 p-2 rounded-full">
                <Truck className="text-green-600" size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Novo Caminhão</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                  Nome do Motorista *
                </label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.truckName}
                    onChange={(e) => setFormData({ ...formData, truckName: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="Nome do Motorista"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidades(T) *
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) || 0 })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="0"
                  />
                </div>
                {formData.weight > 0 && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      <strong>Quantidade de sacas:</strong>{' '}
                      {Math.floor((formData.weight * 1000) / 60).toLocaleString('pt-BR')}{' '}
                      sacas
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 hover:scale-105 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <Plus size={20} />
              <span>Criar Caminhão</span>
            </button>
          </form>
        )}

        {/* Trucks List */}
        {trucks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <Truck className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-base sm:text-lg">Nenhum caminhão cadastrado para esta empresa</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trucks.map((truck) => (
              <div
                key={truck.id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-200"
              >
                {editingId === truck.id ? (
                  <form onSubmit={(e) => handleUpdate(e, truck.id)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Placa *</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={editFormData.trackSign}
                          onChange={(e) => setEditFormData({ ...editFormData, trackSign: e.target.value })}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Motorista *</label>
                      <div className="relative">
                        <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={editFormData.truckName}
                          onChange={(e) => setEditFormData({ ...editFormData, truckName: e.target.value })}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantidades(T) *</label>
                      <div className="relative">
                        <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          value={editFormData.weight || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, weight: Number(e.target.value) || 0 })}
                          required
                          min="0"
                          step="0.01"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        />
                      </div>
                      {editFormData.weight > 0 && (
                        <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-700">
                            <strong>Quantidade de sacas:</strong>{' '}
                            {Math.floor((editFormData.weight * 1000) / 60).toLocaleString('pt-BR')}{' '}
                            sacas
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 hover:scale-105 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex-1"
                      >
                        <Save size={18} />
                        <span>Salvar</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 hover:scale-105 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                          <Truck className="text-green-600" size={24} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{truck.truckName}</h3>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(truck)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                          title="Editar caminhão"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(truck.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                          title="Excluir caminhão"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Hash size={18} className="text-green-600 flex-shrink-0" />
                        <span className="text-sm"><strong>Placa:</strong> {truck.trackSign}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Weight size={18} className="text-green-600 flex-shrink-0" />
                        <span className="text-sm"><strong>Peso:</strong> {truck.weight.toLocaleString('pt-BR')} Toneladas</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Package size={18} className="text-green-600 flex-shrink-0" />
                        <span className="text-sm"><strong>Quantidade:</strong> {truck.quantity}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

