import { useEffect, useState } from 'react';
import { getUserBookings, getProviderBookings, updateBookingStatus } from '../api/bookings';
import { Booking, BookingStatus, User } from '../interfaces';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Loader,
  Modal,
  Badge,
} from '../components';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils';
import { useNavigate } from 'react-router-dom';

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case 'PENDING':
      return <Badge variant="secondary">Pending</Badge>;
    case 'CONFIRMED':
      return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
    case 'COMPLETED':
      return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
    case 'REJECTED':
      return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
    case 'CANCELLED':
      return <Badge className="bg-yellow-100 text-yellow-800">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const MyBookingsPage = () => {
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [providerBookings, setProviderBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    status: BookingStatus;
    message: string;
  } | null>(null);

  const navigate = useNavigate();

  const isProvider = localStorage.getItem('isProvider') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const localUser = localStorage.getItem('user');
        if (!localUser) {
          navigate('/login?redirect=/my-bookings');
          return;
        }

        const parsedUser = JSON.parse(localUser);
        setUser(parsedUser);

        const [customerData, providerData] = await Promise.all([
          getUserBookings(parsedUser.id),
          isProvider ? getProviderBookings(parsedUser.id) : Promise.resolve([]),
        ]);

        setCustomerBookings(customerData);
        setProviderBookings(providerData);
      } catch (err) {
        toast.error(getErrorMessage(err) || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isProvider, navigate]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      toast.success(`Booking ${newStatus}`);
      // Refetch both tabs
      setLoading(true);
      const updatedCustomer = await getUserBookings(user!.id);
      const updatedProvider = isProvider ? await getProviderBookings(user!.id) : [];
      setCustomerBookings(updatedCustomer);
      setProviderBookings(updatedProvider);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const renderActions = (booking: Booking, isProviderView: boolean) => {
    const role = isProviderView ? 'provider' : 'user';

    if (role === 'provider' && booking.status === 'PENDING') {
      return (
        <div className="flex gap-1">
          <Button
            size="sm"
            onClick={() =>
              setConfirmModal({
                id: booking.id,
                status: 'CONFIRMED',
                message: 'Confirm this booking?',
              })
            }
          >
            Confirm
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              setConfirmModal({
                id: booking.id,
                status: 'REJECTED',
                message: 'Reject this booking?',
              })
            }
          >
            Reject
          </Button>
        </div>
      );
    }

    if (role === 'user') {
      if (booking.status === 'PENDING') {
        return (
          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              setConfirmModal({
                id: booking.id,
                status: 'CANCELLED',
                message: 'Cancel your booking?',
              })
            }
          >
            Cancel
          </Button>
        );
      }

      if (booking.status === 'CONFIRMED') {
        return (
          <Button
            size="sm"
            onClick={() =>
              setConfirmModal({
                id: booking.id,
                status: 'COMPLETED',
                message: 'Mark this booking as completed?',
              })
            }
          >
            Mark as Completed
          </Button>
        );
      }
    }

    return <span className="text-muted-foreground text-sm">No actions</span>;
  };

  const renderTable = (bookings: Booking[], isProviderView: boolean) => {
    if (bookings.length === 0) {
      return (
        <p className="text-muted-foreground text-sm">
          No {isProviderView ? 'received' : 'made'} bookings yet.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto mt-4">
        <table className="w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-muted-foreground">
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="text-sm border-t">
                <td className="px-4 py-2">{/* {b.serviceName} */}</td>
                <td className="px-4 py-2">{b.description}</td>
                <td className="px-4 py-2">{new Date(b.bookingDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">${b.price}</td>
                <td className="px-4 py-2">{getStatusBadge(b.status)}</td>
                <td className="px-4 py-2">{renderActions(b, isProviderView)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) <Loader />;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        {isProvider ? (
          <Tabs defaultValue="customer">
            <TabsList>
              <TabsTrigger value="customer">Customer Bookings</TabsTrigger>
              <TabsTrigger value="provider">Provider Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="customer">{renderTable(customerBookings, false)}</TabsContent>
            <TabsContent value="provider">{renderTable(providerBookings, true)}</TabsContent>
          </Tabs>
        ) : (
          renderTable(customerBookings, false)
        )}
      </div>

      {confirmModal && (
        <Modal open={!!confirmModal} onClose={() => setConfirmModal(null)} title="Confirm Action">
          <p className="text-sm text-muted-foreground mb-6">{confirmModal.message}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmModal(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                handleStatusChange(confirmModal.id, confirmModal.status);
                setConfirmModal(null);
              }}
            >
              Yes, Continue
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MyBookingsPage;
