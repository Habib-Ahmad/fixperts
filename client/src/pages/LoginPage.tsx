import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Card, CardContent, Input } from '../components';
import { toast } from 'sonner';
import { login } from '../api/auth';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getErrorMessage } from '../utils';
import { getServicesByProviderId } from '../api';
import logo from '@/assets/logo.svg';

interface FormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await login(values);
      const { token, user } = response;

      if (user.isBanned) {
        toast.error('Your account has been banned.');
        setSubmitting(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      const services = await getServicesByProviderId(user.id);
      if (services.length > 0) {
        localStorage.setItem('isProvider', 'true');
      }

      toast.success('Login successful!');
      navigate('/');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
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

          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={Yup.object({
              email: Yup.string().email('Invalid email').required('Email is required'),
              password: Yup.string().required('Password is required'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values, { setSubmitting });
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="email">Email</label>
                  <Field as={Input} name="email" id="email" type="email" />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                </div>

                <div>
                  <label htmlFor="password">Password</label>
                  <div className="relative">
                    <Field
                      as={Input}
                      name="password"
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                </div>

                <div className="text-right text-sm">
                  <Link to="/forgot-password" className="text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>

                <div className="text-center text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 hover:underline">
                    Sign up
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

export default LoginPage;
