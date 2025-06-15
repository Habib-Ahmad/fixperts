// src/pages/AdminDashboardPage.tsx
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <section className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
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

export default AdminDashboardPage;
