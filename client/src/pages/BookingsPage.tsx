// SAME IMPORTS AS BEFORE
import { useEffect, useState } from 'react';
import {
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
  sendQuote,
  payForBooking as createPayment,
} from '../api/bookings';
import { getUserById } from '../api/users';
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
  Input,
} from '../components';
import { createReview, getReviewByBookingAndAuthor } from '../api/reviews';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils';
import { Link, useNavigate } from 'react-router-dom';

interface BookingWithClient extends Booking {
  client?: User;
}
const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case 'PENDING':
      return <Badge variant="secondary">Pending</Badge>;
    case 'CONFIRMED':
      return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
    case 'COMPLETED':
      return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
    case 'QUOTED':
      return <Badge className="bg-indigo-100 text-indigo-800">Quoted</Badge>;
    case 'PAID':
      return <Badge className="bg-purple-100 text-purple-800">Paid</Badge>;
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
  const [providerBookings, setProviderBookings] = useState<BookingWithClient[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    status: BookingStatus;
    message: string;
  } | null>(null);
  const [quoteModal, setQuoteModal] = useState<{ id: string; price: string }>({
    id: '',
    price: '',
  });
  const [paymentModal, setPaymentModal] = useState<{ id: string; price: number }>({
    id: '',
    price: 0,
  });
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [reviewModal, setReviewModal] = useState<{
    booking: Booking;
    content: string;
    rating: number;
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
        const enrichedProviderBookings = await Promise.all(
          providerData.map(async (booking: Booking) => {
            try {
              const client = await getUserById(booking.customerId);

              return { ...booking, client };
            } catch {
              return booking;
            }
          })
        );
        setProviderBookings(enrichedProviderBookings);
        console.log('Provider bookings:', enrichedProviderBookings);
        const allBookings = [...customerData, ...providerData];
        const reviewKeys = await Promise.all(
          allBookings.map((b) =>
            getReviewByBookingAndAuthor(b.id, parsedUser.id)
              .then(() => `${b.id}_${parsedUser.id}`)
              .catch(() => null)
          )
        );
        const reviewedSet = new Set<string>(
          reviewKeys.filter((key): key is string => key !== null)
        );
        console.log('Reviewed IDs:', reviewedSet);
        setReviewedIds(reviewedSet);
      } catch (err) {
        toast.error(getErrorMessage(err) || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isProvider, navigate]);

  const refreshBookings = async () => {
    setLoading(true);
    const updatedCustomer = await getUserBookings(user!.id);
    const updatedProvider = isProvider ? await getProviderBookings(user!.id) : [];
    setCustomerBookings(updatedCustomer);
    setProviderBookings(updatedProvider);
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (!reviewModal || !user) return;
    try {
      await createReview(reviewModal.booking.id, {
        rating: reviewModal.rating,
        comment: reviewModal.content,
      });
      toast.success('Review submitted!');
      setReviewedIds(new Set([...reviewedIds, `${reviewModal.booking.id}_${user.id}`]));
      setReviewModal(null);
      await refreshBookings();
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to submit review');
    }
  };

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      toast.success(`Booking ${newStatus}`);
      await refreshBookings();
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to update status');
    }
  };

  const renderActions = (booking: Booking, isProviderView: boolean) => {
    const role = isProviderView ? 'provider' : 'user';

    if (booking.status === 'REJECTED' || booking.status === 'CANCELLED') {
      return <span className="text-muted-foreground text-sm">No actions</span>;
    }

    if (booking.status === 'PAID' && user && !reviewedIds.has(`${booking.id}_${user.id}`)) {
      return (
        <Button
          size="sm"
          onClick={() =>
            setReviewModal({
              booking: booking,
              content: '',
              rating: 5,
            })
          }
        >
          Leave Review
        </Button>
      );
    }

    if (role === 'provider') {
      if (booking.status === 'PENDING') {
        return (
          <div className="flex gap-1 min-w-[150px]">
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
      if (booking.status === 'COMPLETED') {
        return (
          <Button size="sm" onClick={() => setQuoteModal({ id: booking.id, price: '' })}>
            Send Quote
          </Button>
        );
      }
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

      if (booking.status === 'QUOTED') {
        return (
          <Button
            size="sm"
            onClick={() => setPaymentModal({ id: booking.id, price: booking.price })}
          >
            Pay
          </Button>
        );
      }
    }

    return <span className="text-muted-foreground text-sm">No actions</span>;
  };

  const renderTable = (bookings: BookingWithClient[], isProviderView: boolean) => {
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
              {isProviderView && <th className="px-4 py-2">Client</th>}
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="text-sm border-t">
                <td className="px-4 py-2">
                  <Link to={`/services/${b.serviceId}`} className="text-blue-600 hover:underline">
                    {b.serviceName}
                  </Link>
                </td>
                <td className="px-4 py-2">{b.description}</td>
                {isProviderView && (
                  <td className="px-4 py-2">
                    {b.client ? (
                      <Link
                        to={`/profile/${b.client.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {b.client.firstName} {b.client.lastName}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Unknown Client</span>
                    )}
                  </td>
                )}
                <td className="px-4 py-2">{new Date(b.bookingDate).toLocaleDateString()}</td>

                <td className="px-4 py-2">{getStatusBadge(b.status)}</td>
                <td className="px-4 py-2">{renderActions(b, isProviderView)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <Loader />;

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
        <Modal open onClose={() => setConfirmModal(null)} title="Confirm Action">
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

      {quoteModal.id && (
        <Modal open onClose={() => setQuoteModal({ id: '', price: '' })} title="Send Quote">
          <p className="text-sm text-muted-foreground mb-4">Enter price for this booking:</p>
          <Input
            type="number"
            value={quoteModal.price}
            onChange={(e) => setQuoteModal({ ...quoteModal, price: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setQuoteModal({ id: '', price: '' })}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={async () => {
                const price = parseFloat(quoteModal.price);
                if (isNaN(price) || price <= 0) {
                  toast.error('Please enter a valid price.');
                  return;
                }
                try {
                  await sendQuote(quoteModal.id, price);
                  await refreshBookings();
                  toast.success('Quote sent.');
                } catch (err) {
                  toast.error(getErrorMessage(err) || 'Failed to send quote.');
                } finally {
                  setQuoteModal({ id: '', price: '' });
                }
              }}
            >
              Send Quote
            </Button>
          </div>
        </Modal>
      )}

      {paymentModal.id && (
        <Modal open onClose={() => setPaymentModal({ id: '', price: 0 })} title="Payment Details">
          <div className="space-y-4 mt-1 text-sm text-muted-foreground">
            <div>
              <label className="block mb-1 font-medium text-sm text-gray-700">Total Amount</label>
              <div className="bg-gray-100 px-3 py-2 rounded-md font-semibold text-black">
                ${paymentModal.price.toFixed(2)}
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm text-gray-700">Card Number</label>
              <Input type="text" placeholder="1234 5678 9012 3456" maxLength={19} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium text-sm text-gray-700">Expiry Date</label>
                <Input type="text" placeholder="MM/YY" maxLength={5} />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium text-sm text-gray-700">CVV</label>
                <Input type="text" placeholder="123" maxLength={4} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setPaymentModal({ id: '', price: 0 })}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={async () => {
                  try {
                    await createPayment(paymentModal.id);
                    await refreshBookings();
                    toast.success('Payment successful!');
                  } catch (err) {
                    toast.error(getErrorMessage(err) || 'Payment failed.');
                  } finally {
                    setPaymentModal({ id: '', price: 0 });
                  }
                }}
              >
                Pay
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {reviewModal && (
        <Modal open onClose={() => setReviewModal(null)} title="Leave a Review">
          <div className="space-y-6 px-2 sm:px-4 py-4 text-center">
            <div className="flex justify-center gap-2 text-yellow-500 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer ${
                    star <= reviewModal.rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setReviewModal((prev) => prev && { ...prev, rating: star })}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              rows={5}
              value={reviewModal.content}
              onChange={(e) =>
                setReviewModal((prev) => prev && { ...prev, content: e.target.value })
              }
              placeholder="Write your experience..."
              className="w-full border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setReviewModal(null)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MyBookingsPage;
