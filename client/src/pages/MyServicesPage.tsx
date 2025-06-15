import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServicesByProviderId, deleteService, updateService } from '../api/services';
import { Service, ServicePayload } from '../interfaces';
import {
  Loader,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '../components';
import { Pencil, Trash2, Eye, PlusSquare } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  price: Yup.number().min(0, 'Must be at least 0').required('Required'),
  // mediaUrl: Yup.string().url('Must be a valid URL').required('Required'),
});

const MyServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          navigate('/login?redirect=/my-services');
          return;
        }
        const parsedUser = JSON.parse(user);
        // print the parsed user id
        console.log('Parsed User ID:', parsedUser.id);
        const data = await getServicesByProviderId(parsedUser.id);
        setServices(data);
      } catch (error) {
        toast.error(getErrorMessage(error) || 'Failed to fetch your services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success('Service deleted');
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg || 'Failed to delete service');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = async (values: ServicePayload) => {
    if (!selected) return;
    try {
      const updated = { ...selected, ...values };
      await updateService(selected.id, updated);
      setServices((prev) => prev.map((s) => (s.id === selected.id ? updated : s)));
      toast.success('Service updated');
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg || 'Failed to update service');
    } finally {
      setSelected(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">My Services</h1>

        <Button
          variant="link"
          onClick={() => navigate('/services/create')}
          className="cursor-pointer"
        >
          <PlusSquare className="!w-6 !h-6 text-primary" />
        </Button>
      </div>

      {services.length === 0 ? (
        <p className="text-muted-foreground">You haven't added any services yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-muted-foreground">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2 flex items-center gap-1">
                  Validated
                  <span
                    className="text-gray-400 cursor-pointer"
                    title="The admin needs to validate your service for it to be visible."
                  >
                    ℹ️
                  </span>
                </th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Emergency</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="text-sm border-t">
                  <td className="px-4 py-2">{service.name}</td>
                  <td className="px-4 py-2">{service.category}</td>
                  <td className="px-4 py-2">{service.validated ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">${service.price}</td>
                  <td className="px-4 py-2">{service.emergencyAvailable ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/services/${service.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelected(service)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      {selected?.id === service.id && (
                        <DialogContent aria-describedby={undefined}>
                          <DialogHeader>
                            <DialogTitle>Edit Service</DialogTitle>
                          </DialogHeader>
                          <Formik
                            initialValues={{
                              providerId: selected.providerId,
                              name: selected.name,
                              description: selected.description,
                              price: selected.price,
                              category: selected.category,
                              emergencyAvailable: selected.emergencyAvailable,
                              averageRating: selected.averageRating,
                              mediaUrls: [''],
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleEdit}
                          >
                            {({ isSubmitting }) => (
                              <Form className="space-y-4">
                                <div>
                                  <label className="block font-medium">Name</label>
                                  <Field name="name" className="w-full border p-2 rounded" />
                                  <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-red-500 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block font-medium">Description</label>
                                  <Field
                                    as="textarea"
                                    name="description"
                                    className="w-full border p-2 rounded"
                                  />
                                  <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-red-500 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block font-medium">Price</label>
                                  <Field
                                    name="price"
                                    type="number"
                                    className="w-full border p-2 rounded"
                                  />
                                  <ErrorMessage
                                    name="price"
                                    component="div"
                                    className="text-red-500 text-sm"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Field type="checkbox" name="emergencyAvailable" />
                                  <label>Emergency Available</label>
                                </div>

                                {/* <div>
                                  <label className="block font-medium">Media URL</label>
                                  <Field name="mediaUrl" className="w-full border p-2 rounded" />
                                  <ErrorMessage
                                    name="mediaUrl"
                                    component="div"
                                    className="text-red-500 text-sm"
                                  />
                                </div> */}
                                <Button type="submit" disabled={isSubmitting}>
                                  Save Changes
                                </Button>
                              </Form>
                            )}
                          </Formik>
                        </DialogContent>
                      )}
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleting(service)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      {deleting?.id === service.id && (
                        <DialogContent aria-describedby={undefined}>
                          <DialogHeader>
                            <DialogTitle>Confirm Delete</DialogTitle>
                          </DialogHeader>
                          <p>
                            Are you sure you want to delete <strong>{deleting?.name}</strong>?
                          </p>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setDeleting(null)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => handleDelete(service.id)}>
                              Yes, delete
                            </Button>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyServicesPage;
