import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '../components';
import { toast } from 'sonner';
import { updateProfile, changePassword } from '../api';
import { getErrorMessage } from '../utils';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { User } from '../interfaces';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        setUser(parsed);
      } catch {
        toast.error('Failed to load user');
      }
    }
  }, []);

  const handleProfileUpdate = async (values: Partial<User>) => {
    if (!user) return;
    try {
      const updated = await updateProfile(values);
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Update failed');
    }
  };

  const handlePasswordChange = async (values: { oldPassword: string; newPassword: string }) => {
    if (!user) return;
    try {
      await changePassword(values);
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Password update failed');
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 space-y-8">
      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <Formik
              initialValues={{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              }}
              validationSchema={Yup.object({
                firstName: Yup.string().required('Required'),
                lastName: Yup.string().required('Required'),
                email: Yup.string().email('Invalid email').required('Required'),
              })}
              onSubmit={handleProfileUpdate}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label>First Name</label>
                      <Field as={Input} name="firstName" />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label>Last Name</label>
                      <Field as={Input} name="lastName" />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label>Email</label>
                    <Field as={Input} name="email" disabled />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSubmitting}>
                      Save
                    </Button>
                    <Button variant="outline" type="button" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={user.profilePictureUrl || 'https://github.com/shadcn.png'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={Yup.object({
              oldPassword: Yup.string().required('Required'),
              newPassword: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Required'),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              handlePasswordChange({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
              });
              setSubmitting(false);
              resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label>Old Password</label>
                  <Field as={Input} name="oldPassword" type="password" />
                  <ErrorMessage
                    name="oldPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label>New Password</label>
                  <Field as={Input} name="newPassword" type="password" />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label>Confirm New Password</label>
                  <Field as={Input} name="confirmPassword" type="password" />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  Update Password
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
