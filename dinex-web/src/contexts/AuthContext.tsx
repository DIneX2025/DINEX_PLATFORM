import { createContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (credentials: any) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Ao carregar a página, verifica se já existe um token salvo
    const token = localStorage.getItem('@DineX:token');
    const savedUser = localStorage.getItem('@DineX:user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  async function signIn({ email, password }: any) {
    // Chama o Backend que já testámos
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Salva no navegador para não deslogar ao atualizar a página
    localStorage.setItem('@DineX:token', token);
    localStorage.setItem('@DineX:user', JSON.stringify(user));

    setUser(user);
  }

  function signOut() {
    localStorage.removeItem('@DineX:token');
    localStorage.removeItem('@DineX:user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}