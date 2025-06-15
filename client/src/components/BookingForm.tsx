import { Formik } from 'formik';
import { Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from './ui';
import { BookingPayload, Service } from '../interfaces';
import { bookService } from '../api';
import { getErrorMessage } from '../utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Props {
  service: Service;
}

const BookingForm = ({ service }: Props) => {
  const navigate = useNavigate();

  const handleBooking = async (values: BookingPayload) => {
    try {
      if (!service) return;
      await bookService(service.id, values);
      toast.success('Service booked successfully!');
      navigate('/bookings');
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg || 'Failed to book service');
    }
  };

  return (
    <Formik
      initialValues={{
        bookingDate: '',
        description: '',
        serviceId: service.id,
        serviceName: service.name,
        price: 0,
      }}
      validationSchema={Yup.object({
        bookingDate: Yup.string().required('Select a date'),
        description: Yup.string().required('Please describe your need'),
      })}
      onSubmit={handleBooking}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Booking Date</label>
            <Field type="date" name="bookingDate" className="w-full border p-2 rounded" />
            <ErrorMessage name="bookingDate" component="div" className="text-sm text-red-500" />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <Field
              as="textarea"
              name="description"
              placeholder="e.g. Leaking pipe under kitchen sink"
              className="w-full border p-2 rounded"
            />
            <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Booking...' : 'Book Now'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default BookingForm;
