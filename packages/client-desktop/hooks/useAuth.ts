import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import jwt from 'jsonwebtoken';
import { DecodedToken } from "@/interfaces/DecodedToken.interface";



export const useAuth = () => {

    const router = useRouter();
    const { isAuthenticated, setAuthenticated, logout } = useAuthStore();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const decodedToken: DecodedToken | string | any = jwt.decode(cookies.token);

    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                const response = await fetch('http://192.168.1.25:4000/auth/verify-token', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${cookies.token}`,
                    },
                });
                if (response.ok) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                console.error('Token verification failed:', error);
            }
        };
        if (cookies.token) {
            checkTokenValidity();
        } else {
            setAuthenticated(false);
        }
      }, [cookies.token]);

      useEffect(() => {
        if (!isAuthenticated && router.pathname !== '/') {
            router.push('/');
        } else if (isAuthenticated && router.pathname === '/') {
            if (decodedToken && decodedToken.role === 'ADMIN') {
                router.push('/main');
            } else if (decodedToken) {
                router.push('/startcourse');
            }
        }
    }, [isAuthenticated, router.pathname, decodedToken]);

    const signIn = async (userData: any) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            
            if(response.ok){
                setCookie('token', data.access_token, { path: '/', sameSite: 'lax' });
                setAuthenticated(true);
                return { success: true };
            } else {
                console.log(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Login failed.' };
        }
    }

    const LogOut = () => {
        removeCookie('token');
        logout();
        router.push('/');
    }

    return {
        isAuthenticated,
        decodedToken,
        router,
        LogOut,
        signIn
    };
}