import React, { useState } from 'react';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    textDecoration: 'none',
    gap: '8px',
    ...(fullWidth && { width: '100%' }),
  };

  const sizeStyles = {
    sm: { height: '32px', fontSize: '14px', padding: '8px 12px' },
    md: { height: '40px', fontSize: '15px', padding: '10px 16px' },
    lg: { height: '48px', fontSize: '17px', padding: '14px 16px' },
    xl: { height: '56px', fontSize: '20px', padding: '16px 20px' },
  };

  const variantStyles = {
    primary: {
      backgroundColor: Colors.buttonPrimary,
      color: Colors.textInverse,
    },
    secondary: {
      backgroundColor: Colors.bgPrimary,
      color: Colors.textPrimary,
      border: `1px solid ${Colors.borderPrimary}`,
    },
    success: {
      backgroundColor: Colors.buttonSuccess,
      color: Colors.textInverse,
    },
    danger: {
      backgroundColor: Colors.buttonDanger,
      color: Colors.textInverse,
    },
    warning: {
      backgroundColor: Colors.warning,
      color: Colors.textInverse,
    },
    outline: {
      backgroundColor: 'transparent',
      color: Colors.primary,
      border: `1px solid ${Colors.primary}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: Colors.textSecondary,
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    opacity: disabled || loading ? 0.6 : 1,
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const getHoverStyles = () => {
    if (isHovered && !disabled && !loading) {
      switch (variant) {
        case 'primary':
          return { backgroundColor: Colors.buttonPrimaryHover };
        case 'secondary':
          return { backgroundColor: Colors.bgSecondary };
        case 'success':
          return { backgroundColor: Colors.buttonSuccessHover };
        case 'danger':
          return { backgroundColor: Colors.danger };
        case 'warning':
          return { opacity: 0.9 };
        case 'outline':
          return { backgroundColor: Colors.primary, color: Colors.textInverse };
        case 'ghost':
          return { backgroundColor: Colors.bgSecondary };
        default:
          return {};
      }
    }
    return {};
  };

  const finalStyles = {
    ...combinedStyles,
    ...getHoverStyles(),
  };

  return (
    <button
      style={finalStyles}
      className={className}
      disabled={disabled || loading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      )}
      {children}
    </button>
  );
};

export default Button;
