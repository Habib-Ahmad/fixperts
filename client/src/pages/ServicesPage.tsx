import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Service, serviceCategories } from '../interfaces';
import { getAllServices, searchServices } from '../api/services';
import { getErrorMessage } from '../utils';
import { toast } from 'sonner';
import { Button, Input, Loader, ServiceCard, Switch } from '../components';

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [emergency, setEmergency] = useState(false);

  const [advanced, setAdvanced] = useState(false);

  useEffect(() => {
    const initialQuery = searchParams.get('key') || '';
    setQuery(initialQuery);
  }, [searchParams]);

  const fetchAdvanced = async () => {
    setLoading(true);
    try {
      const data = await searchServices({
        query,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        emergency,
        category,
      });
      setServices(data);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to perform advanced search');
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSearch = async () => {
    if (advanced) {
      await fetchAdvanced();
    } else {
      // fallback: just filter locally or use getAllServices and filter manually
      fetchAll();
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading && <Loader />}
      <h1 className="text-2xl font-bold mb-4">Services</h1>

      <div className="space-y-4 mb-6 max-w-3xl">
        <Input
          placeholder="Search by name, category or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <label className="font-medium">Enable advanced filters</label>
          <Switch checked={advanced} onCheckedChange={setAdvanced} />
        </div>

        {advanced && (
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded px-3 py-2 text-sm text-foreground bg-background"
            >
              <option value="">All Categories</option>
              {serviceCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace('_', ' ')}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <Switch checked={emergency} onCheckedChange={setEmergency} />
              <span className="text-sm text-muted-foreground">Emergency Available</span>
            </div>
          </div>
        )}

        <Button className="w-full md:w-fit" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {services.length === 0 && !loading ? (
        <p className="text-muted-foreground text-sm">No services match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
