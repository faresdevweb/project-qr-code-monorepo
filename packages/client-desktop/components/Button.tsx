interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  onClick?: () => void;
  disabled?: boolean;
  type?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  variant,
}) => {
  const baseStyles = 'font-bold py-2 px-3 rounded-lg';

  const variantStyles = {
    primary:
      'bg-blue-500 text-white' +
      (!disabled ? ' hover:bg-blue-700' : ''),
    secondary:
      'border border-gray-500 bg-gray-200 text-gray-700' +
      (!disabled ? ' hover:border-gray-500' : ''),
    tertiary:
      'border border-blue-500 bg-transparent text-blue-500' +
      (!disabled ? ' hover:text-blue-700' : ''),
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <button
      className={`${baseStyles} ${
        variantStyles[variant || 'primary']
      } ${disabledStyles}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
