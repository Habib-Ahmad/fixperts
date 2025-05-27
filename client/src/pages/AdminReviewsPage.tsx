// src/pages/AdminReviewsPage.tsx
import { useEffect, useState } from 'react';
import { getAllReviews, deleteReview } from '../api/admins';
import { Review } from '../interfaces';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data);
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
      setReviews(r => r.filter(x => x.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <p>Loading reviews…</p>;

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Reviews</h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <div className="min-w-full grid grid-cols-6 bg-gray-100 p-2 text-sm font-semibold text-gray-700">
          <div>ID</div>
          <div>Service ID</div>
          <div>Booking ID</div>
          <div>Customer ID</div>
          <div>Rating</div>
          <div>Actions</div>
        </div>
        {reviews.map(r => (
          <div key={r.id} className="min-w-full grid grid-cols-6 gap-x-4 border-b p-2 items-center text-sm">
            <div className="overflow-x-auto">
              <div className="w-max">{r.id}</div>
            </div>
            
            <div className="overflow-x-auto">
              <div className="w-max">{r.serviceId}</div>
            </div>
            <div className="overflow-x-auto">
              <div className="w-max">{r.bookingId}</div>
            </div>
            <div className="overflow-x-auto">
              <div className="w-max">{r.customerId}</div>
            </div>
            <div className="overflow-x-auto">
              <div className="w-max">{r.rating}</div>
            </div>
            <div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(r.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
