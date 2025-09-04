import { clsx } from 'clsx';

export function Input({ 
  type = 'text',
  variant = 'text',
  className,
  placeholder,
  ...props 
}) {
  const baseClasses = 'w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors min-h-[44px]';

  if (variant === 'textarea') {
    return (
      <textarea
        className={clsx(baseClasses, 'resize-vertical min-h-[100px]', className)}
        placeholder={placeholder}
        {...props}
      />
    );
  }

  if (variant === 'select') {
    return (
      <select
        className={clsx(baseClasses, 'cursor-pointer', className)}
        {...props}
      >
        {props.children}
      </select>
    );
  }

  return (
    <input
      type={type}
      className={clsx(baseClasses, className)}
      placeholder={placeholder}
      {...props}
    />
  );
}