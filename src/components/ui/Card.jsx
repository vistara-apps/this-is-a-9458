import { clsx } from 'clsx';

export function Card({ children, variant = 'default', className, ...props }) {
  const variants = {
    default: 'bg-white shadow-card border border-neutral/20',
    outlined: 'bg-white border-2 border-neutral',
    elevated: 'bg-white shadow-lg shadow-neutral/20',
  };

  return (
    <div
      className={clsx(
        'rounded-lg p-md',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}