// src/pages/AdminDashboardPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminOverview, getBookingsByDay } from '../api/admins';
import { Loader } from '../components';
import { Card, CardContent } from '../components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const AdminDashboardPage = () => {
  const [overview, setOverview] = useState<Record<string, number> | null>(null);
  const [bookingsChart, setBookingsChart] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [overviewData, bookingsRaw] = await Promise.all([
          getAdminOverview(),
          getBookingsByDay(14),
        ]);

        setOverview(overviewData);

        const bookingsData = Object.entries(bookingsRaw).map(([date, count]) => ({
          date,
          count: Number(count),
        }));
        setBookingsChart(bookingsData);
      } catch (e) {
        console.error('Failed to load admin stats', e);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading || !overview) return <Loader />;

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
        <StatCard title="Users" value={overview.totalUsers} />
        <StatCard title="Banned" value={overview.bannedUsers} />
        <StatCard title="Services" value={overview.totalServices} />
        <StatCard title="Bookings" value={overview.totalBookings} />
      </div>

      {/* Chart */}
      <div className="p-4 bg-white shadow-md rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Bookings (Last 14 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookingsChart}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Admin Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/reviews" className="p-4 border rounded hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Manage Reviews</h2>
          <p>View and delete user-submitted reviews.</p>
        </Link>
        <Link to="/admin/users" className="p-4 border rounded hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">All Users</h2>
          <p>View and manage all users and ban accounts.</p>
        </Link>
        <Link to="/admin/banned-users" className="p-4 border rounded hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Banned Users</h2>
          <p>View and unban restricted users.</p>
        </Link>
        <Link to="/admin/pending-services" className="p-4 border rounded hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Pending Services</h2>
          <p>Approve or reject new service listings.</p>
        </Link>
      </div>
    </section>
  );
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <Card className="shadow-sm">
    <CardContent className="p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default AdminDashboardPage;
