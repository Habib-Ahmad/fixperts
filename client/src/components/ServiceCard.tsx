import { Badge, Card, CardContent, CardHeader, CardTitle } from '../components';
import { StarIcon, AlertCircle } from 'lucide-react';
import { Service } from '../interfaces';
import { useNavigate } from 'react-router-dom';

const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL;

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      className="w-full max-w-md shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => navigate(`/services/${service.id}`)}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="capitalize">{service.name}</span>
          <span className="text-primary font-bold">${service.price}/hour</span>
        </CardTitle>
        <div className="text-sm text-muted-foreground">{service.category.toLowerCase()}</div>
      </CardHeader>
      <CardContent>
        {service.mediaUrls?.[0] && (
          <img
            src={`${mediaBaseUrl}${service.mediaUrls[0]}`}
            alt={service.name}
            className="w-full h-40 object-cover rounded-md mb-3"
          />
        )}
        <p className="text-sm mb-3 line-clamp-3">{service.description}</p>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center text-sm gap-1">
            <StarIcon className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            <span className="text-yellow-600 font-medium">{service.averageRating.toFixed(1)}</span>
          </div>
          {service.emergencyAvailable && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Emergency
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
