import { clsx } from 'clsx';
import { User } from 'lucide-react';

export function Avatar({ 
  src, 
  alt, 
  size = 'md',
  variant = 'default',
  className,
  ...props 
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const variants = {
    default: 'rounded-full',
    group: 'rounded-lg',
  };

  return (
    <div
      className={clsx(
        'flex items-center justify-center bg-neutral overflow-hidden flex-shrink-0',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <User className="w-1/2 h-1/2 text-neutral-500" />
      )}
    </div>
  );
}