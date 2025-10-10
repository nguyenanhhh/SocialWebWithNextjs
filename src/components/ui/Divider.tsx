import React from 'react';

interface DividerProps {
    text?: string;
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

const Divider: React.FC<DividerProps> = ({
    text,
    orientation = 'horizontal',
    className = '',
}) => {
    if (orientation === 'vertical') {
        return (
            <div
                className={`w-px h-full bg-gray-100 ${className}`}
            />
        );
    }

    return (
        <div className={`flex items-center my-4 ${className}`}>
            <div className="flex-1 h-px bg-gray-100" />
            {text && <span className="mx-2 text-gray-100 text-sm">{text}</span>}
            <div className="flex-1 h-px bg-gray-100" />
        </div>
    );
};

export default Divider;
