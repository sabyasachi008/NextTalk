'use client';

import { PropsWithChildren, createContext, useState } from 'react';

interface AuthState {
    name: string;
    image: string;
}

interface AuthContextType extends AuthState {
    login: (name: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    name: '',
    image: '',
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [state, setState] = useState<AuthState>({
        name: '',
        image: '',
    });

    const login = (name: string) => {
        const image = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
        setState({ name, image });
    };

    const logout = () => {
        setState({ name: '', image: '' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
