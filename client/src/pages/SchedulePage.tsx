import { useEffect, useState } from 'react';
import { getUserBookings, getProviderBookings } from '../api/bookings';
import { Booking, User } from '../interfaces';
import { Loader, Button } from '../components';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';

const SchedulePage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [user, setUser] = useState<User | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [providerBookings, setProviderBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const isProvider = localStorage.getItem('isProvider') === 'true';

  useEffect(() => {
    const fetchBookings = async () => {
      const localUser = localStorage.getItem('user');
      if (!localUser) return;

      const parsedUser = JSON.parse(localUser);
      setUser(parsedUser);

      try {
        const [customerData, providerData] = await Promise.all([
          getUserBookings(parsedUser.id),
          isProvider ? getProviderBookings(parsedUser.id) : Promise.resolve([]),
        ]);

        setCustomerBookings(customerData);
        setProviderBookings(providerData);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isProvider]);

  const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const renderDay = (date: Date) => {
    const allBookings = [...customerBookings, ...providerBookings];
    const bookingsForDay = allBookings.filter((b) => isSameDay(new Date(b.bookingDate), date));

    return (
      <div className="border rounded-md p-3 min-h-[300px] bg-white flex flex-col">
        <div className="font-semibold text-center text-sm mb-1">{format(date, 'EEEE')}</div>
        <div className="text-center text-xs text-muted-foreground mb-2">
          {format(date, 'MMM d')}
        </div>
        <div className="flex flex-col gap-2 flex-grow">
          {bookingsForDay.length === 0 && (
            <span className="text-xs text-muted-foreground text-center">No bookings</span>
          )}
          {bookingsForDay.map((b) => {
            const isCustomer = b.customerId === user?.id;
            return (
              <div
                key={b.id}
                className={`text-xs p-2 rounded-md text-white shadow-sm ${
                  isCustomer ? 'bg-blue-500' : 'bg-green-500'
                }`}
              >
                <div className="font-medium">– {b.serviceName}</div>
                <div className="text-[11px]">{b.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Weekly Schedule</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-sm" /> You booked
            <span className="inline-block w-3 h-3 bg-green-500 rounded-sm ml-4" /> Booked you
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>{'<'}</Button>
            <Button onClick={() => setCurrentWeek(new Date())} variant="ghost">
              Today
            </Button>
            <Button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>{'>'}</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day.toISOString()}>{renderDay(day)}</div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
