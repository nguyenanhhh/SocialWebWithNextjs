import React from 'react';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';

interface LabelProps {
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const Label: React.FC<LabelProps> = ({
    children,
    htmlFor,
    required = false,
    className = '',
    style = {},
}) => {
    const baseStyle: React.CSSProperties = {
        marginBottom: '0.25rem',
        display: 'block',
        color: Colors.primaryDark,
        ...TextStyles.systemLight_14,
        ...style,
    };

    return (
        <label htmlFor={htmlFor} style={baseStyle} className={className}>
            {children}
            {required && <span style={{ color: Colors.danger, marginLeft: '0.25rem' }}>*</span>}
        </label>
    );
};

export default Label;
