import React from 'react';
import Colors from '@/constants/color';

interface CardProps {
    children: React.ReactNode;
    padding?: 'sm' | 'md' | 'lg';
    shadow?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
    children,
    padding = 'md',
    shadow = 'md',
    className = '',
    style = {},
}) => {
    const paddingStyles: Record<string, React.CSSProperties> = {
        sm: { padding: '1rem' },
        md: { padding: '2rem' },
        lg: { padding: '3rem' },
    };

    const shadowStyles: Record<string, React.CSSProperties> = {
        sm: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
        md: { boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
        lg: { boxShadow: '0 8px 25px rgba(0,0,0,0.15)' },
    };

    const baseStyle: React.CSSProperties = {
        backgroundColor: Colors.bgPrimary,
        borderRadius: '12px',
        maxWidth: '400px',
        width: '100%',
        ...paddingStyles[padding],
        ...shadowStyles[shadow],
        ...style,
    };

    return (
        <div style={baseStyle} className={className}>
            {children}
        </div>
    );
};

export default Card;
