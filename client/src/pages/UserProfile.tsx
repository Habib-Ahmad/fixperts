import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../api';
import { User } from '../interfaces';
import { Loader } from '../components';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils';

const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL;

const UserProfilePage = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) return;
        const fetchedUser = await getUserById(userId);
        setUser(fetchedUser);
      } catch (error) {
        toast.error(getErrorMessage(error) || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <Loader />;
  if (!user) return <p className="text-center text-muted-foreground">User not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <div className="flex items-center gap-4">
        {user.profilePictureUrl && (
          <img
            src={`${mediaBaseUrl}${user.profilePictureUrl}`}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-20 h-20 rounded-full object-cover border"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
