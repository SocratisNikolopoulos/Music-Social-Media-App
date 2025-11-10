import { createContext, ReactNode, useEffect, useState } from "react";
import { UserDetails } from "../services/auth";
import { authService } from "../bootstrap";

export interface AuthContextType {
    authenticatedUser: UserDetails | null;
    loaded: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, name: string) => Promise<UserDetails | null>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = (props: { children: ReactNode }) => {
    const [authenticatedUser, setAuthenticatedUser] =
        useState<UserDetails | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadAuthenticatedUser();
    }, []);

    const loadAuthenticatedUser = async () => {
        await fetch("http://localhost/sanctum/csrf-cookie", {
            credentials: "include",
        });

        const user = await authService.loadUser();
        setAuthenticatedUser(user);
        setLoaded(true);
    };

    const login = async (email: string, password: string) => {
        const user = await authService.loginWithPassword(email, password);

        // Fetch fresh CSRF cookie after session regeneration
        await fetch("http://localhost/sanctum/csrf-cookie", {
            credentials: "include",
        });

        // Reload user with fresh session
        const freshUser = await authService.loadUser();
        setAuthenticatedUser(freshUser);

        return freshUser != null;
    };

    const register = async (email: string, password: string, name: string) => {
        const user = await authService.register(email, password, name);

        // Fetch fresh CSRF cookie after session regeneration
        await fetch("http://localhost/sanctum/csrf-cookie", {
            credentials: "include",
        });

        // Reload user with fresh session
        const freshUser = await authService.loadUser();
        setAuthenticatedUser(freshUser);
        return freshUser;
    };

    const resetPassword = async (email: string) => {
        await authService.resetPassword(email);
    };

    const logout = async () => {
        await authService.logout();
        setAuthenticatedUser(null);

        // Fetch fresh CSRF cookie after session invalidation
        await fetch("http://localhost/sanctum/csrf-cookie", {
            credentials: "include",
        });
    };

    return (
        <AuthContext.Provider
            value={{
                authenticatedUser,
                loaded,
                register,
                login,
                logout,
                resetPassword,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
