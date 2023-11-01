import React from 'react';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'text' | 'number' | 'password' | 'file';
  label?: string;
  error?: string;
}

const Input: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps
> = ({ variant = 'text', label, error, ...props }, ref) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={variant}
        {...props}
        ref={ref}
        className={`mt-1 block w-full rounded-md border 
              ${error ? 'border-red-600' : 'border-gray-600'} 
              shadow-sm focus:border-blue-500 focus:ring 
              focus:ring-blue-200 focus:ring-opacity-50 p-2`}
      />
      {error && (
        <span className="text-red-600 text-sm mt-1">{error}</span>
      )}
    </div>
  );
};

export default React.forwardRef(Input);
