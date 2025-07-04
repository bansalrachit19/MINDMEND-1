import Navbar from '../components/Navbar.jsx';
import { Outlet } from 'react-router-dom';

export default function UserLayout({ user }) {
  return (
    <div>
      <Navbar name={user.name} role="User" />
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
}
