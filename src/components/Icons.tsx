import React from 'react';
import {
  Scissors,
  Sparkles,
  HeartPulse,
  Hand,
  Utensils,
  Pizza,
  Cake,
  Dumbbell,
  Activity,
  Building,
  Scale,
  Camera,
  Music,
  Mic,
  Wrench,
  Car,
  Stethoscope,
  Smile,
  PawPrint,
  PenTool,
  ShoppingBag,
  Shirt,
  Droplets,
  Zap,
  Snowflake,
  PartyPopper,
  GraduationCap,
  Briefcase,
  Crown,
  Bot,
  Palette,
  LucideIcon
} from 'lucide-react';

export const NicheIconMap: Record<string, LucideIcon> = {
  // 10 Nichos Oficiais Bio Fácil
  Scissors,
  Sparkles,
  Utensils,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Crown,
  Bot,
  HeartPulse,
  Palette,
  Camera,
  // Outros ícones
  Hand,
  Pizza,
  Cake,
  Dumbbell,
  Activity,
  Building,
  Scale,
  Music,
  Mic,
  Wrench,
  Car,
  Stethoscope,
  Smile,
  PawPrint,
  PenTool,
  Shirt,
  Droplets,
  Zap,
  Snowflake,
  PartyPopper,
};

export const WhatsAppIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`text-[#25D366] ${className}`}
  >
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.83.822 2.796.822 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.768-5.768-5.768zm7.42 5.766c-.001 4.093-3.328 7.42-7.42 7.42-.001 0-.001 0 0 0-1.282 0-2.457-.333-3.528-.941l-4.148 1.088 1.107-4.043c-.694-1.121-1.066-2.42-1.066-3.754 0-4.092 3.327-7.419 7.42-7.419 4.092 0 7.419 3.327 7.419 7.42 0 0 0 0 0 0z" />
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-[#E1306C] ${className}`}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-[#1877F2] ${className}`}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-white ${className}`}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.13v-3.53a6.34 6.34 0 0 0-.86-.06A6.33 6.33 0 0 0 3 15.65 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.35V9.48a8.28 8.28 0 0 0 4.91 1.6V7.63a4.84 4.84 0 0 1-1-.94z"/>
  </svg>
);

export const YouTubeIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-[#FF0000] ${className}`}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const GoogleIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const MapsIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-[#EA4335] ${className}`}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" fill="#fff" />
  </svg>
);
