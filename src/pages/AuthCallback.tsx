import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
    const navigate = useNavigate();
    useEffect(() => {
        const cookies = document.cookie.split(';');

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
            
            navigate('/');
        }
    }, []);

    return (
        <>
        </>
    );
}

export default AuthCallback;
