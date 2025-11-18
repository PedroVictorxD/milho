'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import BusinessTrucksScreen from '@/screens/BusinessTrucksScreen';
import { useParams } from 'next/navigation';

export default function BusinessTrucksPage() {
  const params = useParams();
  const businessId = params.id as string;

  return (
    <ProtectedRoute>
      <BusinessTrucksScreen businessId={businessId} />
    </ProtectedRoute>
  );
}

