import {
    useState,
    createContext,
    useEffect,
    useMemo,
} from "react";

export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
    const [User, setUser] = useState(null);
    const [AppLoading, setAppLoading] = useState(null);
    const value = useMemo(
        () => ({
            User,
            setUser,
        }),
        [User]
    );
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}