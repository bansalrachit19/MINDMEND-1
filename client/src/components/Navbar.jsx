import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useMood } from '../context/MoodContext';

export default function Navbar({ name, role }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { setShowMoodModal } = useMood();

  const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
};


  return (
    <nav className="bg-gradient-to-r from-purple-100 to-purple-300 p-4 shadow-md flex justify-between items-center rounded-b-2xl">
      <Link to={`/${role}`}><h1 className="text-2xl font-bold text-purple-800">MindMend</h1></Link>
      <div className="flex items-center gap-4">
        <Link to={`/${role}/forum`} className="text-purple-600 hover:text-purple-800">💬 Community Forum</Link>
        {/* <Link to="#" onClick={() => setShowMoodModal(true)} className="text-2xl">🧠</Link> */}
        <p className="text-purple-700 font-medium capitalize">{role} • {name}</p>
        <button onClick={logout} className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700">
          Logout
        </button>
      </div>
    </nav>
  );
}
