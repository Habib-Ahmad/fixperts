import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Card, CardContent, Input } from '../components';
import { signup } from '../api/auth';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils';

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const getLocation = (): Promise<{ lat: number; long: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          }),
        (error) => reject(error)
      );
    });
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const location = await getLocation();

      const payload = {
        firstName: values.firstname,
        lastName: values.lastname,
        email: values.email,
        password: values.password,
        role: 'user',
        latitude: location?.lat || 0,
        longitude: location?.long || 0,
      };

      await signup(payload);
      navigate('/login');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <Formik
            initialValues={{
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={Yup.object().shape({
              firstname: Yup.string().required('First name is required'),
              lastname: Yup.string().required('Last name is required'),
              email: Yup.string().email('Invalid email').required('Email is required'),
              password: Yup.string()
                .min(6, 'Minimum 6 characters')
                .required('Password is required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Confirm your password'),
            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {['firstname', 'lastname', 'email'].map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="capitalize">
                      {field}
                    </label>
                    <Field as={Input} id={field} name={field} type="text" />
                    <ErrorMessage name={field} component="div" className="text-sm text-red-500" />
                  </div>
                ))}

                <div>
                  <label htmlFor="password">Password</label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                </div>

                <div>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Create Account'}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
