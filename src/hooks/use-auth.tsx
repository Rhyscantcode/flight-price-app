"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { PlaneTakeoff } from 'lucide-react';
import type { UserProfile } from '@/types';

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          // Create user profile in Firestore if it doesn't exist
          const newUserProfile: UserProfile = {
            id: user.uid,
            email: user.email!,
            displayName: user.displayName || user.email!.split('@')[0],
            createdAt: serverTimestamp(),
          };
          await setDoc(userDocRef, newUserProfile);
        }
      }
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isProtectedRoute = pathname.startsWith('/dashboard');

    if (!user && isProtectedRoute) {
      router.push('/login');
    }
    if (user && (isAuthPage || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [user, loading, router, pathname]);
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isProtectedRoute = pathname.startsWith('/dashboard');
  
  const showLoader = loading || 
                     (!user && isProtectedRoute) || 
                     (user && (isAuthPage || pathname === '/'));

  if (showLoader) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <PlaneTakeoff className="h-12 w-12 animate-pulse text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Sky Sentinel...</p>
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
