import { CSSProperties } from 'react';
import Colors from '@/constants/color';

const TextStyles: Record<string, CSSProperties> = {
    // Typography System
    displayLarge: {
        fontSize: '32px',
        fontWeight: 700,
        lineHeight: '1.2',
        color: Colors.textPrimary,
    },

    displayMedium: {
        fontSize: '28px',
        fontWeight: 700,
        lineHeight: '1.2',
        color: Colors.textPrimary,
    },

    displaySmall: {
        fontSize: '24px',
        fontWeight: 700,
        lineHeight: '1.2',
        color: Colors.textPrimary,
    },

    headingLarge: {
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: '1.3',
        color: Colors.textPrimary,
    },

    headingMedium: {
        fontSize: '17px',
        fontWeight: 600,
        lineHeight: '1.3',
        color: Colors.textPrimary,
    },

    headingSmall: {
        fontSize: '15px',
        fontWeight: 600,
        lineHeight: '1.3',
        color: Colors.textPrimary,
    },

    bodyLarge: {
        fontSize: '17px',
        fontWeight: 400,
        lineHeight: '1.4',
        color: Colors.textPrimary,
    },

    bodyMedium: {
        fontSize: '15px',
        fontWeight: 400,
        lineHeight: '1.4',
        color: Colors.textPrimary,
    },

    bodySmall: {
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: '1.4',
        color: Colors.textSecondary,
    },

    caption: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '1.3',
        color: Colors.textTertiary,
    },

    button: {
        fontSize: '17px',
        fontWeight: 600,
        lineHeight: '1.2',
        color: Colors.textInverse,
    },

    buttonSmall: {
        fontSize: '15px',
        fontWeight: 600,
        lineHeight: '1.2',
        color: Colors.textInverse,
    },

    link: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '1.3',
        color: Colors.primary,
        textDecoration: 'none',
        cursor: 'pointer',
    },

    linkHover: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '1.3',
        color: Colors.primaryHover,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
};

export default TextStyles;
