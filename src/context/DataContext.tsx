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
import {
  getLocalUsersMirror,
  updateUserInLocalMirror,
  getLocalTemplatesMirror,
  saveTemplateToLocalMirror,
  updateTemplateInLocalMirror,
  deleteTemplateFromLocalMirror
} from '../utils/persistence';

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
  
  // Combine INITIAL_TEMPLATES with local mirror on mount so all models are immediately ready
  const getInitialUnifiedTemplates = (): BiositeTemplate[] => {
    const mirror = getLocalTemplatesMirror();
    const map = new Map<string, BiositeTemplate>();
    INITIAL_TEMPLATES.forEach((t) => map.set(t.id, t));
    mirror.forEach((t) => map.set(t.id, { ...map.get(t.id), ...t }));
    return Array.from(map.values());
  };

  const [niches, setNiches] = useState<Niche[]>(INITIAL_NICHES as Niche[]);
  const [templates, setTemplates] = useState<BiositeTemplate[]>(getInitialUnifiedTemplates);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => getLocalUsersMirror());
  const [loadingData, setLoadingData] = useState(true);

  // In-memory cache for full template HTML to guarantee zero lag and zero black screens
  const fullTemplatesCache = React.useRef<Map<string, BiositeTemplate>>(new Map());

  // Populate cache on mount
  useEffect(() => {
    INITIAL_TEMPLATES.forEach((t) => {
      fullTemplatesCache.current.set(t.id, t);
    });
    const mirror = getLocalTemplatesMirror();
    mirror.forEach((t) => {
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

  // 1. Seed initial data (non-destructive: only seeds if collections are completely empty)
  const seedInitialDataIfEmpty = async () => {
    if (!isAdmin) return;
    try {
      // Check niches - only seed if completely empty; NEVER delete existing niches!
      const nichesSnap = await getDocs(collection(db, 'niches')).catch(() => null);
      if (!nichesSnap || nichesSnap.empty) {
        for (const item of INITIAL_NICHES) {
          await setDoc(
            doc(db, 'niches', item.id),
            {
              ...item,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch(() => {});
        }
      }

      // Check templates - only seed if completely empty; NEVER overwrite or delete existing models!
      const templatesSnap = await getDocs(collection(db, 'templates')).catch(() => null);
      if (!templatesSnap || templatesSnap.empty) {
        for (const item of INITIAL_TEMPLATES) {
          await setDoc(
            doc(db, 'templates', item.id),
            {
              ...item,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch(() => {});
          saveTemplateToLocalMirror(item);
        }
      }
    } catch (err) {
      console.warn('[Bio Fácil Data] Aviso ao verificar dados iniciais:', err);
    }
  };

  // 2. Listen to Niches (publicly accessible)
  useEffect(() => {
    const q = collection(db, 'niches');
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Niche[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Niche);
        });
        list.sort((a, b) => (a.order || 99) - (b.order || 99));

        if (list.length > 0) {
          setNiches(list);
        } else {
          setNiches(INITIAL_NICHES as Niche[]);
        }
      },
      (error) => {
        console.warn('[Bio Fácil Data] Aviso ao escutar nichos, utilizando nichos base:', error);
        setNiches(INITIAL_NICHES as Niche[]);
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Listen to Templates (with fallback to unified templates + local mirror)
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
        const map = new Map<string, BiositeTemplate>();
        
        // 1. Base initial templates
        INITIAL_TEMPLATES.forEach((t) => {
          if (isAdmin || t.status === 'published') {
            map.set(t.id, t);
          }
        });

        // 2. Local mirror templates
        const mirror = getLocalTemplatesMirror();
        mirror.forEach((t) => {
          if (isAdmin || t.status === 'published') {
            map.set(t.id, { ...map.get(t.id), ...t });
          }
        });

        // 3. Firestore live templates
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as BiositeTemplate;
          map.set(data.id, { ...map.get(data.id), ...data });
          if (data.htmlContent) {
            fullTemplatesCache.current.set(data.id, data);
            saveTemplateToLocalMirror(data);
          }
        });

        const list = Array.from(map.values());
        list.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        setTemplates(list);
        setLoadingData(false);
      },
      (error) => {
        console.warn('[Bio Fácil Data] Aviso ao escutar templates do Firestore, utilizando catálogo protegido:', error);
        const unified = getInitialUnifiedTemplates().filter((t) => isAdmin || t.status === 'published');
        setTemplates(unified);
        unified.forEach((t) => fullTemplatesCache.current.set(t.id, t));
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

    // 2. Check local mirror
    const mirror = getLocalTemplatesMirror();
    const mirrorMatch = mirror.find((t) => t.id === templateId);
    if (mirrorMatch && mirrorMatch.htmlContent && mirrorMatch.htmlContent.trim().length > 0) {
      fullTemplatesCache.current.set(templateId, mirrorMatch);
      return mirrorMatch;
    }

    // 3. Fetch specific doc from Firestore
    try {
      const docRef = doc(db, 'templates', templateId);
      const snapPromise = getDoc(docRef);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      const snap = await Promise.race([snapPromise, timeoutPromise]);

      if (snap && snap.exists()) {
        const full = snap.data() as BiositeTemplate;
        fullTemplatesCache.current.set(templateId, full);
        saveTemplateToLocalMirror(full);
        return full;
      }
    } catch (err) {
      console.warn('[Bio Fácil Data] Aviso ao buscar modelo no Firestore:', err);
    }

    // 4. Fallback to INITIAL_TEMPLATES
    const initial = INITIAL_TEMPLATES.find((t) => t.id === templateId);
    if (initial) {
      fullTemplatesCache.current.set(templateId, initial);
      return initial;
    }

    // 5. Fallback to state
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
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as UserProject);
        });
        setUserProjects(list);
      },
      (error) => {
        console.warn('[Bio Fácil Data] Aviso ao escutar projetos do usuário:', error);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isApproved]);

  // 5. Listen to All Users (Admin only) with resilient mirror merge & required console logging
  useEffect(() => {
    if (!isAdmin) {
      setAllUsers([]);
      return;
    }

    console.log('[Bio Fácil Admin] Pending query started');

    const q = collection(db, 'users');
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const map = new Map<string, UserProfile>();

        // Seed with local mirror users first
        const mirrorUsers = getLocalUsersMirror();
        mirrorUsers.forEach((u) => map.set(u.uid, u));

        // Merge Firestore users
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Partial<UserProfile>;
          const cleanName = data.displayName || data.name || (data.email ? data.email.split('@')[0] : 'Usuário');
          const profile: UserProfile = {
            uid: data.uid || docSnap.id,
            email: data.email || '',
            displayName: cleanName,
            name: cleanName,
            role: data.role || 'user',
            status: data.status || 'pending',
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
          };
          map.set(profile.uid, profile);
          updateUserInLocalMirror(profile.uid, profile);
        });

        const list = Array.from(map.values());
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        const pendingCount = list.filter((u) => u.status === 'pending').length;
        console.log(`[Bio Fácil Admin] Pending users found: ${pendingCount}`);

        setAllUsers(list);
      },
      (error) => {
        console.error('[Bio Fácil Admin] Erro na consulta de usuários:', error);
        // Fallback to local mirror so pending accounts never disappear
        const fallbackUsers = getLocalUsersMirror();
        fallbackUsers.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        const pendingCount = fallbackUsers.filter((u) => u.status === 'pending').length;
        console.log(`[Bio Fácil Admin] Pending users found: ${pendingCount}`);
        setAllUsers(fallbackUsers);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Actions
  const addNiche = async (niche: Omit<Niche, 'createdAt' | 'updatedAt'>) => {
    const docRef = doc(db, 'niches', niche.id);
    await setDoc(
      docRef,
      {
        ...niche,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  };

  const updateNiche = async (id: string, data: Partial<Niche>) => {
    const docRef = doc(db, 'niches', id);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  };

  const deleteNiche = async (id: string) => {
    await deleteDoc(doc(db, 'niches', id));
  };

  const addTemplate = async (template: Omit<BiositeTemplate, 'createdAt' | 'updatedAt'>) => {
    const docRef = doc(db, 'templates', template.id);
    const newTemplateData: BiositeTemplate = {
      ...template,
      createdAt: (template as any).createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Local mirror first to protect data permanently
    saveTemplateToLocalMirror(newTemplateData);
    fullTemplatesCache.current.set(template.id, newTemplateData);
    setTemplates((prev) => [newTemplateData, ...prev.filter((t) => t.id !== template.id)]);

    // 2. Persist to Firestore with merge: true
    try {
      await setDoc(docRef, newTemplateData, { merge: true });
    } catch (err) {
      console.warn('[Bio Fácil Data] Aviso ao persistir modelo no Firestore:', err);
    }
  };

  const updateTemplate = async (id: string, data: Partial<BiositeTemplate>) => {
    const docRef = doc(db, 'templates', id);
    const updatePayload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // 1. Local mirror update
    updateTemplateInLocalMirror(id, updatePayload);
    const cached = fullTemplatesCache.current.get(id);
    if (cached) {
      fullTemplatesCache.current.set(id, { ...cached, ...updatePayload });
    }
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatePayload } : t))
    );

    // 2. Persist to Firestore with merge: true
    try {
      await setDoc(docRef, updatePayload, { merge: true });
    } catch (err) {
      console.warn('[Bio Fácil Data] Aviso ao atualizar modelo no Firestore:', err);
    }
  };

  const deleteTemplate = async (id: string) => {
    deleteTemplateFromLocalMirror(id);
    fullTemplatesCache.current.delete(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteDoc(doc(db, 'templates', id));
    } catch (err) {
      console.warn('[Bio Fácil Data] Aviso ao excluir modelo do Firestore:', err);
    }
  };

  const saveProject = async (project: Partial<UserProject> & { id: string; userId: string }) => {
    if (!currentUser || (!isApproved && !isAdmin)) {
      throw new Error('Apenas usuários aprovados podem criar ou salvar projetos.');
    }
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
    const now = new Date().toISOString();
    const updates: Partial<UserProfile> & Record<string, any> = {
      status,
      updatedAt: now,
    };

    if (status === 'approved') updates.approvedAt = now;
    if (status === 'rejected') updates.rejectedAt = now;
    if (status === 'blocked') updates.blockedAt = now;

    if (role) {
      updates.role = role;
      if (role === 'admin') {
        await setDoc(
          doc(db, 'admins', uid),
          { uid, assignedAt: now },
          { merge: true }
        ).catch(() => {});
      } else {
        await deleteDoc(doc(db, 'admins', uid)).catch(() => {});
      }
    }

    // 1. Update local mirror immediately
    updateUserInLocalMirror(uid, updates);

    // 2. Update local state immediately so admin does not have to reload or wait
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, ...updates } : u))
    );

    // 3. Persist to Firestore with merge: true
    try {
      await setDoc(userRef, updates, { merge: true });
    } catch (err) {
      console.warn('[Bio Fácil Data] Aviso ao atualizar status do usuário no Firestore:', err);
    }
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
