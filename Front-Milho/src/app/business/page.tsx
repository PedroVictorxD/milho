'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import BusinessScreen from '@/screens/BusinessScreen';

export default function BusinessPage() {
  return (
    <ProtectedRoute>
      <BusinessScreen />
    </ProtectedRoute>
  );
}

