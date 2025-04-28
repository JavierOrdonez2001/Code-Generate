import { createContext, useContext,  useState } from "react";


interface AuthContextType{
    authenticated: boolean;
    setAuthenticated: (auth: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({ 
    authenticated: false,
    setAuthenticated: () => {},
});

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }){
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    
    return(
        <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

