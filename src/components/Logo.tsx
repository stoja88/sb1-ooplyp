import { Headphones } from 'lucide-react';

export const Logo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    default: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className={`${sizeClasses[size]} bg-indigo-600 rounded-lg p-2 shadow-lg`}>
        <Headphones className="w-full h-full text-white" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white" />
    </div>
  );
};

export default Logo;