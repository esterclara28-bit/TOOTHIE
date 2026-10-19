import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, handleFirestoreError } from '../lib/firebase';
import { UserProfile, UserRole, OperationType, ActivityLog } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  role: UserRole;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isKader: boolean;
  isViewer: boolean;
  isPengguna: boolean;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signOutAccount: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  logActivity: (action: ActivityLog['action'], details: string, targetId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BOOTSTRAP_SUPERADMIN_EMAIL = 'esterclara28@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const adminDocRef = doc(db, 'admins', user.uid);

        try {
          const userSnapshot = await getDoc(userDocRef);
          const isBootstrapAdmin = user.email?.toLowerCase() === BOOTSTRAP_SUPERADMIN_EMAIL.toLowerCase();

          if (!userSnapshot.exists()) {
            const initialRole: UserRole = isBootstrapAdmin ? 'super_admin' : 'pengguna';
            const newProfile: UserProfile = {
              userId: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Sahabat Gigi',
              photoURL: user.photoURL || '',
              role: initialRole,
              ageGroup: 'anak_9_12',
              educationLevel: 'SD_Kelas_4_6',
              completedModules: ['beranda'],
              unlockedBadges: [],
              quizHighScore: 0,
              quizCompleted: false,
              brushTimerCompletedCount: 0,
              foodGameFedCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);

            if (isBootstrapAdmin) {
              await setDoc(adminDocRef, {
                userId: user.uid,
                role: 'super_admin',
                email: user.email,
                createdAt: new Date().toISOString(),
              });
            }

            // Record login log
            await addDoc(collection(db, 'activity_logs'), {
              actorId: user.uid,
              actorEmail: user.email || '',
              actorRole: initialRole,
              action: 'LOGIN',
              details: `Pengguna baru mendaftar via Google: ${user.email}`,
              createdAt: new Date().toISOString(),
            });
          } else {
            const existingData = userSnapshot.data() as UserProfile;
            if (isBootstrapAdmin && existingData.role !== 'super_admin') {
              await updateDoc(userDocRef, { role: 'super_admin' });
              await setDoc(adminDocRef, {
                userId: user.uid,
                role: 'super_admin',
                email: user.email,
                createdAt: new Date().toISOString(),
              });
              existingData.role = 'super_admin';
            }
            setUserProfile(existingData);
          }

          // Realtime listener for user profile
          unsubscribeProfile = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              setUserProfile(snap.data() as UserProfile);
            }
          }, (err) => {
            console.error('Snapshot error for user profile:', err);
          });

        } catch (error) {
          console.error('Error fetching/creating user profile:', error);
        }
      } else {
        if (unsubscribeProfile) unsubscribeProfile();
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signInGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Sign in with Google failed:', error);
      throw error;
    }
  };

  const signOutAccount = async () => {
    try {
      if (currentUser && userProfile) {
        await logActivity('LOGOUT', `Pengguna keluar: ${currentUser.email}`);
      }
      await logoutUser();
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}`;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const updatePayload = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(userDocRef, updatePayload);
      setUserProfile((prev) => (prev ? { ...prev, ...updatePayload } : null));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const logActivity = async (action: ActivityLog['action'], details: string, targetId?: string) => {
    if (!currentUser) return;
    const path = 'activity_logs';
    try {
      await addDoc(collection(db, path), {
        actorId: currentUser.uid,
        actorEmail: currentUser.email || 'Anonim',
        actorRole: userProfile?.role || 'pengguna',
        action,
        targetId: targetId || '',
        details,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      // Don't break UI for logging failure
      console.warn('Activity logging caught:', error);
    }
  };

  const role: UserRole = userProfile?.role || 'pengguna';
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === 'admin' || isSuperAdmin;
  const isKader = role === 'kader';
  const isViewer = role === 'viewer';
  const isPengguna = role === 'pengguna';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        role,
        isSuperAdmin,
        isAdmin,
        isKader,
        isViewer,
        isPengguna,
        loading,
        signInGoogle,
        signOutAccount,
        updateUserProfile,
        logActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
