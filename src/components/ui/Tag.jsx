import { clsx } from 'clsx';

export function Tag({ 
  children, 
  variant = 'primary',
  size = 'sm',
  className,
  ...props 
}) {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-neutral text-gray-700 border-neutral',
    skill: 'bg-accent/10 text-accent border-accent/20',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}