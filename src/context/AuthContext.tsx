import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  type FirebaseUser
} from '../firebase';
import { UserProfile, UserRole, UserStatus } from '../types';
import {
  saveUserToLocalMirror,
  getLocalUsersMirror,
  updateUserInLocalMirror
} from '../utils/persistence';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Owner / Superadmin bootstrap emails
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
    const cleanEmail = (user.email || '').trim().toLowerCase();

    // Check local mirror first as an immediate safety cache
    const mirrorUsers = getLocalUsersMirror();
    const mirrorMatch = mirrorUsers.find((u) => u.uid === user.uid || (u.email && u.email.toLowerCase() === cleanEmail));

    try {
      const snapPromise = getDoc(userRef);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      const snap = await Promise.race([snapPromise, timeoutPromise]);

      if (snap && snap.exists()) {
        const data = snap.data() as UserProfile;
        
        // If superadmin, ensure admin role and approved status
        if (isSuperAdmin && (data.role !== 'admin' || data.status !== 'approved')) {
          const updated: Partial<UserProfile> = {
            role: 'admin',
            status: 'approved',
            updatedAt: new Date().toISOString(),
          };
          await updateDoc(userRef, updated).catch(() => {});
          await setDoc(doc(db, 'admins', user.uid), {
            uid: user.uid,
            email: cleanEmail,
            assignedAt: new Date().toISOString(),
          }, { merge: true }).catch(() => {});

          const fullProfile = { ...data, ...updated };
          saveUserToLocalMirror(fullProfile);
          return fullProfile;
        }

        saveUserToLocalMirror(data);
        return data;
      } else if (snap && !snap.exists()) {
        // Create new profile if not found in Firestore
        const newRole: UserRole = isSuperAdmin ? 'admin' : 'user';
        const newStatus: UserStatus = isSuperAdmin ? 'approved' : 'pending';
        const displayName = mirrorMatch?.displayName || user.displayName?.trim() || (user.email ? user.email.split('@')[0] : 'Usuário');

        const newProfile: UserProfile = {
          uid: user.uid,
          email: cleanEmail,
          displayName,
          name: displayName,
          role: newRole,
          status: newStatus,
          createdAt: mirrorMatch?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userRef, newProfile, { merge: true });

        if (isSuperAdmin) {
          await setDoc(doc(db, 'admins', user.uid), {
            uid: user.uid,
            email: cleanEmail,
            assignedAt: new Date().toISOString(),
          }, { merge: true }).catch(() => {});
        }

        saveUserToLocalMirror(newProfile);
        return newProfile;
      }
    } catch (err) {
      console.warn('[Bio Fácil Auth] Aviso ao ler perfil do Firestore:', err);
    }

    // Defensive fallback from mirror or memory
    if (mirrorMatch) {
      if (isSuperAdmin && (mirrorMatch.role !== 'admin' || mirrorMatch.status !== 'approved')) {
        mirrorMatch.role = 'admin';
        mirrorMatch.status = 'approved';
        saveUserToLocalMirror(mirrorMatch);
      }
      return mirrorMatch;
    }

    const fallbackName = user.displayName?.trim() || (user.email ? user.email.split('@')[0] : 'Usuário');
    const fallbackProfile: UserProfile = {
      uid: user.uid,
      email: cleanEmail,
      displayName: fallbackName,
      name: fallbackName,
      role: isSuperAdmin ? 'admin' : 'user',
      status: isSuperAdmin ? 'approved' : 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveUserToLocalMirror(fallbackProfile);
    return fallbackProfile;
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      const profile = await fetchOrCreateProfile(auth.currentUser);
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    let userDocUnsub: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(safetyTimer);
      if (userDocUnsub) {
        userDocUnsub();
        userDocUnsub = null;
      }

      setCurrentUser(user);
      if (user) {
        try {
          const profile = await fetchOrCreateProfile(user);
          setUserProfile(profile);

          // Listen to real-time status/role changes (e.g. when admin approves the user)
          userDocUnsub = onSnapshot(
            doc(db, 'users', user.uid),
            (docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                setUserProfile(data);
                saveUserToLocalMirror(data);
              }
            },
            (err) => {
              console.warn('[Bio Fácil Auth] Aviso no listener de perfil:', err);
            }
          );
        } catch (err) {
          console.error('[Bio Fácil Auth] Erro ao obter perfil do usuário:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      if (userDocUnsub) {
        userDocUnsub();
      }
      unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
    } catch (err: any) {
      // If this is the bootstrap admin email and account does not exist in Auth yet, provision on first login
      if (
        isBootstrapAdminEmail(cleanEmail) &&
        (err.code === 'auth/user-not-found' ||
          err.code === 'auth/invalid-credential' ||
          err.code === 'auth/invalid-login-credentials')
      ) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          if (cred.user) {
            const adminProfile: UserProfile = {
              uid: cred.user.uid,
              email: cleanEmail,
              displayName: 'Administrador BIO FÁCIL',
              name: 'Administrador BIO FÁCIL',
              role: 'admin',
              status: 'approved',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', cred.user.uid), adminProfile, { merge: true });
            await setDoc(doc(db, 'admins', cred.user.uid), {
              uid: cred.user.uid,
              email: cleanEmail,
              assignedAt: new Date().toISOString(),
            }, { merge: true });
            saveUserToLocalMirror(adminProfile);
            setUserProfile(adminProfile);
            return;
          }
        } catch {
          throw err;
        }
      }
      throw err;
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // 1. Create user in Firebase Authentication
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    const uid = cred.user.uid;

    console.log(`[Bio Fácil Auth] Account UID: ${uid}`);
    console.log(`[Bio Fácil Auth] Profile collection: users`);

    const isSuperAdmin = isBootstrapAdminEmail(cleanEmail);
    const userRef = doc(db, 'users', uid);

    const newProfile: UserProfile = {
      uid,
      email: cleanEmail,
      displayName: cleanName,
      name: cleanName,
      role: isSuperAdmin ? 'admin' : 'user',
      status: isSuperAdmin ? 'approved' : 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 2. Persist to Firestore with merge: true
    try {
      await setDoc(userRef, newProfile, { merge: true });

      if (isSuperAdmin) {
        await setDoc(doc(db, 'admins', uid), {
          uid,
          email: cleanEmail,
          assignedAt: new Date().toISOString(),
        }, { merge: true }).catch(() => {});
      }

      console.log(`[Bio Fácil Auth] Profile created: true`);
      console.log(`[Bio Fácil Auth] Profile status: ${newProfile.status}`);
    } catch (firestoreErr) {
      console.error('[Bio Fácil Auth] Erro ao gravar perfil no Firestore:', firestoreErr);
      console.log(`[Bio Fácil Auth] Profile created: false`);
      // Still mirror locally so admin has record and account doesn't vanish
      saveUserToLocalMirror(newProfile);
      throw new Error('Não foi possível concluir seu cadastro. Tente novamente.');
    }

    // 3. Mirror locally for resilience
    saveUserToLocalMirror(newProfile);
    setUserProfile(newProfile);
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
