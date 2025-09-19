"use client";
import { Reaction } from '@/types';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';

interface PostReactionsProps {
    reactions: Reaction[];
}

export default function PostReactions({ reactions }: PostReactionsProps) {
    if (reactions.length === 0) return null;
    const reactionsByEmoji = reactions.reduce((acc, reaction) => {
        if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = [];
        }
        acc[reaction.emoji].push(reaction);
        return acc;
    }, {} as Record<string, Reaction[]>);
    const popularReactions = Object.entries(reactionsByEmoji)
        .sort(([, a], [, b]) => b.length - a.length)
        .slice(0, 3);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: Colors.bgSecondary,
            borderRadius: '6px',
            border: `1px solid ${Colors.borderPrimary}`
        }}>
            {popularReactions.map(([emoji, reactionList]) => (
                <div
                    key={emoji}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: Colors.bgPrimary,
                        borderRadius: '4px',
                        border: `1px solid ${Colors.borderPrimary}`
                    }}
                >
                    <span style={{ fontSize: '16px' }}>{emoji}</span>
                    <span style={{
                        ...TextStyles.bodySmall,
                        color: Colors.textSecondary,
                        fontWeight: '500'
                    }}>
                        {reactionList.length}
                    </span>
                </div>
            ))}

            {reactions.length > 0 && (
                <span style={{
                    ...TextStyles.bodySmall,
                    color: Colors.textSecondary,
                    marginLeft: '4px'
                }}>
                    {reactions.length} lượt thích
                </span>
            )}
        </div>
    );
}
