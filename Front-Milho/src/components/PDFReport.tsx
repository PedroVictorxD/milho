import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Business } from '@/types';


const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 12,
    borderBottom: 2,
    borderBottomColor: '#10B981',
    paddingBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 6,
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 3,
  },
  businessCard: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderLeft: 3,
    borderLeftColor: '#10B981',
  },
  businessName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
    fontSize: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 8,
  },
  table: {
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    color: 'white',
    padding: 6,
    fontWeight: 'bold',
    fontSize: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8,
    color: 'white',
  },
  tableHeaderCellSmall: {
    flex: 0.9,
    fontSize: 8,
    color: 'white',
  },
  tableHeaderCellLarge: {
    flex: 1.4,
    fontSize: 8,
    color: 'white',
  },
  tableHeaderCellNumber: {
    flex: 1,
    fontSize: 8,
    color: 'white',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
    padding: 6,
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
  },
  tableCellSmall: {
    flex: 0.9,
    fontSize: 8,
  },
  tableCellLarge: {
    flex: 1.4,
    fontSize: 8,
  },
  tableCellNumber: {
    flex: 1,
    fontSize: 8,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  summaryBox: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    marginTop: 6,
    borderRadius: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 9,
  },
  summaryLabel: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  summaryValue: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 9,
  },
});

interface PDFReportProps {
  businesses: Business[];
  filters?: {
    businessName?: string;
    dateFrom?: string;
    dateTo?: string;
    showCNPJ?: boolean;
    showPhone?: boolean;
    showPlate?: boolean;
    showDriver?: boolean;
    showWeight?: boolean;
    showQuantity?: boolean;
  };
  reportType: 'complete' | 'filtered';
}

const PDFReport: React.FC<PDFReportProps> = ({ businesses, filters, reportType }) => {
  const now = new Date();
  const currentDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;

  
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };


  const totalBusinesses = businesses.length;
  const totalTrucks = businesses.reduce((sum, b) => sum + b.deliveryTrucks.length, 0);
  const totalWeight = businesses.reduce(
    (sum, b) => sum + b.deliveryTrucks.reduce((s, t) => s + t.weight, 0),
    0
  );
  const totalQuantity = businesses.reduce(
    (sum, b) => sum + b.deliveryTrucks.reduce((s, t) => s + t.quantity, 0),
    0
  );

  return (
    <Document>
      {businesses.map((business, index) => (
        <Page key={business.id} size="A4" style={styles.page}>

          <View style={styles.header}>
            <Text style={styles.title}>
              Relatório de {reportType === 'complete' ? 'Dados Completos' : 'Dados Filtrados'}
            </Text>
            <Text style={styles.subtitle}>Sistema de Gerenciamento de Milho</Text>
            <Text style={styles.subtitle}>Gerado em: {currentDate}</Text>
          </View>


          {reportType === 'filtered' && filters && index === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Filtros Aplicados</Text>
              <View style={{ fontSize: 8 }}>
                {filters.businessName && (
                  <Text>• Empresa: {filters.businessName}</Text>
                )}
                {filters.dateFrom && (
                  <Text>• Data de: {new Date(filters.dateFrom).toLocaleDateString('pt-BR')}</Text>
                )}
                {filters.dateTo && (
                  <Text>• Data até: {new Date(filters.dateTo).toLocaleDateString('pt-BR')}</Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalhamento da Empresa</Text>
            <View style={styles.businessCard}>
              <Text style={styles.businessName}>{business.name}</Text>

              {(!filters || filters.showCNPJ !== false) && business.cnpj && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>CNPJ:</Text>
                  <Text>{business.cnpj}</Text>
                </View>
              )}

              {(!filters || filters.showPhone !== false) && business.phone && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Telefone:</Text>
                  <Text>{business.phone}</Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.label}>Total de Caminhões:</Text>
                <Text>{business.deliveryTrucks.length}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Total de Sacarias:</Text>
                <Text>
                  {formatNumber(business.deliveryTrucks.reduce((sum, t) => sum + t.quantity, 0))}
                </Text>
              </View>

              {business.deliveryTrucks.length > 0 && (
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    {(!filters || filters.showDriver !== false) && (
                      <Text style={styles.tableHeaderCellLarge}>Motorista</Text>
                    )}
                    {(!filters || filters.showPlate !== false) && (
                      <Text style={styles.tableHeaderCell}>Placa</Text>
                    )}
                    {(!filters || filters.showWeight !== false) && (
                      <Text style={styles.tableHeaderCellNumber}>Peso (T)</Text>
                    )}
                    {(!filters || filters.showQuantity !== false) && (
                      <Text style={styles.tableHeaderCellNumber}>Sacarias</Text>
                    )}
                  </View>
                  {business.deliveryTrucks.map((truck) => (
                    <View key={truck.id} style={styles.tableRow}>
                      {(!filters || filters.showDriver !== false) && (
                        <Text style={styles.tableCellLarge}>{truck.truckName}</Text>
                      )}
                      {(!filters || filters.showPlate !== false) && (
                        <Text style={styles.tableCell}>{truck.trackSign}</Text>
                      )}
                      {(!filters || filters.showWeight !== false) && (
                        <Text style={styles.tableCellNumber}>{truck.weight.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                      )}
                      {(!filters || filters.showQuantity !== false) && (
                        <Text style={styles.tableCellNumber}>{formatNumber(truck.quantity)}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Text>Sistema de Gerenciamento de Milho - Relatório gerado automaticamente</Text>
            <Text>Página {index + 1} de {businesses.length}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PDFReport;
