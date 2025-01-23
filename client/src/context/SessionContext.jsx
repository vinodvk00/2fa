import { Children, use, useEffect } from "react";
import { createContext } from "react";
import { useState } from "react";
import { useContext } from "react";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        console.log("useEffect runs : ", storedUser);
        if(storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
        setLoading(false);
    }, []);



    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = (data) => {
        if(data) {
            setIsLoggedIn(false);
            setUser(null);
            sessionStorage.removeItem('user');
        }
    };

    return (
        <SessionContext.Provider value={{isLoggedIn, loading, user, login, logout}}>
            {children}
        </SessionContext.Provider>
    );
}