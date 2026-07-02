import Link from 'next/link';
import { getUserEvents } from '@/lib/events/actions';
import EventCard from '@/components/events/EventCard';
import { redirect } from 'next/navigation';
import MyEventsClient from './MyEventsClient';

export const dynamic = 'force-dynamic';

export default async function MyEventsPage() {
  const result = await getUserEvents();

  if (!result.success) {
    if (result.error === 'Not authenticated') {
      redirect('/auth/signin');
    }
  }

  const events = result.data || [];

  return <MyEventsClient events={events} />;
}
