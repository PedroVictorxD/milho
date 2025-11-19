import ReportsScreen from '@/screens/ReportsScreen';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsScreen />
    </ProtectedRoute>
  );
}
