import { AuthStore } from "../store/auth";

export const useAuth = () => {

    const { setAuthenticated, setToken } = AuthStore();

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('http://192.168.1.25:4000/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()
            if(response.ok) {
                setToken(data.access_token)
                setAuthenticated(true)
                return { success: true }
            } else {
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.log(error)
        } 
    }

    const logout = () => {
        setToken("")
        setAuthenticated(false)
    }

    return { login, logout }

}