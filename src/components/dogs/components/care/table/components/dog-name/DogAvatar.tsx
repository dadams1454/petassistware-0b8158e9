
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface DogAvatarProps {
  name: string;
  photo?: string;
  status?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DogAvatar: React.FC<DogAvatarProps> = ({
  name,
  photo,
  status,
  size = 'md',
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      case 'md':
      default:
        return 'h-10 w-10';
    }
  };

  const getStatusClass = () => {
    if (!status) return '';

    switch (status.toLowerCase()) {
      case 'in_heat':
        return 'ring-2 ring-red-500';
      case 'pregnant':
        return 'ring-2 ring-purple-500';
      case 'special_attention':
        return 'ring-2 ring-yellow-500';
      case 'incompatible':
        return 'ring-2 ring-orange-500';
      case 'other':
        return 'ring-2 ring-blue-500';
      default:
        return '';
    }
  };

  return (
    <Avatar className={`${getSizeClass()} ${getStatusClass()}`}>
      {photo && <AvatarImage src={photo} alt={name} />}
      <AvatarFallback className="bg-primary/10 text-primary">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default DogAvatar;
