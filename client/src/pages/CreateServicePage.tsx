import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { createService, updateServiceMedia } from '../api/services';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils';
import { ServicePayload } from '../interfaces';
import { Loader } from '../components';

interface FormValues extends ServicePayload {
  mediaUrls: File[];
}

// Categories remain the same
const categories = [
  'PLUMBING',
  'ELECTRICAL',
  'CLEANING',
  'HVAC',
  'APPLIANCE_REPAIR',
  'PEST_CONTROL',
  'LANDSCAPING',
  'PAINTING',
  'MOVING',
  'HANDYMAN',
];

// Validation schema updated to include mediaUrls
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  price: Yup.number().min(0, 'Must be at least 0').required('Required'),
  category: Yup.string().oneOf(categories).required('Required'),
  emergencyAvailable: Yup.boolean().required(),
  mediaUrls: Yup.array()
    .of(
      Yup.mixed().test('fileSize', 'File too large', (value) => {
        return value instanceof File ? value.size <= 5000000 : true; // Limit size to 5MB
      })
    )
    .min(1, 'At least one file is required')
    .required('Required'),
});

const CreateServicePage = () => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const navigate = useNavigate();

  const handleSubmit = async (values: FormValues) => {
    console.log('Form values:', values);
    try {
      // Step 1: Create service without media
      const { mediaUrls, ...serviceWithoutMedia } = values;
      const files = Array.isArray(mediaUrls)
        ? mediaUrls.flat().filter((f) => f instanceof File)
        : [];

      const created = await createService(serviceWithoutMedia);

      // Step 2: Upload media files separately using the new service ID
      if (files.length > 0) {
        console.log('Uploading media files:', files);
        files.forEach((f, i) => console.log(`File ${i}:`, f.name, f.type));

        await updateServiceMedia(created.id, files);
      }

      toast.success('Service created successfully!');
      navigate('/my-services');
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg || 'Failed to create service');
    }
  };

  if (!user) {
    navigate('/login?redirect=/services/create');
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Service</h1>

      <Formik
        initialValues={{
          name: '',
          description: '',
          price: 0,
          category: '',
          emergencyAvailable: false,
          mediaUrls: [] as File[],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-5">
            {isSubmitting && <Loader />}
            <div>
              <label className="block font-medium">Service Name</label>
              <Field as={Input} name="name" />
              <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <Field as="textarea" name="description" className="w-full border rounded p-2" />
              <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
            </div>

            <div>
              <label className="block font-medium">Price ($/hour)</label>
              <Field as={Input} type="number" name="price" />
              <ErrorMessage name="price" component="div" className="text-sm text-red-500" />
            </div>

            <div>
              <label className="block font-medium">Category</label>
              <Field as="select" name="category" className="w-full border rounded p-2">
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="text-sm text-red-500" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Field type="checkbox" name="emergencyAvailable" />
                <label>Emergency Available?</label>
              </div>
              <p className="text-sm text-muted-foreground">
                (This is for services that can be provided on short notice)
              </p>
            </div>

            <div>
              <label className="block font-medium">Image Upload</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const files = e.currentTarget.files;
                  if (files) {
                    setFieldValue('mediaUrls', Array.from(files));
                  }
                }}
                className="w-full border rounded p-2"
              />
              {values.mediaUrls && values.mediaUrls.length > 0 && (
                <ul className="mt-2">
                  {Array.from(values.mediaUrls).map((file: File, index: number) => (
                    <li key={index} className="text-sm">
                      {file.name}
                    </li>
                  ))}
                </ul>
              )}
              <ErrorMessage name="mediaUrls" component="div" className="text-sm text-red-500" />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateServicePage;
