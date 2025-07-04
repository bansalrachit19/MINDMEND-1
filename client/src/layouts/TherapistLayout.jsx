import Navbar from '../components/Navbar.jsx';
import { Outlet } from 'react-router-dom';

export default function TherapistLayout({ user }) {
  return (
    <div>
      <Navbar name={user.name} role="Therapist" />
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
}
