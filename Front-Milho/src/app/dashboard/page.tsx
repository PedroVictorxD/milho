import DashboardScreen from '@/screens/DashboardScreen';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardScreen />
    </ProtectedRoute>
  );
}
