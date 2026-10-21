import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/api';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const AppContext = createContext(undefined);

export const AppContextProvider = ({children}) => {

    // Auth States
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    // Auth Actions
    const checkSession = async () => {

        try {

            const { data } = await api.get('/api/auth/me');
            setUser(data.user);
        }

        catch(err) {

            setUser(null);
        }

        finally {

            setIsLoading(false)
        }
    }

    useEffect(() => {
        checkSession()
    }, [checkSession])

    const login = async (email, password) => {

        try {

            const { data } = await api.post('/api/auth/login', {email, password});
            setUser(data.user);
            toast.success('Welcome back!');
            navigate('/');
        }

        catch(err) {

            console.error(err.message);
            const errMessage = err?.response?.data?.error || "Invalid email or password"
            toast.error(errMessage);
            throw new Error(errMessage)
        }
    }

    const register = async (name, email, password) => {

        try {

            const { data } = await api.post('/api/auth/register', {name, email, password});
            setUser(data.user);
            toast.success("Account created successfully...");
            navigate('/')
        }

        catch(err) {

            console.error("Registration failed : ", err.message);
            const errorMessage = err?.response?.data?.error || "Registration failed";
            toast.error(errorMessage);
            throw new Error(errorMessage)
            
        }
    }

  return (
    <AppContext.Provider value={{user, isLoading, login, register}}>
        {children}
    </AppContext.Provider>
  )
}


export function useAppContext() {

    const context = useContext(AppContext);

    if(context === undefined) {
        throw new Error("useAppContext must be within an AppContextProvider...")
    }

    return context;
}