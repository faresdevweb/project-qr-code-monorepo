import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatepickerProps {
  label?: string;
  error?: string;
  value?: Date;
  onChange?: (date: any) => void;
}

const Datepicker: React.ForwardRefRenderFunction<
  any,
  DatepickerProps
> = ({ label, value, error, ...props }, ref) => {
  return (
    <div className="relative w-[250px] mx-auto">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <DatePicker
        selected={value}
        {...props}
        onChange={(date) => {
          if (props.onChange) {
            props.onChange(date);
          }
        }}
        ref={ref}
        className="block w-full mt-1 rounded-md border border-gray-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
        dateFormat="dd/MM/yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        showTimeSelect
        timeFormat="HH:mm:ss"
        timeIntervals={15}
      />
      {error && (
        <span className="text-red-600 text-sm mt-1">{error}</span>
      )}
    </div>
  );
};

export default forwardRef(Datepicker);
