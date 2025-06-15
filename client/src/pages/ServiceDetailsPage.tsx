import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getOrCreateConversation, getServiceById, getUserById, getReviewsForService } from '../api';
import { Service, User, Review } from '../interfaces';
import { Loader, Badge, Button, Modal, BookingForm } from '../components';
import { AlertCircle, StarIcon, Clock, MessageSquare, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils';

const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL;

const ServiceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [provider, setProvider] = useState<User | null>(null);
  const [reviews, setReviews] = useState<(Review & { author?: User })[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const result = await getServiceById(id);
        setService(result);
        const reviewData = await getReviewsForService(result.id);
        setReviews(reviewData);

        const providerInfo = await getUserById(result.providerId);
        setProvider(providerInfo);

        const fetchedReviews = await getReviewsForService(result.id);
        const withAuthors = await Promise.all(
          fetchedReviews.map(async (r: Review) => {
            try {
              const author = await getUserById(r.authorId);
              return { ...r, author };
            } catch {
              return r;
            }
          })
        );
        setReviews(withAuthors);
      } catch (error) {
        toast.error(getErrorMessage(error) || 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleMessageProvider = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        toast.error('You must be logged in to message the provider');
        return;
      }
      const parsedUser: User = JSON.parse(user);

      if (!service?.providerId) {
        toast.error('Provider information is missing for this service.');
        return;
      }
      const conversation = await getOrCreateConversation(parsedUser.id, service.providerId);
      navigate(`/inbox?conversationId=${conversation.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to start conversation');
    }
  };

  if (loading) return <Loader />;
  if (!service) return <p className="text-center text-muted-foreground">Service not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {service.mediaUrls?.[0] && (
          <div className="w-full lg:w-1/2">
            <img
              src={`${mediaBaseUrl}${service.mediaUrls[0]}`}
              alt={service.name}
              className="w-full h-[350px] object-cover rounded-lg"
            />
          </div>
        )}

        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="text-3xl font-bold capitalize">{service.name}</h1>

          {provider && (
            <div className="flex items-center gap-3">
              <img
                src={
                  provider.profilePictureUrl
                    ? `http://localhost:8081${provider.profilePictureUrl}`
                    : 'https://github.com/shadcn.png'
                }
                alt="Provider Avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <Link
                to={`/profile/${provider.id}`}
                className="font-medium text-base text-foreground hover:underline"
              >
                {provider.firstName} {provider.lastName}
              </Link>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xl text-primary font-semibold">${service.price}/hour</span>
            <div className="flex items-center text-sm gap-1">
              <StarIcon className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
              <span className="text-yellow-600 font-medium">
                {service.averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">rating</span>
            </div>
            {service.emergencyAvailable && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-red-400" />
                Emergency Available
              </Badge>
            )}
          </div>

          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            {service.category}
          </div>

          <p className="text-base leading-relaxed">{service.description}</p>

          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Clock className="w-4 h-4" />
            Avg. Response Time: <span className="font-medium text-foreground">15–30 mins</span>
          </div>

          {provider && currentUser?.id !== provider.id && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="default"
                className="w-full sm:w-fit"
                onClick={() => setShowModal(true)}
              >
                Book This Service
              </Button>
              <Modal open={showModal} onClose={() => setShowModal(false)} title="Book This Service">
                <BookingForm service={service} />
              </Modal>
              <Button variant="outline" className="w-full sm:w-fit" onClick={handleMessageProvider}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Provider
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {service.mediaUrls?.length > 1 && (
          <section>
            <h2 className="text-xl font-semibold mb-2">More Photos</h2>
            <div className="flex gap-4 overflow-x-auto">
              {service.mediaUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={`${mediaBaseUrl}${url}`}
                  alt={`Service media ${idx + 1}`}
                  className="h-36 w-64 object-cover rounded-md flex-shrink-0 border"
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-2">What to Expect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Once you book this service, the provider will reach out to confirm details, location,
            and availability. Emergency services may incur an extra fee. Describe your issue clearly
            for faster and more accurate assistance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CreditCard className="w-4 h-4" />
            All providers currently accept:{' '}
            <span className="font-medium text-foreground">Card, Bank Transfer, and Cash</span>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
          <p className="text-sm text-muted-foreground">
            Have questions or concerns? Contact support via the in-app chat or email us at{' '}
            <a href="mailto:support@fixperts.com" className="underline text-primary">
              support@fixperts.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Reviews</h2>
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
                          ? `http://localhost:8081${review.author.profilePictureUrl}`
                          : 'https://github.com/shadcn.png'
                      }
                      className="w-8 h-8 rounded-full object-cover border"
                      alt="Reviewer"
                    />
                    <div>
                      <Link
                        to={`/profile/${review.author?.id}`}
                        className="font-medium text-foreground hover:underline"
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
    </div>
  );
};

export default ServiceDetailsPage;
