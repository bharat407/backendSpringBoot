import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const Input = forwardRef(({ label, error, className, id, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={id}
                className={twMerge(clsx(
                    'block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition-colors',
                    error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                    className
                ))}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
