import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type FirebaseUser
} from '../firebase';
import { UserProfile, UserRole, UserStatus } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Owner / Superadmin bootstrap emails from environment
const ADMIN_BOOTSTRAP_EMAILS = [
  'jeanncarllostk00@gmail.com',
  'jeannmkt2@gmail.com',
];

export const isBootstrapAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_BOOTSTRAP_EMAILS.some(
    (e) => e.toLowerCase() === email.trim().toLowerCase()
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrCreateProfile = async (user: FirebaseUser): Promise<UserProfile> => {
    const isSuperAdmin = isBootstrapAdminEmail(user.email);
    const userRef = doc(db, 'users', user.uid);
    
    try {
      const snapPromise = getDoc(userRef);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));
      const snap = await Promise.race([snapPromise, timeoutPromise]);

      if (snap && snap.exists()) {
        const data = snap.data() as UserProfile;
        // If superadmin email, ensure admin role and approved status
        if (isSuperAdmin && (data.role !== 'admin' || data.status !== 'approved')) {
          const updated: Partial<UserProfile> = {
            role: 'admin',
            status: 'approved',
            updatedAt: new Date().toISOString(),
          };
          await updateDoc(userRef, updated).catch(() => {});
          // Also register in admins collection
          await setDoc(doc(db, 'admins', user.uid), {
            uid: user.uid,
            email: user.email,
            assignedAt: new Date().toISOString(),
          }, { merge: true }).catch(() => {});
          return { ...data, ...updated };
        }
        return data;
      } else if (snap && !snap.exists()) {
        // Create new profile
        const newRole: UserRole = isSuperAdmin ? 'admin' : 'user';
        const newStatus: UserStatus = isSuperAdmin ? 'approved' : 'pending';

        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Usuário'),
          role: newRole,
          status: newStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userRef, newProfile).catch(() => {});

        if (isSuperAdmin) {
          await setDoc(doc(db, 'admins', user.uid), {
            uid: user.uid,
            email: user.email,
            assignedAt: new Date().toISOString(),
          }).catch(() => {});
        }

        return newProfile;
      }
    } catch (err) {
      console.warn('Aviso ao sincronizar perfil do Firestore, utilizando perfil em memória:', err);
    }

    // Defensive fallback profile in case of network timeout
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Usuário'),
      role: isSuperAdmin ? 'admin' : 'user',
      status: isSuperAdmin ? 'approved' : 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      const profile = await fetchOrCreateProfile(auth.currentUser);
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    // Safety timer to prevent any infinite black screen during auth resolution
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(safetyTimer);
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await fetchOrCreateProfile(user);
          setUserProfile(profile);
        } catch (err) {
          console.error('Erro ao obter perfil do usuário:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      // If this is the bootstrap admin email and user does not exist in Firebase Auth yet,
      // automatically create and provision the admin account on first login!
      if (
        isBootstrapAdminEmail(email) &&
        (err.code === 'auth/user-not-found' ||
          err.code === 'auth/invalid-credential' ||
          err.code === 'auth/invalid-login-credentials')
      ) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, pass);
          if (cred.user) {
            const adminProfile: UserProfile = {
              uid: cred.user.uid,
              email: email,
              displayName: 'Administrador BIO FÁCIL',
              role: 'admin',
              status: 'approved',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', cred.user.uid), adminProfile);
            await setDoc(doc(db, 'admins', cred.user.uid), {
              uid: cred.user.uid,
              email,
              assignedAt: new Date().toISOString(),
            });
            setUserProfile(adminProfile);
            return;
          }
        } catch {
          // If creation fails (e.g. user already exists but password incorrect), throw the original login error
          throw err;
        }
      }
      throw err;
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      const isSuperAdmin = isBootstrapAdminEmail(email);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: email,
        displayName: name,
        role: isSuperAdmin ? 'admin' : 'user',
        status: isSuperAdmin ? 'approved' : 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      if (isSuperAdmin) {
        await setDoc(doc(db, 'admins', cred.user.uid), {
          uid: cred.user.uid,
          email,
          assignedAt: new Date().toISOString(),
        });
      }
      setUserProfile(newProfile);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const isAdmin = userProfile?.role === 'admin';
  const isApproved = userProfile?.status === 'approved' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        isApproved,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        resetPassword,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
