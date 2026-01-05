import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${sizeClasses[size]}`}></div>
            {message && (
                <p className="text-neutral-600 dark:text-neutral-400 font-medium">{message}</p>
            )}
        </div>
    );
};

export default LoadingSpinner;
