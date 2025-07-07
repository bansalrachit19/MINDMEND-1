export function getUserFromToken() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) return null;

  try {
    const base64 = token.split('.')[1];
    const decoded = JSON.parse(atob(base64));

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      console.warn('Token expired');
      return null;
    }

    return JSON.parse(userStr);
  } catch (e) {
    console.error('Failed to decode token or parse user:', e);
    return null;
  }
}
