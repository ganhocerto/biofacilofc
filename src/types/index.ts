export type UserRole = 'admin' | 'user';
export type UserStatus = 'pending' | 'approved' | 'blocked' | 'rejected';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  name?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Niche {
  id: string;
  name: string;
  slug?: string;
  description: string;
  icon: string;
  imageUrl?: string;
  order: number;
  active: boolean;
  modelCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type FieldType = 
  | 'text'
  | 'title'
  | 'image'
  | 'logo'
  | 'link'
  | 'whatsapp'
  | 'instagram'
  | 'phone'
  | 'email'
  | 'address'
  | 'hours'
  | 'color';

export type EditorCategory =
  | 'identidade'
  | 'textos'
  | 'contato'
  | 'botoes'
  | 'cards'
  | 'imagens'
  | 'localizacao'
  | 'outros';

export type EditorElementType =
  | 'logo'
  | 'image'
  | 'title'
  | 'text'
  | 'whatsapp'
  | 'email'
  | 'phone'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'maps'
  | 'location'
  | 'button'
  | 'card'
  | 'credential'
  | 'link';

export interface EditableElement {
  id: string; // unique identifier
  editorType: EditorElementType;
  category: EditorCategory;
  label: string;
  description?: string;
  selector: string;
  tagName: string;
  attr: 'text' | 'src' | 'href' | 'both';
  originalValue: string;
  originalText?: string;
  originalHref?: string;
  originalSrc?: string;
  details?: {
    phone?: string;
    message?: string;
    email?: string;
    buttonText?: string;
    iconSrc?: string;
    cardTitle?: string;
    cardSubtitle?: string;
    href?: string;
  };
}

export interface EditableElementMap {
  elements: EditableElement[];
  categories: {
    id: EditorCategory;
    name: string;
    icon: string;
    count: number;
    elements: EditableElement[];
  }[];
  byId: Record<string, EditableElement>;
}

export interface EditableField {
  id: string;
  name: string;
  type: FieldType;
  selector?: string;
  attr: 'text' | 'html' | 'src' | 'href' | 'style';
  dataBioAttr?: string;
  originalValue: string;
  currentValue?: string;
  placeholder?: string;
  group?: string;
}

export interface BiositeTemplate {
  id: string;
  name: string;
  nicheId: string;
  nicheName: string;
  description: string;
  coverImage: string;
  version: number;
  status: 'draft' | 'published';
  htmlContent: string;
  cssContent?: string;
  jsContent?: string;
  fields: EditableField[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export type IconStyleType = 'original' | 'minimal' | 'glass' | '3d' | 'brilliant' | 'neon';

export interface SocialItemConfig {
  enabled: boolean;
  url: string;
  style?: IconStyleType;
}

export interface LogoConfig {
  size?: 'sm' | 'md' | 'lg';
  align?: 'center' | 'top' | 'bottom';
  transparent?: boolean;
}

export interface UserProject {
  id: string;
  userId: string;
  userEmail: string;
  templateId: string;
  nicheId: string;
  name: string;
  slug: string;
  customValues: Record<string, string>;
  customColors?: Record<string, string>;
  selectedPalette?: string;
  iconStyle?: IconStyleType;
  socialsConfig?: Record<string, SocialItemConfig>;
  logoConfig?: LogoConfig;
  htmlCompiled: string;
  createdAt: string;
  updatedAt: string;
}

export interface BiofacilManifest {
  templateId: string;
  name: string;
  category: string;
  version: number;
  fields: EditableField[];
}
