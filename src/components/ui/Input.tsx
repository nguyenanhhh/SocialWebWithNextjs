import React from 'react';
import Colors from '@/constants/color';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  error = false,
  errorMessage,
  label,
  helperText,
  className = '',
  style = {},
  ...props
}) => {
  const baseStyles = {
    width: '100%',
    border: `1px solid ${error ? Colors.danger : Colors.borderPrimary}`,
    borderRadius: '6px',
    padding: '14px 16px',
    fontSize: '17px',
    backgroundColor: Colors.bgPrimary,
    color: Colors.textPrimary,
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const combinedStyles = {
    ...baseStyles,
    ...style,
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '15px',
          fontWeight: 600,
          color: Colors.textPrimary,
        }}>
          {label}
        </label>
      )}

      <input
        style={combinedStyles}
        className={className}
        {...props}
      />

      {helperText && !error && (
        <p style={{
          marginTop: '4px',
          fontSize: '13px',
          color: Colors.textPrimary,
        }}>
          {helperText}
        </p>
      )}

      {error && errorMessage && (
        <p style={{
          marginTop: '4px',
          fontSize: '13px',
          color: Colors.danger,
        }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;
