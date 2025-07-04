import Navbar from '../components/Navbar.jsx';
import { Outlet } from 'react-router-dom';

export default function AdminLayout({ user }) {
  return (
    <div>
      <Navbar name={user.name} role="Admin" />
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
}
