'use client';

import { useState, useEffect, useMemo } from 'react';
import { businessService } from '@/services/businessService';
import { Business } from '@/types';
import {
  FileText,
  Download,
  Filter,
  X,
  Loader2,
  CheckSquare,
  Square,
  FileDown,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import PDFReport from '@/components/PDFReport';
import { formatAbbreviatedNumber } from '@/utils/formatters';


const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface ReportFilters {
  businessName: string;
  dateFrom: string;
  dateTo: string;
  showCNPJ: boolean;
  showPhone: boolean;
  showPlate: boolean;
  showDriver: boolean;
  showWeight: boolean;
  showQuantity: boolean;
}

export default function ReportsScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [reportType, setReportType] = useState<'complete' | 'filtered'>('complete');

  const [filters, setFilters] = useState<ReportFilters>({
    businessName: '',
    dateFrom: '',
    dateTo: '',
    showCNPJ: true,
    showPhone: true,
    showPlate: true,
    showDriver: true,
    showWeight: true,
    showQuantity: true,
  });

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
    
  }, []);

 
  const filteredBusinesses = useMemo(() => {
    if (reportType === 'complete') {
      return businesses;
    }

    return businesses
      .filter((business) => {
       
        if (filters.businessName && !business.name.toLowerCase().includes(filters.businessName.toLowerCase())) {
          return false;
        }
        return true;
      })
      .map((business) => {
        const filteredTrucks = business.deliveryTrucks.filter((truck) => {
          
          if (filters.dateFrom || filters.dateTo) {
            if (!truck.createdAt) return false;
            const truckDate = new Date(truck.createdAt);
            if (filters.dateFrom && truckDate < new Date(filters.dateFrom)) return false;
            if (filters.dateTo && truckDate > new Date(filters.dateTo)) return false;
          }

          return true;
        });

        return {
          ...business,
          deliveryTrucks: filteredTrucks,
        };
      })
      .filter((business) => business.deliveryTrucks.length > 0);
  }, [businesses, filters, reportType]);

 
  const stats = useMemo(() => {
    const totalBusinesses = filteredBusinesses.length;
    const totalTrucks = filteredBusinesses.reduce((sum, b) => sum + b.deliveryTrucks.length, 0);
    const totalWeight = filteredBusinesses.reduce(
      (sum, b) => sum + b.deliveryTrucks.reduce((s, t) => s + t.weight, 0),
      0
    );
    const totalQuantity = filteredBusinesses.reduce(
      (sum, b) => sum + b.deliveryTrucks.reduce((s, t) => s + t.quantity, 0),
      0
    );

    return { totalBusinesses, totalTrucks, totalWeight, totalQuantity };
  }, [filteredBusinesses]);

  const handleClearFilters = () => {
    setFilters({
      businessName: '',
      dateFrom: '',
      dateTo: '',
      showCNPJ: true,
      showPhone: true,
      showPlate: true,
      showDriver: true,
      showWeight: true,
      showQuantity: true,
    });
    setReportType('complete');
  };

  const toggleField = (field: keyof ReportFilters) => {
    setFilters((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="text-green-700 font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-green-100 p-2 rounded-full">
              <FileText className="text-green-600" size={24} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-green-800">Relatórios</h1>
          </div>
          <p className="text-green-600 text-sm sm:text-base">
            Gere relatórios completos ou personalizados em PDF
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <X size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Tipo de Relatório */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <FileDown size={20} className="text-green-600" />
            <span>Tipo de Relatório</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setReportType('complete')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg ${
                reportType === 'complete'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">Relatório Completo</h3>
                  <p className="text-sm text-gray-600 mt-1">Todos os dados cadastrados</p>
                </div>
                {reportType === 'complete' && (
                  <CheckSquare className="text-green-600" size={24} />
                )}
              </div>
            </button>

            <button
              onClick={() => setReportType('filtered')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg ${
                reportType === 'filtered'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">Relatório Filtrado</h3>
                  <p className="text-sm text-gray-600 mt-1">Personalize os dados</p>
                </div>
                {reportType === 'filtered' && (
                  <CheckSquare className="text-green-600" size={24} />
                )}
              </div>
            </button>
          </div>
        </div>

        {reportType === 'filtered' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <Filter size={20} className="text-blue-600" />
                <span>Filtros</span>
              </h2>
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-700 hover:scale-105 flex items-center space-x-1 transition-all duration-200"
              >
                <X size={16} />
                <span>Limpar Filtros</span>
              </button>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <select
                  value={filters.businessName}
                  onChange={(e) => setFilters({ ...filters, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="">Todas as empresas</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.name}>
                      {business.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>

            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Campos para Exibir</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { key: 'showCNPJ', label: 'CNPJ' },
                  { key: 'showPhone', label: 'Telefone' },
                  { key: 'showPlate', label: 'Placa' },
                  { key: 'showDriver', label: 'Motorista' },
                  { key: 'showWeight', label: 'Peso' },
                  { key: 'showQuantity', label: 'Sacarias' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleField(key as keyof ReportFilters)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      filters[key as keyof ReportFilters]
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-600 hover:border-green-400'
                    }`}
                  >
                    {filters[key as keyof ReportFilters] ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200 cursor-default">
            <p className="text-gray-600 text-sm font-medium">Empresas</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBusinesses}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-200 cursor-default">
            <p className="text-gray-600 text-sm font-medium">Caminhões</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalTrucks}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-200 cursor-default">
            <p className="text-gray-600 text-sm font-medium">Sacarias</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalQuantity.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-200 cursor-default">
            <p className="text-gray-600 text-sm font-medium">Peso Total (T)</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {formatAbbreviatedNumber(stats.totalWeight)}
            </p>
          </div>
        </div>

        
        {filteredBusinesses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gerar Relatório PDF</h2>
            <p className="text-gray-600 mb-4">
              {reportType === 'complete'
                ? 'Este relatório incluirá todos os dados cadastrados no sistema.'
                : `Este relatório incluirá ${stats.totalBusinesses} empresa(s) com ${stats.totalTrucks} caminhão(ões) baseado nos filtros aplicados.`}
            </p>
            {mounted && (
              <PDFDownloadLink
                document={
                  <PDFReport
                    businesses={filteredBusinesses}
                    filters={reportType === 'filtered' ? filters : undefined}
                    reportType={reportType}
                  />
                }
                fileName={`relatorio-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 hover:scale-105 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {({ loading: pdfLoading }) =>
                  pdfLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Gerando PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      <span>Baixar Relatório PDF</span>
                    </>
                  )
                }
              </PDFDownloadLink>
            )}
            {!mounted && (
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-400 text-white rounded-lg font-medium">
                <Loader2 className="animate-spin" size={20} />
                <span>Carregando gerador de PDF...</span>
              </div>
            )}
          </div>
        )}

        {filteredBusinesses.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-base sm:text-lg">
              Nenhum dado encontrado com os filtros aplicados
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Ajuste os filtros ou selecione o relatório completo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
