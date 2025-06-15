import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrCreateConversation, getServiceById } from '../api';
import { Service, User } from '../interfaces';
import { Loader, Badge, Button, Modal, BookingForm } from '../components';
import { AlertCircle, StarIcon, Clock, MessageSquare, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils';

const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL;

const ServiceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const result = await getServiceById(id);
        setService(result);
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

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xl text-primary font-semibold">${service.price}/hour</span>

            <div className="flex items-center text-sm text-muted-foreground gap-1">
              <StarIcon className="w-4 h-4" />
              {service.averageRating.toFixed(1)} rating
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
            Avg. Response Time: <span className="font-medium text-foreground">15-30 mins</span>
          </div>

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
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
