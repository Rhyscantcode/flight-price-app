"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { PlaneTakeoff } from 'lucide-react';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isProtectedRoute = pathname === '/dashboard';

    if (!user && isProtectedRoute) {
      router.push('/login');
    }
    if (user && (isAuthPage || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [user, loading, router, pathname]);
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isProtectedRoute = pathname === '/dashboard';

  if (loading || (!user && isProtectedRoute) || (user && (isAuthPage || pathname === '/'))) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <PlaneTakeoff className="h-12 w-12 animate-pulse text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Skyscanner Sentinel...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
