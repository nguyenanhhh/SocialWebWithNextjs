"use client";
import { Reaction } from '@/types';

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
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
            {popularReactions.map(([emoji, reactionList]) => (
                <div
                    key={emoji}
                    className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-gray-200"
                >
                    <span className="text-base">{emoji}</span>
                    <span className="text-xs text-gray-600 font-medium">
                        {reactionList.length}
                    </span>
                </div>
            ))}

            {reactions.length > 0 && (
                <span className="text-xs text-gray-600 ml-1">
                    {reactions.length} lượt thích
                </span>
            )}
        </div>
    );
}
