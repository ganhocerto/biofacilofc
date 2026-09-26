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
  loadTemplateFull: (templateId: string) => Promise<BiositeTemplate>;
  saveProject: (project: Omit<UserProject, 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateUserStatus: (uid: string, status: UserProfile['status'], role?: UserProfile['role']) => Promise<void>;
  seedInitialDataIfEmpty: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin, isApproved } = useAuth();
  const [niches, setNiches] = useState<Niche[]>(INITIAL_NICHES as Niche[]);
  const [templates, setTemplates] = useState<BiositeTemplate[]>(INITIAL_TEMPLATES);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // In-memory cache for full template HTML to ensure zero lag and lazy loading
  const fullTemplatesCache = React.useRef<Map<string, BiositeTemplate>>(new Map());

  // Populate cache with initial templates
  useEffect(() => {
    INITIAL_TEMPLATES.forEach((t) => {
      fullTemplatesCache.current.set(t.id, t);
    });
  }, []);

  // Safety timeout: ensure loadingData unblocks within 2.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingData(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // 1. Seed initial data (callable manually by admin)
  const seedInitialDataIfEmpty = async () => {
    if (!isAdmin) return;
    try {
      // Check niches - ensure official niches exist in Firestore
      const nichesSnap = await getDocs(collection(db, 'niches')).catch(() => null);
      const existingDocs = nichesSnap?.docs || [];
      const initialIds = new Set(INITIAL_NICHES.map((n) => n.id));

      // Remove obsolete niche documents if any
      for (const d of existingDocs) {
        if (!initialIds.has(d.id)) {
          await deleteDoc(doc(db, 'niches', d.id)).catch(() => {});
        }
      }

      // Upsert official niches
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
        ).catch(() => {});
      }

      // Check templates
      const templatesSnap = await getDocs(collection(db, 'templates')).catch(() => null);
      if (!templatesSnap || templatesSnap.empty) {
        for (const item of INITIAL_TEMPLATES) {
          await setDoc(doc(db, 'templates', item.id), {
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Erro ao sincronizar dados iniciais:', err);
    }
  };

  // 2. Listen to Niches (publicly accessible)
  useEffect(() => {
    const q = collection(db, 'niches');
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Niche[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Niche);
        });
        // Sort in memory by order
        list.sort((a, b) => (a.order || 99) - (b.order || 99));

        if (list.length > 0) {
          setNiches(list);
        } else {
          setNiches(INITIAL_NICHES as Niche[]);
        }
      },
      (error) => {
        console.warn('Erro ao escutar nichos, utilizando nichos padrão:', error);
        setNiches(INITIAL_NICHES as Niche[]);
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Listen to Templates (with in-memory sorting to avoid composite index failure)
  useEffect(() => {
    let q;
    if (isAdmin) {
      q = collection(db, 'templates');
    } else {
      q = query(
        collection(db, 'templates'),
        where('status', '==', 'published')
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: BiositeTemplate[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as BiositeTemplate;
          list.push(data);
          if (data.htmlContent) {
            fullTemplatesCache.current.set(data.id, data);
          }
        });

        // In-memory sort by createdAt desc
        list.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        if (list.length > 0) {
          setTemplates(list);
        } else {
          const fallback = INITIAL_TEMPLATES.filter((t) => isAdmin || t.status === 'published');
          setTemplates(fallback);
          fallback.forEach((t) => fullTemplatesCache.current.set(t.id, t));
        }
        setLoadingData(false);
      },
      (error) => {
        console.warn('Erro ao escutar templates, utilizando catálogo local:', error);
        const fallback = INITIAL_TEMPLATES.filter((t) => isAdmin || t.status === 'published');
        setTemplates(fallback);
        fallback.forEach((t) => fullTemplatesCache.current.set(t.id, t));
        setLoadingData(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Lazy load full template HTML on demand
  const loadTemplateFull = async (templateId: string): Promise<BiositeTemplate> => {
    // 1. Check in-memory cache
    if (fullTemplatesCache.current.has(templateId)) {
      const cached = fullTemplatesCache.current.get(templateId)!;
      if (cached.htmlContent && cached.htmlContent.trim().length > 0) {
        return cached;
      }
    }

    // 2. Fetch specific doc from Firestore with timeout
    try {
      const docRef = doc(db, 'templates', templateId);
      const snapPromise = getDoc(docRef);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));
      const snap = await Promise.race([snapPromise, timeoutPromise]);

      if (snap && snap.exists()) {
        const full = snap.data() as BiositeTemplate;
        fullTemplatesCache.current.set(templateId, full);
        return full;
      }
    } catch (err) {
      console.warn('Erro ao carregar HTML completo do Firestore:', err);
    }

    // 3. Fallback to INITIAL_TEMPLATES
    const initial = INITIAL_TEMPLATES.find((t) => t.id === templateId);
    if (initial) {
      fullTemplatesCache.current.set(templateId, initial);
      return initial;
    }

    // 4. Fallback to template in state
    const inState = templates.find((t) => t.id === templateId);
    if (inState) {
      return inState;
    }

    throw new Error('Modelo não encontrado');
  };

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
        loadTemplateFull,
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
