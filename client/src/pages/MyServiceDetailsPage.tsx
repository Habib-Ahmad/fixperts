import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Service } from '../interfaces';
import { getServiceById } from '../api/services';
import { Loader, Badge } from '../components';
import { AlertCircle, StarIcon, CalendarCheck2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils';

const MyServiceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getServiceById(id);
        setService(data);
      } catch (err) {
        toast.error(getErrorMessage(err) || 'Failed to fetch service details');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) return <Loader />;
  if (!service) return <p className="text-center text-muted-foreground">Service not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* Overview */}
      <section className="space-y-6">
        <h1 className="text-3xl font-bold capitalize">{service.name}</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <img
              src={service.mediaUrls[0]}
              alt={service.name}
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="text-lg font-semibold text-primary">${service.price}/hour</span>
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                {service.averageRating.toFixed(1)}
              </div>
              {service.emergencyAvailable && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Emergency
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground uppercase">{service.category}</div>
            <p className="text-base">{service.description}</p>
          </div>
        </div>
      </section>

      {/* Bookings */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarCheck2 className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Bookings</h2>
        </div>
        <div className="border rounded-lg p-4 text-sm text-muted-foreground">
          {/* Replace with actual booking table when ready */}
          No bookings yet.
        </div>
      </section>

      {/* Reviews */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Reviews</h2>
        </div>
        <div className="border rounded-lg p-4 text-sm text-muted-foreground">
          {/* Replace with review cards when ready */}
          No reviews yet.
        </div>
      </section>
    </div>
  );
};

export default MyServiceDetailsPage;
