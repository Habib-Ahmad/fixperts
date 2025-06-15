// src/pages/AdminAllUsersPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, banUser, unbanUser } from '../api/admins';
import { User } from '../interfaces';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function AdminAllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const all = await getAllUsers();
      setUsers(all);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (user: User) => {
    try {
      if (user.isBanned) {
        await unbanUser(user.id);
        toast.success('User unbanned');
      } else {
        await banUser(user.id);
        toast.success('User banned');
      }
      fetchUsers();
    } catch {
      toast.error('Failed to update user ban status');
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <div className="min-w-full grid grid-cols-7 bg-gray-100 p-2 text-sm font-semibold text-gray-700">
          <div>User ID</div>
          <div>First Name</div>
          <div>Last Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {users.map((user) => (
          <div
            key={user.id}
            className="min-w-full grid grid-cols-7 gap-x-4 border-b p-2 items-center text-sm"
          >
            <div className="overflow-x-auto">
              <div className="w-max">{user.id}</div>
            </div>
            <div>{user.firstName}</div>
            <div>{user.lastName}</div>
            <div>{user.email}</div>
            <div>{user.role}</div>
            <div>{user.isBanned ? 'Banned' : 'Active'}</div>
            <div className="flex gap-2">
              <Link to={`/profile/${user.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
              <Button
                variant={user.isBanned ? 'default' : 'destructive'}
                size="sm"
                onClick={() => handleToggleBan(user)}
              >
                {user.isBanned ? 'Unban' : 'Ban'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
