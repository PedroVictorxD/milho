'use client';

import { useState, useEffect, useMemo } from 'react';
import { businessService } from '@/services/businessService';
import { Business } from '@/types';
import { BarChart, Calendar, Loader2, TrendingUp, Package, Truck as TruckIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

// Importar Victory dinamicamente para evitar SSR issues
const VictoryBar = dynamic(() => import('victory').then(mod => mod.VictoryBar), { ssr: false });
const VictoryChart = dynamic(() => import('victory').then(mod => mod.VictoryChart), { ssr: false });
const VictoryAxis = dynamic(() => import('victory').then(mod => mod.VictoryAxis), { ssr: false });
const VictoryTooltip = dynamic(() => import('victory').then(mod => mod.VictoryTooltip), { ssr: false });

export default function DashboardScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const data = await businessService.getAll();
      setBusinesses(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar dados das empresas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar dados por data selecionada (se houver data selecionada)
  const filteredBusinesses = useMemo(() => {
    if (!selectedDate) {
      return businesses;
    }

    return businesses.map((business) => {
      const filteredTrucks = business.deliveryTrucks.filter((truck) => {
        if (!truck.createdAt) return true; // Inclui caminhões sem data
        const truckDate = new Date(truck.createdAt).toISOString().split('T')[0];
        return truckDate === selectedDate;
      });

      return {
        ...business,
        deliveryTrucks: filteredTrucks,
      };
    }).filter((business) => business.deliveryTrucks.length > 0);
  }, [businesses, selectedDate]);

  // Preparar dados para o gráfico de sacarias
  const sacariasData = useMemo(() => {
    return filteredBusinesses.map((business) => {
      const totalSacarias = business.deliveryTrucks.reduce(
        (total, truck) => total + truck.quantity,
        0
      );
      return {
        x: business.name.length > 15 ? business.name.substring(0, 15) + '...' : business.name,
        y: totalSacarias,
        label: `${totalSacarias.toLocaleString('pt-BR')} sacas`,
      };
    });
  }, [filteredBusinesses]);

  // Preparar dados para o gráfico de caminhões
  const trucksData = useMemo(() => {
    return filteredBusinesses.map((business) => ({
      x: business.name.length > 15 ? business.name.substring(0, 15) + '...' : business.name,
      y: business.deliveryTrucks.length,
      label: `${business.deliveryTrucks.length} caminhões`,
    }));
  }, [filteredBusinesses]);

  // Calcular estatísticas totais
  const totalStats = useMemo(() => {
    const totalSacarias = filteredBusinesses.reduce(
      (total, business) =>
        total + business.deliveryTrucks.reduce((sum, truck) => sum + truck.quantity, 0),
      0
    );
    const totalTrucks = filteredBusinesses.reduce(
      (total, business) => total + business.deliveryTrucks.length,
      0
    );
    const totalWeight = filteredBusinesses.reduce(
      (total, business) =>
        total + business.deliveryTrucks.reduce((sum, truck) => sum + truck.weight, 0),
      0
    );

    return {
      totalSacarias,
      totalTrucks,
      totalWeight,
      totalBusinesses: filteredBusinesses.length,
    };
  }, [filteredBusinesses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="text-green-700 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <BarChart className="text-green-600" size={24} />
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-green-800">Dashboard</h1>
              </div>
              <p className="text-green-600 text-sm sm:text-base">Visualização de dados e estatísticas</p>
            </div>

            {/* Filtro de Data */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md p-3 border-l-4 border-green-500">
                <Calendar className="text-green-600" size={20} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="Todos os dados"
                />
              </div>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="text-sm text-green-600 hover:text-green-700 underline"
                >
                  Mostrar todos
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total de Empresas */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Empresas Ativas</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {totalStats.totalBusinesses}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Total de Caminhões */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Caminhões</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {totalStats.totalTrucks}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TruckIcon className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          {/* Total de Sacarias */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Sacarias</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {totalStats.totalSacarias.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* Peso Total */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Peso Total (T)</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {totalStats.totalWeight.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        {filteredBusinesses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <BarChart className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-base sm:text-lg">
              Nenhum dado encontrado para a data selecionada
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Tente selecionar outra data ou verifique se há caminhões cadastrados
            </p>
          </div>
        ) : mounted ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Sacarias por Empresa */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Package className="text-green-600" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Sacarias por Empresa</h2>
              </div>
              <div className="w-full overflow-x-auto">
                <VictoryChart
                  domainPadding={{ x: 30 }}
                  height={300}
                  width={500}
                  padding={{ top: 20, bottom: 80, left: 60, right: 40 }}
                >
                  <VictoryAxis
                    style={{
                      tickLabels: {
                        fontSize: 10,
                        angle: -45,
                        textAnchor: 'end',
                        fill: '#4B5563'
                      },
                      axis: { stroke: '#E5E7EB' },
                      grid: { stroke: 'none' },
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      tickLabels: { fontSize: 10, fill: '#4B5563' },
                      axis: { stroke: '#E5E7EB' },
                      grid: { stroke: '#F3F4F6', strokeDasharray: '5,5' },
                    }}
                  />
                  <VictoryBar
                    data={sacariasData}
                    style={{
                      data: {
                        fill: '#10B981',
                        width: 25,
                      },
                    }}
                    labels={({ datum }) => datum.label}
                    labelComponent={
                      <VictoryTooltip
                        flyoutStyle={{ fill: 'white', stroke: '#10B981', strokeWidth: 1 }}
                        style={{ fontSize: 10, fill: '#1F2937' }}
                      />
                    }
                  />
                </VictoryChart>
              </div>
            </div>

            {/* Gráfico de Caminhões por Empresa */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <TruckIcon className="text-purple-600" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Caminhões por Empresa</h2>
              </div>
              <div className="w-full overflow-x-auto">
                <VictoryChart
                  domainPadding={{ x: 30 }}
                  height={300}
                  width={500}
                  padding={{ top: 20, bottom: 80, left: 60, right: 40 }}
                >
                  <VictoryAxis
                    style={{
                      tickLabels: {
                        fontSize: 10,
                        angle: -45,
                        textAnchor: 'end',
                        fill: '#4B5563'
                      },
                      axis: { stroke: '#E5E7EB' },
                      grid: { stroke: 'none' },
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      tickLabels: { fontSize: 10, fill: '#4B5563' },
                      axis: { stroke: '#E5E7EB' },
                      grid: { stroke: '#F3F4F6', strokeDasharray: '5,5' },
                    }}
                  />
                  <VictoryBar
                    data={trucksData}
                    style={{
                      data: {
                        fill: '#8B5CF6',
                        width: 25,
                      },
                    }}
                    labels={({ datum }) => datum.label}
                    labelComponent={
                      <VictoryTooltip
                        flyoutStyle={{ fill: 'white', stroke: '#8B5CF6', strokeWidth: 1 }}
                        style={{ fontSize: 10, fill: '#1F2937' }}
                      />
                    }
                  />
                </VictoryChart>
              </div>
            </div>
          </div>
        ) : null}

        {/* Tabela de Dados Detalhados */}
        {filteredBusinesses.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalhamento por Empresa</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Caminhões
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sacarias
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso Total (T)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBusinesses.map((business) => {
                    const totalSacarias = business.deliveryTrucks.reduce(
                      (sum, truck) => sum + truck.quantity,
                      0
                    );
                    const totalWeight = business.deliveryTrucks.reduce(
                      (sum, truck) => sum + truck.weight,
                      0
                    );
                    return (
                      <tr key={business.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {business.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {business.deliveryTrucks.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {totalSacarias.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {totalWeight.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
