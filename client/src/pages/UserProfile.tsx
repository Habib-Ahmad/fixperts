import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getUserById,
  getReviewsForClient,
  getUserById as fetchUser,
  getServicesByProviderId,
} from '../api';
import { User, Review, Service } from '../interfaces';
import { Loader, Badge, Button } from '../components';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils';
import { StarIcon } from 'lucide-react';

const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL;

const UserProfilePage = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<(Review & { author?: User })[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!userId) return;

        const [fetchedUser, fetchedReviews, fetchedServices] = await Promise.all([
          getUserById(userId),
          getReviewsForClient(userId),
          getServicesByProviderId(userId),
        ]);

        const enrichedReviews = await Promise.all(
          fetchedReviews.map(async (review: Review) => {
            try {
              const author = await fetchUser(review.authorId);
              return { ...review, author };
            } catch {
              return review;
            }
          })
        );

        setUser(fetchedUser);
        setReviews(enrichedReviews);
        setServices(fetchedServices);
      } catch (error) {
        toast.error(getErrorMessage(error) || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <Loader />;
  if (!user) return <p className="text-center text-muted-foreground">User not found.</p>;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* User info with Send Message button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              user.profilePictureUrl
                ? `${mediaBaseUrl}${user.profilePictureUrl}`
                : 'https://github.com/shadcn.png'
            }
            alt={`${user.firstName} ${user.lastName}`}
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            {averageRating && (
              <div className="flex items-center gap-1 text-sm mt-1 text-yellow-600">
                <StarIcon className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                {averageRating} average rating as a client from {reviews.length} reviews
              </div>
            )}
          </div>
        </div>

        {currentUser?.id && currentUser.id !== user.id && (
          <Link to={`/inbox?with=${user.id}`}>
            <Button className="w-full sm:w-fit">Send Message</Button>
          </Link>
        )}
      </div>

      {/* Services */}
      {services.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Services by {user.firstName}</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img
                  src={`${mediaBaseUrl}${service.mediaUrls?.[0]}`}
                  alt={service.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 space-y-1">
                  <h3 className="text-md font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.category}</p>
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <StarIcon className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                    {service.averageRating.toFixed(1)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section>
        <h2 className="text-xl font-semibold mb-2 py-5 text-center">
          What Others Say of {user.firstName} as a Client
        </h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={
                      review.author?.profilePictureUrl
                        ? `${mediaBaseUrl}${review.author.profilePictureUrl}`
                        : 'https://github.com/shadcn.png'
                    }
                    className="w-8 h-8 rounded-full object-cover border"
                    alt="Reviewer"
                  />
                  <div>
                    <Link
                      to={`/profile/${review.author?.id}`}
                      className="hover:underline font-semibold"
                    >
                      {review.author?.firstName} {review.author?.lastName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfilePage;
