export function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const base64 = token.split('.')[1];
    const decoded = JSON.parse(atob(base64));
    if (!decoded.role || !decoded.id) return null;
    return decoded;
  } catch (e) {
    return null;
  }
}
