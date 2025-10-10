"use client";
import { useState } from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
    src?: string | null;
    alt: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
    const [imageError, setImageError] = useState(false);
    
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12', 
        lg: 'w-16 h-16'
    };
    
    const iconSizes = {
        sm: 16,
        md: 24,
        lg: 32
    };

    if (!src || imageError) {
        return (
            <div className={`${sizeClasses[size]} bg-gray-200 rounded-full flex items-center justify-center ${className}`}>
                <User size={iconSizes[size]} className="text-gray-500" />
            </div>
        );
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
            onError={() => setImageError(true)}
        />
    );
}
