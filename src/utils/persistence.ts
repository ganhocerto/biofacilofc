import { UserProfile, BiositeTemplate } from '../types';

const USERS_MIRROR_KEY = 'biofacil_users_mirror_v1';
const TEMPLATES_MIRROR_KEY = 'biofacil_persistent_templates_v1';

// ==========================================
// USERS LOCAL MIRROR
// ==========================================
export function getLocalUsersMirror(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_MIRROR_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UserProfile[];
  } catch (err) {
    console.warn('Erro ao ler espelho local de usuários:', err);
    return [];
  }
}

export function saveUserToLocalMirror(user: UserProfile): void {
  try {
    const current = getLocalUsersMirror();
    const index = current.findIndex((u) => u.uid === user.uid);
    if (index >= 0) {
      current[index] = { ...current[index], ...user };
    } else {
      current.unshift(user);
    }
    localStorage.setItem(USERS_MIRROR_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Erro ao salvar no espelho local de usuários:', err);
  }
}

export function updateUserInLocalMirror(uid: string, updates: Partial<UserProfile>): void {
  try {
    const current = getLocalUsersMirror();
    const index = current.findIndex((u) => u.uid === uid);
    if (index >= 0) {
      current[index] = {
        ...current[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(USERS_MIRROR_KEY, JSON.stringify(current));
    }
  } catch (err) {
    console.warn('Erro ao atualizar no espelho local de usuários:', err);
  }
}

// ==========================================
// TEMPLATES LOCAL MIRROR
// ==========================================
export function getLocalTemplatesMirror(): BiositeTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_MIRROR_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BiositeTemplate[];
  } catch (err) {
    console.warn('Erro ao ler espelho local de templates:', err);
    return [];
  }
}

export function saveTemplateToLocalMirror(template: BiositeTemplate): void {
  try {
    const current = getLocalTemplatesMirror();
    const index = current.findIndex((t) => t.id === template.id);
    if (index >= 0) {
      current[index] = { ...current[index], ...template };
    } else {
      current.push(template);
    }
    localStorage.setItem(TEMPLATES_MIRROR_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Erro ao salvar no espelho local de templates:', err);
  }
}

export function updateTemplateInLocalMirror(id: string, updates: Partial<BiositeTemplate>): void {
  try {
    const current = getLocalTemplatesMirror();
    const index = current.findIndex((t) => t.id === id);
    if (index >= 0) {
      current[index] = {
        ...current[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(TEMPLATES_MIRROR_KEY, JSON.stringify(current));
    }
  } catch (err) {
    console.warn('Erro ao atualizar no espelho local de templates:', err);
  }
}

export function deleteTemplateFromLocalMirror(id: string): void {
  try {
    const current = getLocalTemplatesMirror().filter((t) => t.id !== id);
    localStorage.setItem(TEMPLATES_MIRROR_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Erro ao excluir do espelho local de templates:', err);
  }
}
