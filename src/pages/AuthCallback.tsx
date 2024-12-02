import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

function AuthCallback() {
    const navigate = useNavigate();
    const {login} = useAuth();

    useEffect(() => {
        const cookies = document.cookie.split(';');

        console.log('Cookies:', cookies);
        
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            console.log('JWT:', token);
            localStorage.setItem('token', token);

            // Delete all cookies
            cookies.forEach(cookie => {
                const cookieName = cookie.split('=')[0].trim();
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            });

            login(token);

            navigate('/');
        }
    }, []);

    return (
        <>
        </>
    );
}

export default AuthCallback;
