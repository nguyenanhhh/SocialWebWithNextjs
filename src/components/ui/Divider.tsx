import React from 'react';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';

interface DividerProps {
    text?: string;
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    style?: React.CSSProperties;
}

const Divider: React.FC<DividerProps> = ({
    text,
    orientation = 'horizontal',
    className = '',
    style = {},
}) => {
    if (orientation === 'vertical') {
        return (
            <div
                style={{
                    width: '1px',
                    height: '100%',
                    backgroundColor: Colors. bgSecondary,
                    ...style,
                }}
                className={className}
            />
        );
    }

    const baseStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        margin: '1rem 0',
        ...style,
    };

    const lineStyle: React.CSSProperties = {
        flex: 1,
        height: '1px',
        backgroundColor: Colors. bgSecondary,
    };

    const textStyle: React.CSSProperties = {
        margin: '0 0.5rem',
        color: Colors. bgSecondary,
        ...TextStyles.systemLight_14,
    };

    return (
        <div style={baseStyle} className={className}>
            <div style={lineStyle} />
            {text && <span style={textStyle}>{text}</span>}
            <div style={lineStyle} />
        </div>
    );
};

export default Divider;
