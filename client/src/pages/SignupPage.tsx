import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Card, CardContent, Input } from '../components';
import { signup } from '../api/auth';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getErrorMessage } from '../utils';
import logo from '@/assets/logo.svg';

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
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({ lat: 0, long: 0 });

      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            long: pos.coords.longitude,
          }),
        () => resolve({ lat: 0, long: 0 })
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
        latitude: location.lat,
        longitude: location.long,
      };

      await signup(payload);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="px-6">
          <Link to="/" className="flex items-center gap-2 w-full mb-4">
            <img src={logo} alt="Logo" className="h-8 w-8" />

            <h1 className="text-2xl font-bold">Fixperts</h1>
          </Link>

          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

          <Formik
            initialValues={{
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={Yup.object({
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
                      {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
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

                <div className="text-center text-sm mt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Log in
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
