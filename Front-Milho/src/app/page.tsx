'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import HomeScreen from '@/screens/HomeScreen';

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeScreen />
    </ProtectedRoute>
  );
}

