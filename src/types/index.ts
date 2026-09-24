export type UserRole = 'admin' | 'user';
export type UserStatus = 'pending' | 'approved' | 'blocked' | 'rejected';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
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
