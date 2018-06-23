import jwtDecode from 'jwt-decode';

export default function checkUserSession(header, userId) {
    const authHeader = header['authorization'].split('Bearer')[1].trim();
    return String(jwtDecode(authHeader)._id) === String(userId);
};