import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from '../firebase';
import { useAuth } from './AuthContext';
import { Niche, BiositeTemplate, UserProject, UserProfile } from '../types';
import { INITIAL_NICHES, INITIAL_TEMPLATES } from '../data/initialData';

interface DataContextType {
  niches: Niche[];
  templates: BiositeTemplate[];
  userProjects: UserProject[];
  allUsers: UserProfile[];
  loadingData: boolean;
  addNiche: (niche: Omit<Niche, 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNiche: (id: string, data: Partial<Niche>) => Promise<void>;
  deleteNiche: (id: string) => Promise<void>;
  addTemplate: (template: Omit<BiositeTemplate, 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTemplate: (id: string, data: Partial<BiositeTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  saveProject: (project: Omit<UserProject, 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateUserStatus: (uid: string, status: UserProfile['status'], role?: UserProfile['role']) => Promise<void>;
  seedInitialDataIfEmpty: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin, isApproved } = useAuth();
  const [niches, setNiches] = useState<Niche[]>([]);
  const [templates, setTemplates] = useState<BiositeTemplate[]>([]);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // 1. Seed initial data if collections are empty or missing niches
  const seedInitialDataIfEmpty = async () => {
    try {
      // Check niches - ensure exact 10 initial niches exist in Firestore
      const nichesSnap = await getDocs(collection(db, 'niches'));
      const existingDocs = nichesSnap.docs;
      const initialIds = new Set(INITIAL_NICHES.map((n) => n.id));

      // Remove obsolete niche documents if any
      for (const d of existingDocs) {
        if (!initialIds.has(d.id)) {
          await deleteDoc(doc(db, 'niches', d.id)).catch(() => {});
        }
      }

      // Upsert the 10 official niches
      for (const item of INITIAL_NICHES) {
        const existingDoc = existingDocs.find((d) => d.id === item.id);
        const data = existingDoc?.data();
        await setDoc(
          doc(db, 'niches', item.id),
          {
            ...item,
            name: item.name,
            description: '',
            createdAt: data?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // Check templates
      const templatesSnap = await getDocs(collection(db, 'templates'));
      if (templatesSnap.empty) {
        for (const item of INITIAL_TEMPLATES) {
          await setDoc(doc(db, 'templates', item.id), {
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        // Update any existing template with obsolete niche IDs
        for (const tDoc of templatesSnap.docs) {
          const tData = tDoc.data();
          if (tData.nicheId === 'estetica' || tData.nicheId === 'salao-beleza') {
            await updateDoc(doc(db, 'templates', tDoc.id), {
              nicheId: 'beleza-estetica',
              nicheName: 'Beleza & Estética',
            }).catch(() => {});
          } else if (tData.nicheId === 'restaurante-gastronomia') {
            await updateDoc(doc(db, 'templates', tDoc.id), {
              nicheId: 'gastronomia-delivery',
              nicheName: 'Gastronomia & Delivery',
            }).catch(() => {});
          }
        }

        // Ensure Black Crown Barber Club template is kept up to date
        const barberDoc = await getDoc(doc(db, 'templates', 'template-barbearia-luxo')).catch(() => null);
        if (!barberDoc || !barberDoc.exists() || barberDoc.data()?.name === 'Barbearia Viking & Navalha') {
          const barberTmpl = INITIAL_TEMPLATES.find(t => t.id === 'template-barbearia-luxo');
          if (barberTmpl) {
            await setDoc(doc(db, 'templates', barberTmpl.id), {
              ...barberTmpl,
              createdAt: barberDoc?.data()?.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          }
        }
      }
    } catch (err) {
      console.warn('Erro ao verificar/semear dados iniciais:', err);
    }
  };

  // Run seed check on mount
  useEffect(() => {
    seedInitialDataIfEmpty();
  }, []);

  // 2. Listen to Niches (publicly accessible)
  useEffect(() => {
    const q = query(collection(db, 'niches'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Niche[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Niche);
        });
        setNiches(list);
        if (list.length === 0) {
          seedInitialDataIfEmpty();
        }
      },
      (error) => {
        console.warn('Erro ao escutar nichos:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Listen to Templates
  useEffect(() => {
    let q;
    if (isAdmin) {
      q = query(collection(db, 'templates'), orderBy('createdAt', 'desc'));
    } else {
      q = query(
        collection(db, 'templates'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: BiositeTemplate[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as BiositeTemplate);
        });
        setTemplates(list);
        setLoadingData(false);
      },
      (error) => {
        console.warn('Erro ao escutar templates:', error);
        setLoadingData(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // 4. Listen to User Projects
  useEffect(() => {
    if (!currentUser || !isApproved) {
      setUserProjects([]);
      return;
    }

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: UserProject[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as UserProject);
        });
        setUserProjects(list);
      },
      (error) => {
        console.warn('Erro ao escutar projetos do usuário:', error);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isApproved]);

  // 5. Listen to All Users (Admin only)
  useEffect(() => {
    if (!isAdmin) {
      setAllUsers([]);
      return;
    }

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: UserProfile[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as UserProfile);
        });
        setAllUsers(list);
      },
      (error) => {
        console.warn('Erro ao carregar lista de usuários para admin:', error);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Actions
  const addNiche = async (niche: Omit<Niche, 'createdAt' | 'updatedAt'>) => {
    const docRef = doc(db, 'niches', niche.id);
    await setDoc(docRef, {
      ...niche,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateNiche = async (id: string, data: Partial<Niche>) => {
    const docRef = doc(db, 'niches', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteNiche = async (id: string) => {
    await deleteDoc(doc(db, 'niches', id));
  };

  const addTemplate = async (template: Omit<BiositeTemplate, 'createdAt' | 'updatedAt'>) => {
    const docRef = doc(db, 'templates', template.id);
    await setDoc(docRef, {
      ...template,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateTemplate = async (id: string, data: Partial<BiositeTemplate>) => {
    const docRef = doc(db, 'templates', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteTemplate = async (id: string) => {
    await deleteDoc(doc(db, 'templates', id));
  };

  const saveProject = async (project: Partial<UserProject> & { id: string; userId: string }) => {
    const docRef = doc(db, 'projects', project.id);
    const snap = await getDoc(docRef).catch(() => null);
    const existingCreatedAt = snap?.exists() ? snap.data()?.createdAt : null;
    await setDoc(
      docRef,
      {
        ...project,
        updatedAt: new Date().toISOString(),
        createdAt: project.createdAt || existingCreatedAt || new Date().toISOString(),
      },
      { merge: true }
    );
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  const updateUserStatus = async (
    uid: string,
    status: UserProfile['status'],
    role?: UserProfile['role']
  ) => {
    const userRef = doc(db, 'users', uid);
    const updates: Partial<UserProfile> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (role) {
      updates.role = role;
      if (role === 'admin') {
        await setDoc(
          doc(db, 'admins', uid),
          { uid, assignedAt: new Date().toISOString() },
          { merge: true }
        );
      } else {
        await deleteDoc(doc(db, 'admins', uid)).catch(() => {});
      }
    }
    await updateDoc(userRef, updates);
  };

  return (
    <DataContext.Provider
      value={{
        niches,
        templates,
        userProjects,
        allUsers,
        loadingData,
        addNiche,
        updateNiche,
        deleteNiche,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        saveProject,
        deleteProject,
        updateUserStatus,
        seedInitialDataIfEmpty,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser utilizado dentro de um DataProvider');
  }
  return context;
};
