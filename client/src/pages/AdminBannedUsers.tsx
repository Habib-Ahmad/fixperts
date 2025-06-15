// src/pages/AdminBannedUsers.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, unbanUser } from '../api/admins';
import { User } from '../interfaces';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function AdminBannedUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const fetchBannedUsers = async () => {
    setLoading(true);
    try {
      const all = await getAllUsers();
      setUsers(all.filter((u) => u.isBanned));
    } catch (err) {
      console.error(err); // 👈 catch actual error
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await unbanUser(userId);
      toast.success('User unbanned');
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      toast.error('Failed to unban user');
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Banned Users</h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <div className="min-w-full grid grid-cols-6 bg-gray-100 p-2 text-sm font-semibold text-gray-700">
          <div>User ID</div>
          <div>First Name</div>
          <div>Last Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Actions</div>
        </div>
        {users.map((user) => (
          <div
            key={user.id}
            className="min-w-full grid grid-cols-6 gap-x-4 border-b p-2 items-center text-sm"
          >
            <div className="overflow-x-auto">
              <div className="w-max">{user.id}</div>
            </div>
            <div>{user.firstName}</div>
            <div>{user.lastName}</div>
            <div>{user.email}</div>
            <div>{user.role}</div>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={() => handleUnban(user.id)}>
                Unban
              </Button>
              <Link to={`/profile/${user.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
          </div>
        ))}
        {!users.length && (
          <div className="p-4 text-center text-gray-600">No banned users found.</div>
        )}
      </div>
    </section>
  );
}
