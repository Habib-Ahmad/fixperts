import { useEffect, useState } from 'react';
import { getAllReviews, deleteReview } from '../api/admins';
import { Review, Booking } from '../interfaces';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { getBookingById } from '../api/bookings';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewServiceMap, setReviewServiceMap] = useState<Record<string, string>>({});
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data);

      const map: Record<string, string> = {};
      await Promise.all(
        data
          .filter((r) => r.targetType === 'SERVICE')
          .map(async (r) => {
            try {
              const booking: Booking = await getBookingById(r.bookingId);
              map[r.id] = booking.serviceId;
            } catch (err) {
              console.error(`Failed to get booking for review ${r.id}:`, err);
            }
          })
      );

      setReviewServiceMap(map);
      setMapReady(true);
    } catch {
      toast.error('Could not load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      toast.success('Review deleted');
      setReviews((r) => r.filter((x) => x.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const serviceReviews = reviews.filter((r) => r.targetType === 'SERVICE');
  const clientReviews = reviews.filter((r) => r.targetType === 'CLIENT');

  const renderReviewTable = (title: string, list: Review[], isClient: boolean) => (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Rating</th>
              <th className="px-4 py-2">Comment</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.id}</td>
                <td className="px-4 py-2">{r.rating}</td>
                <td className="px-4 py-2 max-w-xs truncate" title={r.comment}>
                  {r.comment}
                </td>
                <td className="px-4 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 flex gap-2 flex-wrap">
                  {isClient ? (
                    <Link to={`/profile/${r.targetId}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  ) : mapReady && reviewServiceMap.hasOwnProperty(r.id) ? (
                    <Link to={`/services/${reviewServiceMap[r.id]}#review-${r.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400">Resolving…</span>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  if (loading) return <p>Loading reviews…</p>;

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Reviews</h1>
      {renderReviewTable('Service Reviews', serviceReviews, false)}
      {renderReviewTable('Client Reviews', clientReviews, true)}
    </section>
  );
}
