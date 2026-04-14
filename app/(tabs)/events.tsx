import { useAuthRole } from '@/hooks/queries/useAuth';
import { UserEventsScreen } from '@/components/features/events/UserEventsScreen';
import { NgoEventsScreen } from '@/components/features/events/NgoEventsScreen';

export default function EventsTab() {
  const { isNgo } = useAuthRole();

  return isNgo ? <NgoEventsScreen /> : <UserEventsScreen />;
}
