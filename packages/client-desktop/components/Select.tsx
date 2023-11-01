import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  label?: string;
  error?: string;
}

const Select: React.ForwardRefRenderFunction<
  HTMLSelectElement,
  SelectProps
> = ({ options, label, error, ...props }, ref) => {
  return (
    <div className="relative w-[250px] mx-auto mt-5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className="block w-full mt-1 rounded-md border-gray-300 shadow-sm 
          focus:border-blue-500 border border-gray-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
        ref={ref}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-red-600 text-sm mt-1">{error}</span>
      )}
    </div>
  );
};

export default React.forwardRef(Select);
