import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const base = import.meta.env.VITE_API_BASE_URL;

export default function OAuthSuccess() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${base}/api/auth/me`, { withCredentials: true })
      .then(res => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate(`/${res.data.role}`);
      })
      .catch(() => {
        alert("Authentication failed");
        navigate("/login");
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen text-purple-700 text-xl">
      Logging you in securely...
    </div>
  );
}
