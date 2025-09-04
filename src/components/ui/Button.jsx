import { clsx } from 'clsx';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className, 
  disabled,
  ...props 
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80',
    secondary: 'bg-surface text-primary border border-neutral hover:bg-neutral/50',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-primary/10 active:bg-primary/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}