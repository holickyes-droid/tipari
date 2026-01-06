/**
 * INVESTOR AVATAR COMPONENT
 * Displays avatar for investor - either selected or auto-assigned
 */

import { User, Users, Building2 } from 'lucide-react';

export type AvatarType = 
  | 'man-1' 
  | 'man-2' 
  | 'man-3'
  | 'woman-1' 
  | 'woman-2' 
  | 'woman-3'
  | 'company-1' 
  | 'company-2' 
  | 'company-3';

interface InvestorAvatarProps {
  avatarType?: AvatarType;
  investorName: string;
  investorType: 'INDIVIDUAL' | 'LEGAL_ENTITY' | 'FO' | 'PO';
  gender?: 'male' | 'female';  // For FO or for PO contact person
  contactPersonGender?: 'male' | 'female';  // For PO only
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Avatar color schemes
const AVATAR_STYLES: Record<AvatarType, { bg: string; icon: string; gradient: string }> = {
  // Men avatars
  'man-1': { 
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600', 
    icon: 'text-white',
    gradient: 'from-blue-500 to-blue-600'
  },
  'man-2': { 
    bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600', 
    icon: 'text-white',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  'man-3': { 
    bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600', 
    icon: 'text-white',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  
  // Women avatars
  'woman-1': { 
    bg: 'bg-gradient-to-br from-pink-500 to-pink-600', 
    icon: 'text-white',
    gradient: 'from-pink-500 to-pink-600'
  },
  'woman-2': { 
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600', 
    icon: 'text-white',
    gradient: 'from-purple-500 to-purple-600'
  },
  'woman-3': { 
    bg: 'bg-gradient-to-br from-rose-500 to-rose-600', 
    icon: 'text-white',
    gradient: 'from-rose-500 to-rose-600'
  },
  
  // Company avatars
  'company-1': { 
    bg: 'bg-gradient-to-br from-slate-600 to-slate-700', 
    icon: 'text-white',
    gradient: 'from-slate-600 to-slate-700'
  },
  'company-2': { 
    bg: 'bg-gradient-to-br from-gray-600 to-gray-700', 
    icon: 'text-white',
    gradient: 'from-gray-600 to-gray-700'
  },
  'company-3': { 
    bg: 'bg-gradient-to-br from-zinc-600 to-zinc-700', 
    icon: 'text-white',
    gradient: 'from-zinc-600 to-zinc-700'
  },
};

// Auto-assign avatar based on gender
export function getAutoAssignedAvatar(
  name: string, 
  type: 'INDIVIDUAL' | 'LEGAL_ENTITY' | 'FO' | 'PO',
  gender?: 'male' | 'female'
): AvatarType {
  const normalizedType = type === 'FO' ? 'INDIVIDUAL' : type === 'PO' ? 'LEGAL_ENTITY' : type;
  
  if (normalizedType === 'LEGAL_ENTITY') {
    // For companies, use hash of name to pick one of 3 company avatars
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const companyIndex = (hash % 3) + 1;
    return `company-${companyIndex}` as AvatarType;
  }
  
  // For individuals, use gender if provided, otherwise detect from name
  let finalGender: 'male' | 'female';
  
  if (gender) {
    finalGender = gender;
  } else {
    // Auto-detect gender from common Czech names
    const lowerName = name.toLowerCase();
    const isFemale = 
      lowerName.includes('jana') ||
      lowerName.includes('marie') ||
      lowerName.includes('eva') ||
      lowerName.includes('anna') ||
      lowerName.endsWith('ová') ||
      lowerName.includes('petra') ||
      lowerName.includes('kateřina') ||
      lowerName.includes('lenka');
    
    finalGender = isFemale ? 'female' : 'male';
  }
  
  // Use hash to pick variant (1-3)
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variant = (hash % 3) + 1;
  
  if (finalGender === 'female') {
    return `woman-${variant}` as AvatarType;
  } else {
    return `man-${variant}` as AvatarType;
  }
}

export function InvestorAvatar({ 
  avatarType, 
  investorName, 
  investorType,
  gender,
  contactPersonGender,
  size = 'md',
  className = '' 
}: InvestorAvatarProps) {
  const normalizedType = investorType === 'FO' ? 'INDIVIDUAL' : investorType === 'PO' ? 'LEGAL_ENTITY' : investorType;
  
  // Auto-assign if not provided
  const finalAvatarType = avatarType || getAutoAssignedAvatar(investorName, investorType, gender);
  const style = AVATAR_STYLES[finalAvatarType];
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const overlayIconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };
  
  const overlayPositionSizes = {
    sm: 'w-4 h-4 -bottom-0.5 -right-0.5',
    md: 'w-5 h-5 -bottom-0.5 -right-0.5',
    lg: 'w-6 h-6 -bottom-1 -right-1',
  };
  
  // Determine icon
  const isCompany = normalizedType === 'LEGAL_ENTITY';
  const Icon = isCompany ? Building2 : User;
  
  // For companies, show overlay person icon if contactPersonGender is provided
  const showOverlay = isCompany && contactPersonGender;
  const OverlayIcon = User;
  
  return (
    <div className={`relative ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full ${style.bg} flex items-center justify-center ring-2 ring-white shadow-sm`}
        title={investorName}
      >
        <Icon className={`${iconSizes[size]} ${style.icon}`} />
      </div>
      
      {/* Overlay for company with contact person */}
      {showOverlay && (
        <div 
          className={`absolute ${overlayPositionSizes[size]} rounded-full ${
            contactPersonGender === 'female' 
              ? 'bg-gradient-to-br from-pink-500 to-pink-600' 
              : 'bg-gradient-to-br from-blue-500 to-blue-600'
          } flex items-center justify-center ring-2 ring-white shadow-sm`}
          title={`Kontaktní osoba: ${contactPersonGender === 'female' ? 'Paní' : 'Pan'}`}
        >
          <OverlayIcon className={`${overlayIconSizes[size]} text-white`} />
        </div>
      )}
    </div>
  );
}