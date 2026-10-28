import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../api/api';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const AppContext = createContext(undefined);

export const AppContextProvider = ({children}) => {

    // Auth States
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    // States
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [activeProject, setActiveProject] = useState(null);
    const [laodingActiveProject, setLoadingActiveProject] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [generatingProject, setGeneratingProject] = useState(false);
    const [activeFile, setActiveFile] = useState("/App.js");
    const [showCode, setShowCode] = useState(false);

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

    const logout = async () => {

        try {
            await api.post('/api/auth/logout');
            setUser(null);
            setProjects([]);
            setActiveProject(null);
            toast.success("logged out successfully...");
            navigate("/login")
        }

        catch(err) {

            console.error("Logout Failed : ", err.message);
            toast.error(err.message);
        }
    }

    // Project Actions
    const loadProjects = async () => {

        if(!user) return;
        try {
            const { data } = await api.get("/api/projects");
            setProjects(data);
        }

        catch(err) {
            console.error("Failed to list projects : ", err);
            toast.error("Failed to lead projects list")
        }

        finally {
            setLoadingProjects(false);
        }
    }

    const loadProject = async (id, silent = false) => {

        if(!user) return;
        if(!silent) setLoadingActiveProject(true);

        try {

            const { data } = await api.get(`/api/projects${id}`);
            setActiveProject(data);

            // Default file selection
            const files = Object.keys(data.files);
            if(files.length > 0) {
                setActiveFile((prev) => {

                    if(files.includes(prev)) return prev;
                    if(files.includes("/App.js")) return "/App.js"
                    return files[0];
                })
            }
        }

        catch(err) {

            console.error(err.message);  
            if(!silent) {
                toast.error("Failed to load project details");
                navigate("/");
            }
        }

        finally {
            if(!silent) setLoadingActiveProject(false);
        }
    }

    useEffect(() => {

        if(!activeProject?._id || !user) return;

        const isOngoing = activeProject.status === "generating" || activeProject.status === "pending" ||
        activeProject.status === "revising";

        if(isOngoing) {
            setChatLoading(true);
            const interval = setInterval(() => {
                loadProject(activeProject._id, true)
            }, 2000)

            return () => clearInterval(interval);
        }

        else {
            setChatLoading(false);
        }

    }, [activeProject?._id, activeProject?.status, loadProject, user])

    const handleGenerate = useCallback(
        async (prompt) => {
            if(!user) return;
            setGeneratingProject(true);

            try {
                const { data } = await api.post('/api/projects', { prompt });
                toast.success("Ai agent is planning structure...");
                navigate(`/builder/${data._id}`)
            }

            catch (err) {
                console.error("Failed to generate project", err);
                toast.error(err?.response?.data?.message);
            }

            finally {
                setGeneratingProject(false);
            }
        }, [user, navigate]
    )

    const handleDelete = useCallback(
        async (prompt) => {
            if(!user) return;

            try {
               await api.delete(`/api/project/${id}`);
               setProjects((prev) => prev.filter((p) => {
                p._id !== id
               }))
               toast.success("Project deleted successfully")
            }

            catch (err) {
               console.error("Failed to delete project : ", err);
               toast.error("Failed to delete project")
            }
        }, [user]
    )

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