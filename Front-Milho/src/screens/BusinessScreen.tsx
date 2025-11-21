'use client';

import { useState, useEffect } from 'react';
import { businessService } from '@/services/businessService';
import { Business, BusinessCreateDTO } from '@/types';
import { Building2, Plus, X, Trash2, Phone, FileText, Truck, Loader2, Eye, Edit2, Save, Package } from 'lucide-react';
import Link from 'next/link';
import { BusinessUpdateDTO } from '@/types';
import { formatCNPJ, formatPhone, unformatCNPJ, unformatPhone } from '@/utils/formatters';

export default function BusinessScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BusinessCreateDTO>({
    name: '',
    cnpj: '',
    phone: '',
  });
  const [editFormData, setEditFormData] = useState<BusinessUpdateDTO>({
    name: '',
    cnpj: '',
    phone: '',
  });

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const data = await businessService.getAll();
      setBusinesses(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar empresas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Remove formatação antes de enviar
      const dataToSend = {
        ...formData,
        cnpj: unformatCNPJ(formData.cnpj || ''),
        phone: unformatPhone(formData.phone || ''),
      };
      await businessService.create(dataToSend);
      setShowForm(false);
      setFormData({ name: '', cnpj: '', phone: '' });
      loadBusinesses();
    } catch (err) {
      setError('Erro ao criar empresa');
      console.error(err);
    }
  };

  const handleEdit = (business: Business) => {
    setEditFormData({
      name: business.name,
      cnpj: formatCNPJ(business.cnpj || ''),
      phone: formatPhone(business.phone || ''),
    });
    setEditingId(business.id);
    setShowForm(false);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ name: '', cnpj: '', phone: '' });
  };

  const handleUpdate = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
     
      const dataToSend = {
        ...editFormData,
        cnpj: unformatCNPJ(editFormData.cnpj || ''),
        phone: unformatPhone(editFormData.phone || ''),
      };
      await businessService.update(id, dataToSend);
      setEditingId(null);
      setEditFormData({ name: '', cnpj: '', phone: '' });
      loadBusinesses();
    } catch (err) {
      setError('Erro ao atualizar empresa');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) {
      return;
    }
    try {
      await businessService.delete(id);
      loadBusinesses();
    } catch (err) {
      setError('Erro ao excluir empresa');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="text-green-700 font-medium">Carregando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-green-800 mb-2">Empresas</h1>
            <p className="text-green-600 text-sm sm:text-base">Gerencie suas empresas cadastradas</p>
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
                <span>Nova Empresa</span>
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
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-green-500"
          >
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="bg-green-100 p-2 rounded-full">
                <Building2 className="text-green-600" size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Nova Empresa</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ
                </label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 hover:scale-105 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <Plus size={20} />
              <span>Criar Empresa</span>
            </button>
          </form>
        )}

        {businesses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-base sm:text-lg">Nenhuma empresa cadastrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-200"
              >
                {editingId === business.id ? (
                  <form onSubmit={(e) => handleUpdate(e, business.id)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ *</label>
                      <input
                        type="text"
                        value={editFormData.cnpj}
                        onChange={(e) => setEditFormData({ ...editFormData, cnpj: formatCNPJ(e.target.value) })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                      <input
                        type="text"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: formatPhone(e.target.value) })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                      />
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
                          <Building2 className="text-green-600" size={24} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate uppercase">{business.name}</h3>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(business)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                          title="Editar empresa"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(business.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                          title="Excluir empresa"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {business.cnpj && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FileText size={18} className="text-green-600 flex-shrink-0" />
                          <span className="text-sm truncate uppercase"><strong>CNPJ:</strong> {business.cnpj}</span>
                        </div>
                      )}
                      {business.phone && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone size={18} className="text-green-600 flex-shrink-0" />
                          <span className="text-sm truncate uppercase"><strong>Telefone:</strong> {business.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Truck size={18} className="text-green-600 flex-shrink-0" />
                        <span className="text-sm uppercase"><strong>Caminhões:</strong> {business.deliveryTrucks.length}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Package size={18} className="text-green-600 flex-shrink-0" />
                        <span className="text-sm uppercase">
                          <strong>Sacarias Total:</strong>{' '}
                          {business.deliveryTrucks.reduce((total, truck) => total + truck.quantity, 0).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/business/${business.id}`}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-green-600 hover:bg-green-700 hover:scale-105 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                    >
                      <Eye size={18} />
                      <span>Ver Caminhões</span>
                    </Link>
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
