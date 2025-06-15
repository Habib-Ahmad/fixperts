import { useEffect, useState } from 'react';
import {
  getUnapprovedServices,
  approveService,
  rejectService,
} from '../api/admins';
import { Service } from '../interfaces';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getUnapprovedServices();
      setServices(data);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('Service approved');
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject and delete this service?')) return;
    try {
      await rejectService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('Service rejected');
    } catch {
      toast.error('Failed to reject');
    }
  };

  if (loading) return <p>Loading services...</p>;

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Services</h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <div className="min-w-full">
          {/* Combined wrapper for sticky scrolling */}
          <div className="grid grid-cols-7 gap-x-4 bg-gray-100 p-2 text-sm font-semibold text-gray-700">
            <div>ID</div>
            <div>Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Provider</div>
            <div>Actions</div>
          </div>

          {services.map(s => (
            <div key={s.id} className="grid grid-cols-7 gap-x-4 border-b p-2 items-center text-sm">
              <div className="overflow-x-auto"><div className="w-max" title={s.id}>{s.id}</div></div>
              <div>{s.name}</div>
              <div>{s.category}</div>
              <div>${s.price}</div>
              <div className="overflow-x-auto"><div className="w-max">{s.providerId}</div></div>
              <div className="flex gap-2">
                <Link to={`/services/${s.id}`}>
                  <Button size="sm" variant="outline">View</Button>
                </Link>
                <Button size="sm" onClick={() => handleApprove(s.id)}>Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => handleReject(s.id)}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
